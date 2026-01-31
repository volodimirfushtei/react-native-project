// store/authSlice.ts
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {auth, db} from '@/lib/firebase';
import {createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile,} from 'firebase/auth';
import {RootState} from '../store';
import {doc, getDoc, setDoc} from "firebase/firestore";
import Toast from 'react-native-toast-message';

interface User {
    id: string;
    email: string;
    name: string;
    avatar?: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    displayName: string;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    loading: false,
    displayName: '',
    error: null,
};

// ------------------- Thunks -------------------

// Login


export const loginDB = createAsyncThunk<
    User,
    { email: string; password: string },
    { rejectValue: string }
>(
    'auth/loginDB',
    async ({email, password}, {rejectWithValue}) => {
        try {
            const cred = await signInWithEmailAndPassword(
                auth,
                email.trim(),
                password
            );

            const user = cred.user;
            if (!user) throw new Error('User not found');

            const userDocRef = doc(db, 'users', user.uid);
            const userSnap = await getDoc(userDocRef);

            if (!userSnap.exists()) {
                throw new Error('User data not found in Firestore');
            }

            const data = userSnap.data();

            return {
                id: user.uid,
                email: data.email ?? user.email ?? '',
                name: data.name ?? user.displayName ?? '',
                avatar: data.avatar ?? null,
            };
        } catch (error: any) {
            if (error.code === 'auth/user-not-found')
                return rejectWithValue('Користувача не знайдено.');
            if (error.code === 'auth/wrong-password')
                return rejectWithValue('Невірний пароль.');
            if (error.code === 'auth/invalid-email')
                return rejectWithValue('Невірний формат email.');
            return rejectWithValue(error.message || 'Помилка входу');
        }
    }
);


// Logout
export const logoutDB = createAsyncThunk<void, void, { rejectValue: string }>(
    'auth/logoutDB',
    async (_, {rejectWithValue}) => {
        try {
            await signOut(auth);
        } catch (error: any) {
            return rejectWithValue(error.message || 'Logout failed');
        }
    }
);

// Register
export const registerDB = createAsyncThunk<
    User,
    { email: string; password: string; name: string },
    { rejectValue: string }
>(
    'auth/registerDB',
    async ({email, password, name}, {rejectWithValue}) => {
        try {
            const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
            const user = cred.user;

            if (!user) throw new Error("User not created");

            // Оновлюємо displayName
            await updateProfile(user, {displayName: name});

            // ✅ Додаємо користувача у Firestore
            const userDocRef = doc(db, 'users', user.uid);
            await setDoc(userDocRef, {
                id: user.uid,
                email: user.email,
                name,
                avatar: user.photoURL || null,
                createdAt: new Date().toISOString(),
            });

            return {
                id: user.uid,
                email: user.email || '',
                name,
                avatar: user.photoURL || undefined,
            };
        } catch (error: any) {
            if (error.code === 'auth/email-already-in-use') return rejectWithValue('Цей email вже використовується.');
            if (error.code === 'auth/invalid-email') return rejectWithValue('Неправильний формат email.');
            if (error.code === 'auth/weak-password') return rejectWithValue('Пароль занадто слабкий (мінімум 6 символів).');
            return rejectWithValue(error.message || 'Сталася невідома помилка реєстрації');
        }
    }
);

// ------------------- Slice -------------------

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        setUserFromFirebase: (state, action: PayloadAction<User | null>) => {
            state.user = action.payload;
            state.isAuthenticated = !!action.payload;
            state.loading = false;
        },
    },

    extraReducers: (builder) => {
        // Login
        builder
            .addCase(loginDB.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginDB.fulfilled, (state, action: PayloadAction<User>) => {
                state.loading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(loginDB.rejected, (state, action) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.error = action.payload || 'Помилка входу';
            });

        // Logout
        builder
            .addCase(logoutDB.pending, (state) => {
                state.loading = true;
            })
            .addCase(logoutDB.fulfilled, (state) => {
                state.loading = false;
                state.user = null;
                state.isAuthenticated = false;
                Toast.show({type: 'info', text1: 'User logout'});
            })
            .addCase(logoutDB.rejected, (state, action) => {
                state.error = action.payload || 'Помилка виходу';
            });

        // Register
        builder
            .addCase(registerDB.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerDB.fulfilled, (state, action: PayloadAction<User>) => {
                state.loading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(registerDB.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Помилка реєстрації';
            });

    },
});

// ------------------- Exports -------------------
export const {clearError, setUserFromFirebase} = authSlice.actions;
export default authSlice.reducer;

// Селектори
export const selectAuthUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectAuthLoading = (state: RootState) => state.auth.loading;

// store/userSlice.ts
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {auth, db} from '@/lib/firebase';
import {doc, getDoc, setDoc, updateDoc} from 'firebase/firestore';
import Toast from 'react-native-toast-message';
import type {RootState} from '@/redux/store';
// ----- Async Thunks -----

export const loadUserData = createAsyncThunk(
    'user/loadUserData',
    async (uid: string, {rejectWithValue}) => {
        try {
            const docRef = doc(db, 'users', uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data() as any;
                return {
                    displayName: data.name || '',
                    avatarUri: data.avatar || null,
                };
            }
            return {};
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

// Функція для завантаження аватара у Firestore
export const uploadAvatar = createAsyncThunk<
    string, // повертаємо Base64 аватару
    string,// отримуємо URI зображення
    { rejectValue: string }
>("auth/uploadAvatar", async (imageUri, {rejectWithValue}) => {
    if (!auth.currentUser) return rejectWithValue("User not authenticated");

    try {
        const response = await fetch(imageUri);
        const blob = await response.blob();

        const reader = new FileReader();
        const base64Promise = new Promise<string>((resolve, reject) => {
            reader.onerror = reject;
            reader.onload = () => resolve(reader.result as string);
            reader.readAsDataURL(blob);
        });

        const base64Data = await base64Promise;

        // Зберігаємо у Firestore
        const userDocRef = doc(db, "users", auth.currentUser.uid);
        await setDoc(userDocRef, {avatar: base64Data}, {merge: true});

        return base64Data;
    } catch (error: any) {
        return rejectWithValue(error.message || "Failed to upload avatar");
    }
});
export const removeAvatar = createAsyncThunk<void, void, { rejectValue: string }>(
    "auth/removeAvatar",
    async (_, {rejectWithValue}) => {
        if (!auth.currentUser) return rejectWithValue("User not authenticated");

        try {
            const userDocRef = doc(db, "users", auth.currentUser.uid);
            await updateDoc(userDocRef, {avatar: null});
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to remove avatar");
        }
    }
);


// ----- Slice -----

interface UserState {
    displayName: string;
    avatar?: string | null;  // avatar може бути undefined
    loading: boolean;
    error: string | null;
}

const initialState: UserState = {
    displayName: '',
    avatar: null,  // або '', якщо хочеш порожній рядок
    loading: false,
    error: null,
};


const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        clearUserError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // Load user data
        builder.addCase(loadUserData.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(loadUserData.fulfilled, (state, action: PayloadAction<{
            displayName?: string;
            avatarUri?: string | null;
        }>) => {
            state.loading = false;
            state.displayName = action.payload.displayName ?? state.displayName;
            state.avatar = action.payload.avatarUri; // якщо null або undefined — поставимо ''


            Toast.show({type: 'success', text1: 'Дані користувача завантажено'});
        });

        builder.addCase(loadUserData.rejected, (state, action: PayloadAction<any>) => {
            state.loading = false;
            state.error = action.payload;
            Toast.show({type: 'error', text1: '<UNK> <UNK> <UNK>'});
        });

        // Upload avatar
        builder.addCase(uploadAvatar.pending, (state) => {
            state.loading = true;
            state.error = null;
        });

        builder.addCase(uploadAvatar.fulfilled, (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.avatar = action.payload; // ✅ Оновлюємо avatarUri
            Toast.show({type: 'info', text1: 'Аватар оновлено'});
        });

        builder.addCase(uploadAvatar.rejected, (state, action: PayloadAction<any>) => {
            state.loading = false;
            state.error = action.payload || "Failed to upload avatar";
            Toast.show({
                type: 'error',
                text1: 'Помилка завантаження аватара',
                text2: action.payload ?? 'помилка аватара'
            });
            builder.addCase(removeAvatar.fulfilled, state => {

                state.avatar = null; // ✅ локально теж видалили

            });
        });
    },
});

export const {clearUserError} = userSlice.actions;
export default userSlice.reducer;
export const selectAuthUser = (state: RootState) => state.user;

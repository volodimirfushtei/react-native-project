import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {getCurrentUser} from '@/utils/auth';

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
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
};


const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        loginSuccess: (state, action: PayloadAction<User>) => {
            state.loading = false;
            state.user = action.payload;
            state.isAuthenticated = true;
            state.error = null;
        },
        loginFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
            state.isAuthenticated = false;
        },
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.error = null;
        },
        updateUser: (state, action: PayloadAction<Partial<User>>) => {
            if (state.user) {
                state.user = {...state.user, ...action.payload};
            }
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setError: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
        },

        clearError: (state) => {
            state.error = null;
        },
        getUserSession: (state) => {
            const firebaseUser = getCurrentUser();
            if (firebaseUser) {
                state.user = {
                    id: firebaseUser.uid,
                    email: firebaseUser.email || '',
                    name: firebaseUser.displayName || '',
                    avatar: firebaseUser.photoURL || undefined
                };
            } else {
                state.user = null;
            }
            state.isAuthenticated = !!state.user;
        },
    },
});

export const {
    loginStart,
    loginSuccess,
    loginFailure,
    logout,
    updateUser,
    clearError,
    getUserSession,
} = authSlice.actions;

export default authSlice.reducer;
// store/userSlice.ts
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {auth, db, storage} from '@/lib/firebase';
import {doc, getDoc, setDoc, updateDoc} from 'firebase/firestore';
import Toast from 'react-native-toast-message';
import type {RootState} from '@/redux/store';
import * as ImageManipulator from 'expo-image-manipulator';

// ----- Types -----
interface UserState {
    id: string | null;
    displayName: string;
    avatar: string | null;
    loading: boolean;
    error: string | null;
}

const initialState: UserState = {
    id: null,
    displayName: '',
    avatar: null,
    loading: false,
    error: null,
};

// ----- Async Thunks -----

export const loadUserData = createAsyncThunk(
    'user/loadUserData',
    async (uid: string, {rejectWithValue}) => {
        try {
            console.log('[loadUserData] Fetching Firestore for UID:', uid);
            const docRef = doc(db, 'users', uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                console.log('[loadUserData] Firestore Data:', data);
                return {
                    id: uid,
                    displayName: data.name || '',
                    avatarUri: data.avatar || null,
                };
            }
            console.log('[loadUserData] No document found for user');
            return { id: uid };
        } catch (error: any) {
            console.error('[loadUserData] Error:', error.message);
            return rejectWithValue(error.message);
        }
    }
);

export const uploadAvatar = createAsyncThunk<
    string,
    string,
    { rejectValue: string }
>('user/uploadAvatar', async (localUri, {rejectWithValue}) => {
    try {
        const uid = auth.currentUser?.uid;
        if (!uid) throw new Error('No user authenticated');

        console.log('[uploadAvatar] Converting to Base64 (resizing to 200x200):', localUri);

        // Resize and compress for Firestore compatibility (1MB limit)
        const manipulated = await ImageManipulator.manipulateAsync(
            localUri,
            [{ resize: { width: 200, height: 200 } }],
            { compress: 0.6, format: ImageManipulator.SaveFormat.JPEG, base64: true }
        );

        if (!manipulated.base64) throw new Error("Base64 conversion failed");

        const base64Avatar = `data:image/jpeg;base64,${manipulated.base64}`;
        console.log('[uploadAvatar] Base64 created. Length:', base64Avatar.length);

        // Save the Base64 string directly to Firestore
        await setDoc(doc(db, 'users', uid), {
            avatar: base64Avatar
        }, { merge: true });

        console.log('[uploadAvatar] Firestore updated with Base64 avatar');
        return base64Avatar;
    } catch (e: any) {
        console.error('[uploadAvatar] Error:', e.message);
        return rejectWithValue(e.message);
    }
});

export const removeAvatar = createAsyncThunk<
    null,
    void,
    { state: RootState; rejectValue: string }
>(
    'user/removeAvatar',
    async (_, {getState, rejectWithValue}) => {
        try {
            const state = getState() as RootState;
            const avatarUrl = state.user.avatar;
            const userId = auth.currentUser?.uid;

            if (!userId) throw new Error('No user authenticated');

            console.log('[removeAvatar] Removing avatar for UID:', userId);

            console.log('[removeAvatar] Removing avatar for UID:', userId);

            // Update Firestore
            const userDoc = doc(db, "users", userId);
            await updateDoc(userDoc, {avatar: null});
            console.log('[removeAvatar] Firestore updated (avatar = null)');

            return null;
        } catch (e: any) {
            console.error('[removeAvatar] Error:', e.message);
            return rejectWithValue(e.message);
        }
    }
);

// ----- Slice -----

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        clearUserError: (state) => {
            state.error = null;
        },
        setUserId: (state, action: PayloadAction<string | null>) => {
            state.id = action.payload;
        }
    },
    extraReducers: (builder) => {
        // Load user data
        builder.addCase(loadUserData.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(loadUserData.fulfilled, (state, action: PayloadAction<any>) => {
            console.log('[userSlice] loadUserData.fulfilled:', action.payload);
            state.loading = false;
            state.id = action.payload.id || state.id;
            state.displayName = action.payload.displayName ?? state.displayName;
            state.avatar = action.payload.avatarUri ?? null;
        });
        builder.addCase(loadUserData.rejected, (state, action: PayloadAction<any>) => {
            console.log('[userSlice] loadUserData.rejected:', action.payload);
            state.loading = false;
            state.error = action.payload;
        });

        // Upload avatar
        builder.addCase(uploadAvatar.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(uploadAvatar.fulfilled, (state, action: PayloadAction<string>) => {
            console.log('[userSlice] uploadAvatar.fulfilled:', action.payload);
            state.loading = false;
            state.avatar = action.payload;
            state.error = null;
        });
        builder.addCase(uploadAvatar.rejected, (state, action: PayloadAction<any>) => {
            console.log('[userSlice] uploadAvatar.rejected:', action.payload);
            state.loading = false;
            state.error = action.payload || "Failed to upload avatar";
        });

        // Remove avatar
        builder.addCase(removeAvatar.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(removeAvatar.fulfilled, (state) => {
            state.loading = false;
            state.avatar = null;
            state.error = null;
        });
        builder.addCase(removeAvatar.rejected, (state, action: PayloadAction<any>) => {
            state.loading = false;
            state.error = action.payload;
        });
    },
});

export const {clearUserError, setUserId} = userSlice.actions;
export default userSlice.reducer;
export const selectUserProfile = (state: RootState) => state.user;

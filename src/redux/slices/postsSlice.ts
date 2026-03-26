// store/postsSlice.ts
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Post} from '@/types/navigation.types';
import {db} from '@/lib/firebase';
import * as ImageManipulator from 'expo-image-manipulator';
import {addDoc, collection, serverTimestamp} from 'firebase/firestore';
import type {RootState} from '@/redux/store';
import {getPosts} from '@/utils/firestore';

interface PostsState {
    posts: Post[];
    loading: boolean;
    error: string | null;
}

const initialState: PostsState = {
    posts: [],
    loading: false,
    error: null,
};

// ------------------- Thunks -------------------

// Fetch posts
export const fetchPosts = createAsyncThunk<Post[], number | undefined, { rejectValue: string }>(
    'posts/fetchPosts',
    async (limit = 20, {rejectWithValue}) => {
        console.log('🔄 Виклик fetchPosts з лімітом:', limit);

        try {
            const posts = await getPosts(limit);
            console.log('✅ Пости отримано:', posts.length, 'шт');

            if (posts.length === 0) {
                console.log('ℹ️ Масив постів порожній');
            } else {
                console.log('📝 Перший пост:', {
                    id: posts[0].id,
                    title: posts[0].title,
                    photo: posts[0].photo?.substring(0, 50) + '...'
                });
            }

            return posts;
        } catch (error: any) {
            console.error('❌ Помилка fetchPosts:', {
                message: error.message,
                code: error.code,
                stack: error.stack
            });
            return rejectWithValue(error.message || 'Failed to fetch posts');
        }
    }
);

// Add post
export const addPostAsync = createAsyncThunk<
    Post,
    {
        photo: string; // 👈 просто URL
        title: string;
        location: string;
        coordinates: { latitude: number; longitude: number };
        userId: string;
    },
    { rejectValue: string }
>('posts/addPost', async (postData, {rejectWithValue}) => {
    try {
        console.log('[addPostAsync] Processing image for Base64 (max 800px):', postData.photo);

        // Resize and compress for Firestore compatibility (1MB limit)
        const manipulated = await ImageManipulator.manipulateAsync(
            postData.photo,
            [{ resize: { width: 800 } }], // Resize width to 800px, height will auto-scale
            { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG, base64: true }
        );

        if (!manipulated.base64) throw new Error("Base64 conversion failed");

        const base64Photo = `data:image/jpeg;base64,${manipulated.base64}`;
        console.log('[addPostAsync] Base64 created. Length:', base64Photo.length);

        const docRef = await addDoc(collection(db, 'posts'), {
            photo: base64Photo,
            title: postData.title,
            location: postData.location,
            coordinates: postData.coordinates,
            comments: 0,
            likes: 0,
            createdAt: Date.now(), // Fixed to use number for consistency with getPosts
            userId: postData.userId,
        });

        return {
            id: docRef.id,
            ...postData,
            photo: base64Photo, // Use the base64 version
            comments: 0,
            likes: 0,
            createdAt: Date.now(),
        };
    } catch (e: any) {
        return rejectWithValue(e.message || 'Не вдалося створити пост');
    }
});


// ------------------- Slice -------------------

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        addPost: (state, action: PayloadAction<Omit<Post, 'id' | 'createdAt' | 'comments' | 'likes'>>) => {
            const newPost: Post = {
                ...action.payload,
                id: Date.now().toString(),
                createdAt: Date.now(),
                comments: 0,
                likes: 0,
            };
            state.posts.unshift(newPost);
        },
        likePost: (state, action: PayloadAction<string>) => {
            const post = state.posts.find(p => p.id === action.payload);
            if (post) post.likes += 1;
        },
        updatePost: (state, action: PayloadAction<Post>) => {
            const index = state.posts.findIndex(p => p.id === action.payload.id);
            if (index !== -1) state.posts[index] = action.payload;
        },
        deletePost: (state, action: PayloadAction<string>) => {
            state.posts = state.posts.filter(p => p.id !== action.payload);
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // fetchPosts
            .addCase(fetchPosts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPosts.fulfilled, (state, action: PayloadAction<Post[]>) => {
                state.loading = false;
                state.posts = action.payload;
            })
            .addCase(fetchPosts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Помилка завантаження постів';
            })

            // addPostAsync
            .addCase(addPostAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addPostAsync.fulfilled, (state, action: PayloadAction<Post>) => {
                state.loading = false;
                state.posts.unshift(action.payload);
            })
            .addCase(addPostAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Помилка додавання посту';
            });
    },

});

// ------------------- Exports -------------------
export const {addPost, likePost, updatePost, deletePost, clearError} = postsSlice.actions;
export default postsSlice.reducer;

// Селектори
export const selectPosts = (state: RootState) => state.posts.posts;
export const selectPostsLoading = (state: RootState) => state.posts.loading;
export const selectPostsError = (state: RootState) => state.posts.error;

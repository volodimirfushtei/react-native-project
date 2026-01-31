// store/postsSlice.ts
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Post} from '@/types/navigation.types';
import {db} from '@/lib/firebase';
import {addDoc, collection, serverTimestamp,} from 'firebase/firestore';
import type {RootState} from '@/redux/store';
import {getPosts} from '@/utils/firestore';
import {uploadImage} from '@/utils/storage';

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
        photo: string;
        title: string;
        location: string;
        coordinates: { latitude: number; longitude: number };
        userId: string;

    },
    { rejectValue: string }
>('posts/addPost', async (postData, {rejectWithValue}) => {
    try {
        console.log('📝 Початок створення посту:', postData.title);


        // 1️⃣ Upload image
        const photoURL = await uploadImage(postData.photo, postData.userId);

        // 2️⃣ Save post in Firestore
        const docRef = await addDoc(collection(db, 'posts'), {
            photo: photoURL,
            title: postData.title,
            location: postData.location,
            coordinates: postData.coordinates,
            comments: 0,
            likes: 0,
            createdAt: serverTimestamp(),
            userId: postData.userId,
        });

        // 3️⃣ Return serializable post
        return {
            id: docRef.id,
            photo: photoURL,
            title: postData.title,
            location: postData.location,
            coordinates: postData.coordinates,
            comments: 0,
            likes: 0,
            createdAt: Date.now(), // ❗ number, не Date
            userId: postData.userId,
        };
    } catch (error: any) {
        console.error('❌ addPostAsync error:', error);
        return rejectWithValue(error.message || 'Не вдалося створити пост');
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

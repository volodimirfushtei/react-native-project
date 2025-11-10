import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Post} from '@/types/navigation.types';
import {getDbInstance} from '@/lib/firebase';
import {addDoc, collection, getDocs, query} from 'firebase/firestore';


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

// Асинхронні thunks
export const fetchPosts = createAsyncThunk(
    'posts/fetchPosts',
    async (_, {rejectWithValue}) => {
        const db = getDbInstance();
        try {
            const q = query(collection(db, 'posts'));
            const querySnapshot = await getDocs(q);

            const posts: Post[] = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();

                posts.push({
                    id: doc.id,
                    photo: data.photo || '',
                    title: data.title || '',
                    comments: data.comments || 0,
                    likes: data.likes || 0,
                    location: data.location || '',
                    coordinates: data.coordinates || {latitude: 0, longitude: 0},
                    createdAt: data.createdAt ? new Date(data.createdAt.seconds * 1000) : new Date(),
                });
            });

            return posts;
        } catch (error: any) {
            console.error('Firestore fetch error:', error);
            return rejectWithValue(error.message || 'Failed to fetch posts from Firestore');
        }
    }
);

export const addPost = createAsyncThunk(
    'posts/addPost',
    async (post: Omit<Post, 'id'>, {rejectWithValue}) => {
        const db = getDbInstance();
        try {
            // Видаляємо createdAt, якщо він є — Firestore використовує Timestamp
            const {createdAt, ...postData} = post;

            const docRef = await addDoc(collection(db, 'posts'), {
                ...postData,
                createdAt: new Date(), // Firebase автоматично конвертує в Timestamp
            });

            return {
                id: docRef.id,
                ...post,
            } as Post;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        // Синхронні редюсери
        likePost: (state, action: PayloadAction<string>) => {
            const post = state.posts.find(p => p.id === action.payload);
            if (post) {
                post.likes += 1;
            }
        },
        updatePost: (state, action: PayloadAction<Post>) => {
            const index = state.posts.findIndex(p => p.id === action.payload.id);
            if (index !== -1) {
                state.posts[index] = action.payload;
            }
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
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.loading = false;
                state.posts = action.payload;
            })
            .addCase(fetchPosts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch posts';
            })
            // addPost
            .addCase(addPost.fulfilled, (state, action) => {
                state.posts.unshift(action.payload);
            })
            .addCase(addPost.rejected, (state, action) => {
                state.error = action.payload as string;
            });
    },
});

export const {likePost, updatePost, deletePost, clearError} = postsSlice.actions;
export default postsSlice.reducer;
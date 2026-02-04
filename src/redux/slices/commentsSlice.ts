import {Comment} from '@/types/navigation.types';
import type {RootState} from '@/redux/store';
import {createAsyncThunk, createSelector, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {addDoc, collection, doc, getDocs, increment, orderBy, query, updateDoc, where} from 'firebase/firestore';
import {db} from '@/lib/firebase';

interface CommentsState {
    comments: Comment[];
    commentsByPostId: Record<string, Comment[]>;
    loading: boolean;

    error: string | null;
}

const initialState: CommentsState = {
    comments: [],
    commentsByPostId: {},
    loading: false,

    error: null,
};

// Mock fetch
export const fetchComments = createAsyncThunk<
    Comment[],
    { postId: string },
    { rejectValue: string }
>('comments/fetchComments', async ({postId}, {rejectWithValue}) => {
    try {
        const q = query(
            collection(db, 'comments'),
            where('postId', '==', postId),
            orderBy('createdAt', 'asc')
        );

        const snap = await getDocs(q);

        return snap.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                postId,
                text: data.text,
                userId: data.userId,
                userName: data.userName,
                avatar: data.avatar ?? null,
                likes: data.likes ?? 0,
                createdAt: typeof data.createdAt === 'number'
                    ? data.createdAt
                    : data.createdAt?.toMillis() ?? Date.now()

            };
        });
    } catch (e: any) {
        return rejectWithValue(e.message);
    }
});


export const addComment = createAsyncThunk<
    Comment,
    {
        postId: string;
        text: string;
        userName: string;
        userId: string;
        avatar?: string;
    },
    { rejectValue: string }
>('comments/addComment', async (data, {rejectWithValue}) => {
    try {
        const comment = {
            ...data,
            avatar: data.avatar ?? null,
            likes: 0,
            createdAt: Date.now(),
        };

        const ref = await addDoc(collection(db, 'comments'), {
            postId: data.postId,
            text: data.text,
            userId: data.userId,
            userName: data.userName,
            avatar: data.avatar ?? null,
            likes: 0,
            createdAt: Date.now(),
        });

        await updateDoc(doc(db, 'posts', data.postId), {
            comments: increment(1),
        });

        return {
            id: ref.id,
            ...comment,
        };
    } catch (e: any) {
        return rejectWithValue(e.message);
    }
});


const commentsSlice = createSlice({
    name: 'comments',
    initialState,
    reducers: {
        likeComment: (state, action: PayloadAction<string>) => {
            const comment = state.comments.find(c => c.id === action.payload);
            if (comment) comment.likes += 1;
        },
        deleteComment: (state, action: PayloadAction<string>) => {
            state.comments = state.comments.filter(c => c.id !== action.payload);
            // Видаляємо також із commentsByPostId
            Object.keys(state.commentsByPostId).forEach(postId => {
                state.commentsByPostId[postId] = state.commentsByPostId[postId].filter(c => c.id !== action.payload);
            });
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchComments.fulfilled, (state, action) => {
                state.comments = action.payload;
                state.commentsByPostId = {};
                action.payload.forEach(comment => {
                    if (!state.commentsByPostId[comment.postId]) {
                        state.commentsByPostId[comment.postId] = [];
                    }
                    state.commentsByPostId[comment.postId].push(comment);
                });
            })
            .addCase(addComment.fulfilled, (state, action) => {
                state.comments.push(action.payload);
                const postId = action.payload.postId;

                if (!state.commentsByPostId[postId]) {
                    state.commentsByPostId[postId] = [];
                }
                state.commentsByPostId[postId].push(action.payload);
            })
            .addCase(addComment.rejected, (state, action) => {
                state.error = action.payload as string;
            });


    },
});

export const {likeComment, deleteComment, clearError} = commentsSlice.actions;
export default commentsSlice.reducer;

// Селектори
export const selectCommentsState = (state: RootState) => state.comments;


export const selectCommentsByPostId = (postId: string) =>
    createSelector(
        [(state: RootState) => state.comments.commentsByPostId],
        (commentsByPostId) => commentsByPostId?.[postId] ?? []
    );

export const makeSelectCommentsCount = (postId: string) =>
    createSelector(
        [(state: RootState) => state.comments.commentsByPostId],
        (commentsByPostId) => commentsByPostId[postId]?.length ?? 0
    );



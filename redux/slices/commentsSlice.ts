import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Comment} from '@/types/navigation.types';

interface CommentsState {
    comments: Comment[];
    loading: boolean;
    error: string | null;
}

const initialState: CommentsState = {
    comments: [],
    loading: false,
    error: null,
};

export const fetchComments = createAsyncThunk(
    'comments/fetchComments',
    async () => {
        // Тут буде API запит
        const mockComments: Comment[] = [
            {
                id: "1",
                postId: "1",
                user: "John Doe",
                avatar: "https://i.pravatar.cc/50?img=1",
                text: "Really love your most recent photo!",
                date: "09 червня, 2020 | 08:40",
                timestamp: new Date(2020, 5, 9, 8, 40),
                likes: 2
            },
            {
                id: "2",
                postId: "1",
                user: "Sarah Smith",
                avatar: "https://i.pravatar.cc/50?img=2",
                text: "A fast 50mm like f1.8 would help!",
                date: "09 червня, 2020 | 09:14",
                timestamp: new Date(2020, 5, 9, 9, 14),
                likes: 1
            },
        ];
        return mockComments;
    }
);

export const addComment = createAsyncThunk(
    'comments/addComment',
    async (commentData: Omit<Comment, 'id' | 'timestamp' | 'date'>, {rejectWithValue}) => {
        try {
            const newComment: Comment = {
                ...commentData,
                id: Date.now().toString(),
                timestamp: new Date(),
                date: new Date().toLocaleDateString('uk-UA'),
            };
            return newComment;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

const commentsSlice = createSlice({
    name: 'comments',
    initialState,
    reducers: {
        likeComment: (state, action: PayloadAction<string>) => {
            const comment = state.comments.find(c => c.id === action.payload);
            if (comment) {
                comment.likes += 1;
            }
        },
        deleteComment: (state, action: PayloadAction<string>) => {
            state.comments = state.comments.filter(c => c.id !== action.payload);
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchComments.fulfilled, (state, action) => {
                state.comments = action.payload;
            })
            .addCase(addComment.fulfilled, (state, action) => {
                state.comments.push(action.payload);
            })
            .addCase(addComment.rejected, (state, action) => {
                state.error = action.payload as string;
            });
    },
});

export const {likeComment, deleteComment, clearError} = commentsSlice.actions;
export default commentsSlice.reducer;
import {configureStore} from '@reduxjs/toolkit';
import postsReducer from './slices/postsSlice';
import commentsReducer from './slices/commentsSlice';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';

export const store = configureStore({
    reducer: {
        posts: postsReducer,
        comments: commentsReducer,
        auth: authReducer,
        user: userReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [],
                ignoredActionPaths: ['meta.arg', 'payload.timestamp'],
                ignoredPaths: [],
            },
        }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
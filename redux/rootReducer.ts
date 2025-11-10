import {combineReducers} from '@reduxjs/toolkit';
import postsReducer from '@/redux/slices/postsSlice';
import commentsReducer from '@/redux/slices/commentsSlice';
import authReducer from '@/redux/slices/authSlice';
import userReducer from '@/redux/slices/userSlice';

const rootReducer = combineReducers({
    posts: postsReducer,
    comments: commentsReducer,
    auth: authReducer,
    user: userReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface UserState {
    id: string;
    name: string;
    email: string;
    avatar?: string;
}

const initialState: UserState = {
    id: '1',
    name: 'Natali Romanova',
    email: 'email@example.com',
    avatar: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e',
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        updateUser: (state, action: PayloadAction<Partial<UserState>>) => {
            return {...state, ...action.payload};
        },
        resetUser: () => initialState,
    },
});

export const {updateUser, resetUser} = userSlice.actions;
export default userSlice.reducer;
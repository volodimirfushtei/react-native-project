export type RootStackParamList = {
    LoginScreen: undefined;
    RegistrationScreen: undefined;
    PostsScreen: undefined;
    CreatePostScreen: undefined;
    Auth: undefined;
    Home: undefined | {
        screen: 'PostsScreen' | 'CreatePostScreen' | 'ProfileScreen';
        params?: any;
    };
    AuthNavigator: undefined;
    ProfileScreen: undefined;
    SettingsScreen: undefined;
    CommentsScreen: { postId: string };
    MapScreen: { location: string; latitude?: number; longitude?: number };
    AppNavigator: undefined;
    Settings: undefined;
    EditProfile: undefined;
    ChangePassword: undefined;
    deleteAccount: undefined;


};

export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    createdAt: Date;
    updatedAt?: Date;
}


export interface Post {
    id: string;
    photo: string;
    title: string;
    location: string;
    coordinates?: {
        latitude: number;
        longitude: number;
    };
    createdAt: Date;
    comments: number;
    likes: number;
}

export interface Comment {
    id: string;
    postId: string;
    user: string;
    avatar: string;
    text: string;
    date: string;
    timestamp: Date;
    likes: number;
}
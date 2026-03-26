export type RootStackParamList = {
    LoginScreen: undefined;
    RegistrationScreen: undefined;
    PostsScreen: undefined;
    CreatePostScreen: undefined;
    Auth: undefined;
    Home: undefined | {
        screen: 'HomeStack' | 'CreatePostScreen' | 'ProfileScreen';
        params?: {
            screen?: 'PostsScreen' | 'CommentsScreen' | 'MapScreen' | 'TestFirebaseScreen';
            params?: any;
        };
    };
    HomeStack: {
        screen?: 'PostsScreen' | 'CommentsScreen' | 'MapScreen' | 'TestFirebaseScreen';
        params?: any;
    };
    SplashScreen: undefined;
    TestFirebaseScreen: undefined;
    ProfileScreen: undefined;
    SettingsScreen: undefined;
    CommentsScreen: { postId: string };
    MapScreen: { location: string; latitude?: number; longitude?: number };
    RootNavigator: undefined;
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
    createdAt: number;
    updatedAt?: number;
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
    createdAt: number;
    comments: number;
    likes: number;
    userId: string;
}

export interface Comment {
    id: string;
    postId: string;
    text: string;
    userId: string;
    userName: string;
    likes: number;
    avatar: string | null;
    createdAt?: number;
}

export type RootStackParamList = {
    LoginScreen: undefined;
    RegistrationScreen: undefined;
    PostsScreen: undefined;
    CreatePostScreen: undefined;
    Auth: undefined;
    Home: undefined;
    AuthNavigator: undefined;
    ProfileScreen: undefined;
    SettingsScreen: undefined;
    CommentsScreen: { postId: string };
    MapScreen: { location: string; latitude?: number; longitude?: number };
    AppNavigator: undefined;


};

export interface PostData {
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
    author: string;
    authorAvatar?: string;
    text: string;
    timestamp: Date;
    likes: number;
}
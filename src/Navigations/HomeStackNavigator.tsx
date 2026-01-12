// HomeStackNavigator.tsx
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import PostsScreen from '@/Screens/Home/PostsScreen';
import CreatePostScreen from '@/Screens/Home/CreatePostScreen';
import ProfileScreen from '@/Screens/Home/ProfileScreen';
import CommentsScreen from '@/Screens/Home/CommentsScreen';
import MapScreen from '@/Screens/Home/MapScreen';

export type HomeStackParamList = {
    PostsScreen: undefined;
    CreatePostScreen: undefined;
    ProfileScreen: undefined;
    CommentsScreen: { postId: string };
    MapScreen: { location: string; latitude?: number; longitude?: number };
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

export default function HomeStackNavigator() {
    return (
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="PostsScreen" component={PostsScreen}/>
            <Stack.Screen name="CreatePostScreen" component={CreatePostScreen}/>
            <Stack.Screen name="ProfileScreen" component={ProfileScreen}/>
            <Stack.Screen name="CommentsScreen" component={CommentsScreen}/>
            <Stack.Screen name="MapScreen" component={MapScreen}/>

        </Stack.Navigator>
    );
}

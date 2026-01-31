// HomeStackNavigator.tsx
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import PostsScreen from '@/Screens/Home/PostsScreen';
import CommentsScreen from '@/Screens/Home/CommentsScreen';
import MapScreen from '@/Screens/Home/MapScreen';
import TestFirebaseScreen from '@/Screens/Home/TestFirebaseScreen';

export type HomeStackParamList = {
    PostsScreen: undefined;
    CommentsScreen: { postId: string };
    MapScreen: { location: string; latitude?: number; longitude?: number };
    TestFirebaseScreen: undefined;
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

export default function HomeStackNavigator() {
    return (
        <Stack.Navigator
            initialRouteName="PostsScreen"
            screenOptions={{headerShown: false}}
        >
            <Stack.Screen name="PostsScreen" component={PostsScreen}/>
            <Stack.Screen name="CommentsScreen" component={CommentsScreen}/>
            <Stack.Screen name="MapScreen" component={MapScreen}/>
            <Stack.Screen name="TestFirebaseScreen" component={TestFirebaseScreen}/>
        </Stack.Navigator>
    );
}


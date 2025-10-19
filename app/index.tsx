import 'react-native-gesture-handler';
import React from "react";
import AuthContainer from "@/Screens/AuthContainer";
import {RootStackParamList} from "@/types/navigation.types";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import PostsScreen from "@/Screens/PostsScreen";
import CreatePostScreen from "@/Screens/CreatePostScreen";
import Home from "@/Screens/Home";
import Toast, {BaseToast, ErrorToast} from 'react-native-toast-message';
import CommentsScreen from "@/Screens/CommentsScreen";
import ProfileScreen from "@/Screens/ProfileScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {

    const toastConfig = {
        success: (props: any) => (
            <BaseToast
                {...props}
                style={{
                    borderLeftColor: '#24af03',
                    // твій акцентний колір
                    backgroundColor: 'rgba(204,255,200,0.8)',
                    borderRadius: 12,

                    shadowOpacity: 0.15,
                    marginTop: 5,

                }}
                contentContainerStyle={{paddingHorizontal: 16}}
                text1Style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: '#222',
                }}
                text2Style={{
                    fontSize: 12,
                    color: '#666',
                }}
            />
        ),

        error: (props: any) => (
            <ErrorToast
                {...props}
                style={{
                    borderLeftColor: '#ff4444',
                    backgroundColor: 'rgba(255,210,210,0.7)',
                    borderRadius: 12,
                    marginTop: 5,
                }}
                text1Style={{
                    color: '#ff3333', fontSize: 16,
                    fontWeight: '600',
                }}
                text2Style={{
                    color: '#b33', fontSize: 12,
                    fontWeight: '600',
                }}
            />
        ),

    };
    return (
        <>
            <Stack.Navigator screenOptions={{headerShown: false, animation: 'fade'}}
                             initialRouteName="AuthContainer">
                {/* Для неавторизованого користувача */}
                <Stack.Screen name="AuthContainer" component={AuthContainer}/>
                {/* Головний екран після логіну */}
                <Stack.Screen name="Home" component={Home}/>
                <Stack.Screen name="PostsScreen" component={PostsScreen}/>
                <Stack.Screen name="CreatePostScreen" component={CreatePostScreen}/>
                <Stack.Screen name="CommentsScreen" component={CommentsScreen}/>
                <Stack.Screen name="ProfileScreen" component={ProfileScreen}/>

            </Stack.Navigator>
            <Toast config={toastConfig}/>
        </>
    );
}




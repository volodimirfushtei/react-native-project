import 'react-native-gesture-handler';
import React from "react";
import AuthContainer from "@/Screens/AuthContainer";
import {RootStackParamList} from "@/types/navigation.types";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import PostsScreen from "@/Screens/PostsScreen";
import CreatePostScreen from "@/Screens/CreatePostScreen";
import Home from "@/Home/Home";
import Toast, {BaseToast, ErrorToast} from 'react-native-toast-message';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {

    const toastConfig = {
        success: (props: any) => (
            <BaseToast
                {...props}
                style={{

                    borderLeftColor: '#44d51c',
                    // твій акцентний колір
                    backgroundColor: '#fff',
                    borderRadius: 12,

                    shadowOpacity: 0.15,
                }}
                contentContainerStyle={{paddingHorizontal: 16}}
                text1Style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: '#222',
                }}
                text2Style={{
                    fontSize: 14,
                    color: '#666',
                }}
            />
        ),

        error: (props: any) => (
            <ErrorToast
                {...props}
                style={{
                    borderLeftColor: '#ff4444',
                    backgroundColor: '#fff5f5',
                    borderRadius: 12,
                }}
                text1Style={{color: '#ff3333'}}
                text2Style={{color: '#b33'}}
            />
        ),
    };
    return (
        <>
            <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName="AuthContainer">
                {/* Для неавторизованого користувача */}
                <Stack.Screen name="AuthContainer" component={AuthContainer}/>
                {/* Головний екран після логіну */}
                <Stack.Screen name="Home" component={Home}/>
                <Stack.Screen name="PostsScreen" component={PostsScreen}/>
                <Stack.Screen name="CreatePostScreen" component={CreatePostScreen}/>
            </Stack.Navigator>
            <Toast config={toastConfig}/>
        </>
    );
}




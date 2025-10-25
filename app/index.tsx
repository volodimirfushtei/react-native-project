import 'react-native-gesture-handler';
import React from "react";
import AppNavigator from "./Navigations/AppNavigator";
import Toast, {BaseToast, ErrorToast} from 'react-native-toast-message';
import {PostsProvider} from '@/Screens/Home/CreatePostScreen';
import {CommentsProvider} from '@/utils/CommentsProvider';

export default function RootNavigator() {

    const toastConfig = {
        success: (props: any) => (
            <BaseToast
                {...props}
                style={{
                    borderLeftColor: '#29a900',
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
            <CommentsProvider>
                <PostsProvider>
                    <AppNavigator/>
                </PostsProvider>
            </CommentsProvider>
            );
            <Toast config={toastConfig}/>
        </>
    );
}




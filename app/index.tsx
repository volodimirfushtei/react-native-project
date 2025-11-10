// RootNavigator.tsx
import 'react-native-gesture-handler';
import React, {useEffect, useState} from 'react';
import {Provider} from 'react-redux';
import Toast, {BaseToast, ErrorToast} from 'react-native-toast-message';
import {LoadingScreen} from '@/components/LoadingScreen';
import AppNavigator from "./Navigations/AppNavigator";
import {PostsProvider} from '@/utils/PostContext';
import {CommentsProvider} from '@/utils/CommentsProvider';
import {store} from '@/redux/store';
import AuthNavigator from './Navigations/AuthNavigator';

// ✅ Імпортуйте auth та onAuthStateChanged
import {getAuthInstance} from '@/lib/firebase';
import {onAuthStateChanged} from 'firebase/auth';
import {AuthProvider} from "@/utils/AuthContext";

export default function RootNavigator() {
    const [isAppReady, setIsAppReady] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const auth = getAuthInstance();
        return onAuthStateChanged(auth, (user) => {
            setIsAuthenticated(!!user);
            setIsAppReady(true);
        });
    }, []);

    if (!isAppReady) {
        return <LoadingScreen/>;
    }

    const toastConfig = {
        success: (props: any) => (
            <BaseToast
                {...props}
                style={{
                    borderLeftColor: '#44d51c',
                    backgroundColor: 'rgba(227,232,227,0.8)',
                    borderRadius: 12,
                    shadowOpacity: 0.15,

                }}
                contentContainerStyle={{paddingHorizontal: 16}}
                text1Style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: '#282828',
                }}
                text2Style={{
                    fontSize: 12,
                    color: '#3b3b3b',
                }}
            />
        ),

        error: (props: any) => (
            <ErrorToast
                {...props}
                style={{
                    borderLeftColor: '#ff4444',
                    backgroundColor: 'rgba(229,225,225,0.7)',
                    borderRadius: 12,
                    marginTop: 5,
                }}
                text1Style={{
                    color: '#ff3333',
                    fontSize: 14,
                    fontWeight: '600',
                }}
                text2Style={{
                    color: '#b33',
                    fontSize: 10,
                    fontWeight: '600',
                }}
            />
        ),
    };

    return (
        <Provider store={store}>

            <AuthProvider>
                <PostsProvider>
                    <CommentsProvider>
                        {isAuthenticated ? <AppNavigator/> : <AuthNavigator/>}
                    </CommentsProvider>
                </PostsProvider>
                <Toast config={toastConfig}/>
            </AuthProvider>

        </Provider>
    );
}



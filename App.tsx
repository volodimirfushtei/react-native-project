import React, {useEffect, useState} from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Provider} from 'react-redux';
import {store, useAppDispatch} from '@/redux/store';
import {NavigationContainer} from '@react-navigation/native';
import RootNavigator from '@/Navigations/RootNavigator';
import {auth, db} from '@/lib/firebase';
import {onAuthStateChanged} from 'firebase/auth';
import {doc, getDoc} from 'firebase/firestore';
import {setUserFromFirebase} from '@/redux/slices/authSlice';
import {loadUserData} from '@/redux/slices/userSlice';
import SplashScreen from "@/Screens/Splash/SplashScreen"

function AppWrapper() {
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(true);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            console.log('[App] onAuthStateChanged: user is', user ? user.uid : 'null');
            if (user) {
                // Отримуємо дані користувача з Firestore
                const userDocRef = doc(db, 'users', user.uid);
                const userSnap = await getDoc(userDocRef);

                const userData = userSnap.exists()
                    ? userSnap.data()
                    : {id: user.uid, email: user.email || '', name: user.displayName || '', avatar: user.photoURL};

                console.log('[App] Dispatching setUserFromFirebase with:', userData);
                dispatch(
                    setUserFromFirebase({
                        id: user.uid,
                        email: userData.email || user.email || '',
                        name: userData.name || user.displayName || '',
                        avatar: userData.avatar || user.photoURL || undefined,
                    })
                );

                // 🔥 ТАКОЖ завантажуємо в userSlice для профілю
                dispatch(loadUserData(user.uid));
            } else {
                dispatch(setUserFromFirebase(null));
                // Можна також очистити userSlice якщо треба
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [dispatch]);

    if (loading) return null; // тут можна поставити LoadingScreen
    if (!isReady) {
        return <SplashScreen onFinish={() => setIsReady(true)}/>;
    }
    return <RootNavigator/>;
}

export default function App() {
    return (
        <GestureHandlerRootView style={{flex: 1}}>
            <Provider store={store}>
                <NavigationContainer>
                    <AppWrapper/>
                </NavigationContainer>
            </Provider>
        </GestureHandlerRootView>
    );
}








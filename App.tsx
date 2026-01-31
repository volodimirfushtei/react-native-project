import React, {useEffect, useState} from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Provider, useDispatch} from 'react-redux';
import {store} from '@/redux/store';
import {NavigationContainer} from '@react-navigation/native';
import RootNavigator from '@/Navigations/RootNavigator';
import {auth, db} from '@/lib/firebase';
import {onAuthStateChanged} from 'firebase/auth';
import {doc, getDoc} from 'firebase/firestore';
import {setUserFromFirebase} from '@/redux/slices/authSlice';
import SplashScreen from "@/Screens/Splash/SplashScreen"

function AppWrapper() {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                // Отримуємо дані користувача з Firestore
                const userDocRef = doc(db, 'users', user.uid);
                const userSnap = await getDoc(userDocRef);

                const userData = userSnap.exists()
                    ? userSnap.data()
                    : {id: user.uid, email: user.email || '', name: user.displayName || '', avatar: user.photoURL};

                dispatch(
                    setUserFromFirebase({
                        id: userData.id,
                        email: userData.email,
                        name: userData.name,
                        avatar: userData.avatar,
                    })
                );
            } else {
                dispatch(setUserFromFirebase(null));
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








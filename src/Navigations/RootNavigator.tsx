// RootNavigator.tsx
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AuthContainer from '@/Screens/Auth/AuthContainer';
import {LoadingScreen} from "@/components/LoadingScreen";
import React from "react";
import {useSelector} from "react-redux";
import {selectAuthLoading, selectIsAuthenticated} from "@/redux/slices/authSlice";
import Home from "@/Home";

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const loading = useSelector(selectAuthLoading);
    const [initialRoute, setInitialRoute] = React.useState<string | null>(null);

    React.useEffect(() => {
        setInitialRoute(isAuthenticated ? 'Home' : 'Auth');
    }, [isAuthenticated]);

    if (loading) return <LoadingScreen/>;
    if (!initialRoute) return <LoadingScreen/>;
    return (
        <Stack.Navigator screenOptions={{headerShown: false}}>
            {isAuthenticated ? (
                // Якщо залогінений — одразу на PostsScreen
                <Stack.Screen name="Home" component={Home}/>
            ) : (
                // Якщо не залогінений — на Auth
                <Stack.Screen name="Auth" component={AuthContainer}/>
            )}
        </Stack.Navigator>
    );
}




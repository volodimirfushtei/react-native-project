import 'react-native-gesture-handler';
import React from "react";
import LoginScreen from "@/Screens/LoginScreen";
import RegistrationScreen from "@/Screens/RegistrationScreen";
import {RootStackParamList} from "@/types/navigation.types";
import {createNativeStackNavigator} from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
    return (

        <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName="LoginScreen">
            {/* Для неавторизованого користувача */}
            <Stack.Screen name="LoginScreen" component={LoginScreen}/>
            <Stack.Screen name="RegistrationScreen" component={RegistrationScreen}/>

        </Stack.Navigator>

    );
}




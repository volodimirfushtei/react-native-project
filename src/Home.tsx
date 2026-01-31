import React from "react";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {StyleSheet, View} from "react-native";
import CreatePostScreen from "@/Screens/Home/CreatePostScreen";
import ProfileScreen from "@/Screens/Home/ProfileScreen";
import {Feather} from '@expo/vector-icons';
import HomeStackNavigator from "@/Navigations/HomeStackNavigator";

const Tab = createBottomTabNavigator();

export default function Home() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarStyle: styles.tabBar,
            }}
        >
            {/* Публікації */}
            <Tab.Screen
                name="HomeStack"
                component={HomeStackNavigator} // <- тут вставляємо стек
                options={{
                    tabBarIcon: ({focused}) => (

                        <Feather name="grid" size={24} color={focused ? "#FF6C00" : "#bdbdbd"} style={styles.icon}/>

                    ),
                }}
            />

            {/* Створити публікацію */}
            <Tab.Screen
                name="CreatePostScreen"
                component={CreatePostScreen}
                options={{
                    tabBarIcon: ({focused}) => (
                        <View
                            style={[
                                styles.addButton,
                                focused && styles.addButtonFocused
                            ]}
                        >
                            <Feather
                                name="plus"
                                size={24}
                                color={focused ? "#FFFFFF" : "#FFFFFF"}
                            />
                        </View>
                    ),
                    tabBarStyle: {display: 'none'}, // Приховати текст
                }}
            />
            {/* Профіль */}
            <Tab.Screen
                name="ProfileScreen"
                component={ProfileScreen}
                options={{
                    tabBarIcon: ({focused}) => (
                        <Feather name="user" size={24}
                                 color={focused ? "#FF6C00" : "#bdbdbd"}
                                 style={styles.icon}/>
                    ),
                }}
            />

        </Tab.Navigator>
    );
}
const styles = StyleSheet.create({
    tabBar: {
        height: 83,
        borderTopWidth: 1,
        borderTopColor: "#E8E8E8",
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    icon: {
        width: 24,
        height: 24,
        tintColor: "#212121",
        top: 9,
    },
    iconPlus: {
        width: 24,
        height: 24,
        tintColor: "#212121",
    },
    addButton: {
        backgroundColor: "#FF6C00",
        width: 70,
        height: 40,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        top: 9,
    },
    addButtonFocused: {
        backgroundColor: "#FF6C00",

        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
    addButtonText: {
        fontSize: 30, color: "#fff",
        lineHeight: 35,
    },
});


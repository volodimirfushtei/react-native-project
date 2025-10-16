import React from "react";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {Image, StyleSheet, Text, View} from "react-native";

import PostsScreen from "@/Screens/PostsScreen";
import CreatePostScreen from "@/Screens/CreatePostScreen";
import ProfileScreen from "@/Screens/ProfileScreen"; // створи пізніше

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
                name="PostsScreen"
                component={PostsScreen}
                options={{
                    tabBarIcon: ({focused}) => (
                        <Image
                            source={require("@/assets/icons/grid.png")}
                            style={[styles.icon, focused && {tintColor: "#FF6C00"}]}
                        />
                    ),
                }}
            />

            {/* Створити публікацію */}
            <Tab.Screen
                name="CreatePostScreen"
                component={CreatePostScreen}
                options={{
                    tabBarIcon: () => (
                        <View style={styles.addButton}>
                            <Text style={styles.addButtonText}>+</Text>
                        </View>
                    ),
                }}
            />

            {/* Профіль */}
            <Tab.Screen
                name="ProfileScreen"
                component={ProfileScreen}
                options={{
                    tabBarIcon: ({focused}) => (
                        <Image
                            source={require("@/assets/icons/user.png")}
                            style={[styles.icon, focused && {tintColor: "#FF6C00"}]}
                        />
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
    },
    icon: {
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
        top: -10,
    },
    addButtonText: {
        fontSize: 30,
        color: "#fff",
        lineHeight: 35,
    },
});


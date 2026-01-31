import React from "react";
import {Dimensions, StyleSheet, View} from "react-native";
import Animated, {useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";

import LoginScreen from "@/Screens/Auth/LoginScreen";
import RegistrationScreen from "@/Screens/Auth/RegistrationScreen";
import {BlurView} from "expo-blur";
import {LinearGradient} from "expo-linear-gradient";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {RootStackParamList} from "@/types/navigation.types";

const {width} = Dimensions.get("window");
type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList>;
    route: any;
    children?: React.ReactNode;
};
export default function AuthContainer({navigation, route}: Props) {


    // Значення анімації
    const progress = useSharedValue(0); // 0 = login, 1 = register
    const overlayOpacity = useSharedValue(0); // для BlurView
    const goToRegister = () => {
        overlayOpacity.value = withTiming(1, {duration: 150});
        progress.value = withTiming(1, {duration: 500});
        overlayOpacity.value = withTiming(0, {duration: 200});
    };

    const goToLogin = () => {
        overlayOpacity.value = withTiming(1, {duration: 150});
        progress.value = withTiming(0, {duration: 500});
        overlayOpacity.value = withTiming(0, {duration: 200});
    };

    // Стиль для Blur overlay
    const overlayStyle = useAnimatedStyle(() => ({
        opacity: overlayOpacity.value,
    }));


    // Стиль Login екрана
    const loginStyle = useAnimatedStyle(() => ({
        transform: [
            {translateX: -progress.value * width},
            // зсуваємо вліво
        ],
        opacity: 1 - progress.value,
        // fade out
    }));

    // Стиль Register екрана
    const registerStyle = useAnimatedStyle(() => ({
        transform: [
            {translateX: (1 - progress.value) * width},
            // зсуваємо справа
        ],
        opacity: progress.value, // fade in


    }));

    // @ts-ignore
    return (
        <View style={styles.container}>
            <Animated.View style={[styles.screen, loginStyle]}>
                <LoginScreen navigation={navigation} route={route} goToRegister={goToRegister}/>
            </Animated.View>

            <Animated.View style={[styles.screen, registerStyle]}>
                <RegistrationScreen navigation={navigation} route={route} goToLogin={goToLogin}/>
            </Animated.View>
            {/* 🔹 Оверлей з розмиттям */}
            <Animated.View style={[styles.overlay, overlayStyle]} pointerEvents="none">
                <BlurView intensity={50} tint="extraLight" style={StyleSheet.absoluteFill}/>
                <LinearGradient
                    colors={[
                        "rgba(255, 255, 255, 0.45)",
                        "rgba(255, 255, 255, 0.45)",
                        "rgba(0, 0, 0, 0.2)",
                    ]}
                    style={StyleSheet.absoluteFill}
                />
                <View style={styles.glowCircle}/>
            </Animated.View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {flex: 1, overflow: "hidden"},
    screen: {
        ...StyleSheet.absoluteFillObject,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
    },
    buttonContainer: {
        position: "absolute",
        bottom: 40,
        alignSelf: "center",
    },
    glowCircle: {
        position: "absolute",
        top: "30%",
        left: "20%",
        width: 250,
        height: 250,
        borderRadius: 250,
        backgroundColor: "rgba(255, 180, 80, 0.5)", // теплий світловий ефект
        shadowColor: "rgba(255, 180, 80, 0.5)",
        shadowOpacity: 1,
        shadowRadius: 40,
        shadowOffset: {width: 0, height: 0},
    },
});

import React, {useEffect, useRef} from 'react';
import {Dimensions, Image, StyleSheet, View} from 'react-native';
import Animated, {
    Easing,
    interpolate,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withSpring,
    withTiming,
} from 'react-native-reanimated';
import {Gesture, GestureDetector,} from 'react-native-gesture-handler';
import {LinearGradient} from 'expo-linear-gradient';
import {Feather} from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

const {height: SCREEN_HEIGHT} = Dimensions.get('window');
export type SplashScreenProps = {
    onFinish: () => void;
};

export default function SplashScreen({onFinish}: SplashScreenProps) {

    const hasMounted = useRef(false);
    const logoScale = useSharedValue(0);
    const logoOpacity = useSharedValue(0);
    const logoRotate = useSharedValue(0);
    const textOpacity = useSharedValue(0);
    const textScale = useSharedValue(0.8);

    // Нова анімація для свайпу вниз
    const swipeTranslateY = useSharedValue(0);
    const swipeOpacity = useSharedValue(1);
    const swipeScale = useSharedValue(1);
    const hasTriggered = useSharedValue(false);

    useEffect(() => {
        if (hasMounted.current) return;
        hasMounted.current = true;
        // Лого з'являється
        logoOpacity.value = withTiming(1, {duration: 800});
        logoScale.value = withSpring(1, {damping: 12, stiffness: 120});
        logoRotate.value = withDelay(200, withTiming(360, {duration: 600, easing: Easing.out(Easing.cubic)}));

        // Текст з'являється
        textOpacity.value = withDelay(800, withTiming(1, {duration: 600}));
        textScale.value = withDelay(800, withSpring(1, {damping: 10, stiffness: 100}));
    }, []);


    const triggerHaptic = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    };
    const finishSplash = () => {
        onFinish();
    };

    const panGesture = Gesture.Pan()
        .onStart(() => {
            // Зберігаємо початкове значення
        })
        .onUpdate((event) => {
            // Дозволяємо тільки свайп вниз (позитивні значення)
            if (event.translationY > 0) {
                swipeTranslateY.value = event.translationY;
                swipeOpacity.value = interpolate(
                    swipeTranslateY.value,
                    [0, SCREEN_HEIGHT * 0.3],
                    [1, 0.3]
                );
                swipeScale.value = interpolate(
                    swipeTranslateY.value,
                    [0, SCREEN_HEIGHT * 0.4],
                    [1, 0.7]
                );
            }
        })
        .onEnd((event) => {


            if (!hasTriggered.value && event.translationY > SCREEN_HEIGHT * 0.2) {
                hasTriggered.value = true;
                runOnJS(triggerHaptic)();
            }


            if (event.translationY > SCREEN_HEIGHT * 0.2) {

                runOnJS(triggerHaptic)();

                swipeTranslateY.value = withSpring(
                    SCREEN_HEIGHT,
                    {damping: 20, stiffness: 200},
                    () => {
                        runOnJS(finishSplash)();
                    }
                );

                swipeOpacity.value = withTiming(0, {duration: 300});
                swipeScale.value = withTiming(0.5, {duration: 300});

            } else {
                swipeTranslateY.value = withSpring(0);
                swipeOpacity.value = withTiming(1);
                swipeScale.value = withTiming(1);
            }
        });


    const logoStyle = useAnimatedStyle(() => ({
        opacity: logoOpacity.value,
        transform: [
            {scale: logoScale.value},
            {rotate: `${logoRotate.value}deg`}
        ],
        shadowColor: '#FF6C00',
        shadowOffset: {width: 0, height: interpolate(logoScale.value, [0, 1], [0, 12])},
        shadowOpacity: interpolate(logoScale.value, [0, 1], [0, 0.35]),
        shadowRadius: interpolate(logoScale.value, [0, 1], [0, 18]),
    }));

    const textStyle = useAnimatedStyle(() => ({
        opacity: textOpacity.value,
        transform: [{scale: textScale.value}],
        textShadowColor: 'rgba(255,108,0,0.4)',
        textShadowOffset: {width: 0, height: 0},
        textShadowRadius: interpolate(textOpacity.value, [0, 1], [0, 8]),
    }));

    const containerStyle = useAnimatedStyle(() => ({
        transform: [
            {translateY: swipeTranslateY.value},
            {scale: swipeScale.value}
        ],
        opacity: swipeOpacity.value,
    }));


    return (
        <GestureDetector gesture={panGesture}>
            <Animated.View style={[styles.animatedContainer, containerStyle]}>
                <LinearGradient
                    colors={['#F5f5f5', '#f5f5f5', '#f39149']}
                    start={{x: 0.5, y: 0}}
                    end={{x: 0.5, y: 1}}
                    style={styles.gradient}
                >
                    {/* Лого */}
                    <Animated.View style={logoStyle}>
                        <Image source={require('./logo.png')} style={styles.logo}/>
                        <View style={styles.glowEffect}/>
                    </Animated.View>

                    {/* Текст */}
                    <Animated.Text style={[styles.subtitle, textStyle]}>
                        Welcome to
                    </Animated.Text>
                    <Animated.Text style={[styles.title, textStyle]}>
                        REACT NATIVE APP
                    </Animated.Text>
                    <Animated.Text style={[styles.text, textStyle]}>
                        Developed in 2026
                    </Animated.Text>
                    <Animated.View style={styles.containerArrow}>
                        <Feather name="arrow-down" size={24} color="#999" style={styles.icon}/>
                        <Animated.Text style={[styles.text, textStyle]}>Swipe down</Animated.Text>
                    </Animated.View>
                </LinearGradient>
            </Animated.View>
        </GestureDetector>
    );

}
const styles = StyleSheet.create({
    animatedContainer: {
        flex: 1,

    },

    gradient: {
        flex: 1,
        width: '100%',
        height: '100%',
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },

    logo: {
        width: 100,
        height: 100,
        borderRadius: 50,
        resizeMode: 'contain',
        marginBottom: 16,
    },

    glowEffect: {
        position: 'absolute',
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(255,108,0,0.15)',
        zIndex: -1,
    },

    title: {
        color: '#FF6C00',
        fontSize: 28,
        fontWeight: '800',
        letterSpacing: 1.5,
        marginBottom: 6,
        textTransform: 'uppercase',
    },
    icon: {
        marginTop: 38,

    },
    subtitle: {
        color: '#666',
        fontSize: 16,
        letterSpacing: 2,
    },
    containerArrow: {
        marginTop: 18,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    },
    text: {
        color: '#999',
        fontSize: 14,

        letterSpacing: 1.5,
    },
    text2: {
        color: '#999'
    }
});




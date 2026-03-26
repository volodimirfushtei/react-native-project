import React, {useEffect, useRef} from 'react';
import {Animated, StyleSheet, View, Text, Easing} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';

export const LoadingScreen = () => {
    const spinValue = useRef(new Animated.Value(0)).current;
    const pulseValue = useRef(new Animated.Value(1)).current;
    const fadeValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Continuous spinning for the outer ring
        Animated.loop(
            Animated.timing(spinValue, {
                toValue: 1,
                duration: 3000,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start();

        // Pulsing for the inner circle
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseValue, {
                    toValue: 1.15,
                    duration: 1000,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(pulseValue, {
                    toValue: 1,
                    duration: 1000,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
            ])
        ).start();

        // Smooth fade in for the whole content
        Animated.timing(fadeValue, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();
    }, []);

    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <LinearGradient
            colors={['#FF6C00', '#FF8C3A', '#212121']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={styles.container}
        >
            <Animated.View style={[styles.content, {opacity: fadeValue}]}>
                <View style={styles.loaderContainer}>
                    {/* Outer spinning ring */}
                    <Animated.View
                        style={[
                            styles.outerRing,
                            {
                                transform: [{rotate: spin}],
                            },
                        ]}
                    />
                    
                    {/* Middle ring with slightly different style */}
                    <View style={styles.middleRing} />

                    {/* Inner pulsing logo/circle */}
                    <Animated.View
                        style={[
                            styles.innerCircle,
                            {
                                transform: [{scale: pulseValue}],
                            },
                        ]}
                    >
                        <View style={styles.logoDot} />
                    </Animated.View>
                </View>

                <View style={styles.textWrapper}>
                    <Text style={styles.text}>Завантаження</Text>
                    <View style={styles.dotsContainer}>
                        {[0, 1, 2].map((i) => (
                            <AnimatedDot key={i} delay={i * 200}/>
                        ))}
                    </View>
                </View>
                
                <Text style={styles.subText}>Будь ласка, зачекайте...</Text>
            </Animated.View>
        </LinearGradient>
    );
};

const AnimatedDot = ({delay}: { delay: number }) => {
    const bounceValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.delay(delay),
                Animated.timing(bounceValue, {
                    toValue: -6,
                    duration: 400,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(bounceValue, {
                    toValue: 0,
                    duration: 400,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    return (
        <Animated.View
            style={[
                styles.dot,
                {
                    transform: [{translateY: bounceValue}],
                },
            ]}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    loaderContainer: {
        width: 120,
        height: 120,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 40,
    },
    outerRing: {
        position: 'absolute',
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: 'transparent',
        borderTopColor: '#FFFFFF',
        borderRightColor: 'rgba(255, 255, 255, 0.3)',
    },
    middleRing: {
        position: 'absolute',
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderStyle: 'dashed',
    },
    innerCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.4)',
    },
    logoDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#FFFFFF',
        shadowColor: '#FFFFFF',
        shadowOffset: {width: 0, height: 0},
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 5,
    },
    textWrapper: {
        flexDirection: 'row',
        alignItems: 'baseline',
        marginBottom: 8,
    },
    text: {
        fontSize: 24,
        fontWeight: '700',
        color: '#FFFFFF',
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    subText: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.6)',
        fontWeight: '400',
        letterSpacing: 0.5,
    },
    dotsContainer: {
        flexDirection: 'row',
        marginLeft: 4,
        gap: 4,
    },
    dot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#FFFFFF',
    },
});
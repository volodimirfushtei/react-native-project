import React, {useEffect, useRef} from 'react';
import {Animated, StyleSheet, View} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';

export const LoadingScreen = () => {
    const spinValue = useRef(new Animated.Value(0)).current;
    const pulseValue = useRef(new Animated.Value(1)).current;
    const fadeValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Spinning animation
        Animated.loop(
            Animated.timing(spinValue, {
                toValue: 1,
                duration: 2000,
                useNativeDriver: true,
            })
        ).start();

        // Pulsing animation
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseValue, {
                    toValue: 1.2,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseValue, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ])
        ).start();

        // Fade in text
        Animated.timing(fadeValue, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
        }).start();
    }, []);


    return (
        <LinearGradient
            colors={['#FF6C00', '#FF8C3A', '#FFF5F0']}
            start={{x: 0.5, y: 0}}
            end={{x: 0.5, y: 1}}
            style={styles.container}
        >


            {/* Loading text with fade in */}
            <Animated.Text
                style={[
                    styles.text,
                    {
                        opacity: fadeValue,
                    },
                ]}
            >
                Завантаження...
            </Animated.Text>

            {/* Animated dots */}
            <View style={styles.dotsContainer}>
                {[0, 1, 2].map((i) => (
                    <AnimatedDot key={i} delay={i * 200}/>
                ))}
            </View>
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
                    toValue: -10,
                    duration: 400,
                    useNativeDriver: true,
                }),
                Animated.timing(bounceValue, {
                    toValue: 0,
                    duration: 400,
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
    circle: {
        position: 'absolute',
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 4,
        borderColor: 'rgba(255, 108, 0, 0.3)',
    },
    circleOuter: {
        width: 160,
        height: 160,
        borderRadius: 80,
        borderWidth: 3,
        borderColor: 'rgba(255, 108, 0, 0.15)',
        borderStyle: 'dashed',
    },
    circleMiddle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 5,
        borderColor: 'rgba(255, 108, 0, 0.5)',
    },
    text: {
        marginTop: 120,
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
        letterSpacing: 0.5,
        textShadowColor: 'rgba(0, 0, 0, 0.1)',
        textShadowOffset: {width: 0, height: 1},
        textShadowRadius: 2,
    },
    dotsContainer: {
        flexDirection: 'row',
        marginTop: 18,
        gap: 8,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
});
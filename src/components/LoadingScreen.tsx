import React from 'react';
import {ActivityIndicator, StyleSheet, Text} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';

export const LoadingScreen = () => {
    return (
        <LinearGradient
            colors={['#FF6C00', '#f5f5f5', '#fafaf4']}

            start={{x: 0.5, y: 0}}
            end={{x: 0.5, y: 1}}
            style={styles.container}
        >

            <ActivityIndicator size="large" color="#FF6C00"/>


            <Text style={styles.text}>Завантаження...</Text>
        </LinearGradient>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    text: {
        marginTop: 26,
        fontSize: 16,
        color: '#666',
    },
});

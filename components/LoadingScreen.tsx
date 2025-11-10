import React from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';

export const LoadingScreen = () => {
    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color="#FF6C00"/>
            <Text style={styles.text}>Завантаження...</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    text: {
        marginTop: 16,
        fontSize: 16,
        color: '#666',
    },
});
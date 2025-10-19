import React, {useState} from "react";
import {Image, StyleSheet, TouchableOpacity, View} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";


export default function UserAvatar() {
    const [avatar, setAvatar] = useState<string | null>(
        "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e"
    );

    const handlePickImage = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) return;

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: "images",
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setAvatar(result.assets[0].uri);
        }
    };

    const handleRemove = () => {
        setAvatar(null);
    };

    return (
        <View style={styles.container}>
            <View style={styles.avatarWrapper}>
                <Image
                    source={
                        avatar
                            ? {uri: avatar}
                            : require("@/assets/images/default-avatar.png")
                    }
                    style={styles.avatar}
                />
                <TouchableOpacity
                    style={[styles.iconButton, avatar ? styles.removeBtn : styles.addBtn]}
                    onPress={avatar ? handleRemove : handlePickImage}
                >
                    <Ionicons
                        name={avatar ? "close-circle-outline" : "add-circle-outline"}
                        size={25}
                        color={avatar ? "#BDBDBD" : "#FF6C00"}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
    },
    avatarWrapper: {
        position: "relative",
        width: 120,
        height: 120,
        borderRadius: 16,

        backgroundColor: "#F6F6F6",
        zIndex: 1,
    },
    avatar: {

        objectFit: "cover",
        width: "100%",
        height: "100%",
        borderRadius: 16,
    },
    iconButton: {
        position: "absolute",
        right: -10,
        bottom: 10,
        backgroundColor: "#fff",
        borderRadius: 50,
        elevation: 2, // для тіні на Android
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.2,
        shadowRadius: 3,
        zIndex: 999,
    },
    removeBtn: {},
    addBtn: {},
});

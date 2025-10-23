import React, {useState} from "react";
import {Image, StyleSheet, TouchableOpacity, View} from "react-native";
import {Feather} from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import Toast from 'react-native-toast-message';

interface UserAvatarProps {
    uri?: string;
    onAvatarChange?: (uri: string | null) => void;
    size?: number;
    editable?: boolean;
}

export default function UserAvatar({
                                       uri,
                                       onAvatarChange,
                                       size = 120,
                                       editable = true
                                   }: UserAvatarProps) {
    const [avatar, setAvatar] = useState<string | null>(uri || null);

    const handlePickImage = async () => {
        if (!editable) return;

        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
            Toast.show({
                type: "error",
                text1: "Доступ заборонено",
                text2: "Дозвольте доступ до галереї",
            });
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled && result.assets[0]) {
            const newAvatar = result.assets[0].uri;
            setAvatar(newAvatar);
            onAvatarChange?.(newAvatar);
            Toast.show({type: "success", text1: "Аватар змінено"});
        }
    };

    const handleRemove = () => {
        if (!editable) return;
        setAvatar(null);
        onAvatarChange?.(null);
        Toast.show({type: "info", text1: "Аватар видалено"});
    };

    return (
        <View style={styles.container}>
            <View style={[styles.avatarWrapper, {width: size, height: size}]}>
                <Image
                    source={
                        avatar
                            ? {uri: avatar}
                            : require("@/assets/images/default-avatar.png")
                    }
                    style={[styles.avatar, {width: size, height: size}]}
                />

                {editable && (
                    <TouchableOpacity
                        style={[
                            styles.iconButton,
                            avatar ? styles.removeBtn : styles.addBtn
                        ]}
                        onPress={avatar ? handleRemove : handlePickImage}
                    >
                        <Feather
                            name={avatar ? "x" : "plus"}
                            size={20}
                            color={avatar ? "#BDBDBD" : "#FF6C00"}
                        />
                    </TouchableOpacity>
                )}
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
        alignItems: "center",
        justifyContent: "center",
        zIndex: 999,
    },
    removeBtn: {
        width: 25,
        height: 25,

        borderColor: "#BDBDBD",
        borderWidth: 1,
    },
    addBtn: {
        width: 25,
        height: 25,

        borderColor: "#FF6C00",
        borderWidth: 1,
    },
});
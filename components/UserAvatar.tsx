import React, {useEffect, useState} from "react";
import {Alert, Image, StyleSheet, TouchableOpacity, View} from "react-native";
import {Feather} from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import Toast from 'react-native-toast-message';


interface UserAvatarProps {
    uri?: string;
    onAvatarChange?: (uri: string | null) => void;
    size?: number;
    editable?: boolean;
    onPress?: () => void;
}

export default function UserAvatar({
                                       uri,
                                       onAvatarChange,
                                       size = 120,
                                       editable = true,

                                   }: UserAvatarProps) {
    const [avatar, setAvatar] = useState<string | null>(uri || null);
    // Оновлення аватара при зміні uri з пропсів
    useEffect(() => {
        if (uri !== undefined) {
            setAvatar(uri);
        }
    }, [uri]);
    const handlePickImage = async () => {
        if (!editable) return;

        // Запит дозволів на камеру ТА галерею
        const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
        const mediaPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!cameraPermission.granted || !mediaPermission.granted) {
            Toast.show({
                type: "error",
                text1: "Доступ заборонено",
                text2: "Дозвольте доступ до камери та галереї",
            });
            return;
        }

        // Показуємо вибір: камера чи галерея
        Alert.alert(
            "Виберіть джерело",
            "Звідки завантажити аватар?",
            [
                {text: "Скасувати", style: "cancel"},
                {
                    text: "Зробити фото",
                    onPress: () => pickFromCamera(),
                },
                {
                    text: "Вибрати з галереї",
                    onPress: () => pickFromLibrary(),
                },
            ],
            {cancelable: true}
        );
    };

    const pickFromCamera = async () => {
        try {
            const result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });

            if (!result.canceled && result.assets[0]) {
                const newAvatar = result.assets[0].uri;
                setAvatar(newAvatar);
                onAvatarChange?.(newAvatar);
                Toast.show({
                    type: "success",
                    text1: "Успіх",
                    text2: "Фото з камери додано",
                });
            }
        } catch (error) {
            console.error("Помилка камери:", error);
            Toast.show({
                type: "error",
                text1: "Помилка",
                text2: "Не вдалося зробити фото",
            });
        }
    };

    const pickFromLibrary = async () => {
        try {
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
                Toast.show({
                    type: "success",
                    text1: "Успіх",
                    text2: "Зображення з галереї додано",
                });
            }
        } catch (error) {
            console.error("Помилка галереї:", error);
            Toast.show({
                type: "error",
                text1: "Помилка",
                text2: "Не вдалося вибрати зображення",
            });
        }
    };


    const handleRemove = () => {
        if (!editable) return;
        setAvatar(null);
        onAvatarChange?.(null);
        Toast.show({
            type: "info",
            text1: "Інформація",
            text2: "Аватар видалено"
        });
    };
    const avatarStyles = {
        width: size,
        height: size,
        borderRadius: size * 0.133,
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
                    style={[styles.avatar, avatarStyles]}
                    onError={() => {
                        // Обробка помилки завантаження зображення
                        setAvatar(null);
                        onAvatarChange?.(null);
                    }}
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
import React, {useEffect, useState} from "react";
import {Alert, Image, StyleSheet, TouchableOpacity, View} from "react-native";
import {Feather} from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import Toast from 'react-native-toast-message';
import {useAppDispatch} from '@/redux/store';
import {removeAvatar, uploadAvatar} from '@/redux/slices/userSlice';

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


    const dispatch = useAppDispatch();


    const handlePickImage = () => {
        Alert.alert(
            "Виберіть джерело",
            "Звідки завантажити аватар?",
            [
                {
                    text: "Камера",
                    onPress: pickFromCamera,
                },
                {
                    text: "Галерея",
                    onPress: pickFromLibrary,
                },
                {
                    text: "Скасувати",
                    style: "cancel",
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
                await handleAvatarUpdate(result.assets[0].uri);
            }
        } catch (error) {
            console.error("Помилка камери:", error);
            Toast.show({type: "error", text1: "Помилка", text2: "Не вдалося зробити фото"});
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
                await handleAvatarUpdate(result.assets[0].uri);
            }
        } catch (error) {
            console.error("Помилка галереї:", error);
            Toast.show({type: "error", text1: "Помилка", text2: "Не вдалося вибрати зображення"});
        }
    };
    const handleAvatarUpdate = async (uri: string) => {
        // Миттєво показуємо локально
        setAvatar(uri);

        // Завантажуємо у Firestore
        try {
            const downloadUrl = await dispatch(uploadAvatar(uri)).unwrap();
            setAvatar(downloadUrl); // локальний state оновлюємо реальним URL
            onAvatarChange?.(downloadUrl);
            Toast.show({type: "success", text1: "Аватар оновлено"});
        } catch (error: any) {
            Toast.show({type: "error", text1: "Помилка завантаження", text2: error?.message ?? ""});
        }
    };

    const handleRemoveAvatar = async () => {
        try {
            await dispatch(removeAvatar()).unwrap();
            setAvatar(null);           // локальний state
            onAvatarChange?.(null);    // callback батьку
            Toast.show({type: 'info', text1: 'Аватар видалено'});
        } catch (e: any) {
            Toast.show({type: 'error', text1: 'Помилка', text2: e?.message ?? String(e)});
        }
    };


// допоміжна функція для витягання шляху з downloadURL
    const getStoragePathFromUrl = (url: string) => {
        const baseUrl = 'https://firebasestorage.googleapis.com/v0/b/react-native-project-b83ef.appspot.com/o/';
        const path = url.replace(baseUrl, '').split('?')[0];
        return decodeURIComponent(path);
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
                    key={avatar ?? 'no-avatar'} // 🔥 примусовий rerender
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
                        onPress={avatar ? handleRemoveAvatar : handlePickImage}
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
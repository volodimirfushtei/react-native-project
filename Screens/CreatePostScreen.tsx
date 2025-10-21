import React, {useState} from "react";
import {
    Keyboard,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from "react-native";
import Toast from 'react-native-toast-message';
import {Ionicons} from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '@/types/navigation.types';
import {Image} from "expo-image";

export default function CreatePostScreen() {
    const [photo, setPhoto] = useState<string | null>(null);
    const [title, setTitle] = useState("");
    const [location, setLocation] = useState("");

    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const handlePickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            Toast.show({
                type: "error",
                text1: "Помилка",
                text2: "Дозвольте доступ до галереї, щоб завантажити фото",
            });
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: "images",
        });


        if (!result.canceled) {
            setPhoto(result.assets[0].uri);
        }
    };

    const handlePublish = () => {
        if (!photo || !title || !location) {
            Toast.show({
                type: "error",
                text1: "Помилка",
                text2: "Заповніть всі поля",
            });
            return;
        }

        console.log({photo, title, location});
        // TODO: Надіслати дані на сервер

        Toast.show({
            type: "success",
            text1: "Успіх",
            text2: "Публікацію створено!",
        });

        handleDelete(); // Очистити поля
        navigation.goBack(); // Повернутись до списку
    };

    const handleDelete = () => {
        setPhoto(null);
        setTitle("");
        setLocation("");
    };

    const isButtonDisabled = !photo || !title || !location;


    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.safeArea}>
                <ScrollView contentContainerStyle={styles.container}>
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                            <Ionicons name="arrow-back" size={24} color="#212121"/>
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Створити публікацію</Text>
                        <View style={{width: 24}}/>
                    </View>

                    {/* Image upload */}
                    <TouchableOpacity style={styles.imageBox}>
                        {photo && <Image source={{uri: photo}} style={styles.image}/>}

                        {/* Іконка камери поверх */}
                        <Pressable style={styles.iconBox} onPress={handlePickImage}>
                            <Image style={styles.cameraIcon} source={require('@/assets/icons/camera_alt-black.svg')}/>
                        </Pressable>
                    </TouchableOpacity>

                    <Text style={styles.uploadText}>Завантажте фото</Text>

                    {/* Title */}
                    <TextInput
                        style={[styles.input, {marginBottom: 16}]}

                        placeholder="Назва..."
                        placeholderTextColor="#BDBDBD"
                        value={title}
                        onChangeText={setTitle}
                    />

                    {/* Location */}
                    <View style={styles.locationRow}>

                        <TextInput
                            style={[styles.input, {textAlign: "left", paddingHorizontal: 30}]}
                            placeholder="Місцевість..."
                            placeholderTextColor="#BDBDBD"
                            value={location}
                            onChangeText={setLocation}
                        />
                        <Pressable style={styles.iconInsideInput}>
                            <Image
                                style={styles.locationIcon}
                                source={require("@/assets/icons/map-pin.svg")}
                            />
                        </Pressable>
                    </View>

                    {/* Publish Button */}
                    <TouchableOpacity
                        style={[styles.button, isButtonDisabled && styles.buttonDisabled]}
                        onPress={handlePublish}
                        disabled={isButtonDisabled}
                    >
                        <Text style={styles.buttonText}>Опублікувати</Text>
                    </TouchableOpacity>

                    {/* Delete */}
                    <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                        <Ionicons name="trash-outline" size={24} color="#BDBDBD"/>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#fff",
    },
    container: {
        flexGrow: 1,
        padding: 16,
        backgroundColor: "#fff",
    },
    header: {
        height: 88,
        borderBottomWidth: 1,
        borderBottomColor: "#E8E8E8",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 32,
    },
    backButton: {
        position: "absolute",
        left: 16,
        bottom: 10,
    },

    headerTitle: {
        position: "absolute",
        bottom: 11,
        right: '30%',
        fontSize: 17,
        fontWeight: "500",
        color: "#212121",
    },
    imageBox: {
        width: "100%",
        height: 240,
        borderRadius: 8,
        backgroundColor: "#F6F6F6",
        borderColor: "#E8E8E8",
        borderWidth: 1,
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",

    },
    iconBox: {
        position: "absolute",
        top: '40%',
        right: '40%',
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10,
    },
    cameraIcon: {
        width: 32,
        height: 32,
        tintColor: "#ffffff",
    },
    image: {
        width: "100%",
        height: "100%",
    },
    uploadText: {
        color: "#BDBDBD",
        fontSize: 16,
        fontWeight: 400,
        marginTop: 8,
        marginBottom: 32,
    },
    input: {
        width: "100%",
        height: 50,
        borderBottomWidth: 1,
        borderBottomColor: "#E8E8E8",
        paddingVertical: 8,
        paddingHorizontal: 8,
        fontSize: 16,
        fontWeight: 400,
        color: "#212121",


    },
    locationRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#E8E8E8",
        marginBottom: 32,
    },
    iconInsideInput: {
        position: 'absolute',
        left: 0,
        top: '50%',
        transform: [{translateY: -16}], // Половина висоти іконки
        padding: 4,
    },
    locationIcon: {

        width: 24,
        height: 24,
        color: "#696565",
    },
    button: {
        width: "100%",
        backgroundColor: "#FF6C00",
        paddingVertical: 16,
        borderRadius: 100,
        alignItems: "center",
        marginLeft: 4,

    },
    buttonDisabled: {
        backgroundColor: "#F6F6F6",
    },
    buttonText: {
        color: "#BDBDBD",
        fontSize: 16,
        fontWeight: "600",

    },
    deleteButton: {
        alignSelf: "center",
        marginTop: 120,
        backgroundColor: "#F6F6F6",
        width: 70,
        height: 40,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
    },
});

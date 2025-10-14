import React, {useState} from "react";
import {
    Image,
    Keyboard,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

export default function CreatePostScreen() {
    const [photo, setPhoto] = useState<string | null>(null);
    const [title, setTitle] = useState("");
    const [location, setLocation] = useState("");

    const handlePickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            alert("Дозвольте доступ до галереї, щоб завантажити фото");
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
        console.log({photo, title, location});
        // TODO: Надіслати дані на сервер
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
                        <TouchableOpacity style={styles.backButton}>
                            <Ionicons name="arrow-back" size={24} color="#212121"/>
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Створити публікацію</Text>
                        <View style={{width: 24}}/>
                    </View>

                    {/* Image upload */}
                    <TouchableOpacity style={styles.imageBox} onPress={handlePickImage}>
                        {photo ? (
                            <Image source={{uri: photo}} style={styles.image}/>
                        ) : (
                            <View style={styles.iconBox}><Image
                                source={require('@/assets/icons/camera_alt-black.png')}/></View>
                        )}
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
                        <Image
                            style={styles.locationIcon}
                            source={require("@/assets/icons/map-pin.png")}
                        />
                        <TextInput
                            style={[styles.input, {flex: 1, borderBottomWidth: 0}]}
                            placeholder="Місцевість..."
                            placeholderTextColor="#BDBDBD"
                            value={location}
                            onChangeText={setLocation}
                        />
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
        borderRadius: '50%',
        backgroundColor: "#ffffff",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10,
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
    locationIcon: {
        marginRight: 4,
        width: 24,
        height: 24,
        color: "#BDBDBD",
    },
    button: {
        width: "100%",
        backgroundColor: "#FF6C00",
        paddingVertical: 16,
        borderRadius: 100,
        alignItems: "center",

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

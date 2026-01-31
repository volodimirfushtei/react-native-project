import React, {useCallback, useEffect, useRef, useState} from "react";
import {
    ActivityIndicator,
    Alert,
    Keyboard,
    Modal,
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
import * as ImagePicker from "expo-image-picker";
import {CameraType, CameraView, useCameraPermissions} from 'expo-camera';
import * as Location from 'expo-location';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '@/types/navigation.types';
import {Image} from "expo-image";
import {Feather, Ionicons} from "@expo/vector-icons";
import {addPostAsync} from "@/redux/slices/postsSlice";
import type {RootState} from "@/redux/store"
import {useAppDispatch, useAppSelector} from "@/redux/store";

export default function CreatePostScreen() {
    const [photo, setPhoto] = useState<string | null>(null);
    const [title, setTitle] = useState("");
    const [location, setLocation] = useState("");
    const [cameraVisible, setCameraVisible] = useState(false);
    const [facing, setFacing] = useState<CameraType>('back');
    const [permission, requestPermission] = useCameraPermissions();
    const [isLoading, setIsLoading] = useState(false);
    const cameraRef = useRef<any>(null);
    const dispatch = useAppDispatch()
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const currentUser = useAppSelector((state: RootState) => state.auth.user);

    // Запит дозволів для камери та локації
    useEffect(() => {
        const requestPermissions = async () => {
            try {
                await requestPermission();

                // Запит дозволу на локацію
                const {status} = await Location.requestForegroundPermissionsAsync();

                if (status !== 'granted') {
                    Toast.show({
                        type: "info",
                        text1: "Геолокація",
                        text2: "Дозвіл на геолокацію не надано",
                    });
                }
            } catch (error) {
                console.error("Помилка запиту дозволів:", error);
                Toast.show({
                    type: "error",
                    text1: "Помилка",
                    text2: "Не вдалося отримати необхідні дозволи",
                });
            }
        };

        requestPermissions();
    }, [requestPermission]);

    const toggleCameraFacing = useCallback(() => {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    }, []);

    const takePicture = useCallback(async () => {
        if (cameraRef.current) {
            try {
                const newPhoto = await cameraRef.current.takePictureAsync({
                    quality: 0.8,
                    base64: true,
                });
                setPhoto(newPhoto.uri);
                setCameraVisible(false);
                Toast.show({
                    type: "success",
                    text1: "Успіх",
                    text2: "Фото зроблено!",
                });
            } catch (error) {
                console.error("Помилка при зйомці фото:", error);
                Toast.show({
                    type: "error",
                    text1: "Помилка",
                    text2: "Не вдалося зробити фото",
                });
            }
        }
    }, []);

    const getCurrentLocation = async () => {
        try {
            setIsLoading(true);

            // 1. Перевіряємо GPS
            const gpsEnabled = await Location.hasServicesEnabledAsync();
            if (!gpsEnabled) {
                Alert.alert(
                    'Геолокація вимкнена',
                    'Увімкніть GPS (Location Services) у налаштуваннях пристрою'
                );
                return null;
            }

            // 2. Перевіряємо дозвіл
            const {status} = await Location.getForegroundPermissionsAsync();
            if (status !== 'granted') {
                const request = await Location.requestForegroundPermissionsAsync();
                if (request.status !== 'granted') {
                    Alert.alert(
                        'Немає доступу',
                        'Додатку потрібен доступ до геолокації'
                    );
                    return null;
                }
            }

            // 3. Отримуємо координати
            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Highest,
            });

            return {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            };
        } catch (e) {
            console.log('Location error:', e);
            Alert.alert('Помилка', 'Не вдалося отримати поточну локацію');
            return null;
        } finally {
            setIsLoading(false);
        }
    };
    ;

    const getAddressFromCoordinates = useCallback(async (latitude: number, longitude: number): Promise<string> => {
        try {
            const [address] = await Location.reverseGeocodeAsync({
                latitude,
                longitude,
            });

            if (address) {
                const addressParts = [];
                if (address.city) addressParts.push(address.city);
                if (address.region) addressParts.push(address.region);
                if (address.country) addressParts.push(address.country);

                return addressParts.join(', ');
            }

            return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
        } catch (error) {
            console.error("Помилка отримання адреси:", error);
            return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
        }
    }, []);

    const handlePickImage = useCallback(async () => {
        try {
            const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (!permissionResult.granted) {
                Toast.show({
                    type: "error",
                    text1: "Помилка",
                    text2: "Дозвольте доступ до галереї",
                });
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ["images"],
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
            });

            if (!result.canceled && result.assets[0]) {
                setPhoto(result.assets[0].uri);
            }
        } catch (error) {
            console.error("Помилка вибору зображення:", error);
            Toast.show({
                type: "error",
                text1: "Помилка",
                text2: "Не вдалося вибрати зображення",
            });
        }
    }, []);

    const openCamera = useCallback(async () => {
        if (!permission?.granted) {
            try {
                await requestPermission();
                if (permission?.granted) {
                    setCameraVisible(true);
                }
            } catch (error) {
                console.log(error)
                Alert.alert(
                    "Дозвіл на камеру",
                    "Для використання камери необхідно надати дозвіл",
                    [
                        {text: "Скасувати", style: "cancel"},
                        {text: "Спробувати ще", onPress: () => openCamera()}
                    ]
                );
            }
            return;
        }
        setCameraVisible(true);
    }, [permission, requestPermission]);

    const handleImageAction = useCallback(() => {
        Alert.alert(
            "Виберіть джерело",
            "Зробити фото чи вибрати з галереї?",
            [
                {
                    text: "Камера",
                    onPress: openCamera
                },
                {
                    text: "Галерея",
                    onPress: handlePickImage
                },
                {
                    text: "Скасувати",
                    style: "cancel"
                }
            ]
        );
    }, [openCamera, handlePickImage]);

    const handleDelete = useCallback(() => {
        setPhoto(null);
        setTitle("");
        setLocation("");
    }, []);

    const handlePublish = useCallback(async () => {
        if (!photo || !title.trim() || !location.trim()) {
            Toast.show({
                type: "error",
                text1: "Помилка",
                text2: "Заповніть всі поля",
            });
            return;
        }

        if (!currentUser) {
            Toast.show({
                type: "error",
                text1: "Помилка",
                text2: "Користувач не автентифікований",
            });
            return;
        }

        setIsLoading(true);

        try {
            // 1️⃣ Отримання геолокації
            const coordinates = await getCurrentLocation();
            if (!coordinates) {
                Toast.show({
                    type: "error",
                    text1: "Помилка",
                    text2: "Не вдалося отримати геолокацію",
                });
                setIsLoading(false);
                return;
            }

            // 2️⃣ Отримання адреси
            let finalLocation = location;
            if (!finalLocation.trim()) {
                finalLocation = await getAddressFromCoordinates(
                    coordinates.latitude,
                    coordinates.longitude
                );
            }

            console.log('📝 Дані для посту:', {
                photoType: photo.startsWith('data:') ? 'data URL' :
                    photo.startsWith('file://') ? 'file URI' : 'URL',
                title,
                location: finalLocation,
                userId: currentUser.id
            });

            // 3️⃣ ВИПРАВЛЕНО: Відправляємо фото URI напряму, без конвертації в Blob
            // Функція addPostAsync сама обробить завантаження
            const resultAction = await dispatch(addPostAsync({
                photo, // Відправляємо URI напряму
                title,
                location: finalLocation,
                coordinates,
                userId: currentUser.id
            })).unwrap();

            console.log('✅ Пост створено:', resultAction);

            Toast.show({
                type: "success",
                text1: "Успіх",
                text2: "Публікацію створено з геолокацією!",
            });

            handleDelete();
            navigation.goBack();

        } catch (error: any) {
            console.error("❌ Publish error:", error);

            let errorMessage = "Не вдалося опублікувати";

            if (error.message) {
                errorMessage = error.message;
            } else if (typeof error === 'string') {
                errorMessage = error;
            }

            Toast.show({
                type: "error",
                text1: "Помилка",
                text2: errorMessage,
            });
        } finally {
            setIsLoading(false);
        }
    }, [photo, title, location, getCurrentLocation, getAddressFromCoordinates, currentUser, handleDelete, navigation, dispatch]);

    const handleGetCurrentLocation = useCallback(async () => {
        try {
            const coordinates = await getCurrentLocation();
            if (coordinates) {
                const address = await getAddressFromCoordinates(
                    coordinates.latitude,
                    coordinates.longitude
                );
                setLocation(address);
            }
        } catch (error) {
            console.error("Помилка отримання локації:", error);
        }
    }, [getCurrentLocation, getAddressFromCoordinates]);


    const isButtonDisabled = !photo || !title.trim() || !location.trim() || isLoading;

    if (!permission) {
        return (
            <View style={styles.centerContainer}>
                <Text>Запит дозволів...</Text>
            </View>
        );
    }

    if (!permission.granted) {
        return (
            <View style={styles.centerContainer}>
                <Text>Потрібен доступ до камери</Text>
                <TouchableOpacity
                    style={styles.button}
                    onPress={async () => {
                        try {
                            await requestPermission();
                        } catch (error) {
                            console.error("Помилка запиту дозволу:", error);
                        }
                    }}
                >
                    <Text style={styles.buttonText}>Надати доступ</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.safeArea}>
                <ScrollView contentContainerStyle={styles.container}>
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                            <Feather name="arrow-left" size={24} color="#bdbdbd"/>
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Створити публікацію</Text>
                        <View style={{width: 24}}/>
                    </View>

                    {/* Image upload */}
                    <TouchableOpacity style={styles.imageBox} onPress={handleImageAction}>
                        {photo ? (
                            <Image source={{uri: photo}} style={styles.image}/>
                        ) : (
                            <View style={styles.placeholderContainer}>
                                <Feather name="camera" size={24} color="#BDBDBD"/>
                            </View>
                        )}

                        {/* Іконка камери поверх */}
                        <Pressable
                            style={[
                                styles.iconBox,
                                photo ? styles.iconBoxWithPhoto : styles.iconBoxWithoutPhoto
                            ]}
                            onPress={handleImageAction}
                        >
                            <Feather name="camera" size={24} color={photo ? "#FFFFFF" : "#bdbdbd"}/>
                        </Pressable>
                    </TouchableOpacity>

                    <Text style={styles.uploadText}>
                        {photo ? "Редагувати фото" : "Завантажте фото"}
                    </Text>

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
                            style={[styles.input, {textAlign: "left", paddingLeft: 30}]}
                            placeholder="Місцевість..."
                            placeholderTextColor="#BDBDBD"
                            value={location}
                            onChangeText={setLocation}
                        />
                        <TouchableOpacity
                            style={styles.locationIcon}
                            onPress={handleGetCurrentLocation}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator size="small" color="#FF6C00"/>
                            ) : (
                                <Feather name="map-pin" size={24} color="#bdbdbd"/>
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* Publish Button */}
                    <TouchableOpacity
                        style={[styles.button, isButtonDisabled && styles.buttonDisabled]}
                        onPress={handlePublish}
                        disabled={isButtonDisabled}
                    >
                        {isLoading ? (
                            <ActivityIndicator size="small" color="#FFFFFF"/>
                        ) : (
                            <Text
                                style={[styles.buttonText, isButtonDisabled ? styles.buttonTextDisabled : styles.buttonTextActive]}>
                                Опублікувати
                            </Text>
                        )}
                    </TouchableOpacity>

                    {/* Delete */}
                    <TouchableOpacity
                        style={[styles.deleteButton, isLoading && styles.deleteButtonDisabled]}
                        onPress={handleDelete}
                        disabled={isLoading}
                    >
                        <Feather name="trash" size={24} color={isLoading ? "#E8E8E8" : "#BDBDBD"}/>
                    </TouchableOpacity>
                </ScrollView>

                {/* Модальне вікно камери */}
                <Modal
                    visible={cameraVisible}
                    animationType="slide"
                    statusBarTranslucent
                >
                    <View style={styles.cameraContainer}>
                        <CameraView
                            style={styles.camera}
                            facing={facing}
                            ref={cameraRef}
                        />
                        {/* Елементи управління камерою поверх камери */}
                        <View style={styles.cameraControls}>
                            <TouchableOpacity
                                style={styles.cameraButton}
                                onPress={() => setCameraVisible(false)}
                            >
                                <Ionicons name="close" size={24} color="white"/>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.captureButton}
                                onPress={takePicture}
                            >
                                <View style={styles.captureButtonInner}/>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.cameraButton}
                                onPress={toggleCameraFacing}
                            >
                                <Feather name="camera" size={24} color="bdbdbd"/>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                <Toast/>
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
        fontSize: 17,
        fontWeight: "500",
        color: "#212121",
        textAlign: "center",
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
    placeholderContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        alignItems: "center",
        justifyContent: "center",
    },
    iconBox: {
        position: "absolute",
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: "center",
        justifyContent: "center",
    },
    iconBoxWithPhoto: {
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    iconBoxWithoutPhoto: {
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
    },
    image: {
        width: "100%",
        height: "100%",
    },
    uploadText: {
        color: "#BDBDBD",
        fontSize: 16,
        fontWeight: "400",
        marginTop: 8,
        marginBottom: 32,
        textAlign: "left",
    },
    input: {
        width: "100%",
        height: 50,
        borderBottomWidth: 1,
        borderBottomColor: "#E8E8E8",
        paddingVertical: 8,
        paddingHorizontal: 8,
        fontSize: 16,
        fontWeight: "400",
        color: "#212121",
    },
    locationRow: {
        position: "relative",
        marginBottom: 8,
    },
    locationIcon: {
        position: "absolute",
        left: 0,
        top: 13,
        padding: 4,

    },
    locationHint: {
        fontSize: 12,
        color: "#BDBDBD",
        marginBottom: 32,
        textAlign: "center",
    },
    button: {
        width: "100%",
        backgroundColor: "#FF6C00",
        paddingVertical: 16,
        borderRadius: 100,
        alignItems: "center",
        justifyContent: "center",
        minHeight: 50,
        marginTop: 32,
    },
    buttonDisabled: {
        backgroundColor: "#F6F6F6",
    },
    buttonText: {
        fontSize: 16,
        fontWeight: "600",
    },
    buttonTextActive: {
        color: "#FFFFFF",
    },
    buttonTextDisabled: {
        color: "#BDBDBD",
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
    deleteButtonDisabled: {
        opacity: 0.7,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    cameraContainer: {
        flex: 1,
        backgroundColor: 'black',
        position: 'relative',
    },
    camera: {
        flex: 1,
    },
    cameraControls: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 30,
        paddingVertical: 40,
        backgroundColor: 'transparent',
    },
    cameraButton: {
        padding: 10,
    },
    captureButton: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: 'white',
    },
    captureButtonInner: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'white',
    },
});
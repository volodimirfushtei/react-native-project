import React, {useState} from "react";
import {
    ImageBackground,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import {SafeAreaView} from 'react-native-safe-area-context';
import {RootStackParamList} from "@/types/navigation.types";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import Toast from 'react-native-toast-message';
import UserAvatar from "@/components/UserAvatar";
import {useAppDispatch} from '@/redux/store';
import {registerDB} from '@/redux/slices/authSlice';
import {loadUserData, uploadAvatar} from '@/redux/slices/userSlice';
import {useSelector} from 'react-redux';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type Props = {
    navigation: NavigationProp;
    goToLogin: () => void;
    route: any;
};
const image = require('@/assets/images/mountain-bg.jpg')
export default function RegistrationScreen({goToLogin}: Props) {
    const [showPassword, setShowPassword] = useState(false);
    const [focusedInput, setFocusedInput] = useState<string | null>(null);
    const dispatch = useAppDispatch();
    const userState = useSelector((state: any) => state.user);

    type FormState = {
        avatar: string | null;
        username: string;
        email: string;
        password: string;
    };

    const [form, setForm] = useState<FormState>({
        username: "",
        email: "",
        password: "",
        avatar: null,
    });

    const handleChange = <K extends keyof FormState>(
        key: K,
        value: FormState[K]
    ) => {
        setForm({...form, [key]: value});
    };


    const handleRegister = async () => {
        if (!form.username || !form.email || !form.password) {
            Toast.show({
                type: "error",
                text1: "Помилка",
                text2: "Будь ласка, заповніть всі поля",
            });
            return;
        }

        try {
            // 1️⃣ Викликаємо thunk для реєстрації
            const resultAction: any = await dispatch(registerDB({
                email: form.email,
                password: form.password,
                name: form.username,
            }));

            if (registerDB.fulfilled.match(resultAction)) {
                const userId = resultAction.payload.id;

                // 2️⃣ Завантажуємо аватар, якщо він вибраний
                if (form.avatar) {
                    await dispatch(uploadAvatar(form.avatar));
                }

                // 3️⃣ Завантажуємо дані користувача у Redux
                await dispatch(loadUserData(userId));

                Toast.show({
                    type: "success",
                    text1: "Успіх",
                    text2: "Ви успішно зареєструвалися!",
                });
            } else {
                throw new Error(resultAction.payload || 'Не вдалося зареєструватися');
            }
        } catch (error: any) {
            console.error("Error registration:", error);
            Toast.show({
                type: "error",
                text1: "Помилка",
                text2: error.message || "Error registration",
            });
        }
    };


    return (
        <Pressable style={{flex: 1}} onPress={Keyboard.dismiss}>

            <SafeAreaView style={styles.container}>

                <ImageBackground
                    source={image}
                    style={styles.background}
                    resizeMode="cover"
                />

                {/* ⬇⬇⬇ Головне — KeyboardAvoidingView ⬇⬇⬇ */}
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : undefined}
                    style={styles.keyboardView}
                >
                    <View style={styles.card}>
                        <View style={styles.avatarWrapper}><UserAvatar
                            uri={form.avatar || userState.avatarUri || undefined}
                            onAvatarChange={(uri) => handleChange("avatar", uri)}/></View>


                        <Text style={styles.title}>Реєстрація</Text>

                        <TextInput
                            style={[
                                styles.input,
                                focusedInput === "username" && {borderColor: "#ff6600"}, // активне поле
                            ]}
                            placeholder="Логін"
                            value={form.username}
                            onChangeText={(text) => handleChange("username", text)}
                            onFocus={() => setFocusedInput("username")}
                            onBlur={() => setFocusedInput(null)}
                            placeholderTextColor={"#BDBDBD"}

                        />

                        <TextInput
                            style={[
                                styles.input,
                                focusedInput === "email" && {borderColor: "#ff6600"},
                            ]}
                            placeholder="Адреса електронної пошти"
                            value={form.email}
                            onChangeText={(text) => handleChange("email", text)}
                            onFocus={() => setFocusedInput("email")}
                            onBlur={() => setFocusedInput(null)}
                            placeholderTextColor={"#BDBDBD"}


                            keyboardType="email-address"
                        />

                        <View style={styles.inputContainer}>
                            <TextInput
                                style={[
                                    styles.input,
                                    focusedInput === "password" && {borderColor: "#ff6600"},
                                ]}
                                placeholder="Пароль"
                                secureTextEntry={!showPassword}
                                value={form.password}
                                onChangeText={(text) => handleChange("password", text)}
                                onFocus={() => setFocusedInput("password")}
                                onBlur={() => setFocusedInput(null)}
                                placeholderTextColor={"#BDBDBD"}


                            />
                            <TouchableOpacity
                                style={styles.showButton}
                                onPress={() => setShowPassword(!showPassword)}
                            >
                                <Text style={styles.showText}>
                                    {showPassword ? "Сховати" : "Показати"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity style={styles.button} onPress={handleRegister} activeOpacity={0.6}>
                            <Text style={styles.buttonText}>Зареєструватися</Text>
                        </TouchableOpacity>
                        <View style={styles.containerLink}>
                            <Text style={styles.link}>Вже є акаунт?{" "}</Text>
                            <Pressable onPress={goToLogin}
                                       style={({pressed}) => pressed && {
                                           opacity: 0.6,

                                           shadowColor: "#ff6600",
                                           shadowOffset: {
                                               width: 0,
                                               height: 2,
                                           },
                                           shadowOpacity: 0.25,
                                           shadowRadius: 3.84,
                                           elevation: 5,
                                       }}>
                                <Text style={styles.link}>Увійти</Text>
                            </Pressable>

                        </View>
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>

        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: "100%",

    },

    background: {
        position: "absolute",
        top: 0,
        width: "100%",
        height: "100%",
    },
    keyboardView: {
        flex: 1,
        justifyContent: "flex-end",
    },
    card: {
        backgroundColor: "#fff",
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        padding: 20,
        alignItems: "center",

    },
    avatarWrapper: {
        marginTop: -80,
        marginBottom: 32,
    },
    avatarPlaceholder: {
        position: "relative",
        width: 120,
        height: 120,
        borderRadius: 16,
        backgroundColor: "#f2f2f2",
        alignItems: "center",
        justifyContent: "center",
    },
    avatarPlus: {
        position: "absolute",
        top: "70%",
        transform: [{translateX: 60}],
        borderWidth: 1,
        width: 25,
        height: 25,
        borderRadius: 999,
        borderColor: "#ff6600",
        alignItems: "center",
        justifyContent: "center",
    },
    plus: {
        fontSize: 13,
        color: "#ff6600",
    },
    title: {
        fontSize: 30,
        fontWeight: "500",
        marginBottom: 33,
    },
    inputContainer: {
        position: "relative",
        marginBottom: 15,
    },
    input: {
        width: 343,
        height: 50,
        borderWidth: 1,
        borderColor: "#e8e8e8",
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 16,
        fontSize: 16,
        fontWeight: "400",
        marginBottom: 16,

        backgroundColor: "#f6f6f6",
    },
    showButton: {
        position: "absolute",
        right: 15,
        top: "50%",
        transform: [{translateY: -15}],
    },
    showText: {
        color: "#1B4373",
        fontWeight: "500",
    },
    button: {
        backgroundColor: "#ff6600",
        borderRadius: 100,
        paddingVertical: 15,
        alignItems: "center",
        width: 343,
        marginTop: 43,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    containerLink: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 16,
        marginBottom: 78
    },

    link: {
        color: "#1B4373",
        fontWeight: "400",
        fontSize: 16,
    },
});


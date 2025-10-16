import React, {useState} from "react";
import {
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import {Image} from "expo-image";
import {RootStackParamList} from "@/types/navigation.types";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import Toast from 'react-native-toast-message';

type NavigationProps = NativeStackScreenProps<RootStackParamList, "RegistrationScreen" | "LoginScreen">;
type Props = NavigationProps & {
    goToLogin: () => void;
};

export default function RegistrationScreen({navigation, goToLogin}: Props) {
    const [showPassword, setShowPassword] = useState(false);
    const [focusedInput, setFocusedInput] = useState<string | null>(null);


    type FormState = {
        username: string;
        email: string;
        password: string;
    };

    const [form, setForm] = useState<FormState>({
        username: "",
        email: "",
        password: "",
    });

    const handleChange = (key: keyof FormState, value: string) => {
        setForm({...form, [key]: value});
    };


    const handleRegister = () => {
        if (!form.username || !form.email || !form.password) {
            Toast.show({
                type: "error",
                text1: "Помилка",
                text2: "Будь ласка, заповніть всі поля",
            });
            return;
        }
        console.log("User data:", form);
        Toast.show({
            type: "success",
            text1: "Успіх",
            text2: "Ви успішно зареєструвалися!",
        });
        // ✅ Переходимо на Home/PostsScreen
        navigation.navigate("PostsScreen");
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <Image
                    source={require("@/assets/images/mountain-bg.jpg")}
                    style={styles.background}
                    contentFit="cover"
                />

                {/* ⬇⬇⬇ Головне — KeyboardAvoidingView ⬇⬇⬇ */}
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.keyboardView}
                >
                    <View style={styles.card}>
                        <View style={styles.avatarWrapper}>
                            <View style={styles.avatarPlaceholder}>
                                <View style={styles.avatarPlus}>
                                    <Text style={styles.plus}>＋</Text>
                                </View>
                            </View>
                        </View>

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

                        <TouchableOpacity style={styles.button} onPress={handleRegister}>
                            <Text style={styles.buttonText}>Зареєструватися</Text>
                        </TouchableOpacity>
                        <View style={styles.containerLink}>

                            <TouchableOpacity onPress={goToLogin}>
                                <Text style={styles.link}>Вже є акаунт?{" "}Увійти</Text>
                            </TouchableOpacity>

                        </View>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
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
        marginTop: "auto",
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
        borderRadius: 50,
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
    containerLink: {alignItems: "center", justifyContent: "center", marginTop: 16,},

    link: {
        color: "#1B4373",
        fontWeight: "400",
        fontSize: 16,
    },
});


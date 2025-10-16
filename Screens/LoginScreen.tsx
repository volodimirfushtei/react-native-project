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

import Toast from 'react-native-toast-message';
import {RootStackParamList} from "@/types/navigation.types";
import {NativeStackScreenProps} from "@react-navigation/native-stack";

type NavigationProps = NativeStackScreenProps<RootStackParamList, "RegistrationScreen" | "LoginScreen">;
type Props = NavigationProps & {
    goToRegister: () => void;
};

export default function LoginScreen({navigation, goToRegister}: Props) {
    const [showPassword, setShowPassword] = useState(false);
    const [focusedInput, setFocusedInput] = useState<string | null>(null);

    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
    });

    const handleChange = (key: keyof typeof form, value: string) => {
        setForm({...form, [key]: value});
    };

    const handleLogin = () => {
        if (!form.email || !form.password) {
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
            text2: "Ви успішно увійшли!",
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
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.keyboardView}
                >
                    <View style={styles.card}>
                        <View style={styles.avatarWrapper}>
                            <View style={styles.avatarPlaceholder}>

                                <View style={styles.avatarPlus}><Text style={styles.plus}>＋</Text></View>
                            </View>

                        </View>

                        <Text style={styles.title}>Увійти</Text>


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
                                maxLength={12}
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
                        <TouchableOpacity style={styles.button} onPress={handleLogin}>
                            <Text style={styles.buttonText}>Увійти</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.linkContainer}
                                          onPress={goToRegister}>
                            <Text style={styles.link}>Немає акаунту?{" "}</Text>
                            <Text style={styles.linkup}>Зареєструватися</Text>
                        </TouchableOpacity>
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
        height: 812,
    },
    background: {
        position: "absolute",
        top: 0,
        width: "100%",
        height: "80%",
    },
    card: {
        marginTop: 323,
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
    keyboardView: {
        flex: 1,
        justifyContent: "flex-end",
    },
    avatarPlus: {
        flex: 1,
        position: "absolute",
        top: "70%",
        transform: [{translateX: 60}],
        borderWidth: 1,
        width: 25,
        height: 25,
        borderRadius: "50%",
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
        paddingRight: 80, // відступ для кнопки
        fontSize: 16,
        fontWeight: "400",
        marginBottom: 16,
        color: "#BDBDBD",
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

    linkContainer: {
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        marginTop: 16,
    },
    footerText: {
        marginTop: 16,
        color: "#1B4373",
        fontWeight: "400",
    },
    linkup: {
        color: "#1B4373",
        fontSize: 16,
        fontWeight: "400",
        textDecorationLine: "underline",
    },
    link: {
        color: "#1B4373",
        fontWeight: "400",
        fontSize: 16,

    },
});
import React, {useState} from "react";
import {
    Image,
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
import UserAvatar from "@/components/UserAvatar";
import Toast from "react-native-toast-message";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {RootStackParamList} from "@/types/navigation.types";
import {useSelector} from "react-redux";
import {loginDB} from "@/redux/slices/authSlice";
import {uploadAvatar} from "@/redux/slices/userSlice";
import {useAppDispatch} from "@/redux/store";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type Props = {
    navigation: NavigationProp;
    route: any;
    goToRegister: () => void;
};

export default function LoginScreen({goToRegister}: Props) {
    const dispatch = useAppDispatch();
    const userState = useSelector((state: any) => state.user);
    const [showPassword, setShowPassword] = useState(false);
    const [focusedInput, setFocusedInput] = useState<string | null>(null);
    const [localAvatar, setLocalAvatar] = useState<string | null>(null);
    const [form, setForm] = useState({
        username: "",
        email: "",
        password: ""
    });

    const handleChange = (key: keyof typeof form, value: string) => {
        setForm({...form, [key]: value});
    };

    const mapAuthError = (error: any) => {
        switch (error) {
            case "auth/invalid-credential":
                return "Невірний email або пароль";
            case "auth/email-already-in-use":
                return "Email вже використовується";
            case "auth/user-disabled":
                return "Акаунт заблоковано";
            case "auth/too-many-requests":
                return "Забагато спроб, спробуйте пізніше";
            default:
                return "Не вдалося увійти";
        }
    };

    const handleAvatarChange = async (uri: string | null) => {
        setLocalAvatar(uri);
        if (uri) {
            try {
                await dispatch(uploadAvatar(uri)).unwrap();
                Toast.show({type: "success", text1: "Аватар оновлено"});
            } catch (error: any) {
                console.error("Avatar upload error:", error);
                Toast.show({
                    type: "error",
                    text1: "Помилка завантаження аватара",
                    text2: error
                });
            }
        }
    };

    const handleLogin = async () => {
        if (!form.email || !form.password) {
            Toast.show({
                type: "error",
                text1: "Помилка",
                text2: "Будь ласка, заповніть всі поля"
            });
            return;
        }

        try {
            // 1️⃣ Логін
            await dispatch(
                loginDB({email: form.email, password: form.password})
            ).unwrap();


            Toast.show({
                type: "success",
                text1: "Успіх",
                text2: "Ви успішно увійшли!"
            });
        } catch (error: any) {
            console.error("Error login:", error);
            Toast.show({
                type: "error",
                text1: "Помилка",
                text2: mapAuthError(error)
            });
        }
    };

    return (
        <Pressable onPress={Keyboard.dismiss} style={styles.container}>
            <Image
                source={require("@/assets/images/mountain-bg.jpg")}
                style={styles.background}
                resizeMode="cover"
            />


            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                style={styles.keyboardView}
            >
                <View style={styles.card}>
                    <UserAvatar
                        uri={userState.avatarUri}
                        onAvatarChange={handleAvatarChange}
                    />

                    <Text style={styles.title}>Увійти</Text>

                    <TextInput
                        style={[
                            styles.input,
                            focusedInput === "email" && {borderColor: "#ff6600"}
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
                                focusedInput === "password" && {borderColor: "#ff6600"}
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

                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleLogin}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.buttonText}>Увійти</Text>
                    </TouchableOpacity>

                    <View style={styles.linkContainer}>
                        <Text style={styles.link}>Немає акаунту?{" "}</Text>
                        <Pressable
                            onPress={goToRegister}
                            style={({pressed}) => pressed && {opacity: 0.6}}
                        >
                            <Text style={styles.linkup}>Зареєструватися</Text>
                        </Pressable>
                    </View>
                </View>

            </KeyboardAvoidingView>

        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {flex: 1},
    background: {
        position: "absolute",
        top: 0,
        width: "100%",
        height: "100%"
    },
    card: {
        backgroundColor: "#fff",
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        padding: 20,
        alignItems: "center"
    },
    keyboardView: {flex: 1, justifyContent: "flex-end"},
    avatarWrapper: {marginTop: -80, marginBottom: 32},
    title: {fontSize: 30, fontWeight: "500", marginBottom: 33},
    inputContainer: {position: "relative", marginBottom: 15},
    input: {
        width: 343,
        height: 50,
        borderWidth: 1,
        borderColor: "#e8e8e8",
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 16,
        paddingRight: 80,
        fontSize: 16,
        fontWeight: "400",
        marginBottom: 16,
        color: "#BDBDBD",
        backgroundColor: "#f6f6f6"
    },
    showButton: {
        position: "absolute",
        right: 15,
        top: "50%",
        transform: [{translateY: -15}]
    },
    showText: {color: "#1B4373", fontWeight: "500"},
    button: {
        backgroundColor: "#ff6600",
        borderRadius: 100,
        paddingVertical: 15,
        alignItems: "center",
        width: 343,
        marginTop: 27
    },
    buttonText: {color: "#fff", fontSize: 16, fontWeight: "600"},
    linkContainer: {
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        marginTop: 16,
        marginBottom: 144
    },
    linkup: {color: "#1B4373", fontSize: 16, fontWeight: "400", textDecorationLine: "underline"},
    link: {color: "#1B4373", fontWeight: "400", fontSize: 16}
});

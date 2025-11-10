// Screens/Home/SettingsScreen.tsx
import React, {useState} from 'react';
import {Alert, Linking, Pressable, ScrollView, StyleSheet, Switch, Text, View} from 'react-native';
import {Feather} from '@expo/vector-icons';
import UserAvatar from '@/components/UserAvatar';
import {useAuth} from '@/utils/AuthContext';
import {authService} from '@/services/AuthService';
import {userService} from '@/services/UserService';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '@/types/navigation.types';

type SettingsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface SettingItem {
    id: string;
    title: string;
    subtitle?: string;
    icon: keyof typeof Feather.glyphMap;
    type: 'navigation' | 'toggle' | 'link' | 'action';
    screen?: keyof RootStackParamList;
    url?: string;
    value?: boolean;
    onToggle?: (value: boolean) => void;
    onPress?: () => void;
    color?: string;
}

const SettingsScreen = () => {
    const {user} = useAuth();

    const navigation = useNavigation<SettingsScreenNavigationProp>();

    // Стани для перемикачів
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [darkModeEnabled, setDarkModeEnabled] = useState(false);
    const [biometricEnabled, setBiometricEnabled] = useState(false);

    const handleLogout = async () => {
        Alert.alert(
            'Вихід',
            'Ви дійсно хочете вийти з облікового запису?',
            [
                {text: 'Скасувати', style: 'cancel'},
                {
                    text: 'Вийти',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await authService.logoutDB();
                            // Після виходу користувача AuthContext автоматично перенаправить на Auth
                        } catch (error) {
                            console.error('Logout error:', error);
                            Alert.alert('Помилка', 'Не вдалося вийти з облікового запису');
                        }
                    },
                },
            ]
        );
    };

    const handleEditProfile = () => {
        navigation.navigate('EditProfile');
    };

    const handleChangePassword = () => {
        navigation.navigate('ChangePassword');
    };

    const handlePrivacyPolicy = () => {
        Linking.openURL('https://yourapp.com/privacy');
    };

    const handleTermsOfService = () => {
        Linking.openURL('https://yourapp.com/terms');
    };

    const handleContactSupport = () => {
        Linking.openURL('mailto:support@yourapp.com');
    };

    const handleClearCache = () => {
        Alert.alert(
            'Очистити кеш',
            'Ця дія видалить тимчасові дані додатка. Продовжити?',
            [
                {text: 'Скасувати', style: 'cancel'},
                {
                    text: 'Очистити',
                    style: 'destructive',
                    onPress: () => {
                        // Тут можна додати логіку очищення кешу
                        Alert.alert('Успішно', 'Кеш очищено');
                    },
                },
            ]
        );
    };

    const handleDeleteAccount = () => {
        const user = authService.getCurrentUser();
        if (!user) {
            Alert.alert('Помилка', 'Користувача не знайдено');
            return;
        }

        Alert.alert(
            'Видалити акаунт',
            'Ця дія незворотня. Всі ваші дані будуть видалені. Продовжити?',
            [
                {text: 'Скасувати', style: 'cancel'},
                {
                    text: 'Видалити',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await userService.deleteAccount(user.uid);
                        } catch (error) {
                            console.error('Delete account error:', error);
                            Alert.alert('Помилка', 'Не вдалося видалити акаунт');
                        }
                    },
                },
            ]
        );
    };

    const settingsSections: SettingItem[][] = [
        // Профіль
        [
            {
                id: 'edit-profile',
                title: 'Редагувати профіль',
                subtitle: 'Змінити ім\'я та фото',
                icon: 'user',
                type: 'navigation',
                screen: 'EditProfile',
                onPress: handleEditProfile,
            },
            {
                id: 'change-password',
                title: 'Змінити пароль',
                subtitle: 'Оновити пароль безпеки',
                icon: 'lock',
                type: 'navigation',
                screen: 'ChangePassword',
                onPress: handleChangePassword,
            },
        ],

        // Сповіщення
        [
            {
                id: 'notifications',
                title: 'Сповіщення',
                subtitle: 'Отримувати сповіщення',
                icon: 'bell',
                type: 'toggle',
                value: notificationsEnabled,
                onToggle: setNotificationsEnabled,
            },
            {
                id: 'biometric',
                title: 'Біометрія',
                subtitle: 'Увійти за допомогою відбитку/обличчя',
                icon: 'smartphone',
                type: 'toggle',
                value: biometricEnabled,
                onToggle: setBiometricEnabled,
            },
        ],

        // Тема
        [
            {
                id: 'dark-mode',
                title: 'Темна тема',
                subtitle: 'Увімкнути темний режим',
                icon: 'moon',
                type: 'toggle',
                value: darkModeEnabled,
                onToggle: setDarkModeEnabled,
            },
        ],

        // Додатково
        [
            {
                id: 'privacy',
                title: 'Політика конфіденційності',
                icon: 'shield',
                type: 'link',
                onPress: handlePrivacyPolicy,
            },
            {
                id: 'terms',
                title: 'Умови використання',
                icon: 'file-text',
                type: 'link',
                onPress: handleTermsOfService,
            },
            {
                id: 'support',
                title: 'Підтримка',
                icon: 'help-circle',
                type: 'link',
                onPress: handleContactSupport,
            },
        ],

        // Система
        [
            {
                id: 'clear-cache',
                title: 'Очистити кеш',
                icon: 'trash-2',
                type: 'action',
                onPress: handleClearCache,
                color: '#FF9500',
            },
            {
                id: 'delete-account',
                title: 'Видалити акаунт',
                icon: 'x-circle',
                type: 'action',
                onPress: handleDeleteAccount,
                color: '#FF3B30',
            },
        ],
    ];

    const renderSettingItem = (item: SettingItem) => {
        const handlePress = () => {
            if (item.type === 'navigation' && item.screen) {

                navigation.navigate(item.screen as any);
            } else if (item.onPress) {
                item.onPress();
            }
        };

        return (
            <Pressable
                key={item.id}
                style={styles.settingItem}
                onPress={handlePress}
                disabled={item.type === 'toggle'}
            >
                <View style={styles.settingLeft}>
                    <Feather
                        name={item.icon}
                        size={20}
                        color={item.color || '#666'}
                    />
                    <View style={styles.settingTextContainer}>
                        <Text style={[styles.settingTitle, item.color && {color: item.color}]}>
                            {item.title}
                        </Text>
                        {item.subtitle && (
                            <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
                        )}
                    </View>
                </View>

                {item.type === 'toggle' && (
                    <Switch
                        value={item.value}
                        onValueChange={item.onToggle}
                        trackColor={{false: '#767577', true: '#81b0ff'}}
                        thumbColor={item.value ? '#007AFF' : '#f4f3f4'}
                    />
                )}

                {(item.type === 'navigation' || item.type === 'link') && (
                    <Feather name="chevron-right" size={20} color="#C7C7CC"/>
                )}

                {item.type === 'action' && (
                    <Feather name="alert-circle" size={20} color={item.color || '#FF3B30'}/>
                )}
            </Pressable>
        );
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            {/* Заголовок */}
            <View style={styles.header}>
                <Text style={styles.title}>Налаштування</Text>
            </View>

            {/* Профіль користувача */}
            <Pressable style={styles.profileSection} onPress={handleEditProfile}>
                <UserAvatar
                    size={80}
                    uri={user?.photoURL || undefined}
                    editable={false}
                />
                <View style={styles.userInfo}>
                    <Text style={styles.displayName}>
                        {user?.displayName || 'Користувач'}
                    </Text>
                    <Text style={styles.email}>
                        {user?.email || 'email@example.com'}
                    </Text>
                    <Text style={styles.editProfileText}>Натисніть для редагування</Text>
                </View>
                <Feather name="chevron-right" size={20} color="#C7C7CC"/>
            </Pressable>

            {/* Секції налаштувань */}
            {settingsSections.map((section, index) => (
                <View key={index} style={styles.settingsSection}>
                    {section.map(renderSettingItem)}
                    {index < settingsSections.length - 1 && <View style={styles.divider}/>}
                </View>
            ))}

            {/* Інформація про версію */}
            <View style={styles.versionSection}>
                <Text style={styles.versionText}>Версія 1.0.0</Text>
            </View>

            {/* Кнопка виходу */}
            <Pressable style={styles.logoutButton} onPress={handleLogout}>
                <Feather name="log-out" size={20} color="#FF3B30"/>
                <Text style={styles.logoutText}>Вийти з облікового запису</Text>
            </Pressable>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#494949',
    },
    content: {
        padding: 16,
    },
    header: {
        marginBottom: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        color: '#212121',
        textAlign: 'center',
    },
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#f9f9f9',
        borderRadius: 12,
        marginBottom: 24,
    },
    userInfo: {
        flex: 1,
        marginLeft: 16,
    },
    displayName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#212121',
    },
    email: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    editProfileText: {
        fontSize: 12,
        color: '#007AFF',
        marginTop: 4,
    },
    divider: {
        height: 1,
        backgroundColor: '#E0E0E0',
        marginVertical: 8,
    },
    settingsSection: {
        marginBottom: 24,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 8,
    },
    settingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    settingTextContainer: {
        marginLeft: 12,
        flex: 1,
    },
    settingTitle: {
        fontSize: 16,
        color: '#212121',
        fontWeight: '500',
    },
    settingSubtitle: {
        fontSize: 12,
        color: '#666',
        marginTop: 2,
    },
    versionSection: {
        alignItems: 'center',
        marginVertical: 16,
    },
    versionText: {
        fontSize: 12,
        color: '#999',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#FF3B30',
        marginTop: 8,
    },
    logoutText: {
        fontSize: 16,
        color: '#FF3B30',
        fontWeight: '600',
        marginLeft: 8,
    },
});

export default SettingsScreen;
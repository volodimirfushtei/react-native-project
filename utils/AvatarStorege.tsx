// utils/avatarStorage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const AVATAR_KEY = 'user_avatar';

export const saveAvatarToStorage = async (uri: string) => {
    try {
        await AsyncStorage.setItem(AVATAR_KEY, uri);
    } catch (error) {
        console.error('Помилка збереження аватара:', error);
    }
};

export const getAvatarFromStorage = async (): Promise<string | null> => {
    try {
        return await AsyncStorage.getItem(AVATAR_KEY);
    } catch (error) {
        console.error('Помилка отримання аватара:', error);
        return null;
    }
};

export const clearAvatarStorage = async () => {
    try {
        await AsyncStorage.removeItem(AVATAR_KEY);
    } catch (error) {
        console.error('Помилка видалення аватара:', error);
    }
};

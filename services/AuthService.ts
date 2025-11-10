import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
    User
} from 'firebase/auth';
import {getAuthInstance} from '@/lib/firebase';
import {userService} from './UserService';

// Типи для TypeScript
interface AuthUser {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
}

interface RegisterData {
    email: string;
    password: string;
    displayName: string;
    avatar: string | null;
}

interface LoginData {
    email: string;
    password: string;
}

// Реєстрація користувача
export const registerDB = async ({email, password, displayName, avatar}: RegisterData): Promise<User> => {
    const auth = getAuthInstance();

    try {
        const {user} = await createUserWithEmailAndPassword(auth, email, password);
        const currentUserAvatar = avatar || 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e';

        // Оновити профіль користувача
        if (displayName && currentUserAvatar) {
            await updateProfile(user, {
                displayName: displayName,
                photoURL: currentUserAvatar
            });
        }

        // Створити запис користувача в Firestore
        await userService.createOrUpdateUser({
            id: user.uid,
            name: displayName,
            email: email,
            avatar: currentUserAvatar,
        });

        return user;
    } catch (error: any) {
        console.error('Registration error:', error);
        throw new Error(getAuthErrorMessage(error.code));
    }
};

// Вхід користувача
export const loginDB = async ({email, password}: LoginData): Promise<User> => {
    const auth = getAuthInstance();
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error: any) {
        console.error('Login error:', error);
        throw new Error(getAuthErrorMessage(error.code));
    }
};


// Вихід користувача
export const logoutDB = async (): Promise<void> => {
    const auth = getAuthInstance();
    try {
        await signOut(auth);
    } catch (error: any) {
        console.error('Logout error:', error);
        throw new Error(getAuthErrorMessage(error.code));
    }
};

// Слухач змін стану аутентифікації
export const authStateChanged = (onChange: (user: AuthUser | null) => void) => {
    const auth = getAuthInstance();
    return onAuthStateChanged(auth, (user) => {
        if (user) {
            const authUser: AuthUser = {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL
            };
            onChange(authUser);
        } else {
            onChange(null);
        }
    });
};

// Оновлення профілю користувача
export const updateUserProfile = async (update: {

    displayName?: string;
    photoURL?: string;
}): Promise<void> => {
    const auth = getAuthInstance();
    try {
        const user = auth.currentUser;

        if (!user) {
            throw new Error('Користувач не авторизований');
        }

        await updateProfile(user, update);

        // Оновити дані в Firestore
        if (update.displayName || update.photoURL) {
            await userService.createOrUpdateUser({
                id: user.uid,
                name: update.displayName || user.displayName || '',
                email: user.email || '',
                avatar: update.photoURL || user.photoURL || undefined
            });
        }
    } catch (error: any) {
        console.error('Update profile error:', error);
        throw new Error(getAuthErrorMessage(error.code));
    }
};
// Оновлення аватара користувача
export const updateUserAvatar = async (avatarUrl: string): Promise<void> => {
    const auth = getAuthInstance();
    try {
        const user = auth.currentUser;

        if (!user) {
            throw new Error('Користувач не авторизований');
        }

        // Оновити аватар в Firebase Auth
        await updateProfile(user, {
            photoURL: avatarUrl
        });

        // Оновити аватар в Firestore
        await userService.createOrUpdateUser({
            id: user.uid,
            name: user.displayName || '',
            email: user.email || '',
            avatar: avatarUrl
        });

        console.log('Аватар успішно оновлено:', avatarUrl);
    } catch (error: any) {
        console.error('Update avatar error:', error);
        throw new Error(getAuthErrorMessage(error.code));
    }
};

// Завантаження та оновлення аватара
export const uploadAndUpdateAvatar = async (userId: string, imageUri: string): Promise<string> => {
    try {
        // Завантажити аватар на сервер
        const uploadResult = await userService.uploadUserAvatar(userId, imageUri);

        if (!uploadResult.success || !uploadResult.url) {
            throw new Error(uploadResult.error || 'Помилка завантаження аватара');
        }

        // Оновити аватар в профілі
        await updateUserAvatar(uploadResult.url);

        return uploadResult.url;
    } catch (error: any) {
        console.error('Upload and update avatar error:', error);
        throw new Error(error.message || 'Помилка оновлення аватара');
    }
};
// Отримати поточного користувача
export const getCurrentUser = (): AuthUser | null => {
    const auth = getAuthInstance();

    const user = auth.currentUser;

    if (!user) return null;

    return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL
    };
};
// Отримати аватар поточного користувача
export const getCurrentUserAvatar = (): string | null => {
    const currentUser = getCurrentUser();
    return currentUser?.photoURL || null;
};
// Функція для перекладу помилок Firebase
const getAuthErrorMessage = (errorCode: string): string => {

    switch (errorCode) {
        case 'auth/email-already-in-use':
            return 'Цей email вже використовується';
        case 'auth/invalid-email':
            return 'Невірний формат email';
        case 'auth/operation-not-allowed':
            return 'Операція не дозволена';
        case 'auth/weak-password':
            return 'Пароль занадто простий';
        case 'auth/user-disabled':
            return 'Обліковий запис вимкнено';
        case 'auth/user-not-found':
            return 'Користувача не знайдено';
        case 'auth/wrong-password':
            return 'Невірний пароль';
        case 'auth/network-request-failed':
            return 'Помилка мережі';
        case 'auth/too-many-requests':
            return 'Забагато спроб. Спробуйте пізніше';
        default:
            return 'Сталася помилка. Спробуйте ще раз';
    }
};

// Скидання пароля
export const resetPassword = async (email: string): Promise<void> => {
    const auth = getAuthInstance();
    try {
        await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
        console.error('Password reset error:', error);
        throw new Error(getAuthErrorMessage(error.code));
    }
};

// Експорт всіх функцій
export const authService = {
    registerDB,
    loginDB,
    logoutDB,
    authStateChanged,
    updateUserProfile,
    getCurrentUser,
    resetPassword
};
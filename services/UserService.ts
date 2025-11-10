// services/UserService.ts
import {
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    orderBy,
    query,
    serverTimestamp,
    setDoc,
    updateDoc,
    where,
} from 'firebase/firestore';
import {getAuthInstance, getDbInstance, getStorageInstance} from '@/lib/firebase';
import {deleteObject, getDownloadURL, ref, uploadBytes,} from 'firebase/storage';

import {User} from '@/types/navigation.types';


export interface UpdateUserData {
    name?: string;
    avatar?: string;
    email?: string;
}

// Допоміжна функція для конвертації даних Firestore у User
const firestoreUserToUser = (id: string, data: any): User => ({
    id,
    name: data.name || '',
    email: data.email || '',
    avatar: data.avatar || '',
    createdAt: data.createdAt ? data.createdAt.toDate() : new Date(),
    updatedAt: data.updatedAt ? data.updatedAt.toDate() : undefined,
});

export const userService = {
    // Створити або оновити користувача
    createOrUpdateUser: async (userData: Omit<User, 'createdAt' | 'updatedAt'>) => {
        const db = getDbInstance();
        try {
            const userRef = doc(collection(db, 'users'), userData.id);
            await setDoc(userRef, {
                ...userData,
                updatedAt: serverTimestamp(),
                createdAt: serverTimestamp(),
            }, {merge: true});
            return {success: true};
        } catch (error: any) {
            console.error('Error creating/updating user:', error);
            return {success: false, error: error.message};
        }
    },

    // Отримати користувача за ID
    getUser: async (userId: string) => {
        const db = getDbInstance();
        try {
            const docRef = doc(db, 'users', userId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const user = firestoreUserToUser(docSnap.id, docSnap.data());
                return {success: true, user};
            }
            return {success: false, error: 'User not found'};
        } catch (error: any) {
            console.error('Error getting user:', error);
            return {success: false, error: error.message};
        }
    },

    // Оновити профіль користувача
    updateUserProfile: async (userId: string, updates: UpdateUserData) => {
        const db = getDbInstance();
        try {
            const userRef = doc(db, 'users', userId);
            await updateDoc(userRef, {
                ...updates,
                updatedAt: serverTimestamp(),
            });
            return {success: true};
        } catch (error: any) {
            console.error('Error updating user profile:', error);
            return {success: false, error: error.message};
        }
    },

    // Завантажити аватар користувача
    uploadUserAvatar: async (userId: string, imageUri: string) => {
        const storage = getStorageInstance();

        try {
            // Для Expo: imageUri — це шлях типу "file:///..."
            const response = await fetch(imageUri);
            const blob = await response.blob();

            const filename = `avatars/${userId}/${Date.now()}.jpg`;
            const storageRef = ref(storage, filename);
            await uploadBytes(storageRef, blob);
            const downloadURL = await getDownloadURL(storageRef);

            return {success: true, url: downloadURL};
        } catch (error: any) {
            console.error('Error uploading avatar:', error);
            return {success: false, error: error.message};
        }
    },

    // Видалити аватар користувача
    deleteUserAvatar: async (avatarUrl: string) => {

        const storage = getStorageInstance();
        try {
            const storageRef = ref(storage, avatarUrl);
            await deleteObject(storageRef);
            return {success: true};
        } catch (error: any) {
            console.error('Error deleting avatar:', error);
            return {success: false, error: error.message};
        }
    },

    // Отримати всіх користувачів
    getAllUsers: async () => {
        const db = getDbInstance();
        try {
            const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);
            const users = querySnapshot.docs.map(doc => firestoreUserToUser(doc.id, doc.data()));
            return {success: true, users};
        } catch (error: any) {
            console.error('Error getting all users:', error);
            return {success: false, error: error.message};
        }
    },

    // Пошук користувачів за ім'ям (⚠️ Потрібен індекс у Firestore!)
    searchUsers: async (searchTerm: string) => {
        const db = getDbInstance();
        try {
            // Web SDK не підтримує startAt/endAt для рядків без індексу
            // Простіший варіант — отримати всіх і фільтрувати на клієнті (для малої кількості користувачів)
            const q = query(collection(db, 'users'));
            const querySnapshot = await getDocs(q);
            const users = querySnapshot.docs
                .map(doc => firestoreUserToUser(doc.id, doc.data()))
                .filter(user => user.name.toLowerCase().includes(searchTerm.toLowerCase()));

            return {success: true, users};
        } catch (error: any) {
            console.error('Error searching users:', error);
            return {success: false, error: error.message};
        }
    },

    // Отримати статистику користувача
    getUserStats: async (userId: string) => {
        const db = getDbInstance();
        try {
            const postsQuery = query(collection(db, 'posts'), where('userId', '==', userId));
            const commentsQuery = query(collection(db, 'comments'), where('userId', '==', userId));

            const [postsSnapshot, commentsSnapshot] = await Promise.all([
                getDocs(postsQuery),
                getDocs(commentsQuery),
            ]);

            return {
                success: true,
                stats: {
                    postsCount: postsSnapshot.size,
                    commentsCount: commentsSnapshot.size,
                },
            };
        } catch (error: any) {
            console.error('Error getting user stats:', error);
            return {success: false, error: error.message};
        }
    },

    // Видалити користувача
    deleteUser: async (userId: string) => {
        const db = getDbInstance();
        try {
            await deleteDoc(doc(db, 'users', userId));
            return {success: true};
        } catch (error: any) {
            console.error('Error deleting user:', error);
            return {success: false, error: error.message};
        }
    },
    deleteAccount: async (userId: string): Promise<void> => {
        const auth = getAuthInstance();
        const user = auth.currentUser;

        if (!user) {
            throw new Error('No user is currently signed in');
        }

        try {
            // Delete user data from Firestore first
            await userService.deleteUser(userId);
            // Then delete the auth account
            await user.delete();
        } catch (error: any) {
            console.error('Delete account error:', error);

        }


    }

};


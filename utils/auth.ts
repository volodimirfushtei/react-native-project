// src/utils/auth.ts
import {createUserWithEmailAndPassword, User} from 'firebase/auth';
import {getAuthInstance} from '@/lib/firebase';

export const registerWithEmail = async (email: string, password: string) => {
    const auth = getAuthInstance();
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error: any) {
        throw new Error(error.message);
    }
};
export const getCurrentUser = (): User | null => {
    const auth = getAuthInstance();
    return auth.currentUser;
};
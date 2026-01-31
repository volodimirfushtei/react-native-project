import {getDownloadURL, ref, uploadBytesResumable} from 'firebase/storage';
import {storage} from '@/lib/firebase';
import * as FileSystem from 'expo-file-system/legacy';

/**
 * Завантажує зображення у Firebase Storage і повертає URL для завантаження
 * @param uri URI зображення на пристрої
 * @param userId ID користувача (щоб зберігати у папці user)
 * @returns URL зображення у Storage
 */
export async function uploadImage(uri: string, userId: string): Promise<string> {
    try {
        // 1️⃣ Читаємо файл у Base64
        const base64 = await FileSystem.readAsStringAsync(uri, {encoding: FileSystem.EncodingType.Base64});

        // 2️⃣ Конвертуємо Base64 у Uint8Array
        const bytes = Uint8Array.from(atob(base64), c => c.charCodeAt(0));

        // 3️⃣ Створюємо референс у Storage
        const storageRef = ref(storage, `posts/${userId}/${Date.now()}.jpg`);

        // 4️⃣ Завантажуємо дані
        await uploadBytesResumable(storageRef, bytes, {contentType: 'image/jpeg'});

        // 5️⃣ Отримуємо URL
        const downloadURL = await getDownloadURL(storageRef);

        return downloadURL;
    } catch (error: any) {
        console.error('❌ Upload error:', error);
        throw new Error(error.message || 'Failed to upload image');
    }
}












// utils/firestore.ts
import {db} from '@/lib/firebase';
import {collection, getDocs, limit, orderBy, query, Timestamp} from 'firebase/firestore';
import {Post} from '@/types/navigation.types';

// utils/firestore.ts
export const parseCreatedAt = (value: any): number => {
    if (!value) return Date.now();

    if (value instanceof Timestamp) {
        return value.toMillis(); // ✅ number
    }

    if (typeof value === 'number') {
        return value;
    }

    if (value instanceof Date) {
        return value.getTime();
    }

    return Date.now();
};

export const getPosts = async (limitCount: number = 20): Promise<Post[]> => {
    console.log('📥 Початок завантаження постів з Firestore...');

    try {
        const postsRef = collection(db, 'posts');
        const q = query(postsRef, orderBy('createdAt', 'desc'), limit(limitCount));

        const querySnapshot = await getDocs(q);
        console.log(`✅ Знайдено ${querySnapshot.size} постів`);

        const posts: Post[] = [];

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            console.log(`📄 Пост ${doc.id}:`, JSON.stringify(data));

            // ВИПРАВЛЕНО: Очищення даних від зайвих лапок
            const cleanString = (value: any): string => {
                if (typeof value === 'string') {
                    // Видаляємо зайві лапки та пробіли
                    return value.replace(/^["'\s]+|["'\s]+$/g, '');
                }
                return String(value || '');
            };

            // ВИПРАВЛЕНО: Правильна обробка координат
            let coordinates = {latitude: 0, longitude: 0};

            if (typeof data.coordinates === 'string') {
                // Спроба парсингу строки координат
                try {
                    const coordsString = data.coordinates.replace(/[{}]/g, '');
                    const parts = coordsString.split(',');
                    coordinates.latitude = parseFloat(parts[0].split(':')[1]?.trim()) || 0;
                    coordinates.longitude = parseFloat(parts[1].split(':')[1]?.trim()) || 0;
                } catch (e) {
                    console.warn('❌ Помилка парсингу координат:', data.coordinates);
                }
            } else if (data.coordinates && typeof data.coordinates === 'object') {
                coordinates = {
                    latitude: data.coordinates.latitude || 0,
                    longitude: data.coordinates.longitude || 0
                };
            }

            // ВИПРАВЛЕНО: Правильна обробка дати
            let createdAt: Date = new Date();

            if (data.createdAt) {
                try {
                    if (data.createdAt.toDate && typeof data.createdAt.toDate === 'function') {
                        // Firestore Timestamp
                        createdAt = data.createdAt.toDate();
                    } else if (data.createdAt.seconds) {
                        // Timestamp з секундами
                        createdAt = new Date(data.createdAt.seconds * 1000);
                    } else if (typeof data.createdAt === 'string') {
                        // Строкова дата
                        const dateString = cleanString(data.createdAt);
                        createdAt = new Date(dateString);

                        if (isNaN(createdAt.getTime())) {
                            console.warn('⚠️ Невірна дата, використовую поточну');
                            createdAt = new Date();
                        }
                    } else if (typeof data.createdAt === 'number') {
                        // Unix timestamp
                        createdAt = new Date(data.createdAt);
                    }
                } catch (error) {
                    console.error('❌ Помилка парсингу дати:', data.createdAt, error);
                    createdAt = new Date();
                }
            }


            const post: Post = {
                id: doc.id,
                photo: cleanString(data.photo || ''),
                title: cleanString(data.title || ''),
                location: cleanString(data.location || ''),
                coordinates,
                comments: Number(data.comments) || 0,
                likes: Number(data.likes) || 0,
                createdAt: parseCreatedAt(data.createdAt), // ✅ number,

            };

            console.log(`✅ Очищений пост ${doc.id}:`, {
                title: post.title,
                photoLength: post.photo.length,
                createdAt: parseCreatedAt(data.createdAt), // ✅ number
            });

            posts.push(post);
        });

        return posts;

    } catch (error: any) {
        console.error('❌ Помилка завантаження постів:', error);
        throw error;
    }
};



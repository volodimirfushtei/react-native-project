// PostsProvider.tsx (оновлена версія)
import React, {createContext, ReactNode, useContext, useEffect, useState} from 'react';
import {getDbInstance} from '@/lib/firebase';
import {addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc} from 'firebase/firestore';
import {Post} from '@/types/navigation.types';

interface PostsContextType {
    posts: Post[];
    loading: boolean;
    addPost: (post: Omit<Post, 'id'>) => Promise<void>;
    updatePost: (postId: string, updates: Partial<Post>) => Promise<void>;
    deletePost: (postId: string) => Promise<void>;
}

const PostsContext = createContext<PostsContextType | undefined>(undefined);

export const PostsProvider: React.FC<{ children: ReactNode }> = ({children}) => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    // Завантаження постів з Firestore
    useEffect(() => {
        const fetchPosts = async () => {
            const db = getDbInstance();
            try {
                const q = query(collection(db, 'posts'));
                const querySnapshot = await getDocs(q);
                const loadedPosts: Post[] = [];
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    loadedPosts.push({
                        id: doc.id,
                        photo: data.photo || '',
                        title: data.title || '',
                        comments: data.comments || 0,
                        likes: data.likes || 0,
                        location: data.location || '',
                        coordinates: data.coordinates || {latitude: 0, longitude: 0},
                        createdAt: data.createdAt ? new Date(data.createdAt.seconds * 1000) : new Date(),
                    });
                });
                setPosts(loadedPosts);
            } catch (error) {
                console.error('Помилка завантаження постів:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    const addPost = async (post: Omit<Post, 'id'>) => {
        const db = getDbInstance();
        try {
            const docRef = await addDoc(collection(db, 'posts'), {
                ...post,
                createdAt: new Date(),
            });
            setPosts(prev => [...prev, {...post, id: docRef.id} as Post]);
        } catch (error) {
            console.error('Помилка додавання поста:', error);
        }
    };

    const updatePost = async (postId: string, updates: Partial<Post>) => {
        const db = getDbInstance();
        try {
            await updateDoc(doc(db, 'posts', postId), updates);
            setPosts(prev =>
                prev.map(post => (post.id === postId ? {...post, ...updates} : post))
            );
        } catch (error) {
            console.error('Помилка оновлення поста:', error);
        }
    };

    const deletePost = async (postId: string) => {
        const db = getDbInstance();
        try {
            await deleteDoc(doc(db, 'posts', postId));
            setPosts(prev => prev.filter(post => post.id !== postId));
        } catch (error) {
            console.error('Помилка видалення поста:', error);
        }
    };

    return (
        <PostsContext.Provider value={{
            posts,
            loading,
            addPost,
            updatePost,
            deletePost,
        }}>
            {children}
        </PostsContext.Provider>
    );
};

export const usePosts = () => {
    const context = useContext(PostsContext);
    if (!context) {
        throw new Error('usePosts must be used within a PostsProvider');
    }
    return context;
};
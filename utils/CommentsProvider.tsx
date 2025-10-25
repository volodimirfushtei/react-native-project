import React, {createContext, ReactNode, useContext, useState} from 'react';
import {Comment} from '@/types/navigation.types';

interface CommentsContextType {
    comments: Comment[];
    addComment: (postId: string, text: string, author?: string) => void;
    deleteComment: (commentId: string) => void;
    likeComment: (commentId: string) => void;
    getCommentsByPostId: (postId: string) => Comment[];
    getCommentsCount: (postId: string) => number;
}

const CommentsContext = createContext<CommentsContextType | undefined>(undefined);

export const CommentsProvider: React.FC<{ children: ReactNode }> = ({children}) => {
    const [comments, setComments] = useState<Comment[]>([
        {
            id: '1',
            postId: '1',
            author: 'Natali Romanova',
            authorAvatar: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e',
            text: 'Це чудова фотографія!',
            timestamp: new Date('2024-01-15'),
            likes: 3,
        },
        {
            id: '2',
            postId: '1',
            author: 'Іван Петров',
            text: 'Де це було зроблено?',
            timestamp: new Date('2024-01-16'),
            likes: 1,
        },
    ]);

    const addComment = (postId: string, text: string, author: string = 'Natali Romanova') => {
        const newComment: Comment = {
            id: Date.now().toString(),
            postId,
            author,
            authorAvatar: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e',
            text,
            timestamp: new Date(),
            likes: 0,
        };

        setComments(prev => [newComment, ...prev]);
    };

    const deleteComment = (commentId: string) => {
        setComments(prev => prev.filter(comment => comment.id !== commentId));
    };

    const likeComment = (commentId: string) => {
        setComments(prev =>
            prev.map(comment =>
                comment.id === commentId
                    ? {...comment, likes: comment.likes + 1}
                    : comment
            )
        );
    };

    const getCommentsByPostId = (postId: string) => {
        return comments.filter(comment => comment.postId === postId)
            .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    };

    const getCommentsCount = (postId: string) => {
        return comments.filter(comment => comment.postId === postId).length;
    };

    return (
        <CommentsContext.Provider value={{
            comments,
            addComment,
            deleteComment,
            likeComment,
            getCommentsByPostId,
            getCommentsCount,
        }}>
            {children}
        </CommentsContext.Provider>
    );
};

export const useComments = () => {
    const context = useContext(CommentsContext);
    if (context === undefined) {
        throw new Error('useComments must be used within a CommentsProvider');
    }
    return context;
};
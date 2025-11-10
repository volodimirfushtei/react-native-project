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
            id: "1",
            postId: "1",
            user: "John Doe",
            avatar: "https://i.pravatar.cc/50?img=1",
            text: "Really love your most recent photo. I've been trying to capture the same thing for a few months and would love some tips!",
            date: "09 червня, 2020 | 08:40",
            timestamp: new Date(2020, 5, 9, 8, 40),
            likes: 2
        },
        {
            id: "2",
            postId: "1",
            user: "Sarah Smith",
            avatar: "https://i.pravatar.cc/50?img=2",
            text: "A fast 50mm like f1.8 would help with the bokeh. I've been using primes as they tend to get a bit sharper images.",
            date: "09 червня, 2020 | 09:14",
            timestamp: new Date(2020, 5, 9, 9, 14),
            likes: 1
        },
        {
            id: "3",
            postId: "1",
            user: "John Doe",
            avatar: "https://i.pravatar.cc/50?img=1",
            text: "Thank you! That was very helpful!",
            date: "09 червня, 2020 | 09:20",
            timestamp: new Date(2020, 5, 9, 9, 20),
            likes: 0
        },
        {
            id: "4",
            postId: "2",
            user: "Mike Johnson",
            avatar: "https://i.pravatar.cc/50?img=4",
            text: "Amazing landscape! Where was this taken?",
            date: "10 червня, 2020 | 10:30",
            timestamp: new Date(2020, 5, 10, 10, 30),
            likes: 3
        },
    ]);

    const formatDate = (date: Date) => {
        const today = new Date();
        const isToday = date.toDateString() === today.toDateString();

        if (isToday) {
            return `Сьогодні | ${date.toLocaleTimeString('uk-UA', {
                hour: '2-digit',
                minute: '2-digit'
            })}`;
        } else {
            return date.toLocaleDateString('uk-UA', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            }) + ' | ' + date.toLocaleTimeString('uk-UA', {
                hour: '2-digit',
                minute: '2-digit'
            });
        }
    };

    const addComment = (postId: string, text: string, author: string = "Natali Romanova") => {
        const newComment: Comment = {
            id: Date.now().toString(),
            postId,
            user: author,
            avatar: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e",
            text,
            date: formatDate(new Date()),
            timestamp: new Date(),
            likes: 0
        };
        setComments(prev => [...prev, newComment]);
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
        const postComments = comments.filter(comment => comment.postId === postId)
            .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

        console.log(`Getting comments for post ${postId}:`, postComments);
        return postComments;
    };

    const getCommentsCount = (postId: string) => {
        const count = comments.filter(comment => comment.postId === postId).length;
        console.log(`Comments count for post ${postId}:`, count);
        return count;
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
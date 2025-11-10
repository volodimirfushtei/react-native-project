// contexts/AuthContext.tsx
import React, {createContext, ReactNode, useContext, useEffect, useState} from 'react';
import {getAuthInstance} from '@/lib/firebase';
import {onAuthStateChanged, User} from 'firebase/auth';

type AuthContextType = {
    user: User | null;
    loading: boolean;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({children}: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const auth = getAuthInstance();
    useEffect(() => {
        return onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });
    }, [auth]);

    return (
        <AuthContext.Provider value={{user, loading}}>
            {children}
        </AuthContext.Provider>
    );
};

// ✅ Хук з перевіркою
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
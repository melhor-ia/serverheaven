"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth } from '@/lib/firebase-config';
import { User } from 'firebase/auth';
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextType {
    currentUser: User | null;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ currentUser: null, loading: true });

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setCurrentUser(user);
            setLoading(false);

            if (user) {
                // Redirect new users to create their profile
                const defaultUsername = user.email?.split('@')[0];
                const isNewUser = user.displayName === null || user.displayName === defaultUsername;

                const allowedPaths = ['/profile/create', '/beta/setup', '/beta/signin'];

                if (isNewUser && !allowedPaths.some(p => pathname.startsWith(p))) {
                    router.push('/profile/create');
                }
            }
        });

        return () => unsubscribe();
    }, [pathname, router]);

    return (
        <AuthContext.Provider value={{ currentUser, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 
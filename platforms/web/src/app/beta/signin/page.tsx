"use client";

import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/badge';
import { AnimatedGridBackground } from '../../components/ui/AnimatedGridBackground';
import { ArrowRight, ShieldAlert } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase-config';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, User } from 'firebase/auth';

const BetaSignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSuccessfulSignIn = async (user: User) => {
        try {
            // Check if user has a profile document in Firestore
            const userDocResponse = await fetch(`/api/users/id/${user.uid}`);
            
            if (userDocResponse.ok) {
                 // User has a profile, go to feed
                const userProfile = await userDocResponse.json();
                if (userProfile.username) {
                    router.push('/feed');
                } else {
                    // This case is unlikely if the doc exists, but as a fallback:
                    router.push('/profile/create');
                }
            } else if (userDocResponse.status === 404) {
                // User does not have a profile, go to creation page
                router.push('/profile/create');
            } else {
                // Handle other potential errors during fetch
                throw new Error('Failed to check user profile.');
            }
        } catch (err) {
            console.error("Error during post-signin check:", err);
            await auth.signOut();
            setError("Could not verify your profile. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleAuthError = (err: unknown) => {
        console.error("Error during authentication:", err);
        let message = "An unexpected error occurred. Please try again.";
        if (typeof err === 'object' && err !== null) {
            const firebaseError = err as { code?: string; message?: string };
            if (firebaseError.code === 'auth/user-not-found' || firebaseError.code === 'auth/wrong-password' || firebaseError.code === 'auth/invalid-credential') {
                message = "Invalid email or password.";
            } else if (firebaseError.message) {
                message = firebaseError.message;
            }
        }
        setError(message);
        setIsLoading(false);
    }

    const handleEmailSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            await handleSuccessfulSignIn(userCredential.user);
        } catch (err: unknown) {
            handleAuthError(err);
        }
    };

    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const provider = new GoogleAuthProvider();
            const userCredential = await signInWithPopup(auth, provider);
            await handleSuccessfulSignIn(userCredential.user);
        } catch (err: unknown) {
            handleAuthError(err);
        }
    };

    return (
        <div className="relative min-h-screen w-full bg-background text-foreground flex items-center justify-center p-4 overflow-x-hidden">
            <div className="absolute inset-0 z-0">
                <AnimatedGridBackground variant="sparse" />
            </div>
            <div className="relative z-10 w-full max-w-xl hud-panel p-8 md:p-12 rounded-2xl">
                <div className="text-center mb-10">
                    <Badge className="mb-4 bg-emerald-500/20 text-emerald-400 border-emerald-400/30 font-mono uppercase">
                        Beta Access
                    </Badge>
                    <h1 className="text-3xl md:text-5xl font-bold mb-4 text-white hud-text-glow font-mono">
                        Pioneer Login
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
                        Welcome back! Please sign in to continue.
                    </p>
                </div>

                <div className="space-y-6">
                    <Button
                        size="lg"
                        variant="outline"
                        onClick={handleGoogleSignIn}
                        disabled={isLoading}
                        className="w-full font-bold group transition-all duration-300 shadow-glow-lg uppercase tracking-wider flex items-center justify-center"
                    >
                        <FcGoogle className="w-6 h-6 mr-3" />
                        Sign In with Google
                    </Button>
                    <div className="flex items-center my-6">
                        <div className="flex-grow border-t border-border" />
                        <span className="flex-shrink mx-4 text-xs uppercase text-muted-foreground font-mono">
                            Or Sign In With Email
                        </span>
                        <div className="flex-grow border-t border-border" />
                    </div>
                </div>

                <form className="space-y-8" onSubmit={handleEmailSignIn}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-muted-foreground mb-2 font-mono uppercase tracking-wider">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="pioneer@serverheaven.com"
                            required
                            className="w-full bg-black/30 border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:border-emerald-500 focus:ring-emerald-500/50 focus:ring-1 transition-all duration-300 glass"
                        />
                    </div>
                    <div>
                        <label htmlFor="password"
                            className="block text-sm font-medium text-muted-foreground mb-2 font-mono uppercase tracking-wider">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            className="w-full bg-black/30 border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:border-emerald-500 focus:ring-emerald-500/50 focus:ring-1 transition-all duration-300 glass"
                        />
                    </div>
                    
                    {error && (
                        <div className="flex items-center gap-3 hud-panel-red p-4 rounded-lg">
                            <ShieldAlert className="h-6 w-6 text-red-400 flex-shrink-0" />
                            <p className="text-red-400 font-semibold">{error}</p>
                        </div>
                    )}

                    <div className="pt-2 flex justify-end">
                        <Button
                            size="lg"
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold group transition-all duration-300 shadow-glow-lg uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Signing In...' : 'Sign In'}
                            <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BetaSignIn; 
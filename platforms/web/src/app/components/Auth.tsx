"use client";

import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut 
} from "firebase/auth";
import { auth } from "@/lib/firebase-config";
import Link from "next/link";

export default function Auth() {
    const { user } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isSignUp, setIsSignUp] = useState(true);

    const handleAuthAction = async () => {
        setError(null);
        try {
            if (isSignUp) {
                await createUserWithEmailAndPassword(auth, email, password);
            } else {
                await signInWithEmailAndPassword(auth, email, password);
            }
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleSignOut = async () => {
        setError(null);
        try {
            await signOut(auth);
        } catch (err: any) {
            setError(err.message);
        }
    };

    if (user) {
        return (
            <div className="bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg p-8 mt-4">
                <p>Welcome, {user.email}</p>
                <Link href="/profile">My Profile</Link>
                <br />
                <button onClick={handleSignOut} className="w-full p-3 mt-4 mb-2 bg-transparent border border-zinc-300 dark:border-zinc-600 text-zinc-900 dark:text-white rounded-md font-semibold cursor-pointer">Sign Out</button>
                {error && <p style={{ color: "red" }}>{error}</p>}
            </div>
        );
    }

    return (
        <div className="bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg p-8 mt-4">
            <h2 className="text-2xl font-bold mb-6">{isSignUp ? "Sign Up" : "Sign In"}</h2>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full p-3 mb-4 bg-transparent border border-zinc-300 dark:border-zinc-600 rounded-md"
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full p-3 mb-4 bg-transparent border border-zinc-300 dark:border-zinc-600 rounded-md"
            />
            <button onClick={handleAuthAction} className="w-full p-3 mb-2 bg-blue-600 text-white rounded-md font-semibold cursor-pointer">
                {isSignUp ? "Sign Up" : "Sign In"}
            </button>
            <button onClick={() => setIsSignUp(!isSignUp)} className="w-full p-3 mb-2 bg-transparent border border-zinc-300 dark:border-zinc-600 text-zinc-900 dark:text-white rounded-md font-semibold cursor-pointer">
                Switch to {isSignUp ? "Sign In" : "Sign Up"}
            </button>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
} 
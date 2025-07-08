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
            <div>
                <p>Welcome, {user.email}</p>
                <Link href="/profile">My Profile</Link>
                <br />
                <button onClick={handleSignOut}>Sign Out</button>
                {error && <p style={{ color: "red" }}>{error}</p>}
            </div>
        );
    }

    return (
        <div>
            <h2>{isSignUp ? "Sign Up" : "Sign In"}</h2>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
            />
            <button onClick={handleAuthAction}>
                {isSignUp ? "Sign Up" : "Sign In"}
            </button>
            <button onClick={() => setIsSignUp(!isSignUp)}>
                Switch to {isSignUp ? "Sign In" : "Sign Up"}
            </button>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
} 
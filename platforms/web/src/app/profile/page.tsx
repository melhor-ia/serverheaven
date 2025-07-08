"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/navigation";

interface UserProfile {
    id: string;
    username: string;
    display_name: string;
    avatar_url: string;
    bio: string;
    reputation_score: number;
    is_supporter: boolean;
}

export default function MyProfilePage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [displayName, setDisplayName] = useState("");
    const [bio, setBio] = useState("");
    const [avatarUrl, setAvatarUrl] = useState("");

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/'); // Redirect to home if not logged in
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        if (user) {
            const fetchProfile = async () => {
                setLoading(true);
                setError(null);
                try {
                    const functionsUrl = process.env.NEXT_PUBLIC_FUNCTIONS_URL || 'http://localhost:5001/server-heaven-c6fb1/us-central1/api';
                    const response = await fetch(`${functionsUrl}/profile/${user.uid}`);
                    if (!response.ok) throw new Error("Failed to fetch profile");
                    
                    const data = await response.json();
                    setProfile(data);
                    setDisplayName(data.display_name);
                    setBio(data.bio);
                    setAvatarUrl(data.avatar_url);
                } catch (err: any) {
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            };
            fetchProfile();
        }
    }, [user]);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            const token = await user?.getIdToken();
            if (!token) throw new Error("Not authenticated");

            const functionsUrl = process.env.NEXT_PUBLIC_FUNCTIONS_URL || 'http://localhost:5001/server-heaven-c6fb1/us-central1/api';
            const response = await fetch(`${functionsUrl}/profile`, {
                method: "PATCH",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ displayName, bio, avatarUrl })
            });

            if (!response.ok) throw new Error("Failed to update profile");
            
            const data = await response.json();
            setProfile(data);
            alert("Profile updated!");
        } catch (err: any) {
            setError(err.message);
        }
    };

    if (authLoading || loading) return <div>Loading...</div>;
    if (!user) return <div>Please log in to see your profile.</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h1>Your Profile</h1>
            {profile && (
                <div>
                    <p>Username: {profile.username}</p>
                    <p>Email: {user.email}</p>
                    <p>Reputation: {profile.reputation_score}</p>
                </div>
            )}
            
            <form onSubmit={handleUpdateProfile}>
                <h2>Edit Profile</h2>
                <label>
                    Display Name:
                    <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
                </label>
                <br />
                <label>
                    Bio:
                    <textarea value={bio} onChange={(e) => setBio(e.target.value)} />
                </label>
                <br />
                <label>
                    Avatar URL:
                    <input type="text" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} />
                </label>
                <br />
                <button type="submit">Update Profile</button>
            </form>
        </div>
    );
} 
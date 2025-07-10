"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface UserProfile {
    id: string;
    username: string;
    display_name: string;
    avatar_url: string;
    bio: string;
    reputation_score: number;
    is_supporter: boolean;
    created_at: any;
}

export default function UserProfilePage() {
    const params = useParams();
    const userId = params.userId as string;
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (userId) {
            const fetchProfile = async () => {
                setLoading(true);
                setError(null);
                try {
                    // This needs to be the URL of your deployed functions or emulated function
                    const functionsUrl = process.env.NEXT_PUBLIC_FUNCTIONS_URL || 'http://localhost:5001/server-heaven-c6fb1/us-central1/api';
                    const response = await fetch(`${functionsUrl}/profile/${userId}`);
                    
                    if (!response.ok) {
                        throw new Error("Failed to fetch profile");
                    }
                    
                    const data = await response.json();
                    setProfile(data);
                } catch (err: any) {
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            };
            fetchProfile();
        }
    }, [userId]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!profile) return <div>User not found.</div>;

    return (
        <div>
            <h1>{profile.display_name}'s Profile</h1>
            <p>Username: {profile.username}</p>
            {profile.avatar_url && <img src={profile.avatar_url} alt="Avatar" width="100" />}
            <p>Bio: {profile.bio}</p>
            <p>Reputation: {profile.reputation_score}</p>
            <p>Supporter: {profile.is_supporter ? "Yes" : "No"}</p>
        </div>
    );
} 
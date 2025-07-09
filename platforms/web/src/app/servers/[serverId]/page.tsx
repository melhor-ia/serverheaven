"use client";

import { useEffect, useState } from 'react';

interface ServerProfile {
    id: string;
    name: string;
    description: string;
    ip_address: string;
    website_url: string;
    discord_url: string;
    tags: string[];
    reputation_score: number;
    owner_id: string;
    game_id: string;
}

export default function ServerPage({ params }: { params: { serverId: string } }) {
    const { serverId } = params;
    const [server, setServer] = useState<ServerProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (serverId) {
            const fetchServer = async () => {
                setLoading(true);
                setError(null);
                try {
                    const response = await fetch(`/api/servers/${serverId}`);
                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.message || "Failed to fetch server details");
                    }
                    const data = await response.json();
                    setServer(data);
                } catch (err) {
                    if (err instanceof Error) {
                        setError(err.message);
                    } else {
                        setError("An unexpected error occurred.");
                    }
                } finally {
                    setLoading(false);
                }
            };
            fetchServer();
        }
    }, [serverId]);

    if (loading) return <div className="container mx-auto p-4">Loading...</div>;
    if (error) return <div className="container mx-auto p-4">Error: {error}</div>;
    if (!server) return <div className="container mx-auto p-4">Server not found.</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-2">{server.name}</h1>
            <p className="text-gray-400 mb-4">A server for {server.game_id}</p>
            
            <div className="bg-gray-800 p-4 rounded-lg">
                <h2 className="text-xl font-semibold mb-2">Description</h2>
                <p>{server.description}</p>
            </div>
            
            <div className="mt-4">
                <p><strong>Owner ID:</strong> {server.owner_id}</p>
                <p><strong>Reputation:</strong> {server.reputation_score}</p>
                {server.ip_address && <p><strong>IP Address:</strong> {server.ip_address}</p>}
                {server.website_url && <p><strong>Website:</strong> <a href={server.website_url} className="text-indigo-400 hover:underline">{server.website_url}</a></p>}
                {server.discord_url && <p><strong>Discord:</strong> <a href={server.discord_url} className="text-indigo-400 hover:underline">{server.discord_url}</a></p>}
            </div>
        </div>
    );
} 
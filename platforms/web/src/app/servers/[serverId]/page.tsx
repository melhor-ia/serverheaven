"use client";

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import StarRating from '@/app/components/StarRating';
import ReviewForm from '@/app/components/ReviewForm';

interface ServerProfile {
    id: string;
    name: string;
    description: string;
    ip_address: string;
    website_url: string;
    discord_url: string;
    tags: string[];
    rating: {
        average: number;
        count: number;
    };
    owner_id: string;
    game_id: string;
}

interface Review {
    id: string;
    author_id: string;
    content: string;
    rating: number;
    created_at: {
        _seconds: number;
    };
}

export default function ServerPage() {
    const params = useParams();
    const serverId = params.serverId as string;
    const [server, setServer] = useState<ServerProfile | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchServerAndReviews = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // Fetch server details
            const serverResponse = await fetch(`/api/servers/${serverId}`);
            if (!serverResponse.ok) {
                const errorData = await serverResponse.json();
                throw new Error(errorData.message || "Failed to fetch server details");
            }
            const serverData = await serverResponse.json();
            setServer(serverData);

            // Fetch reviews
            const reviewsResponse = await fetch(`/api/reviews/${serverId}`);
            if (!reviewsResponse.ok) {
                const errorData = await reviewsResponse.json();
                throw new Error(errorData.message || "Failed to fetch reviews");
            }
            const reviewsData = await reviewsResponse.json();
            setReviews(reviewsData);

        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unexpected error occurred.");
            }
        } finally {
            setLoading(false);
        }
    }, [serverId]);

    useEffect(() => {
        if (serverId) {
            fetchServerAndReviews();
        }
    }, [serverId, fetchServerAndReviews]);

    if (loading) return <div className="container mx-auto p-4">Loading...</div>;
    if (error) return <div className="container mx-auto p-4">Error: {error}</div>;
    if (!server) return <div className="container mx-auto p-4">Server not found.</div>;

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold mb-2">{server.name}</h1>
                    <p className="text-gray-400 mb-4">A server for {server.game_id}</p>
                </div>
                <div className="text-right">
                    <StarRating rating={server.rating.average} />
                    <p className="text-sm text-gray-400">({server.rating.count} reviews)</p>
                </div>
            </div>
            
            <div className="bg-gray-800 p-4 rounded-lg mt-4">
                <h2 className="text-xl font-semibold mb-2">Description</h2>
                <p>{server.description}</p>
            </div>
            
            <div className="mt-4">
                <p><strong>Owner ID:</strong> {server.owner_id}</p>
                {server.ip_address && <p><strong>IP Address:</strong> {server.ip_address}</p>}
                {server.website_url && <p><strong>Website:</strong> <a href={server.website_url} className="text-indigo-400 hover:underline">{server.website_url}</a></p>}
                {server.discord_url && <p><strong>Discord:</strong> <a href={server.discord_url} className="text-indigo-400 hover:underline">{server.discord_url}</a></p>}
            </div>

            <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Reviews</h2>
                <ReviewForm targetId={serverId} targetType="player_to_server" onReviewSubmitted={fetchServerAndReviews} />
                <div className="mt-6 space-y-4">
                    {reviews.length > 0 ? (
                        reviews.map(review => (
                            <div key={review.id} className="bg-gray-800 p-4 rounded-lg">
                                <div className="flex justify-between items-center mb-2">
                                    <p className="font-semibold">By: {review.author_id.substring(0, 8)}...</p>
                                    <StarRating rating={review.rating} />
                                </div>
                                <p className="text-gray-300">{review.content}</p>
                                <p className="text-xs text-gray-500 mt-2">
                                    {new Date(review.created_at._seconds * 1000).toLocaleDateString()}
                                </p>
                            </div>
                        ))
                    ) : (
                        <p>No reviews yet. Be the first to leave one!</p>
                    )}
                </div>
            </div>
        </div>
    );
} 
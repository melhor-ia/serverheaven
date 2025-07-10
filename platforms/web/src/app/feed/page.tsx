"use client";

import { useState, useEffect } from 'react';
import { Post } from '@/lib/types';
import { getFunctions, httpsCallable } from 'firebase/functions';
import PostCard from '../components/PostCard'; // Adjusted path
import PostForm from '../components/PostForm'; // Add this import
import { useAuth } from '../contexts/AuthContext'; // Assuming useAuth provides user info

const FeedPage = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth(); // Get user for authentication checks

    const fetchPosts = async () => {
        try {
            const functions = getFunctions();
            // Note: Ensure your Cloud Function for getting posts is named 'api-posts-get' or adjust as needed.
            // Or if you have a single 'api' function that routes based on method/path,
            // you might not need to change the function name here.
            const getPostsCallable = httpsCallable(functions, 'api');
            const result = await getPostsCallable({ route: 'posts', method: 'GET' });

            if (Array.isArray(result.data)) {
                setPosts(result.data as Post[]);
            } else {
                console.error("Expected an array of posts, but received:", result.data);
                setPosts([]);
            }
        } catch (err) {
            console.error("Error fetching posts:", err);
            setError('Failed to load posts.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleLike = async (postId: string) => {
        if (!user) {
            alert("You must be logged in to like a post.");
            return;
        }
        try {
            const functions = getFunctions();
            const likePostCallable = httpsCallable(functions, 'api');
            await likePostCallable({ route: `posts/${postId}/like`, method: 'POST' });
            // Refresh posts to show updated like count
            fetchPosts(); 
        } catch (err) {
            console.error("Error liking post:", err);
            alert("Failed to like the post.");
        }
    };

    const handleComment = async (postId: string, content: string) => {
        if (!user) {
            alert("You must be logged in to comment.");
            return;
        }
        try {
            const functions = getFunctions();
            const commentOnPostCallable = httpsCallable(functions, 'api');
            await commentOnPostCallable({ route: `posts/${postId}/comment`, method: 'POST', data: { content } });
            // Refresh posts to show new comment
            fetchPosts();
        } catch (err) {
            console.error("Error commenting on post:", err);
            alert("Failed to post comment.");
        }
    };

    if (loading) return <p className="text-center mt-8">Loading feed...</p>;
    if (error) return <p className="text-center mt-8 text-red-500">{error}</p>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4 text-center">Feed</h1>
            <PostForm onPostCreated={fetchPosts} />
            <div className="space-y-4 mt-8">
                {posts.length > 0 ? (
                    posts.map(post => (
                        <PostCard 
                            key={post.id} 
                            post={post}
                            onLike={handleLike}
                            onComment={handleComment}
                        />
                    ))
                ) : (
                    <p className="text-center">No posts in the feed yet.</p>
                )}
            </div>
        </div>
    );
};

export default FeedPage; 
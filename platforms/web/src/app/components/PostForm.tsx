"use client";

import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getFunctions, httpsCallable } from 'firebase/functions';

interface PostFormProps {
    onPostCreated: () => void;
}

const PostForm = ({ onPostCreated }: PostFormProps) => {
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim() || !user) {
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const functions = getFunctions();
            const createPostCallable = httpsCallable(functions, 'api');
            await createPostCallable({
                route: 'posts',
                method: 'POST',
                data: { 
                    content,
                    type: 'update', // Defaulting to 'update', could be dynamic
                }
            });
            setContent('');
            onPostCreated(); // Callback to refresh the feed
        } catch (err) {
            console.error("Error creating post:", err);
            setError("Failed to create post.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!user) {
        return <p className="text-center text-gray-400">Please log in to create a post.</p>;
    }

    return (
        <div className="bg-gray-800 shadow-md rounded-lg p-4 my-4 w-full max-w-2xl mx-auto">
            <form onSubmit={handleSubmit}>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="What's on your mind?"
                    className="bg-gray-700 text-white w-full rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    rows={4}
                    required
                />
                <div className="flex justify-end items-center mt-2">
                    {error && <p className="text-red-500 mr-4">{error}</p>}
                    <button 
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-full disabled:bg-gray-500"
                    >
                        {isSubmitting ? 'Posting...' : 'Post'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PostForm; 
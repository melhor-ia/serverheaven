"use client";

import { useState, FormEvent, useEffect } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { Button } from './ui/Button';
import { useAuth } from '@/app/contexts/AuthContext';
import { getFunctions, httpsCallable } from 'firebase/functions';

// Updated comment data structure to match API response
interface Comment {
    id: string;
    author: {
        display_name: string;
        avatar_url: string | null;
    };
    content: string;
    created_at: {
        _seconds: number;
        _nanoseconds: number;
    };
}

interface CommentSectionProps {
    postId: string;
}

export const CommentSection = ({ postId }: CommentSectionProps) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { currentUser } = useAuth();

    useEffect(() => {
        const fetchComments = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const functions = getFunctions();
                const getComments = httpsCallable(functions, 'api');
                const response = await getComments({ route: `posts/${postId}/comments`, method: 'GET' });
                setComments(response.data as Comment[]);
            } catch (err) {
                console.error("Error fetching comments:", err);
                setError("Could not load comments.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchComments();
    }, [postId]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!newComment.trim() || !currentUser) return;

        try {
            const token = await currentUser.getIdToken();
            const functions = getFunctions();
            // This assumes your callable function is named 'api' and it routes requests
            const postCommentCallable = httpsCallable(functions, 'api');

            await postCommentCallable({
                route: `posts/${postId}/comment`,
                method: 'POST',
                data: { content: newComment },
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            // The API should return the new comment object, including author info.
            // Let's assume the callable function itself doesn't return the needed data,
            // so we'll create it on the client-side for immediate feedback.
            const newCommentData: Comment = {
                id: new Date().toISOString(), // Temporary ID, API should provide the real one
                content: newComment,
                author: {
                    display_name: currentUser.displayName || "You",
                    avatar_url: currentUser.photoURL,
                },
                created_at: { // Mocking timestamp for optimistic update
                    _seconds: Math.floor(Date.now() / 1000),
                    _nanoseconds: 0
                }
            };

            setComments([...comments, newCommentData]);
            setNewComment('');
        } catch (err) {
            console.error("Error posting comment:", err);
            // Optionally show an error to the user
        }
    };

    return (
        <div className="border-t border-gray-700 mt-4 pt-4">
            {/* Comment Form */}
            <form onSubmit={handleSubmit} className="flex items-start space-x-3 mb-6">
                <FaUserCircle className="h-8 w-8 text-muted-foreground mt-1" />
                <div className="flex-1">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder={currentUser ? "Add a comment..." : "You must be logged in to comment."}
                        className="w-full bg-gray-800 border border-gray-600 rounded-lg p-2 focus:ring-emerald-500 focus:border-emerald-500 transition text-sm"
                        rows={2}
                        disabled={!currentUser}
                    />
                    <div className="flex justify-end mt-2">
                        <Button type="submit" size="sm" disabled={!currentUser || !newComment.trim()}>
                            Comment
                        </Button>
                    </div>
                </div>
            </form>

            {/* Comments List */}
            {isLoading && <p>Loading comments...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {!isLoading && !error && (
                 <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                    {comments.map((comment) => (
                        <div key={comment.id} className="flex items-start space-x-3 text-sm">
                            <FaUserCircle className="h-8 w-8 text-muted-foreground" />
                            <div className="flex-1 bg-gray-800/50 rounded-lg p-3">
                                <div className="flex items-center gap-2">
                                    <p className="font-bold text-white">{comment.author.display_name}</p>
                                    <p className="text-xs text-muted-foreground">
                                        · {new Date(comment.created_at._seconds * 1000).toLocaleDateString()}
                                    </p>
                                </div>
                                <p className="text-foreground mt-1">{comment.content}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}; 
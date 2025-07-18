"use client";

import NextImage from 'next/image';
import { Post } from '@/lib/types';
import { FaUserCircle, FaHeart, FaComment } from 'react-icons/fa';
import { useAuth } from '@/app/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { CommentSection } from './CommentSection';
import { AnimatePresence, motion } from 'framer-motion';

interface PostCardProps {
    post: Post;
    onCardClick?: () => void;
}

const PostCard = ({ post, onCardClick }: PostCardProps) => {
    const { currentUser } = useAuth();
    const [likeCount, setLikeCount] = useState(post.likes || 0);
    // We'd need to know if the user has already liked this post.
    // This information should ideally come from the API in the initial post fetch.
    // For now, we'll optimistically manage this on the client.
    const [isLiked, setIsLiked] = useState(false);

    // Persist liked posts in localStorage, scoped per user id
    useEffect(() => {
        if (!currentUser) return;

        try {
            const likedKey = `likedPosts_${currentUser.uid}`;
            const stored = localStorage.getItem(likedKey);
            if (stored) {
                const likedIds: string[] = JSON.parse(stored);
                setIsLiked(likedIds.includes(post.id));
            }
        } catch (err) {
            console.error('Failed to read liked posts from localStorage', err);
        }
    }, [currentUser, post.id]);

    const [commentsVisible, setCommentsVisible] = useState(false);
    const postDate = post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Some time ago';

    const handleLike = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!currentUser) {
            // TODO: Prompt user to login
            console.log("Not logged in");
            return;
        }

        const originalLikedState = isLiked;
        const originalLikeCount = likeCount;

        // Optimistic update
        const nextLikedState = !isLiked;
        setIsLiked(nextLikedState);
        setLikeCount(likeCount + (nextLikedState ? 1 : -1));

        // Update localStorage optimistically
        if (currentUser) {
            const likedKey = `likedPosts_${currentUser.uid}`;
            try {
                const stored = localStorage.getItem(likedKey);
                let likedIds: string[] = stored ? JSON.parse(stored) : [];

                if (nextLikedState) {
                    if (!likedIds.includes(post.id)) {
                        likedIds.push(post.id);
                    }
                } else {
                    likedIds = likedIds.filter(id => id !== post.id);
                }

                localStorage.setItem(likedKey, JSON.stringify(likedIds));
            } catch (err) {
                console.error('Failed to update localStorage liked posts', err);
            }
        }

        try {
            const token = await currentUser.getIdToken();
            const response = await fetch(`/api/posts/${post.id}/like`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                // Revert on error
                setIsLiked(originalLikedState);
                setLikeCount(originalLikeCount);

                // Revert localStorage change
                if (currentUser) {
                    const likedKey = `likedPosts_${currentUser.uid}`;
                    try {
                        if (originalLikedState) {
                            // Should be liked
                            const stored = localStorage.getItem(likedKey);
                            const likedIds: string[] = stored ? JSON.parse(stored) : [];
                            if (!likedIds.includes(post.id)) {
                                likedIds.push(post.id);
                                localStorage.setItem(likedKey, JSON.stringify(likedIds));
                            }
                        } else {
                            // Should be unliked
                            const stored = localStorage.getItem(likedKey);
                            if (stored) {
                                const likedIds: string[] = JSON.parse(stored).filter((id: string) => id !== post.id);
                                localStorage.setItem(likedKey, JSON.stringify(likedIds));
                            }
                        }
                    } catch (err) {
                        console.error('Failed to revert localStorage liked posts', err);
                    }
                }
                console.error("Failed to update like status");
            }
        } catch (error) {
            // Revert on error
            setIsLiked(originalLikedState);
            setLikeCount(originalLikeCount);

            if (currentUser) {
                const likedKey = `likedPosts_${currentUser.uid}`;
                try {
                    if (originalLikedState) {
                        const stored = localStorage.getItem(likedKey);
                        const likedIds: string[] = stored ? JSON.parse(stored) : [];
                        if (!likedIds.includes(post.id)) {
                            likedIds.push(post.id);
                            localStorage.setItem(likedKey, JSON.stringify(likedIds));
                        }
                    } else {
                        const stored = localStorage.getItem(likedKey);
                        if (stored) {
                            const likedIds: string[] = JSON.parse(stored).filter((id: string) => id !== post.id);
                            localStorage.setItem(likedKey, JSON.stringify(likedIds));
                        }
                    }
                } catch (err) {
                    console.error('Failed to revert localStorage liked posts', err);
                }
            }
            console.error("Error liking post:", error);
        }
    };


    return (
        <div 
            className="postcard-panel rounded-lg p-4 sm:p-6 my-4 w-full max-w-2xl mx-auto cursor-pointer"
            onClick={() => {
                onCardClick?.();
                setCommentsVisible(!commentsVisible);
            }}
        >
            <div className="flex items-start space-x-4">
                {post.author && post.author.avatar_url ? (
                    <NextImage 
                        src={post.author.avatar_url} 
                        alt={post.author.display_name || 'author avatar'} 
                        width={40}
                        height={40}
                        className="h-10 w-10 rounded-full object-cover" 
                    />
                ) : (
                    <FaUserCircle className="text-muted-foreground h-10 w-10" />
                )}
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <p className="font-bold text-white">{post.author ? post.author.display_name : 'Anonymous'}</p>
                        <p className="text-sm text-muted-foreground">· {postDate}</p>
                    </div>
                    <div 
                      className="prose prose-sm prose-invert max-w-none text-foreground mt-2"
                      dangerouslySetInnerHTML={{ __html: post.content }} 
                    />
                    <div className="mt-4 flex items-center gap-4">
                        <button onClick={handleLike} className="flex items-center gap-2 text-muted-foreground hover:text-red-500 transition-colors">
                            <FaHeart className={isLiked ? "text-red-500" : ""} />
                            <span>{likeCount}</span>
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); setCommentsVisible(!commentsVisible); }} className="flex items-center gap-2 text-muted-foreground hover:text-emerald-500 transition-colors">
                            <FaComment />
                            <span>{post.commentCount || 0}</span>
                        </button>
                    </div>
                     <AnimatePresence>
                        {commentsVisible && (
                            <motion.div
                                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                animate={{ opacity: 1, height: 'auto', marginTop: '16px' }}
                                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                className="overflow-hidden"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <CommentSection postId={post.id} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default PostCard; 
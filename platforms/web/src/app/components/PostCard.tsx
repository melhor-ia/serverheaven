"use client";

import NextImage from 'next/image';
import { Post } from '@/lib/types';
import { FaUserCircle, FaHeart, FaComment } from 'react-icons/fa';
import { useAuth } from '@/app/contexts/AuthContext';
import { useState } from 'react';
import { CommentSection } from './CommentSection';
import { AnimatePresence, motion } from 'framer-motion';

interface PostCardProps {
    post: Post;
}

const PostCard = ({ post }: PostCardProps) => {
    const { currentUser } = useAuth();
    const [likeCount, setLikeCount] = useState(post.likes || 0);
    // We'd need to know if the user has already liked this post.
    // This information should ideally come from the API in the initial post fetch.
    // For now, we'll optimistically manage this on the client.
    const [isLiked, setIsLiked] = useState(false); 
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
        setIsLiked(!isLiked);
        setLikeCount(likeCount + (!isLiked ? 1 : -1));

        try {
            const token = await currentUser.getIdToken();
            const response = await fetch(`http://127.0.0.1:5001/server-heaven-c6fb1/us-central1/api/posts/${post.id}/like`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                // Revert on error
                setIsLiked(originalLikedState);
                setLikeCount(originalLikeCount);
                console.error("Failed to update like status");
            }
        } catch (error) {
            // Revert on error
            setIsLiked(originalLikedState);
            setLikeCount(originalLikeCount);
            console.error("Error liking post:", error);
        }
    };


    return (
        <div 
            className="postcard-panel rounded-lg p-4 sm:p-6 my-4 w-full max-w-2xl mx-auto cursor-pointer"
            onClick={() => setCommentsVisible(!commentsVisible)}
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
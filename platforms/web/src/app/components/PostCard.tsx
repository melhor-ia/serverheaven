"use client";

import { Post } from '@/lib/types';
import { FaHeart, FaComment, FaUserCircle } from 'react-icons/fa';
import { useState } from 'react';
import Image from 'next/image';

interface PostCardProps {
    post: Post;
    onLike: (postId: string) => Promise<void>;
    onComment: (postId: string, content: string) => Promise<void>;
}

const PostCard = ({ post, onLike, onComment }: PostCardProps) => {
    const [comment, setComment] = useState('');

    const handleCommentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (comment.trim()) {
            onComment(post.id, comment);
            setComment('');
        }
    };

    const postDate = post.created_at ? new Date(post.created_at._seconds * 1000).toLocaleDateString() : 'Some time ago';

    return (
        <div className="bg-gray-800 shadow-md rounded-lg p-4 my-4 w-full max-w-2xl mx-auto">
            <div className="flex items-center mb-4">
                <FaUserCircle className="text-gray-400 mr-3" size={40} />
                <div>
                    <p className="font-bold text-white">{post.author_user_id || post.author_server_id || 'Anonymous'}</p>
                    <p className="text-sm text-gray-400">{postDate}</p>
                </div>
            </div>

            <p className="text-gray-300 mb-4">{post.content}</p>

            {post.media_urls && post.media_urls.length > 0 && (
                <div className="relative mb-4 h-96">
                    {/* Placeholder for media content */}
                    <Image src={post.media_urls[0]} alt="Post media" fill className="rounded-lg object-cover" />
                </div>
            )}
            
            <div className="flex justify-between items-center text-gray-400">
                <div className="flex items-center">
                    <button onClick={() => onLike(post.id)} className="flex items-center space-x-2 hover:text-red-500">
                        <FaHeart /> 
                        <span>{post.like_count}</span>
                    </button>
                </div>
                <div className="flex items-center space-x-2">
                    <FaComment />
                    <span>{post.comment_count}</span>
                </div>
            </div>

            <div className="mt-4">
                <form onSubmit={handleCommentSubmit} className="flex items-center">
                    <input
                        type="text"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Add a comment..."
                        className="bg-gray-700 text-white w-full rounded-full py-2 px-4 focus:outline-none"
                    />
                    <button type="submit" className="ml-2 text-indigo-400 hover:text-indigo-300">
                        Post
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PostCard; 
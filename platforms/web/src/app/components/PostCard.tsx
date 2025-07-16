"use client";

import { Post } from '@/lib/types';
import { FaUserCircle } from 'react-icons/fa';

interface PostCardProps {
    post: Post;
}

const PostCard = ({ post }: PostCardProps) => {
    const postDate = post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Some time ago';

    return (
        <div className="postcard-panel rounded-lg p-4 sm:p-6 my-4 w-full max-w-2xl mx-auto">
            <div className="flex items-start space-x-4">
                {post.author && post.author.avatar_url ? (
                    <img src={post.author.avatar_url} alt={post.author.display_name || 'author avatar'} className="h-10 w-10 rounded-full object-cover" />
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
                </div>
            </div>
        </div>
    );
};

export default PostCard; 
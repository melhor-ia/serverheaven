// Based on the backend interfaces

export interface User {
    id: string;
    username: string;
    display_name: string;
    avatar_url: string;
    cover_url: string;
    bio: string;
    tags: string[];
    rating: {
        average: number;
        count: number;
    };
    is_supporter: boolean;
    created_at: string;
}

export interface Server {
    id: string;
    name: string;
    avatar_url: string;
}

export interface Post {
    id: string;
    author: User;
    content: string;
    likes: number;
    commentCount: number;
    createdAt: Date;
    server?: Server;
}

// Props for PostCard component
export interface PostCardProps {
    post: Post;
    onLike: (postId: string) => void;
    onComment: (postId: string) => void;
}

export interface Interaction {
    id: string;
    post_id: string;
    user_id: string;
    type: 'like' | 'comment';
    content?: string;
    created_at: {
        _seconds: number;
        _nanoseconds: number;
    };
} 
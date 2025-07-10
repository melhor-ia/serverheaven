// Based on the backend interfaces

export interface Post {
    id: string;
    author_user_id?: string;
    author_server_id?: string;
    content: string;
    media_urls: string[];
    tags: string[];
    created_at: {
        _seconds: number;
        _nanoseconds: number;
    };
    updated_at: {
        _seconds: number;
        _nanoseconds: number;
    };
    status: 'active' | 'flagged' | 'removed';
    type: 'update' | 'event' | 'recruitment' | 'media';
    like_count: number;
    comment_count: number;
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
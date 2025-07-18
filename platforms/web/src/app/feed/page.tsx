"use client";

import { useEffect, useState } from 'react';
import { Rss } from 'lucide-react';
import AppHeader from '@/app/components/AppHeader';
import PostCard from '@/app/components/PostCard';
import { Post } from '@/lib/types';
import { useAuth } from '@/app/contexts/AuthContext';
import dynamic from 'next/dynamic';
import { ProfileSidebar } from '../components/ProfileSidebar';
import { AnimatePresence, motion } from 'framer-motion';

const PostForm = dynamic(() => import('@/app/components/PostForm'), { ssr: false });

const FeedPage = () => {
    const { currentUser } = useAuth();
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);

    useEffect(() => {
        const fetchFeedData = async () => {
            setLoading(true);
            setError(null);
            try {
                const postsResponse = await fetch('/api/posts');
                if (!postsResponse.ok) {
                    throw new Error('Failed to fetch posts');
                }
                const { data: fetchedPosts }: { data: Post[] } = await postsResponse.json();
                setPosts(fetchedPosts);

                document.title = `Server Heaven | Feed`;
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchFeedData();
    }, []);

    if (loading) {
        return <div>Loading...</div>; // TODO: Create a proper loading skeleton
    }

    if (error) {
        return <div>Error: {error}</div>; // TODO: Create a proper error component
    }

    const handlePostCreated = async () => {
        try {
            const postsResponse = await fetch('/api/posts');
            if (postsResponse.ok) {
                const { data: fetchedPosts }: { data: Post[] } = await postsResponse.json();
                setPosts(fetchedPosts);
            } else {
                console.error('Failed to refetch posts');
            }
        } catch (error) {
            console.error('Error refetching posts:', error);
        }
    };

    const handleCardClick = (post: Post) => {
        setSelectedPost(post);
    };

    const handleCloseSidebar = () => {
        setSelectedPost(null);
    };

    return (
        <div className="bg-background text-foreground min-h-screen">
            <AppHeader />
            <AnimatePresence>
                {selectedPost && (
                     <motion.div
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    >
                        <ProfileSidebar post={selectedPost} onClose={handleCloseSidebar} />
                    </motion.div>
                )}
            </AnimatePresence>
            <motion.main 
                className="relative z-10 pt-20"
                animate={{ marginLeft: selectedPost ? '320px' : '0px' }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
                <div className="px-4 sm:px-6 lg:px-8 pt-8">
                    <div className="flex flex-col md:flex-row gap-8 justify-center">

                        {/* Main content */}
                        <div className="flex-1 max-w-2xl mx-auto">
                            <div className="space-y-4">
                                {currentUser && (
                                    <PostForm
                                        onPostCreated={handlePostCreated}
                                        className="mb-4 border-2 border-dashed border-emerald-500/30 hover:border-emerald-500/60 transition-colors"
                                    />
                                )}
                                {posts.length > 0 ? (
                                    posts.map(post => (
                                        <PostCard
                                            key={post.id}
                                            post={post}
                                            onCardClick={() => handleCardClick(post)}
                                        />
                                    ))
                                ) : (
                                    <div className="text-center text-muted-foreground py-20 hud-panel rounded-lg">
                                        <div className="inline-block p-4 bg-black/20 rounded-full border border-border mb-4">
                                            <Rss className="h-10 w-10" />
                                        </div>
                                        <p className="text-lg font-bold">The feed is empty.</p>
                                        <p>Be the first to post something!</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <footer className="text-center p-8 text-muted-foreground font-mono text-xs mt-16">
                    ServerHeaven v0.1.0 - All rights reserved.
                </footer>
            </motion.main>
        </div>
    );
};

export default FeedPage; 
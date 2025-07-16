"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/Button';
import { UserPlus, MessageSquare, Server, Star, Rss, Calendar, Diamond, ShieldCheck, Zap, ChevronLeft, ChevronRight } from 'lucide-react';
import AppHeader from '@/app/components/AppHeader';
import PostCard from '@/app/components/PostCard';
import { User, Post } from '@/lib/types';
import { cn } from '@/lib/utils';
import { AnimatedGridBackground } from '@/app/components/ui/AnimatedGridBackground';


type ProfileUser = User & {
    stats: { servers: number; reviews: number; posts: number };
    badges: (keyof typeof badgeDetails)[];
};


type BadgeType = {
    name: 'Supporter' | 'Angel' | 'Pioneer';
    icon: React.ElementType;
    color: string;
    description: string;
};

const badgeDetails: Record<string, BadgeType> = {
    supporter: { name: 'Supporter', icon: Diamond, color: 'text-amber-400', description: 'Recognizes users who financially support the platform.' },
    angel: { name: 'Angel', icon: ShieldCheck, color: 'text-sky-400', description: 'Awarded to the first 100 beta testers.' },
    pioneer: { name: 'Pioneer', icon: Zap, color: 'text-rose-500', description: 'Granted to users who joined within the first week of launch.' },
};

const mockPosts: Post[] = [
    {
        id: 'post1',
        author: { // This will need to be updated once we have real post author data
            id: 'nathan',
            username: 'nathan',
            display_name: 'Nathan',
            avatar_url: 'https://i.pravatar.cc/150?u=nathan',
            cover_url: 'https://i.pravatar.cc/150?u=nathan',
            bio: "Just a guy who loves to build.",
            tags: ["builder", "redstone"],
            rating: {
                average: 4.8,
                count: 120
            },
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        },
        content: 'Just finished the main structure for the new hub on my server. It\'s looking massive! Will post screenshots soon. #minecraft #building',
        likes: 132,
        commentCount: 14,
        createdAt: new Date('2024-07-20T18:30:00Z'),
        server: {
            id: 'server1',
            name: 'ChaosCraft',
            avatar_url: 'https://i.pravatar.cc/150?u=chaoscraft'
        }
    },
    {
        id: 'post2',
        author: { // This will also need to be updated
            id: 'nathan',
            username: 'nathan',
            display_name: 'Nathan',
            avatar_url: 'https://i.pravatar.cc/150?u=nathan',
            cover_url: 'https://i.pravatar.cc/150?u=nathan',
            bio: "Just a guy who loves to build.",
            tags: ["builder", "redstone"],
            rating: {
                average: 4.8,
                count: 120
            },
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        },
        content: 'Thinking about starting a new series on YouTube exploring weird Minecraft seeds. What do you all think? Any cool seeds I should check out?',
        likes: 256,
        commentCount: 42,
        createdAt: new Date('2024-07-19T12:00:00Z'),
    },
];

const StatItem = ({ value, label, icon: Icon }: { value: string | number; label: string, icon: React.ElementType }) => (
    <div className="flex items-center gap-2 text-sm text-muted-foreground font-mono group">
        <Icon className="h-4 w-4 text-emerald-400/50 transition-colors group-hover:text-emerald-400" />
        <span className="font-bold text-white transition-colors group-hover:text-white">{value}</span>
        <span className="transition-colors group-hover:text-white/80">{label}</span>
    </div>
);

const ProfileHeader = ({ user }: { user: ProfileUser }) => (
    <header className="relative h-[40vh] min-h-[300px] w-full mb-8">
        <div className="absolute inset-0 h-full w-full">
            {user.cover_url ? (
                <img src={user.cover_url} alt={`${user.display_name}'s cover`} className="h-full w-full object-cover" />
            ) : (
                <div className="h-full w-full">
                    <AnimatedGridBackground />
                </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        </div>

        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-full px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
                <div className="relative h-32 w-32 md:h-40 md:w-40 rounded-full border-4 border-background bg-background flex-shrink-0 shadow-lg -mt-12 md:-mt-0">
                    <img src={user.avatar_url} alt={`${user.display_name}'s avatar`} className="w-full h-full rounded-full object-cover" />
                </div>

                <div className="flex-grow flex flex-col md:flex-row justify-between items-center md:items-start w-full text-center md:text-left pt-4">
                    <div className="w-full">
                        <div className="flex flex-col md:flex-row justify-between items-center">
                            <div>
                        <h1 className="text-4xl font-bold text-white hud-text-glow font-mono">{user.display_name}</h1>
                        <p className="text-muted-foreground font-mono text-lg">@{user.username}</p>
                    </div>
                    <div className="flex gap-3 mt-4 md:mt-0">
                        <Button size="lg" className="bg-white/10 border border-white/20 text-white backdrop-blur-sm hover:bg-white/20">
                            <UserPlus className="mr-2 h-5 w-5" /> Follow
                        </Button>
                        <Button size="lg" className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 backdrop-blur-sm hover:bg-emerald-500/30">
                            <MessageSquare className="mr-2 h-5 w-5" /> Message
                        </Button>
                            </div>
                        </div>
                        <div className="w-full h-px bg-border my-4"></div>
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-2">
                            <StatItem value={user.stats.servers} label="Servers" icon={Server} />
                            <StatItem value={user.stats.posts} label="Posts" icon={Rss} />
                            <StatItem value={user.stats.reviews} label="Reviews" icon={MessageSquare} />
                             <div className="flex items-center gap-2 text-sm text-muted-foreground font-mono group">
                                <Star className="h-4 w-4 text-yellow-400/80 transition-colors group-hover:text-yellow-400 fill-yellow-400/50 group-hover:fill-yellow-400" />
                                <span className="font-bold text-white transition-colors group-hover:text-white">{user.rating.average}</span>
                                <span className="transition-colors group-hover:text-white/80">({user.rating.count} ratings)</span>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </header>
);

const ProfilePage = () => {
    const params = useParams();
    const userId = params.userId as string;

    const [user, setUser] = useState<ProfileUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [activeTab, setActiveTab] = useState('Posts');
    const [hoveredBadge, setHoveredBadge] = useState<BadgeType | null>(null);
    const [carouselIndex, setCarouselIndex] = useState(0);

    useEffect(() => {
        if (!userId) return;

        const fetchUser = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`/api/users/profile/${userId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }
                const userData: User = await response.json();

                // Merge with mock data for fields not in backend yet
                const fullUser: ProfileUser = {
                    ...userData,
                    // MOCK DATA: These fields will be replaced by API data later
                    stats: {
                        servers: 3,
                        reviews: 28,
                        posts: 12,
                    },
                    badges: ['supporter', 'angel', 'pioneer'],
                };

                setUser(fullUser);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [userId]);

    if (loading) {
        return <div>Loading...</div>; // TODO: Create a proper loading skeleton
    }

    if (error) {
        return <div>Error: {error}</div>; // TODO: Create a proper error component
    }

    if (!user) {
        return <div>User not found.</div>;
    }

    const TABS = ['Posts', 'Servers', 'Reviews'];

    const aboutSections = [
        // Badges Section
        <div key="badges">
            <h2 className="text-xl font-bold font-mono uppercase tracking-wider mb-4 text-white">Badge Showcase</h2>
            <div className="flex flex-wrap gap-4 justify-start mb-4">
                {user.badges.map(id => {
                    const badge = badgeDetails[id];
                    const Icon = badge.icon;
                    return (
                        <div
                            key={id}
                            onMouseEnter={() => setHoveredBadge(badge)}
                            onMouseLeave={() => setHoveredBadge(null)}
                            className={cn("h-16 w-16 flex items-center justify-center rounded-lg bg-black/20 border-2 transition-all duration-200 cursor-pointer",
                                hoveredBadge?.name === badge.name ? `border-emerald-400 scale-110 shadow-glow` : 'border-border'
                            )}
                        >
                            <Icon className={cn("h-8 w-8 transition-colors", badge.color)} />
                        </div>
                    );
                })}
            </div>
            <div className="h-14 mt-2">
                {hoveredBadge && (
                    <div className="text-left animate-fade-in">
                        <h3 className={cn("text-lg font-bold font-mono", hoveredBadge.color)}>{hoveredBadge.name}</h3>
                        <p className="text-muted-foreground text-sm">{hoveredBadge.description}</p>
                    </div>
                )}
            </div>
        </div>,
        // About Section
        <div key="about">
            <h2 className="text-xl font-bold font-mono uppercase tracking-wider mb-4 text-white">About {user.display_name}</h2>
            <p className="text-muted-foreground text-base leading-relaxed">{user.bio}</p>
            <div className="flex items-center gap-2 mt-4 text-muted-foreground text-sm">
                <Calendar className="h-4 w-4" />
                <span>Joined on {new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
        </div>,
        // Tags Section
        <div key="tags">
            <h2 className="text-xl font-bold font-mono uppercase tracking-wider mb-4 text-white">Tags</h2>
            <div className="flex flex-wrap gap-2">
                {user.tags.map(tag => (
                    <Badge key={tag} className="bg-emerald-900 border border-emerald-700 text-emerald-300 text-sm font-mono px-3 py-1">
                        {tag}
                    </Badge>
                ))}
            </div>
        </div>
    ];

    const handlePrev = () => {
        setCarouselIndex(prev => (prev === 0 ? aboutSections.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setCarouselIndex(prev => (prev === aboutSections.length - 1 ? 0 : prev + 1));
    };


    return (
        <div className="bg-background text-foreground min-h-screen">
            <AppHeader />
            <main className="relative z-10 pt-20">
                <ProfileHeader user={user} />
                
                <div className="px-4 sm:px-6 lg:px-8 mt-24">
                    {/* Mobile: Carousel for About sections */}
                    <div className="md:hidden hud-panel rounded-lg overflow-hidden p-6 mb-4 relative">
                        <div className="overflow-hidden">
                            <div className="flex transition-transform duration-300 ease-in-out" style={{ transform: `translateX(-${carouselIndex * 100}%)` }}>
                                {aboutSections.map((section, index) => (
                                    <div key={index} className="w-full flex-shrink-0 px-1">
                                        {section}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <Button onClick={handlePrev} size="icon" variant="ghost" className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50">
                            <ChevronLeft className="h-5 w-5" />
                        </Button>
                        <Button onClick={handleNext} size="icon" variant="ghost" className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50">
                             <ChevronRight className="h-5 w-5" />
                        </Button>
                    </div>

                    {/* Main content block */}
                    <div className="hud-panel rounded-lg overflow-hidden">
                        <div className="flex flex-col md:flex-row">
                            {/* Desktop: Sidebar */}
                            <div className="hidden md:block w-[350px] flex-shrink-0 p-6 space-y-6">
                               {aboutSections[0]}
                               <div className="w-full h-px bg-border/50"></div>
                               {aboutSections[1]}
                               <div className="w-full h-px bg-border/50"></div>
                               {aboutSections[2]}
                            </div>

                             {/* Custom Divider for Desktop */}
                            <div className="hidden md:block w-px bg-emerald-700/30 self-stretch my-8"></div>

                            {/* Tabs and Content */}
                            <div className="flex-1 flex flex-col">
                                <div className="p-4 border-b border-border">
                                    <nav className="flex space-x-2">
                                        {TABS.map(tab => (
                                            <button 
                                                key={tab}
                                                onClick={() => setActiveTab(tab)}
                                                className={`font-mono uppercase tracking-wider px-4 py-2 rounded-md text-sm transition-colors ${activeTab === tab ? 'bg-emerald-500/20 text-emerald-300' : 'text-muted-foreground hover:bg-white/10 hover:text-white'}`}
                                            >
                                                {tab}
                                            </button>
                                        ))}
                                    </nav>
                                </div>
                                <div className="p-4 flex-1">
                                     {activeTab === 'Posts' && (
                                         <div className="space-y-4">
                                             {mockPosts.map(post => (
                                                 <PostCard 
                                                    key={post.id} 
                                                    post={post}
                                                    onLike={async () => {}}
                                                    onComment={async () => {}}
                                                 />
                                             ))}
                                         </div>
                                     )}
                                     {activeTab !== 'Posts' && (
                                         <div className="text-center text-muted-foreground py-20">
                                            <div className="inline-block p-4 bg-black/20 rounded-full border border-border mb-4">
                                                {activeTab === 'Servers' && <Server className="h-10 w-10" />}
                                                {activeTab === 'Reviews' && <Star className="h-10 w-10" />}
                                            </div>
                                            <p className="text-lg font-bold">Content for {activeTab} is not available yet.</p>
                                            <p>Check back later!</p>
                                        </div>
                                     )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                 <footer className="text-center p-8 text-muted-foreground font-mono text-xs mt-16">
                    ServerHeaven v0.1.0 - All rights reserved.
                </footer>
            </main>
        </div>
    );
};

export default ProfilePage; 
"use client";

import { Post, User } from "@/lib/types"; // Import User
import { Calendar, Diamond, ShieldCheck, X, Zap } from "lucide-react"; // Import icons
import { FaUserCircle } from "react-icons/fa";
import { Button } from "./ui/Button";
import NextImage from 'next/image';
import Link from "next/link";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils"; // Import cn
import { useState } from "react"; // Import useState

// Mock badge data as in the profile page
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


// Mock user with badges for demonstration
type ProfileUser = User & {
    badges: (keyof typeof badgeDetails)[];
};


interface ProfileSidebarProps {
    post: Post;
    onClose: () => void;
}

export const ProfileSidebar = ({ post, onClose }: ProfileSidebarProps) => {
    const [hoveredBadge, setHoveredBadge] = useState<BadgeType | null>(null);

    if (post.author.type !== 'user') {
        return (
            <div className="fixed top-0 left-0 h-full w-80 bg-background border-r border-border z-30 flex flex-col">
                <div className="p-4 flex justify-between items-center border-b border-border">
                    <h2 className="font-bold text-lg">Author Information</h2>
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X className="h-5 w-5" />
                    </Button>
                </div>
                <div className="flex-1 p-6 flex flex-col items-center justify-center text-center">
                     {post.author.avatar_url ? (
                        <NextImage
                            src={post.author.avatar_url}
                            alt={post.author.name || 'server avatar'}
                            width={96}
                            height={96}
                            className="h-24 w-24 rounded-full object-cover mb-4"
                        />
                    ) : (
                        <FaUserCircle className="text-muted-foreground h-24 w-24 mb-4" />
                    )}
                    <h3 className="text-xl font-bold text-white">{post.author.name}</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                        This post was made by a server. Full server profiles are not yet available.
                    </p>
                </div>
            </div>
        );
    }

    // This is now safe because we've handled the 'server' case.
    const author = post.author as unknown as ProfileUser;
    
    // Add mock badges to the author object
    if (author) {
        author.badges = ['supporter', 'angel', 'pioneer'];
    }

    return (
        <div className="fixed top-0 left-0 h-full w-80 bg-background border-r border-border z-30 flex flex-col">
            <div className="p-4 flex justify-between items-center border-b border-border">
                <h2 className="font-bold text-lg">Profile Preview</h2>
                <Button variant="ghost" size="icon" onClick={onClose}>
                    <X className="h-5 w-5" />
                </Button>
            </div>
            <div className="flex-1 p-6 flex flex-col overflow-y-auto">
                {author ? (
                    <>
                        <div className="flex flex-col items-center text-center">
                            {author.avatar_url ? (
                                <NextImage
                                    src={author.avatar_url}
                                    alt={author.display_name || 'author avatar'}
                                    width={96}
                                    height={96}
                                    className="h-24 w-24 rounded-full object-cover mb-4"
                                />
                            ) : (
                                <FaUserCircle className="text-muted-foreground h-24 w-24 mb-4" />
                            )}
                            <h3 className="text-xl font-bold text-white">{author.display_name}</h3>
                            <p className="text-sm text-muted-foreground mb-4">@{author.username || 'username'}</p>
                        </div>

                        <div className="space-y-6 w-full mt-6 text-left">
                            <div>
                                <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-2">Badges</h4>
                                <div className="flex flex-wrap gap-2">
                                    {author.badges.map(id => {
                                        const badge = badgeDetails[id];
                                        const Icon = badge.icon;
                                        return (
                                            <div
                                                key={id}
                                                onMouseEnter={() => setHoveredBadge(badge)}
                                                onMouseLeave={() => setHoveredBadge(null)}
                                                className={cn("h-12 w-12 flex items-center justify-center rounded-lg bg-black/20 border-2 transition-all duration-200 cursor-pointer",
                                                    hoveredBadge?.name === badge.name ? `border-emerald-400 scale-110 shadow-glow` : 'border-border'
                                                )}
                                            >
                                                <Icon className={cn("h-6 w-6 transition-colors", badge.color)} />
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="h-12 mt-2">
                                    {hoveredBadge && (
                                        <div className="animate-fade-in">
                                            <h3 className={cn("text-md font-bold font-mono", hoveredBadge.color)}>{hoveredBadge.name}</h3>
                                            <p className="text-muted-foreground text-xs">{hoveredBadge.description}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {author.bio && (
                                <div>
                                    <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-2">About</h4>
                                    <p className="text-sm text-foreground/80 break-words">{author.bio}</p>
                                </div>
                            )}

                            {author.tags && author.tags.length > 0 && (
                                <div>
                                    <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-2">Tags</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {author.tags.map((tag) => (
                                            <Badge key={tag} variant="secondary">{tag}</Badge>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                <Calendar className="h-4 w-4" />
                                <span>Joined on {new Date(author.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</span>
                            </div>
                        </div>


                        <div className="mt-auto pt-6 w-full">
                            <Button className="w-full" asChild>
                                <Link href={`/profile/${author.username}`}>View Full Profile</Link>
                            </Button>
                        </div>
                    </>
                ) : (
                    <div className="text-muted-foreground">
                        <p>No author information available.</p>
                    </div>
                )}
            </div>
             <div className="p-4 border-t border-border mt-auto">
                <p className="text-xs text-muted-foreground text-center">
                    This is a preview. More details will be available on the profile page.
                </p>
            </div>
        </div>
    );
}; 
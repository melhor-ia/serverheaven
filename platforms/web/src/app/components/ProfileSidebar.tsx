"use client";

import { Post } from "@/lib/types";
import { X } from "lucide-react";
import { FaUserCircle } from "react-icons/fa";
import { Button } from "./ui/Button";
import NextImage from 'next/image';

interface ProfileSidebarProps {
    post: Post;
    onClose: () => void;
}

export const ProfileSidebar = ({ post, onClose }: ProfileSidebarProps) => {
    // Placeholder content. This will be replaced with a real profile preview.
    const author = post.author;

    return (
        <div className="fixed top-0 left-0 h-full w-80 bg-background border-r border-border z-30 flex flex-col">
            <div className="p-4 flex justify-between items-center border-b border-border">
                <h2 className="font-bold text-lg">Profile Preview</h2>
                <Button variant="ghost" size="icon" onClick={onClose}>
                    <X className="h-5 w-5" />
                </Button>
            </div>
            <div className="flex-1 p-6 flex flex-col items-center text-center">
                {author ? (
                    <>
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
                        <p className="text-sm text-muted-foreground">@{author.username || 'username'}</p>
                        
                        <div className="mt-6 w-full">
                             <Button className="w-full">View Full Profile</Button>
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
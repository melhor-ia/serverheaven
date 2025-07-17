
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Button } from './ui/Button';
import { Rss, Search, Server, Bell, Mail, User, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Skeleton } from './ui/skeleton';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { auth } from '@/lib/firebase-config';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

const navLinks = [
    { href: '/feed', label: 'Feed', icon: Rss },
    { href: '/servers', label: 'Servers', icon: Server },
];

const AppHeader = () => {
    const pathname = usePathname();
    const { currentUser, loading } = useAuth();
    const [username, setUsername] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        if (currentUser) {
            fetch(`/api/users/id/${currentUser.uid}`)
                .then(res => res.json())
                .then(data => {
                    if (data && data.username) {
                        setUsername(data.username);
                    }
                })
                .catch(console.error);
        }
    }, [currentUser]);

    const handleSignOut = async () => {
        await auth.signOut();
        router.push('/beta/signin');
    };
    
    return (
        <header className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
            <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="flex items-center gap-8">
                        <Link href="/feed" className="flex items-center gap-2 text-2xl font-bold text-white font-mono hud-text-glow">
                            SH
                        </Link>
                        <nav className="hidden md:flex items-center gap-1 bg-black/20 p-1 rounded-lg border border-border">
                            {navLinks.map(({ href, label, icon: Icon }) => (
                                <Link key={href} href={href} passHref>
                                    <Button
                                        variant="ghost"
                                        className={`font-mono uppercase tracking-wider text-base transition-colors ${pathname === href ? 'bg-white/10 text-emerald-300' : 'text-muted-foreground hover:bg-white/5 hover:text-white'}`}
                                    >
                                        <Icon className="h-4 w-4 mr-2" />
                                        {label}
                                    </Button>
                                </Link>
                            ))}
                        </nav>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="group">
                             <Search className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-emerald-400" />
                        </Button>
                         <Button variant="ghost" size="icon" className="group">
                             <Bell className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-emerald-400" />
                        </Button>
                         <Button variant="ghost" size="icon" className="group">
                            <Mail className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-emerald-400" />
                        </Button>

                        <div className="w-px h-8 bg-border mx-2"></div>
                        
                        {loading ? (
                            <div className="flex items-center gap-3 p-2">
                                <Skeleton className="h-10 w-10 rounded-full" />
                                <div className="hidden lg:block space-y-2">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-3 w-16" />
                                </div>
                            </div>
                        ) : currentUser ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <div className="flex items-center gap-3 group cursor-pointer p-2 rounded-lg hover:bg-white/5 transition-colors">
                                        <Image 
                                            src={currentUser.photoURL || '/default-avatar.png'} 
                                            alt="User Avatar" 
                                            width={40}
                                            height={40}
                                            className="h-10 w-10 rounded-full border-2 border-border group-hover:border-emerald-500 transition-colors object-cover" 
                                        />
                                        <div className="text-left hidden lg:block">
                                            <p className="font-bold text-white group-hover:text-emerald-400 transition-colors">{currentUser.displayName}</p>
                                            <p className="text-xs font-mono text-muted-foreground">@{username || currentUser.email?.split('@')[0]}</p>
                                        </div>
                                    </div>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56 bg-background/80 backdrop-blur-lg border-border" align="end">
                                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link href={username ? `/profile/${username}` : ''} className={`cursor-pointer ${!username ? 'pointer-events-none' : ''}`}>
                                            <User className="mr-2 h-4 w-4" />
                                            <span>Profile</span>
                                        </Link>
                                        </DropdownMenuItem>
                                    <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>Sign Out</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                             <Link href="/beta/signin">
                                 <Button>Sign In</Button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default AppHeader; 
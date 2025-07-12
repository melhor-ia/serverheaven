"use client";

import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/badge';
import { AnimatedGridBackground } from '../../components/ui/AnimatedGridBackground';
import { UserCog, Send, TestTube, MessageSquare, ArrowRight, Users, Heart } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { functions } from '@/lib/firebase-config';
import { httpsCallable, HttpsCallableResult } from 'firebase/functions';

interface VerifyTokenResponse {
    success: boolean;
    email: string;
}

const CheckboxCard = ({ icon: Icon, title, description, checked, onChange }: { icon: React.ElementType, title: string, description: string, checked: boolean, onChange: () => void }) => (
    <div 
        className={`hud-panel p-6 rounded-xl transition-all duration-300 cursor-pointer ${checked ? 'shadow-hud-active border-emerald-400/80' : 'hover:shadow-hud-active'}`}
        onClick={onChange}
    >
        <div className="flex items-start gap-4">
            <div className={`p-2 rounded-lg border transition-colors ${checked ? 'bg-emerald-500/20 border-emerald-400/30' : 'bg-transparent border-border'}`}>
                <Icon className={`h-6 w-6 ${checked ? 'text-emerald-400' : 'text-muted-foreground'}`} />
            </div>
            <div>
                <h4 className="font-bold text-lg text-white font-mono">{title}</h4>
                <p className="text-muted-foreground text-sm">{description}</p>
            </div>
            <div className="ml-auto flex-shrink-0">
                <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${checked ? 'bg-emerald-500 border-emerald-400' : 'border-border'}`}>
                    {checked && <div className="w-3 h-3 rounded-sm bg-white" />}
                </div>
            </div>
        </div>
    </div>
);


export default function BetaProfileSetup() {
    const [step, setStep] = useState(1);
    const [contribution, setContribution] = useState<string[]>([]);
    const [discordUsername, setDiscordUsername] = useState('');
    const [contactEmail, setContactEmail] = useState(''); // Should be pre-filled
    const [isValidToken, setIsValidToken] = useState<boolean | null>(null);
    const searchParams = useSearchParams();

    useEffect(() => {
        const tokenFromUrl = searchParams.get('token');
        if (tokenFromUrl) {
            // Sanitize token: remove whitespace and trailing backslashes that might be added on copy-paste from some terminals.
            const token = tokenFromUrl.trim().replace(/\\+$/, '');

            const verifyBetaToken = httpsCallable<
                { token: string },
                VerifyTokenResponse
            >(functions, 'verifyBetaToken');

            verifyBetaToken({ token })
                .then((result: HttpsCallableResult<VerifyTokenResponse>) => {
                    setIsValidToken(true);
                    setContactEmail(result.data.email);
                })
                .catch((error) => {
                    console.error("Error verifying beta token:", error);
                    setIsValidToken(false);
                });
        } else {
            setIsValidToken(false);
        }
    }, [searchParams]);


    const handleContributionChange = (value: string) => {
        setContribution(prev => 
            prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]
        );
    };

    const contributionOptions = [
        { id: 'feedback', icon: TestTube, title: 'Early Feature Access', description: 'Use new features early and provide feedback to shape development.' },
        { id: 'ideas', icon: MessageSquare, title: 'Share Ideas', description: 'Help us innovate by sharing your ideas for the platform.' },
        { id: 'spread', icon: Users, title: 'Spread the Word', description: 'Enjoying the platform? Bring a friend and help our community grow.' },
    ];
    
    if (isValidToken === null) {
        return (
            <div className="relative min-h-screen w-full bg-background text-foreground flex items-center justify-center">
                <AnimatedGridBackground />
                <p className="text-white text-lg z-10 font-mono">Verifying Invitation...</p>
            </div>
        );
    }

    if (isValidToken === false) {
        return (
            <div className="relative min-h-screen w-full bg-background text-foreground flex items-center justify-center text-center p-4">
                <AnimatedGridBackground />
                <div className="z-10 hud-panel p-8 rounded-lg">
                    <h1 className="text-2xl font-bold text-red-400 mb-4 font-mono">Invalid or Expired Invitation</h1>
                    <p className="text-muted-foreground">The link you used is either invalid or has expired. Please request a new one.</p>
                </div>
            </div>
        );
    }

    const WelcomeStep = () => (
        <div className="w-full max-w-3xl hud-panel p-8 md:p-12 rounded-2xl text-center">
            <Badge className="mb-6 bg-emerald-500/20 text-emerald-400 border-emerald-400/30 font-mono uppercase">
                Beta Program
            </Badge>
            <h1 className="text-2xl md:text-4xl font-bold mb-4 text-white hud-text-glow font-mono">
                Welcome, Pioneer!
            </h1>
            <p className="text-muted-foreground mb-2">You are setting up the beta profile for:</p>
            <p className="text-emerald-400 font-bold text-lg font-mono mb-8">{contactEmail}</p>

            <div className="glass p-6 rounded-lg text-left space-y-4 mb-10 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400/80 to-emerald-500" />
                <div className="flex items-center gap-3">
                    <Heart className="h-6 w-6 text-emerald-400 flex-shrink-0" />
                    <h3 className="text-lg text-white font-semibold font-mono uppercase tracking-wider">A Platform For Players, By Players</h3>
                </div>
                <ul className="space-y-3 pt-2">
                    <li className="flex gap-3 items-start">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 mt-2 flex-shrink-0" />
                        <p className="text-muted-foreground"><span className="font-semibold text-emerald-300">Always Free:</span> Our commitment is to the community, not profits.</p>
                    </li>
                    <li className="flex gap-3 items-start">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 mt-2 flex-shrink-0" />
                        <p className="text-muted-foreground"><span className="font-semibold text-emerald-300">Your Voice Matters:</span> Your feedback directly shapes the future of ServerHeaven.</p>
                    </li>
                    <li className="flex gap-3 items-start">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 mt-2 flex-shrink-0" />
                        <p className="text-muted-foreground"><span className="font-semibold text-emerald-300">A Big Thank You:</span> We&apos;re genuinely grateful you&apos;re here to help us build.</p>
                    </li>
                </ul>
            </div>

            <Button
                size="lg"
                onClick={() => setStep(2)}
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold group transition-all duration-300 shadow-glow-lg uppercase tracking-wider"
            >
                Let&apos;s Get Started
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
        </div>
    );

    const SetupStep = () => (
        <div className="w-full max-w-4xl hud-panel p-8 md:p-12 rounded-2xl">
            <div className="text-center mb-10">
                <Badge className="mb-4 bg-emerald-500/20 text-emerald-400 border-emerald-400/30 font-mono uppercase">
                    Beta Profile Setup
                </Badge>
                <h1 className="text-3xl md:text-5xl font-bold mb-4 text-white hud-text-glow font-mono">
                    Shape The Future
                </h1>
                <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
                    Your feedback is crucial. Let&apos;s set up your beta profile.
                </p>
            </div>

            <form className="space-y-12">
                {/* Contribution Section */}
                <div>
                    <h2 className="text-2xl font-bold text-white font-mono mb-6 flex items-center gap-3">
                        <UserCog className="text-emerald-400 h-7 w-7" />
                        How would you like to contribute?
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {contributionOptions.map(option => (
                            <CheckboxCard 
                                key={option.id}
                                icon={option.icon}
                                title={option.title}
                                description={option.description}
                                checked={contribution.includes(option.id)}
                                onChange={() => handleContributionChange(option.id)}
                            />
                        ))}
                    </div>
                </div>

                {/* Communication Section */}
                <div>
                    <h2 className="text-2xl font-bold text-white font-mono mb-6 flex items-center gap-3">
                        <Send className="text-emerald-400 h-7 w-7" />
                        How can we reach you?
                    </h2>
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="discord" className="block text-sm font-medium text-muted-foreground mb-2 font-mono uppercase tracking-wider">Discord Username</label>
                            <div className="relative">
                                <input 
                                    type="text"
                                    id="discord"
                                    value={discordUsername}
                                    onChange={(e) => setDiscordUsername(e.target.value)}
                                    placeholder="your_discord#1234"
                                    className="w-full bg-black/30 border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:border-emerald-500 focus:ring-emerald-500/50 focus:ring-1 transition-all duration-300 glass"
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-muted-foreground mb-2 font-mono uppercase tracking-wider">Contact Email</label>
                            <input 
                                type="email"
                                id="email"
                                value={contactEmail}
                                onChange={(e) => setContactEmail(e.target.value)}
                                placeholder="your.email@example.com"
                                className="w-full bg-black/30 border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:border-emerald-500 focus:ring-emerald-500/50 focus:ring-1 transition-all duration-300 glass"
                            />
                        </div>
                    </div>
                </div>

                {/* Submit */}
                <div className="pt-8 flex justify-end">
                    <Button
                        size="lg"
                        type="submit"
                        className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold group transition-all duration-300 shadow-glow-lg uppercase tracking-wider"
                    >
                        Submit and Enter
                        <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </Button>
                </div>
            </form>
        </div>
    );
    
    return (
        <div className="relative min-h-screen w-full bg-background text-foreground overflow-hidden">
            <AnimatedGridBackground variant="sparse" />
            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4 py-12">
                {step === 1 ? <WelcomeStep /> : <SetupStep />}
            </div>
        </div>
    );
} 
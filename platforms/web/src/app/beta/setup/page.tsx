"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/badge';
import { AnimatedGridBackground } from '../../components/ui/AnimatedGridBackground';
import { UserCog, Send, TestTube, MessageSquare, ArrowRight, Users, Heart, ShieldAlert } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { auth, functions } from '@/lib/firebase-config';
import { httpsCallable, HttpsCallableResult } from 'firebase/functions';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

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

// --- Step Components ---

const WelcomeStep = ({ setStep, contactEmail }: { setStep: (step: number) => void, contactEmail: string }) => (
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

const SetupStep = ({ setStep, contribution, handleContributionChange, discordUsername, setDiscordUsername, contributionOptions }: { 
    setStep: (step: number) => void,
    contribution: string[],
    handleContributionChange: (value: string) => void,
    discordUsername: string,
    setDiscordUsername: (value: string) => void,
    contributionOptions: {id: string, icon: React.ElementType, title: string, description: string}[]
}) => (
    <div className="w-full max-w-4xl hud-panel p-8 md:p-12 rounded-2xl">
        <div className="text-center mb-10">
            <Badge className="mb-4 bg-emerald-500/20 text-emerald-400 border-emerald-400/30 font-mono uppercase">
                Step 1 of 2: Profile Setup
            </Badge>
            <h1 className="text-3xl md:text-5xl font-bold mb-4 text-white hud-text-glow font-mono">
                Shape The Future
            </h1>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
                Your feedback is crucial. Let&apos;s set up your beta profile.
            </p>
        </div>

        <div className="space-y-12">
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
                    How can we reach you? (Optional)
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
                </div>
            </div>

            {/* Next Step */}
            <div className="pt-8 flex justify-end">
                <Button
                    size="lg"
                    onClick={() => setStep(3)}
                    disabled={contribution.length === 0}
                    className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold group transition-all duration-300 shadow-glow-lg uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Next: Create Account
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
            </div>
        </div>
    </div>
);

const AuthStep = ({ handleEmailPasswordSubmit, handleGoogleSignIn, password, setPassword, confirmPassword, setConfirmPassword, contactEmail, isLoading, error }: {
    handleEmailPasswordSubmit: (e: React.FormEvent) => void;
    handleGoogleSignIn: () => void;
    password: string;
    setPassword: (value: string) => void;
    confirmPassword: string;
    setConfirmPassword: (value: string) => void;
    contactEmail: string;
    isLoading: boolean;
    error: string | null;
}) => (
    <div className="w-full max-w-xl hud-panel p-8 md:p-12 rounded-2xl">
        <div className="text-center mb-10">
            <Badge className="mb-4 bg-emerald-500/20 text-emerald-400 border-emerald-400/30 font-mono uppercase">
                Step 2 of 2: Create Account
            </Badge>
            <h1 className="text-3xl md:text-5xl font-bold mb-4 text-white hud-text-glow font-mono">
                Final Step
            </h1>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
                Create a secure password or sign in with Google to finalize your profile.
            </p>
        </div>

        <div className="space-y-6">
            <Button
                size="lg"
                variant="outline"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full font-bold group transition-all duration-300 shadow-glow-lg uppercase tracking-wider"
            >
                <svg className="w-5 h-5 mr-3" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Google</title><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.37 1.62-3.82 1.62-4.66 0-8.44-3.72-8.44-8.32s3.78-8.32 8.44-8.32c2.48 0 4.38.92 5.58 2.08L21.5 4.82C19.36 2.84 16.3 1.5 12.48 1.5 7 1.5 2.94 5.5 2.94 10.98s4.06 9.48 9.54 9.48c2.82 0 5.26-.94 7.08-2.76 1.94-1.94 2.58-4.58 2.58-7.72 0-.64-.06-1.22-.18-1.78Z" fill="currentColor"/></svg>
                Sign In with Google
            </Button>
            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground font-mono">
                        Or create a password
                    </span>
                </div>
            </div>
        </div>

        <form className="space-y-8" onSubmit={handleEmailPasswordSubmit}>
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-muted-foreground mb-2 font-mono uppercase tracking-wider">Contact Email</label>
                <input 
                    type="email"
                    id="email"
                    value={contactEmail}
                    disabled
                    className="w-full bg-black/30 border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:border-emerald-500 focus:ring-emerald-500/50 focus:ring-1 transition-all duration-300 glass disabled:opacity-60"
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="password"
                           className="block text-sm font-medium text-muted-foreground mb-2 font-mono uppercase tracking-wider">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full bg-black/30 border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:border-emerald-500 focus:ring-emerald-500/50 focus:ring-1 transition-all duration-300 glass"
                    />
                </div>
                <div>
                    <label htmlFor="confirmPassword"
                           className="block text-sm font-medium text-muted-foreground mb-2 font-mono uppercase tracking-wider">Confirm
                        Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full bg-black/30 border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:border-emerald-500 focus:ring-emerald-500/50 focus:ring-1 transition-all duration-300 glass"
                    />
                </div>
            </div>

            {error && (
                <div className="flex items-center gap-3 hud-panel-red p-4 rounded-lg">
                    <ShieldAlert className="h-6 w-6 text-red-400 flex-shrink-0" />
                    <p className="text-red-400 font-semibold">{error}</p>
                </div>
            )}

            <div className="pt-2 flex justify-end">
                 <Button
                    size="lg"
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold group transition-all duration-300 shadow-glow-lg uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Finalizing...' : 'Submit and Enter'}
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
            </div>
        </form>
    </div>
);

const ThankYouStep = () => (
    <div className="w-full max-w-3xl hud-panel p-8 md:p-12 rounded-2xl text-center">
        <Badge className="mb-6 bg-emerald-500/20 text-emerald-400 border-emerald-400/30 font-mono uppercase">
            Setup Complete
        </Badge>
        <h1 className="text-2xl md:text-4xl font-bold mb-4 text-white hud-text-glow font-mono">
            You&apos;re All Set!
        </h1>
        <p className="text-muted-foreground mb-8">
            Thank you for joining the ServerHeaven beta program. That&apos;s all for now!
        </p>
        <div className="glass p-6 rounded-lg text-left space-y-4 mb-10 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400/80 to-emerald-500" />
            <h3 className="text-lg text-white font-semibold font-mono uppercase tracking-wider text-center">What&apos;s Next?</h3>
            <p className="text-muted-foreground text-center pt-2">
                The first feature drop is scheduled for next week. Keep an eye on your inbox for updates. We can&apos;t wait to hear your feedback!
            </p>
        </div>
    </div>
);


export default function BetaProfileSetup() {
    const [step, setStep] = useState(1);
    const [contribution, setContribution] = useState<string[]>([]);
    const [discordUsername, setDiscordUsername] = useState('');
    const [contactEmail, setContactEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isValidToken, setIsValidToken] = useState<boolean | null>(null);
    const searchParams = useSearchParams();
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const tokenFromUrl = searchParams.get('token');
        if (tokenFromUrl) {
            const token = tokenFromUrl.trim().replace(/\\+$/, '');
            const verifyBetaToken = httpsCallable< { token: string }, VerifyTokenResponse >(functions, 'verifyBetaToken');
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

    useEffect(() => {
        const updateScrollY = () => {
            setScrollY(window.scrollY);
        };
        updateScrollY(); // Set initial scroll position
        window.addEventListener('scroll', updateScrollY);
        return () => window.removeEventListener('scroll', updateScrollY);
    }, []);

    const handleContributionChange = (value: string) => {
        setContribution(prev => 
            prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]
        );
    };

    const finalizeProfile = async (user: { uid: string, email: string | null }) => {
        const token = searchParams.get('token')?.trim().replace(/\\+$/, '');
        if (!token) {
            throw new Error("Your session is invalid. Please use the link from your email again.");
        }
        
        if (user.email !== contactEmail) {
            await auth.signOut(); // Sign out mismatched user for security
            throw new Error("Authenticated email does not match the invitation email.");
        }

        const completeBetaProfile = httpsCallable(functions, 'completeBetaProfile');
        await completeBetaProfile({
            token,
            uid: user.uid,
            contribution,
            discordUsername,
        });

        setStep(4);
    };
    
    const handleAuthError = (err: unknown) => {
        console.error("Error during authentication:", err);
        let message = "An unexpected error occurred. Please try again.";
        if (typeof err === 'object' && err !== null) {
            const firebaseError = err as { code?: string; details?: { message?: string }, message?: string };
            if (firebaseError.code === 'auth/email-already-in-use') {
                message = "This email is already associated with an account.";
            } else if (firebaseError.details?.message) { // HttpsError
                message = firebaseError.details.message;
            } else if (firebaseError.message) { // Generic Auth or other errors
                message = firebaseError.message;
            }
        }
        setError(message);
    }

    const handleEmailPasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        if (password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }

        setIsLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, contactEmail, password);
            await finalizeProfile(userCredential.user);
        } catch (err: unknown) {
            handleAuthError(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const provider = new GoogleAuthProvider();
            const userCredential = await signInWithPopup(auth, provider);
            await finalizeProfile(userCredential.user);
        } catch (err: unknown) {
            handleAuthError(err);
        } finally {
            setIsLoading(false);
        }
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

    const renderStep = () => {
        switch (step) {
            case 1:
                return <WelcomeStep setStep={setStep} contactEmail={contactEmail} />;
            case 2:
                return <SetupStep 
                    setStep={setStep} 
                    contribution={contribution} 
                    handleContributionChange={handleContributionChange} 
                    discordUsername={discordUsername} 
                    setDiscordUsername={setDiscordUsername}
                    contributionOptions={contributionOptions}
                />;
            case 3:
                return <AuthStep
                    handleEmailPasswordSubmit={handleEmailPasswordSubmit}
                    handleGoogleSignIn={handleGoogleSignIn}
                    password={password}
                    setPassword={setPassword}
                    confirmPassword={confirmPassword}
                    setConfirmPassword={setConfirmPassword}
                    contactEmail={contactEmail}
                    isLoading={isLoading}
                    error={error}
                />
            case 4:
                return <ThankYouStep />;
            default:
                return <WelcomeStep setStep={setStep} contactEmail={contactEmail} />;
        }
    }
    
    return (
        <div className="relative min-h-screen w-full bg-background text-foreground overflow-y-auto">
            <div
                className="absolute inset-0 z-0"
                style={{ transform: `translateY(${scrollY * 0.1}px)` }}
            >
                <AnimatedGridBackground variant="sparse" />
            </div>
            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4 py-12">
                {renderStep()}
            </div>
        </div>
    );
} 
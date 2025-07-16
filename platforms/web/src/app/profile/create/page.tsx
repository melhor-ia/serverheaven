"use client";

import React, { useState, useEffect, KeyboardEvent, useRef } from 'react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/badge';
import { AnimatedGridBackground } from '../../components/ui/AnimatedGridBackground';
import { ArrowRight, ShieldAlert, UserPlus, X, ImageUp, Info } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';
import { storage } from '@/lib/firebase-config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { ImageCropModal } from '@/app/components/ImageCropModal';

interface FormData {
    username: string;
    displayName: string;
    bio: string;
    tags: string[];
    avatarFile: File | null;
    coverFile: File | null;
}

// --- Helper Components ---

const TagInput = ({ tags, setTags }: { tags: string[], setTags: (tags: string[]) => void }) => {
    const [inputValue, setInputValue] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === ',' || e.key === 'Enter') {
            e.preventDefault();
            const newTag = inputValue.trim();
            if (newTag && !tags.includes(newTag)) {
                setTags([...tags, newTag]);
            }
            setInputValue('');
        } else if (e.key === 'Backspace' && inputValue === '') {
            setTags(tags.slice(0, -1));
        }
    };

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    return (
        <div>
            <label htmlFor="tags" className="block text-sm font-medium text-muted-foreground mb-2 font-mono uppercase tracking-wider">Tags</label>
            <div 
                className="w-full bg-black/30 border border-border rounded-lg px-3 py-2 text-foreground flex items-center flex-wrap gap-2 transition-all duration-300 glass focus-within:border-emerald-500 focus-within:ring-emerald-500/50 focus-within:ring-1"
                onClick={() => inputRef.current?.focus()}
            >
                {tags.map(tag => (
                    <span key={tag} className="flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 text-sm font-medium px-2 py-1 rounded-md">
                        {tag}
                        <button type="button" onClick={() => removeTag(tag)} className="text-emerald-300 hover:text-white transition-colors">
                            <X className="h-4 w-4" />
                        </button>
                    </span>
                ))}
                <input
                    ref={inputRef}
                    type="text"
                    id="tags"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={tags.length > 0 ? '' : "e.g. survival, pvp, friendly"}
                    className="flex-grow bg-transparent outline-none placeholder:text-muted-foreground/50 text-base"
                />
            </div>
             <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1.5"><Info className="h-3 w-3" /> Use comma or enter to create a tag. Max 5 tags.</p>
        </div>
    );
};

const ImageUploader = ({ id, label, currentImage, onImageSelect, aspect }: { id: string, label: string, currentImage: string | null, onImageSelect: (file: File) => void, aspect: 'aspect-square' | 'aspect-video' }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [imageToCrop, setImageToCrop] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const aspectValue = aspect === 'aspect-square' ? 1 / 1 : 16 / 9;

    const handleFileSelect = (file: File) => {
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = () => {
                setImageToCrop(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    };

    const handleDragEvents = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setIsDragging(true);
        } else if (e.type === 'dragleave') {
            setIsDragging(false);
        }
    };
    
    const onCropComplete = (blob: Blob) => {
        const file = new File([blob], `${id}.jpg`, { type: 'image/jpeg' });
        onImageSelect(file);
        setImageToCrop(null);
    };

    return (
        <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2 font-mono uppercase tracking-wider">{label}</label>
            <div 
                onDragEnter={handleDragEvents}
                onDragOver={handleDragEvents}
                onDragLeave={handleDragEvents}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative w-full ${aspect} bg-black/30 border-2 border-dashed rounded-lg flex items-center justify-center text-muted-foreground overflow-hidden group transition-all duration-300 cursor-pointer ${isDragging ? 'border-emerald-500' : 'border-border hover:border-emerald-500/50'}`}
            >
                {currentImage ? (
                     <img src={currentImage} alt={label} className="w-full h-full object-cover" />
                ) : (
                    <div className="text-center p-4">
                        <ImageUp className="mx-auto h-10 w-10 mb-2" />
                        <p className="text-sm">
                            <span className="font-semibold text-emerald-400">Click to upload</span> or drag and drop
                        </p>
                         <p className="text-xs text-muted-foreground mt-1">PNG, JPG, GIF</p>
                    </div>
                )}
                <input 
                    ref={fileInputRef}
                    type="file" 
                    id={id}
                    accept="image/png, image/jpeg, image/gif"
                    onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])}
                    className="hidden"
                />
                 <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${currentImage ? 'bg-black/70 opacity-0 group-hover:opacity-100' : 'bg-transparent'}`}>
                    {currentImage && <p className="text-white font-bold">Change {label}</p>}
                </div>
                 {isDragging && <div className="absolute inset-0 bg-emerald-500/20 backdrop-blur-sm" />}
            </div>
            {imageToCrop && (
                <ImageCropModal 
                    isOpen={!!imageToCrop}
                    imageSrc={imageToCrop}
                    aspect={aspectValue}
                    onClose={() => setImageToCrop(null)}
                    onCropComplete={onCropComplete}
                />
            )}
        </div>
    );
};


// --- Step Components ---

const Step1_ProfileDetails = ({ nextStep, formData, setFormData }: { nextStep: () => void, formData: FormData, setFormData: (data: FormData) => void }) => {
    const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');
    const [debouncedUsername, setDebouncedUsername] = useState(formData.username);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedUsername(formData.username);
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [formData.username]);

    useEffect(() => {
        if (debouncedUsername.length < 3) {
            setUsernameStatus('idle');
            return;
        }

        const checkUsername = async () => {
            setUsernameStatus('checking');
            try {
                const response = await fetch(`/api/users/check-username?username=${debouncedUsername}`);
                const { isAvailable } = await response.json();
                setUsernameStatus(isAvailable ? 'available' : 'taken');
            } catch (error) {
                console.error("Failed to check username", error);
                setUsernameStatus('idle'); // Or some error state
            }
        };

        checkUsername();
    }, [debouncedUsername]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        if (id === 'username') {
            const sanitizedValue = value.toLowerCase().replace(/[^a-z0-9_]/g, '');
            setFormData({ ...formData, [id]: sanitizedValue });
        } else {
            setFormData({ ...formData, [id]: value });
        }
    };

    const handleTagsChange = (newTags: string[]) => {
        if (newTags.length <= 5) {
            setFormData({ ...formData, tags: newTags });
        }
    };
    
    const canProceed = formData.username && formData.displayName;

    return (
        <div className="w-full">
            <div className="text-center mb-10">
                <h1 className="text-3xl md:text-5xl font-bold mb-4 text-white hud-text-glow font-mono flex items-center justify-center gap-3">
                    <UserPlus className="w-10 h-10" />
                    Create Your Profile
                </h1>
                <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
                    Choose a unique username and tell others a bit about yourself.
                </p>
            </div>

            <div className="space-y-8">
                <div>
                    <label htmlFor="username" className="block text-sm font-medium text-muted-foreground mb-2 font-mono uppercase tracking-wider">Username</label>
                    <input
                        type="text"
                        id="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="your-unique-username"
                        required
                        className="w-full bg-black/30 border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:border-emerald-500 focus:ring-emerald-500/50 focus:ring-1 transition-all duration-300 glass"
                    />
                     <div className="h-5 mt-2 text-sm">
                        {usernameStatus === 'checking' && <p className="text-muted-foreground animate-pulse">Checking availability...</p>}
                        {usernameStatus === 'available' && <p className="text-emerald-400">Username is available!</p>}
                        {usernameStatus === 'taken' && <p className="text-red-500">This username is already taken.</p>}
                        {formData.username.length > 0 && formData.username.length < 3 && <p className="text-yellow-500">Username must be at least 3 characters.</p>}
                    </div>
                </div>
                <div>
                    <label htmlFor="displayName" className="block text-sm font-medium text-muted-foreground mb-2 font-mono uppercase tracking-wider">Display Name</label>
                    <input
                        type="text"
                        id="displayName"
                        value={formData.displayName}
                        onChange={handleChange}
                        placeholder="Your Display Name"
                        required
                        className="w-full bg-black/30 border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:border-emerald-500 focus:ring-emerald-500/50 focus:ring-1 transition-all duration-300 glass"
                    />
                </div>
                <div>
                    <label htmlFor="bio" className="block text-sm font-medium text-muted-foreground mb-2 font-mono uppercase tracking-wider">Bio</label>
                    <textarea
                        id="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        placeholder="Tell us about your favorite games, servers, or anything else!"
                        rows={3}
                        className="w-full bg-black/30 border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:border-emerald-500 focus:ring-emerald-500/50 focus:ring-1 transition-all duration-300 glass"
                    />
                </div>
                <TagInput tags={formData.tags} setTags={handleTagsChange} />

                <div className="pt-2 flex justify-end">
                    <Button
                        size="lg"
                        onClick={nextStep}
                        disabled={!canProceed}
                        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold group transition-all duration-300 shadow-glow-lg uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Next: Customize Appearance
                        <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </Button>
                </div>
            </div>
        </div>
    );
};


const Step2_Appearance = ({ prevStep, handleSubmit, formData, setFormData, isLoading }: { prevStep: () => void, handleSubmit: () => void, formData: FormData, setFormData: (data: FormData) => void, isLoading: boolean }) => {
    
    const handleImageSelect = (field: 'avatarFile' | 'coverFile', file: File) => {
        setFormData({ ...formData, [field]: file });
    };

    return (
        <div className="w-full">
            <div className="text-center mb-10">
                <h1 className="text-3xl md:text-5xl font-bold mb-4 text-white hud-text-glow font-mono">
                    Customize Appearance
                </h1>
                <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
                    Upload a profile picture and a cover image to make your profile stand out.
                </p>
            </div>
             <div className="space-y-8">
                <ImageUploader 
                    id="avatar"
                    label="Profile Picture"
                    aspect="aspect-square"
                    currentImage={formData.avatarFile ? URL.createObjectURL(formData.avatarFile) : null}
                    onImageSelect={(file) => handleImageSelect('avatarFile', file)}
                />
                <ImageUploader 
                    id="cover"
                    label="Profile Cover"
                    aspect="aspect-video"
                    currentImage={formData.coverFile ? URL.createObjectURL(formData.coverFile) : null}
                    onImageSelect={(file) => handleImageSelect('coverFile', file)}
                />

                <div className="pt-2 flex flex-col sm:flex-row gap-4">
                     <Button
                        size="lg"
                        variant="outline"
                        onClick={prevStep}
                        className="w-full"
                    >
                        Back
                    </Button>
                    <Button
                        size="lg"
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold group transition-all duration-300 shadow-glow-lg uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Creating Profile...' : 'Complete Profile'}
                        <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </Button>
                </div>
            </div>
        </div>
    );
};


// --- Main Component ---

const CreateProfilePage = () => {
    const { currentUser } = useAuth();
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState<FormData>({
        username: '',
        displayName: '',
        bio: '',
        tags: [],
        avatarFile: null,
        coverFile: null,
    });
    const [isInitialDataLoaded, setIsInitialDataLoaded] = useState(false);

    useEffect(() => {
        // Pre-populate form when user is loaded, but only do it once.
        if (currentUser && !isInitialDataLoaded) {
            setFormData(prevData => ({
                ...prevData,
                displayName: currentUser.displayName || '',
                username: currentUser.email?.split('@')[0] || '',
            }));
            setIsInitialDataLoaded(true);
        }
    }, [currentUser, isInitialDataLoaded]);

    const nextStep = () => setStep(s => s + 1);
    const prevStep = () => setStep(s => s - 1);

    const handleProfileCreation = async () => {
        if (!currentUser) {
            setError("You must be logged in to create a profile.");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            let avatarUrl = '';
            let coverUrl = '';

            // Upload images if they exist
            if (formData.avatarFile) {
                const avatarRef = ref(storage, `users/${currentUser.uid}/avatar.jpg`);
                await uploadBytes(avatarRef, formData.avatarFile);
                avatarUrl = await getDownloadURL(avatarRef);
            }
             if (formData.coverFile) {
                const coverRef = ref(storage, `users/${currentUser.uid}/cover.jpg`);
                await uploadBytes(coverRef, formData.coverFile);
                coverUrl = await getDownloadURL(coverRef);
            }

            const token = await currentUser.getIdToken();
            const response = await fetch(`/api/users`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    username: formData.username,
                    displayName: formData.displayName,
                    bio: formData.bio,
                    tags: formData.tags,
                    avatarUrl,
                    coverUrl,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create profile.');
            }
            
            await currentUser.reload(); // Refresh user to get new display name etc.
            router.push(`/profile/${formData.username}`);

        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unknown error occurred.");
            }
            // If the error occurred after the first step, we should probably stay on step 2
            setStep(2);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen w-full bg-background text-foreground flex items-center justify-center p-4 overflow-x-hidden">
            <div className="absolute inset-0 z-0">
                <AnimatedGridBackground variant="sparse" />
            </div>
            <div className="relative z-10 w-full max-w-2xl hud-panel p-8 md:p-12 rounded-2xl">
                <div className="text-center mb-6">
                     <Badge className="mb-4 bg-emerald-500/20 text-emerald-400 border-emerald-400/30 font-mono uppercase">
                        Step {step} of 2
                    </Badge>
                </div>

                {error && (
                    <div className="flex items-center gap-3 hud-panel-red p-4 rounded-lg mb-6">
                        <ShieldAlert className="h-6 w-6 text-red-400 flex-shrink-0" />
                        <p className="text-red-400 font-semibold">{error}</p>
                    </div>
                )}
                
                {step === 1 && <Step1_ProfileDetails nextStep={nextStep} formData={formData} setFormData={setFormData} />}
                {step === 2 && <Step2_Appearance prevStep={prevStep} handleSubmit={handleProfileCreation} formData={formData} setFormData={setFormData} isLoading={isLoading} />}
            </div>
        </div>
    );
};

export default CreateProfilePage; 
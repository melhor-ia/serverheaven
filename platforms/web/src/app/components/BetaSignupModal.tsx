"use client";

import React, { useState } from 'react';
import { Button } from './ui/Button';
import { X, ArrowLeft, Star } from 'lucide-react';

interface BetaSignupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BetaSignupModal: React.FC<BetaSignupModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [choice, setChoice] = useState<string | null>(null);
  const [email, setEmail] = useState('');

  if (!isOpen) return null;

  const handleChoice = (selectedChoice: string) => {
    setChoice(selectedChoice);
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
  };
  
  const handleCloseAndReset = () => {
    onClose();
    setTimeout(() => {
        setStep(1);
        setChoice(null);
        setEmail('');
    }, 300);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Later: implement actual submission logic
    console.log({ choice, email });
    setStep(3);
  };
  
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleCloseAndReset();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center transition-opacity duration-300"
      onClick={handleOverlayClick}
    >
      <div className="hud-panel p-8 rounded-xl max-w-lg w-full relative m-4 animate-fade-in">
        <button
          onClick={handleCloseAndReset}
          className="absolute top-4 right-4 text-muted-foreground hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <X className="h-6 w-6" />
        </button>

        {step === 1 && (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white font-mono mb-2 hud-text-glow">Welcome aboard!</h2>
            <p className="text-muted-foreground mb-8">How would you like to join our mission?</p>

            <div className="space-y-4">
              <button
                onClick={() => handleChoice('feedback')}
                className="w-full text-left glass p-6 rounded-lg transition-all duration-300 hover:border-emerald-400/60 hover:shadow-hud-active border border-emerald-400/30"
              >
                <h3 className="font-bold text-lg text-emerald-400 font-mono">I want to help with my opinion</h3>
                <p className="text-sm text-muted-foreground">Provide feedback, test features, and help shape the future of ServerHeaven.</p>
              </button>
              <button
                onClick={() => handleChoice('notify')}
                className="w-full text-left glass p-6 rounded-lg transition-all duration-300 hover:border-emerald-400/60 hover:shadow-hud-active border border-emerald-400/30"
              >
                <h3 className="font-bold text-lg text-emerald-400 font-mono">I just want to be notified on the release</h3>
                <p className="text-sm text-muted-foreground">Get an email when we launch and be one of the first to join.</p>
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <button onClick={handleBack} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors mb-4">
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
            <h2 className="text-2xl font-bold text-white font-mono mb-2 hud-text-glow">Almost there!</h2>
            <p className="text-muted-foreground mb-8">Please provide your email to receive updates.</p>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-mono text-emerald-400 mb-2 uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="w-full bg-black/30 border border-emerald-400/30 rounded-md p-3 text-white placeholder-muted-foreground focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition-all"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  {choice === 'feedback'
                    ? "We respect your privacy. Your email will only be used for beta testing communication and the official release notification. No spam."
                    : "We respect your privacy. This is for a one-time release notification only. No spam."
                  }
                </p>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold shadow-glow uppercase tracking-wider"
              >
                Get Notified
              </Button>
            </form>
          </div>
        )}

        {step === 3 && (
          <div className="text-center">
            <div className="p-4 bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 rounded-full inline-block mb-6">
                <Star className="h-10 w-10 text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold text-white font-mono mb-4 hud-text-glow">
              {choice === 'feedback' ? 'You are a Pioneer!' : 'Thank You!'}
            </h2>
            {choice === 'feedback' ? (
              <p className="text-muted-foreground mb-8">
                Thank you for your commitment! A confirmation email has been sent. As a beta tester, you&apos;ll earn <span className="text-emerald-400 font-semibold">exclusive rewards</span> upon the platform&apos;s official release.
              </p>
            ) : (
              <p className="text-muted-foreground mb-8">
                Thanks for your interest! We&apos;ve received your email and will notify you as soon as ServerHeaven is live.
              </p>
            )}
            <Button
              onClick={handleCloseAndReset}
              className="w-full sm:w-auto px-8 bg-transparent border border-emerald-400/30 text-muted-foreground hover:bg-emerald-500/10 hover:text-white transition-colors"
            >
              Close
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}; 
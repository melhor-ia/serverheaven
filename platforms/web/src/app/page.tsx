"use client";

import React, { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { ArrowRight, UserCog, Scale, Handshake, CloudCog, Info } from 'lucide-react';
import { Button } from "./components/ui/Button";
import { Badge } from "./components/ui/badge";
import Link from 'next/link';
// import { useAuth } from './contexts/AuthContext'; // Assuming AuthContext exists

export default function Home() {
  // const { user, login } = useAuth(); // from useAuth
  const [waitlistCount, setWaitlistCount] = useState(4127);
  const [scrollY, setScrollY] = useState(0);

  const { ref: refStep1, inView: inViewStep1 } = useInView({ triggerOnce: true, rootMargin: '-50px 0px' });
  const { ref: refStep2, inView: inViewStep2 } = useInView({ triggerOnce: true, rootMargin: '-50px 0px' });
  const { ref: refStep3, inView: inViewStep3 } = useInView({ triggerOnce: true, rootMargin: '-50px 0px' });

  useEffect(() => {
    // In a real app, you'd fetch this from your backend/Firebase
    const baseWaitlistCount = 840;
    // For now, we'll just simulate a fetch
    setTimeout(() => {
      setWaitlistCount(baseWaitlistCount + 3287); // simulated fetched count
    }, 1000);

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Placeholder for login modal
  const openLoginModal = () => {
    alert("Login modal would open here!");
    // In a real implementation, you'd set a state to show a modal
    // e.g., setShowLoginModal(true)
  };

  return (
    <>
      {/* SEO and Head management would be in layout.tsx or using Next.js Head component */}
      <div className="flex min-h-screen flex-col bg-background text-foreground">
        {/* Header */}
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="w-full px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative h-8 w-8 overflow-hidden rounded-md bg-emerald-600 flex items-center justify-center">
                <CloudCog className="h-7 w-7 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight">ServerHeaven.co</span>
            </div>
            <nav className="hidden md:flex gap-6">
              <a href="#features" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                Features
              </a>
              <a href="#how-it-works" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                How It Works
              </a>
              <a href="#challenges" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                Challenges
              </a>
            </nav>
            <Button onClick={openLoginModal} className="bg-emerald-600 hover:bg-emerald-700 text-white">Login</Button>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-80 animate-ken-burns-horizontal"
              style={{ 
                backgroundImage: "url('/parallaxe-banner.jpg')",
                transform: `translateY(${scrollY * 0.15}px)` 
              }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/30 to-emerald-900/20"></div>
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/90 to-transparent"></div>
          </div>
          <div className="w-full px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid gap-8 md:grid-cols-2 items-center">
              <div className="space-y-6">
                <Badge className="bg-emerald-600 text-white hover:bg-emerald-700 px-3 py-1 text-sm">
                  Beta Access Coming Soon
                </Badge>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white">
                  Find (or host) the perfect server — no surprises.
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground max-w-md">
                  Forge lasting Minecraft groups. We connect you with verified players and hosts through transparent ratings and secure invites.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white group transition-all duration-300"
                    onClick={openLoginModal}
                  >
                    Login / Get Started
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Button>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="font-semibold text-emerald-400">{waitlistCount.toLocaleString()}</span> on the waitlist
                  <span className="text-xs text-muted-foreground cursor-help" title="This is an estimated count. Live data will be available soon.">
                    <Info size={14} />
                  </span>
                  <div className="flex -space-x-2">
                    <div className="h-6 w-6 rounded-full bg-emerald-800 border-2 border-background"></div>
                    <div className="h-6 w-6 rounded-full bg-emerald-700 border-2 border-background"></div>
                    <div className="h-6 w-6 rounded-full bg-emerald-600 border-2 border-background"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Problems & Solutions Section */}
        <section id="challenges" className="relative py-20 md:py-32 bg-gradient-to-bl from-background via-emerald-950/5 to-background/80">
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 max-w-3xl mx-auto">
              <Badge className="mb-4 bg-emerald-600 text-white hover:bg-emerald-700">Challenges We Address</Badge>
              <h2 className="text-3xl md:text-5xl font-bold mb-6">Building Better Server Experiences</h2>
              <p className="text-muted-foreground text-lg">
                We&apos;re focused on overcoming common hurdles in Minecraft server communities to enhance the experience for everyone.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 mt-12">
              {/* For Players */}
              <div className="bg-black/40 backdrop-blur-sm rounded-xl p-8 border border-emerald-900/50 shadow-[0_0_15px_rgba(16,185,129,0.1)] transition-all duration-300 hover:shadow-[0_0_25px_rgba(16,185,129,0.15)]">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-emerald-950 rounded-lg">
                    <svg className="h-8 w-8 text-emerald-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">For Players</h3>
                    <p className="text-muted-foreground">Enhancing your server discovery journey</p>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="bg-emerald-950/50 p-6 rounded-lg border border-emerald-900/50 relative">
                    <div className="absolute -top-3 -left-3 p-1.5 bg-emerald-700 rounded-md">
                      <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
                    </div>
                    <h4 className="font-bold text-xl text-emerald-400 mb-3">Our Solutions:</h4>
                    <ul className="space-y-4">
                      <li className="flex gap-3">
                        <div className="h-6 w-6 rounded-full bg-emerald-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="h-3.5 w-3.5 text-emerald-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
                        </div>
                        <p><span className="font-semibold">Never guess again:</span> See real-time uptime & history for active servers.</p>
                      </li>
                      <li className="flex gap-3">
                        <div className="h-6 w-6 rounded-full bg-emerald-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="h-3.5 w-3.5 text-emerald-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
                        </div>
                        <p><span className="font-semibold">Pinpoint your match:</span> Filter by player count, playstyle, game mode, and more.</p>
                      </li>
                      <li className="flex gap-3">
                        <div className="h-6 w-6 rounded-full bg-emerald-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="h-3.5 w-3.5 text-emerald-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
                        </div>
                        <p><span className="font-semibold">Trust genuine experiences:</span> Choose based on feedback from real players with active playtime.</p>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* For Hosts */}
              <div className="bg-black/40 backdrop-blur-sm rounded-xl p-8 border border-emerald-900/50 shadow-[0_0_15px_rgba(16,185,129,0.1)] transition-all duration-300 hover:shadow-[0_0_25px_rgba(16,185,129,0.15)]">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-emerald-950 rounded-lg">
                    <svg className="h-8 w-8 text-emerald-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">For Hosts</h3>
                    <p className="text-muted-foreground">Build Your Dream Community, Confidently</p>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="bg-emerald-950/50 p-6 rounded-lg border border-emerald-900/50 relative">
                    <div className="absolute -top-3 -left-3 p-1.5 bg-emerald-700 rounded-md">
                      <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
                    </div>
                    <h4 className="font-bold text-xl text-emerald-400 mb-3">Our Solutions:</h4>
                    <ul className="space-y-4">
                      <li className="flex gap-3">
                        <div className="h-6 w-6 rounded-full bg-emerald-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                         <svg className="h-3.5 w-3.5 text-emerald-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
                        </div>
                        <p><span className="font-semibold">Attract dedicated players:</span> Showcase your world feats with premium visibility.</p>
                      </li>
                      <li className="flex gap-3">
                        <div className="h-6 w-6 rounded-full bg-emerald-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="h-3.5 w-3.5 text-emerald-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
                        </div>
                        <p><span className="font-semibold">Recruit with insight:</span> Choose the right players using a reputation system, tags, and verified history.</p>
                      </li>
                      <li className="flex gap-3">
                        <div className="h-6 w-6 rounded-full bg-emerald-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="h-3.5 w-3.5 text-emerald-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
                        </div>
                        <p><span className="font-semibold">Cultivate respect:</span> Set rules and behavior agreements, and see them followed.</p>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-20 md:py-32 bg-gradient-to-tr from-background/80 via-emerald-950/5 to-background">
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 max-w-3xl mx-auto">
              <Badge className="mb-4 bg-emerald-900 text-white hover:bg-emerald-800">Process</Badge>
              <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">How It Works</h2>
              <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
                A simple three-step process designed to create better Minecraft communities through trust and transparency.
              </p>
            </div>

            <div className="relative">
              <div className="absolute left-1/2 -translate-x-1/2 h-full w-2 bg-emerald-900/30 hidden md:block"></div>
              <div className="space-y-20 relative">
                {/* Step 1 */}
                <div ref={refStep1} className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="order-2 md:order-1">
                    {inViewStep1 && (
                      <div className="bg-black/40 backdrop-blur-sm p-8 rounded-xl border border-emerald-900/50 shadow-[0_0_15px_rgba(16,185,129,0.1)] transition-all duration-300 hover:shadow-[0_0_25px_rgba(16,185,129,0.15)] relative animate-fade-in">
                        <div className="absolute top-6 -right-4 md:right-auto md:-left-4 h-10 w-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold shadow-lg">1</div>
                        <h3 className="text-2xl font-bold mb-4 text-white">1. Build Your Verified Identity</h3>
                        <p className="text-muted-foreground mb-4">
                          Integration with Microsoft account to confirm authenticity and establish your identity in the community, so you connect with real, passionate players and hosts.
                        </p>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div><span>Verified Minecraft accounts only</span></li>
                          <li className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div><span>Customizable player/server profiles</span></li>
                          <li className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div><span>Privacy controls for your information</span></li>
                        </ul>
                      </div>
                    )}
                  </div>
                  <div className="order-1 md:order-2 flex justify-center">
                    <div className="relative w-[200px] h-[200px] rounded-xl overflow-hidden border-4 border-emerald-900/50 shadow-[0_0_30px_rgba(16,185,129,0.2)] flex items-center justify-center bg-black/30">
                      <UserCog className="h-16 w-16 md:h-24 md:w-24 text-emerald-500" />
                    </div>
                  </div>
                </div>
                {/* Step 2 */}
                <div ref={refStep2} className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="flex justify-center">
                    <div className="relative w-[200px] h-[200px] rounded-xl overflow-hidden border-4 border-emerald-900/50 shadow-[0_0_30px_rgba(16,185,129,0.2)] flex items-center justify-center bg-black/30">
                      <Scale className="h-16 w-16 md:h-24 md:w-24 text-emerald-500" />
                    </div>
                  </div>
                  <div>
                    {inViewStep2 && (
                      <div className="bg-black/40 backdrop-blur-sm p-8 rounded-xl border border-emerald-900/50 shadow-[0_0_15px_rgba(16,185,129,0.1)] transition-all duration-300 hover:shadow-[0_0_25px_rgba(16,185,129,0.15)] relative animate-fade-in">
                        <div className="absolute top-6 -left-4 h-10 w-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold shadow-lg">2</div>
                        <h3 className="text-2xl font-bold mb-4 text-white">2. Shape a Fair Community</h3>
                        <p className="text-muted-foreground mb-4">
                          "Upvote + flags" system linked to server logs creates a transparent reputation system for both players and hosts, empowering everyone to maintain high standards.
                        </p>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div><span>Evidence-based reputation system</span></li>
                          <li className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div><span>Dispute resolution for unfair ratings</span></li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
                {/* Step 3 */}
                <div ref={refStep3} className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="order-2 md:order-1">
                    {inViewStep3 && (
                      <div className="bg-black/40 backdrop-blur-sm p-8 rounded-xl border border-emerald-900/50 shadow-[0_0_15px_rgba(16,185,129,0.1)] transition-all duration-300 hover:shadow-[0_0_25px_rgba(16,185,129,0.15)] relative animate-fade-in">
                        <div className="absolute top-6 -right-4 md:right-auto md:-left-4 h-10 w-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold shadow-lg">3</div>
                        <h3 className="text-2xl font-bold mb-4 text-white">3. Connect with Confidence</h3>
                        <p className="text-muted-foreground mb-4">
                          Platform-generated invites and requests create safe connections, with mutual evaluation ensuring a great fit for everyone involved.
                        </p>
                         <ul className="space-y-2 text-sm">
                          <li className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div><span>Secure whitelist and ban management</span></li>
                          <li className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div><span>Trial period with clear expectations</span></li>
                          <li className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div><span>Two-way feedback after trial completion</span></li>
                        </ul>
                      </div>
                    )}
                  </div>
                  <div className="order-1 md:order-2 flex justify-center">
                    <div className="relative w-[200px] h-[200px] rounded-xl overflow-hidden border-4 border-emerald-900/50 shadow-[0_0_30px_rgba(16,185,129,0.2)] flex items-center justify-center bg-black/30">
                      <Handshake className="h-16 w-16 md:h-24 md:w-24 text-emerald-500" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="relative py-20 md:py-32 bg-gradient-to-br from-background via-emerald-950/5 to-background/90">
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-emerald-950/30 to-transparent pointer-events-none"></div>
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 max-w-3xl mx-auto">
              <Badge className="mb-4 bg-emerald-900 text-white hover:bg-emerald-800">Features</Badge>
              <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">Our Core Features</h2>
              <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
                Tools designed specifically for Minecraft communities to build trust and create better experiences.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-black/40 backdrop-blur-sm border-emerald-900/50 shadow-[0_0_15px_rgba(16,185,129,0.1)] transition-all duration-300 hover:shadow-[0_0_25px_rgba(16,185,129,0.15)] hover:-translate-y-1 rounded-lg border p-5">
                <div className="pb-2">
                  <svg className="h-10 w-10 text-emerald-500 mb-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
                  <h3 className="text-xl text-white font-semibold">Your Reputation, Your Passport</h3>
                </div>
                <div><p className="text-muted-foreground">Carry your trust score and history to any ServerHeaven server.</p></div>
              </div>
              <div className="bg-black/40 backdrop-blur-sm border-emerald-900/50 shadow-[0_0_15px_rgba(16,185,129,0.1)] transition-all duration-300 hover:shadow-[0_0_25px_rgba(16,185,129,0.15)] hover:-translate-y-1 rounded-lg border p-5">
                <div className="pb-2">
                  <svg className="h-10 w-10 text-emerald-500 mb-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>
                  <h3 className="text-xl text-white font-semibold">Showcase Your Genius</h3>
                </div>
                <div><p className="text-muted-foreground">Inspire and be inspired with your portfolio of builds, timelapses, and schematics.</p></div>
              </div>
              <div className="bg-black/40 backdrop-blur-sm border-emerald-900/50 shadow-[0_0_15px_rgba(16,185,129,0.1)] transition-all duration-300 hover:shadow-[0_0_25px_rgba(16,185,129,0.15)] hover:-translate-y-1 rounded-lg border p-5">
                <div className="pb-2">
                  <svg className="h-10 w-10 text-emerald-500 mb-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                  <h3 className="text-xl text-white font-semibold">Find Your Tribe</h3>
                </div>
                <div><p className="text-muted-foreground">Connect with players and servers that match your unique playstyle and interests.</p></div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing/Boosts Section */}
        <section className="relative py-20 md:py-32 bg-gradient-to-b from-emerald-950/30 via-emerald-950/20 to-emerald-950/50">
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-background/70 to-transparent pointer-events-none"></div>
          <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="text-center mb-16 max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">Free For All</h2>
              <p className="text-center text-lg mb-16 max-w-3xl mx-auto text-muted-foreground">
                ServerHeaven is completely free because we believe every Minecraft enthusiast deserves a safe and rewarding multiplayer experience. Our mission is to empower players and hosts to build thriving communities founded on trust, transparency, and a shared passion for the game.
              </p>
            </div>
          </div>
        
          {/* Final CTA */}
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-7xl">
            <Badge className="mb-6 bg-emerald-900 text-white hover:bg-emerald-800">Join Us</Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">Ready to find your ideal server?</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto text-muted-foreground">
              Join the waitlist and be one of the first to experience ServerHeaven – where your perfect Minecraft community is just a few clicks away.
            </p>
            <Button
              variant="outline"
              size="lg"
              className="bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-500 hover:border-emerald-400"
              onClick={openLoginModal}
            >
              Login to Join Waitlist
            </Button>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 border-t border-emerald-900/20 bg-black/40">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center gap-2 mb-6 md:mb-0">
                <div className="relative h-8 w-8 overflow-hidden rounded-md bg-emerald-600 flex items-center justify-center">
                  <CloudCog className="h-7 w-7 text-white" />
                </div>
                <span className="font-bold text-white">ServerHeaven.co</span>
              </div>
              <div className="flex gap-6 mb-6 md:mb-0">
                <Link href="/terms" className="text-sm text-muted-foreground hover:text-emerald-400 transition-colors">
                  Terms
                </Link>
                <Link href="/privacy" className="text-sm text-muted-foreground hover:text-emerald-400 transition-colors">
                  Privacy
                </Link>
              </div>
            </div>
            <div className="mt-8 text-center text-xs text-muted-foreground">
              <p>Made by Minecraft fans — © {new Date().getFullYear()}, not affiliated with Mojang/Microsoft.</p>
            </div>
          </div>
        </footer>
      </div>
      {/* <LoginModal isOpen={showLoginModal} setIsOpen={setShowLoginModal} onSuccess={handleLoginSuccess} /> */}
    </>
  );
}

"use client";

import React, { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { ArrowRight, UserCog, Scale, Handshake, CloudCog, Shield, Zap, Target, Users, Star, Activity } from 'lucide-react';
import { Button } from "./components/ui/Button";
import { Badge } from "./components/ui/badge";
import { AnimatedGridBackground } from "./components/ui/AnimatedGridBackground";
import Link from 'next/link';
import { BetaSignupModal } from './components/BetaSignupModal';
import { DiscordIcon } from './components/ui/DiscordIcon';

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { ref: refStep1, inView: inViewStep1 } = useInView({ triggerOnce: true, rootMargin: '-50px 0px' });
  const { ref: refStep2, inView: inViewStep2 } = useInView({ triggerOnce: true, rootMargin: '-50px 0px' });
  const { ref: refStep3, inView: inViewStep3 } = useInView({ triggerOnce: true, rootMargin: '-50px 0px' });

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const openLoginModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <BetaSignupModal isOpen={isModalOpen} onClose={closeModal} />
      <div className="flex min-h-screen flex-col bg-background text-foreground">
        {/* HUD-Style Header */}
        <header className="sticky top-0 z-50 w-full hud-panel">
          <div className="w-full px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-glow-sm">
                <CloudCog className="h-6 w-6 text-black" />
              </div>
              <span className="text-xl font-bold tracking-tight hud-text-glow font-mono">
                SERVER<span className="text-emerald-400">HEAVEN</span>
              </span>
            </div>
            
            <nav className="hidden md:flex gap-8">
              <a href="#features" className="text-sm font-medium text-muted-foreground transition-colors hover:text-emerald-400 font-mono uppercase tracking-wider">
                Features
              </a>
              <a href="#how-it-works" className="text-sm font-medium text-muted-foreground transition-colors hover:text-emerald-400 font-mono uppercase tracking-wider">
                How It Works
              </a>
              <a href="#mission" className="text-sm font-medium text-muted-foreground transition-colors hover:text-emerald-400 font-mono uppercase tracking-wider">
                Mission
              </a>
            </nav>
            
            <Button onClick={openLoginModal} className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold shadow-glow uppercase tracking-wider">
              Get Started
            </Button>
          </div>
        </header>

        {/* Hero Section - Command Center */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          <AnimatedGridBackground />
          
          <div className="absolute inset-0 z-0">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-60"
              style={{ 
                backgroundImage: "url('/parallaxe-banner.jpg')",
                transform: `translateY(${scrollY * 0.1}px)` 
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/80" />
          </div>
          
          <div className="w-full px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <div className="inline-flex items-center gap-2 hud-panel px-4 py-2 rounded-full">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-sm font-mono text-emerald-400 uppercase tracking-wider">Beta Access is live!</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-tight">
                <span className="glitch hud-text-glow" data-text="FIND OR HOST">FIND OR HOST</span>
                <br />
                <span className="bg-gradient-to-r from-emerald-400 to-emerald-500 bg-clip-text text-transparent">
                  THE PERFECT SERVER
                </span>
                <br />
                <span className="text-3xl md:text-4xl lg:text-5xl text-gray-300">
                  No More Guessing
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                Smart matchmaking for Minecraft communities. Connect with trusted players and servers through 
                <span className="text-emerald-400 font-semibold"> verified reputation systems</span> and 
                <span className="text-emerald-400 font-semibold"> transparent community feedback</span>.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold group transition-all duration-300 shadow-glow-lg uppercase tracking-wider"
                  onClick={openLoginModal}
                >
                  Join Beta Access
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
                <Link href="https://discord.gg/h6VVzbZU" target="_blank" rel="noopener noreferrer">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full border-emerald-400/50 text-emerald-400 hover:bg-emerald-400/10 hover:text-emerald-300 group transition-all duration-300 uppercase tracking-wider"
                  >
                    <DiscordIcon className="mr-2 h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                    Join Discord
                  </Button>
                </Link>
              </div>
              
            </div>
          </div>
        </section>

        {/* Mission Brief Section */}
        <section id="mission" className="relative py-20 md:py-32">
          <AnimatedGridBackground variant="sparse" />
          
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <Badge className="mb-4 bg-emerald-500/20 text-emerald-400 border-emerald-400/30 font-mono uppercase">Our Solution</Badge>
                <h2 className="text-3xl md:text-5xl font-bold mb-6 hud-text-glow">Why ServerHeaven Works</h2>
                <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
                  Eliminate guesswork in server selection. Smart systems that match you with the right communities.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                {/* For Players */}
                <div className="hud-panel p-8 rounded-xl transition-all duration-300 hover:shadow-hud-active group">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 rounded-lg border border-emerald-400/30">
                      <Users className="h-8 w-8 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white font-mono">For Players</h3>
                      <p className="text-muted-foreground">Smart discovery tools</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="glass p-6 rounded-lg relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-emerald-500" />
                      <h4 className="font-bold text-xl text-emerald-400 mb-4 font-mono">What We Offer:</h4>
                      <ul className="space-y-3">
                        <li className="flex gap-3">
                          <div className="w-2 h-2 rounded-full bg-emerald-400 mt-2 flex-shrink-0" />
                          <p><span className="font-semibold text-emerald-300">Live Server Data:</span> Real-time server metrics, uptime tracking, and performance insights</p>
                        </li>
                        <li className="flex gap-3">
                          <div className="w-2 h-2 rounded-full bg-emerald-400 mt-2 flex-shrink-0" />
                          <p><span className="font-semibold text-emerald-300">Smart Filtering:</span> Find servers by gameplay style, mods, community size, and preferences</p>
                        </li>
                        <li className="flex gap-3">
                          <div className="w-2 h-2 rounded-full bg-emerald-400 mt-2 flex-shrink-0" />
                          <p><span className="font-semibold text-emerald-300">Trusted Reviews:</span> Verified feedback from real players with confirmed playtime</p>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* For Hosts */}
                <div className="hud-panel p-8 rounded-xl transition-all duration-300 hover:shadow-hud-active group">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 rounded-lg border border-emerald-400/30">
                      <CloudCog className="h-8 w-8 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white font-mono">For Server Hosts</h3>
                      <p className="text-muted-foreground">Player recruitment tools</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="glass p-6 rounded-lg relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-emerald-500" />
                      <h4 className="font-bold text-xl text-emerald-400 mb-4 font-mono">How We Help:</h4>
                      <ul className="space-y-3">
                        <li className="flex gap-3">
                          <div className="w-2 h-2 rounded-full bg-emerald-400 mt-2 flex-shrink-0" />
                          <p><span className="font-semibold text-emerald-300">Better Visibility:</span> Get discovered by players looking for your server type</p>
                        </li>
                        <li className="flex gap-3">
                          <div className="w-2 h-2 rounded-full bg-emerald-400 mt-2 flex-shrink-0" />
                          <p><span className="font-semibold text-emerald-300">Player Insights:</span> See reputation scores, play styles, and compatibility before inviting</p>
                        </li>
                        <li className="flex gap-3">
                          <div className="w-2 h-2 rounded-full bg-emerald-400 mt-2 flex-shrink-0" />
                          <p><span className="font-semibold text-emerald-300">Community Tools:</span> Built-in moderation features and community guidelines</p>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-20 md:py-32 relative">
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <Badge className="mb-4 bg-emerald-500/20 text-emerald-400 border-emerald-400/30 font-mono uppercase">How It Works</Badge>
                <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white hud-text-glow">Three Simple Steps</h2>
                <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
                  A straightforward process to connect trusted players with the right Minecraft communities.
                </p>
              </div>

              <div className="relative">
                <div className="absolute left-1/2 -translate-x-1/2 h-full w-1 bg-gradient-to-b from-emerald-400/30 via-emerald-400/50 to-emerald-400/30 hidden md:block" />
                
                <div className="space-y-16 relative">
                  {/* Phase 1 */}
                  <div ref={refStep1} className="grid md:grid-cols-2 gap-8 items-center">
                    <div className="order-2 md:order-1">
                      {inViewStep1 && (
                        <div className="hud-panel p-8 rounded-xl transition-all duration-300 hover:shadow-hud-active relative">
                          <div className="absolute top-6 -right-4 md:right-auto md:-left-4 h-12 w-12 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white flex items-center justify-center font-bold shadow-glow font-mono text-lg">01</div>
                          <h3 className="text-2xl font-bold mb-4 text-white font-mono">Verify Your Identity</h3>
                          <p className="text-muted-foreground mb-6">
                            Connect your Microsoft account to establish a trusted profile. This ensures all players are real and builds community confidence.
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                            <div className="flex items-center gap-2 glass p-3 rounded">
                              <Shield className="h-4 w-4 text-emerald-400" />
                              <span>Microsoft Account Link</span>
                            </div>
                            <div className="flex items-center gap-2 glass p-3 rounded">
                              <UserCog className="h-4 w-4 text-emerald-400" />
                              <span>Profile Setup</span>
                            </div>
                            <div className="flex items-center gap-2 glass p-3 rounded">
                              <Activity className="h-4 w-4 text-emerald-400" />
                              <span>Privacy Settings</span>
                            </div>
                            <div className="flex items-center gap-2 glass p-3 rounded">
                              <Star className="h-4 w-4 text-emerald-400" />
                              <span>Initial Reputation</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="order-1 md:order-2 flex justify-center">
                      <div className="relative w-48 h-48 hud-panel rounded-2xl flex items-center justify-center">
                        <UserCog className="h-20 w-20 text-emerald-400" />
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-400/20 to-transparent" />
                      </div>
                    </div>
                  </div>

                  {/* Phase 2 */}
                  <div ref={refStep2} className="grid md:grid-cols-2 gap-8 items-center">
                    <div className="flex justify-center">
                      <div className="relative w-48 h-48 hud-panel rounded-2xl flex items-center justify-center">
                        <Scale className="h-20 w-20 text-emerald-400" />
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-400/20 to-transparent" />
                      </div>
                    </div>
                    <div>
                      {inViewStep2 && (
                        <div className="hud-panel p-8 rounded-xl transition-all duration-300 hover:shadow-hud-active relative">
                          <div className="absolute top-6 -left-4 h-12 w-12 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white flex items-center justify-center font-bold shadow-glow font-mono text-lg">02</div>
                          <h3 className="text-2xl font-bold mb-4 text-white font-mono">Build Your Reputation</h3>
                          <p className="text-muted-foreground mb-6">
                            Earn trust through positive interactions with servers and players. Fair, transparent feedback system that prevents gaming.
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                            <div className="flex items-center gap-2 glass p-3 rounded">
                              <Scale className="h-4 w-4 text-emerald-400" />
                              <span>Fair Feedback</span>
                            </div>
                            <div className="flex items-center gap-2 glass p-3 rounded">
                              <Shield className="h-4 w-4 text-emerald-400" />
                              <span>Anti-Gaming Protection</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Phase 3 */}
                  <div ref={refStep3} className="grid md:grid-cols-2 gap-8 items-center">
                    <div className="order-2 md:order-1">
                      {inViewStep3 && (
                        <div className="hud-panel p-8 rounded-xl transition-all duration-300 hover:shadow-hud-active relative">
                          <div className="absolute top-6 -right-4 md:right-auto md:-left-4 h-12 w-12 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white flex items-center justify-center font-bold shadow-glow font-mono text-lg">03</div>
                          <h3 className="text-2xl font-bold mb-4 text-white font-mono">Connect & Play</h3>
                          <p className="text-muted-foreground mb-6">
                            Find the perfect match through smart recommendations. Trial periods ensure good fits before long-term commitments.
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                            <div className="flex items-center gap-2 glass p-3 rounded">
                              <Target className="h-4 w-4 text-emerald-400" />
                              <span>Smart Matching</span>
                            </div>
                            <div className="flex items-center gap-2 glass p-3 rounded">
                              <Handshake className="h-4 w-4 text-emerald-400" />
                              <span>Trial Periods</span>
                            </div>
                            <div className="flex items-center gap-2 glass p-3 rounded">
                              <Activity className="h-4 w-4 text-emerald-400" />
                              <span>Progress Tracking</span>
                            </div>
                            <div className="flex items-center gap-2 glass p-3 rounded">
                              <Scale className="h-4 w-4 text-emerald-400" />
                              <span>Mutual Reviews</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="order-1 md:order-2 flex justify-center">
                      <div className="relative w-48 h-48 hud-panel rounded-2xl flex items-center justify-center">
                        <Handshake className="h-20 w-20 text-emerald-400" />
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-400/20 to-transparent" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Core Systems */}
        <section id="features" className="relative py-20 md:py-32">
          <AnimatedGridBackground variant="dense" />
          
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <Badge className="mb-4 bg-emerald-500/20 text-emerald-400 border-emerald-400/30 font-mono uppercase">Features</Badge>
                <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white hud-text-glow">What You Get</h2>
                <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
                  Tools designed to make finding and managing Minecraft communities easier and safer.
                </p>
              </div>
              
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    icon: Shield,
                    title: "Your Reputation Passport",
                    description: "Build trust that follows you everywhere. Your reputation works across all ServerHeaven servers."
                  },
                  {
                    icon: Zap,
                    title: "Show Your Skills", 
                    description: "Upload builds, timelapses, and creations to attract servers that match your playstyle."
                  },
                  {
                    icon: Target,
                    title: "Smart Discovery",
                    description: "Find servers that fit your preferences, schedule, and gaming style through intelligent matching."
                  }
                ].map((feature, index) => (
                  <div key={index} className="hud-panel p-6 rounded-xl transition-all duration-300 hover:shadow-hud-active group">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 rounded-lg border border-emerald-400/30">
                        <feature.icon className="h-6 w-6 text-emerald-400" />
                      </div>
                      <h3 className="text-xl text-white font-semibold font-mono">{feature.title}</h3>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Mission Statement */}
        <section className="relative py-20 md:py-32">
          <div className="w-full px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
            <div className="text-center space-y-8">
              <h2 className="text-3xl md:text-5xl font-bold text-white hud-text-glow">Free For Everyone</h2>
              <p className="text-xl text-gray-300 leading-relaxed">
                ServerHeaven is <span className="text-emerald-400 font-semibold">completely free</span> because 
                every Minecraft player deserves access to trusted communities. Our mission is to eliminate the guesswork 
                and create safer connections through <span className="text-emerald-400 font-semibold">transparency</span>, 
                <span className="text-emerald-400 font-semibold"> verified players</span>, and 
                <span className="text-emerald-400 font-semibold"> honest feedback</span>.
              </p>
            </div>
          </div>
        
          {/* Final CTA */}
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-4xl mt-16">
            <div className="hud-panel p-12 rounded-2xl">
              <Badge className="mb-6 bg-emerald-500/20 text-emerald-400 border-emerald-400/30 font-mono uppercase">Join The Community</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white hud-text-glow">Ready to Get Started?</h2>
              <p className="text-lg mb-8 max-w-2xl mx-auto text-muted-foreground">
                Join the waitlist and get early access to ServerHeaven&apos;s smart matchmaking for Minecraft communities.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold shadow-glow-lg uppercase tracking-wider"
                  onClick={openLoginModal}
                >
                  Join Beta Access
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Link href="https://discord.gg/h6VVzbZU" target="_blank" rel="noopener noreferrer">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full border-emerald-400/50 text-emerald-400 hover:bg-emerald-400/10 hover:text-emerald-300 group transition-all duration-300 uppercase tracking-wider"
                  >
                    <DiscordIcon className="mr-2 h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                    Join Discord
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* HUD Footer */}
        <footer className="py-12 border-t border-emerald-400/20 hud-panel">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center gap-3 mb-6 md:mb-0">
                <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-glow-sm">
                  <CloudCog className="h-6 w-6 text-white" />
                </div>
                <span className="font-bold text-white font-mono hud-text-glow">
                  SERVER<span className="text-emerald-400">HEAVEN</span>
                </span>
              </div>
              
              <div className="flex gap-8 mb-6 md:mb-0">
                <Link href="/terms" className="text-sm text-muted-foreground hover:text-emerald-400 transition-colors font-mono uppercase tracking-wider">
                  Terms
                </Link>
                <Link href="/privacy" className="text-sm text-muted-foreground hover:text-emerald-400 transition-colors font-mono uppercase tracking-wider">
                  Privacy
                </Link>
                <Link href="/docs" className="text-sm text-muted-foreground hover:text-emerald-400 transition-colors font-mono uppercase tracking-wider">
                  Documentation
                </Link>
              </div>
            </div>
            
            <div className="mt-8 pt-8 border-t border-emerald-400/20 text-center">
              <p className="text-xs text-muted-foreground font-mono">
                <span className="text-emerald-400">MINECRAFT COMMUNITY PLATFORM</span> — © {new Date().getFullYear()} — Independent of Mojang/Microsoft
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

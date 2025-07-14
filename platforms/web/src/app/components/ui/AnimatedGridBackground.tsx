"use client";

import React, { useState, useEffect } from 'react';

interface AnimatedGridBackgroundProps {
  className?: string;
  variant?: 'default' | 'dense' | 'sparse';
  animationType?: 'default' | 'fps';
}

const Particle = ({ top, left }: { top: string, left: string }) => (
    <div
        className="absolute w-1 h-1 bg-emerald-400/30 rounded-full"
        style={{ top, left }}
    />
);


export function AnimatedGridBackground({ className = "", variant = 'default', animationType = 'fps' }: AnimatedGridBackgroundProps) {
  const gridSize = variant === 'dense' ? 20 : variant === 'sparse' ? 60 : 40;
  const numParticles = 12;

  const [particlePositions, setParticlePositions] = useState(() =>
    [...Array(numParticles)].map(() => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
    }))
  );

  useEffect(() => {
    if (animationType === 'fps') {
      const intervalId = setInterval(() => {
        setParticlePositions(
          [...Array(numParticles)].map(() => ({
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }))
        );
      }, 1000); // Update all particles every 1 second (1 FPS)

      return () => clearInterval(intervalId);
    }
  }, [animationType, numParticles]);
  
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {/* Base grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(52, 211, 153, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(52, 211, 153, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: `${gridSize}px ${gridSize}px`,
        }}
      />
      
      {/* Animated grid overlay */}
      <div 
        className="absolute inset-0 opacity-[0.08] animate-grid-flow"
        style={{
          backgroundImage: `
            linear-gradient(rgba(52, 211, 153, 0.6) 1px, transparent 1px),
            linear-gradient(90deg, rgba(52, 211, 153, 0.6) 1px, transparent 1px)
          `,
          backgroundSize: `${gridSize * 2}px ${gridSize * 2}px`,
        }}
      />
      
      {/* Scanning line effect */}
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-emerald-400 to-transparent animate-scanner opacity-40" 
           style={{animationDelay: '0s'}} />
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-emerald-300 to-transparent animate-scanner opacity-20" 
           style={{animationDelay: '2s'}} />
      
      {/* Corner HUD elements */}
      <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-emerald-400/40" />
      <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-emerald-400/40" />
      <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-emerald-400/40" />
      <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-emerald-400/40" />
      
      {/* Floating particles */}
      <div className="absolute inset-0">
        {animationType === 'fps'
          ? particlePositions.map((pos, i) => (
              <Particle key={i} top={pos.top} left={pos.left} />
            ))
          : [...Array(numParticles)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-emerald-400/30 rounded-full animate-pulse-slow"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${2 + Math.random() * 2}s`,
                }}
              />
            ))}
      </div>
      
      {/* Central focus ring */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full border border-emerald-400/20 animate-pulse-slow" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full border border-emerald-400/10 animate-pulse-slow" 
           style={{animationDelay: '1s'}} />
    </div>
  );
}

export default AnimatedGridBackground; 
import React, { useEffect, useState } from 'react';

/**
 * Living Aurora / Mesh Gradient Background + Subtle Paper Noise
 * Includes gentle scroll parallax for floating pastel stars and sticker elements.
 */
export function Decorations() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY || 0);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed inset-0 w-full max-w-full pointer-events-none overflow-hidden z-0 select-none" aria-hidden="true">
      {/* 1. Subtle Paper Texture Noise Overlay */}
      <div className="absolute inset-0 bg-noise-overlay pointer-events-none z-10" />

      {/* 2. Slow Living Aurora Mesh Gradient Blobs (CSS animate-aurora) */}
      {/* Mint Green Aura (Top Left) */}
      <div
        className="absolute -top-32 -left-28 w-[32rem] h-[32rem] sm:w-[44rem] sm:h-[44rem] rounded-full bg-[#CDF5B5]/60 dark:bg-[#1E3B28]/35 blur-[100px] animate-aurora"
        style={{ animationDuration: '22s' }}
      />

      {/* Soft Purple & Blue Aura (Top Right) */}
      <div
        className="absolute -top-24 -right-28 w-[30rem] h-[30rem] sm:w-[42rem] sm:h-[42rem] rounded-full bg-[#D5DDF0]/70 dark:bg-[#1E2B4B]/35 blur-[100px] animate-aurora-slow"
        style={{ animationDuration: '26s' }}
      />

      {/* Sweet Strawberry Pink Aura (Mid Left) */}
      <div
        className="absolute top-[38%] -left-36 w-[28rem] h-[28rem] sm:w-[40rem] sm:h-[40rem] rounded-full bg-[#E8B4D6]/60 dark:bg-[#431B34]/30 blur-[100px] animate-aurora"
        style={{ animationDuration: '24s' }}
      />

      {/* Warm Sunny Butter Yellow Aura (Mid Right) */}
      <div
        className="absolute top-[55%] -right-32 w-[28rem] h-[28rem] sm:w-[38rem] sm:h-[38rem] rounded-full bg-[#FFF0A0]/70 dark:bg-[#3E3418]/35 blur-[95px] animate-aurora-slow"
        style={{ animationDuration: '28s' }}
      />

      {/* Bottom Center Lavender / Mint Aura */}
      <div
        className="absolute -bottom-36 left-[20%] w-[34rem] h-[34rem] rounded-full bg-[#D5DDF0]/55 dark:bg-[#1C2840]/30 blur-[110px] animate-aurora"
        style={{ animationDuration: '20s' }}
      />

      {/* 3. Floating Sticker Decors with Smooth Scroll Parallax */}
      {/* Top Left Sparkle Star */}
      <div
        className="absolute top-28 left-[10%] opacity-85 transition-transform duration-75 ease-out"
        style={{ transform: `translateY(${scrollY * -0.04}px)` }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="#FFD95A" className="drop-shadow-sm animate-pulse">
          <path d="M12 0Q12 12 0 12Q12 12 12 24Q12 12 24 12Q12 12 12 0Z" />
        </svg>
      </div>

      {/* Top Right Pink Cross (+) */}
      <div
        className="absolute top-36 right-[12%] opacity-80 transition-transform duration-75 ease-out"
        style={{ transform: `translateY(${scrollY * -0.06}px)` }}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" stroke="#F58DB8" strokeWidth="3.5" strokeLinecap="round">
          <line x1="10" y1="2" x2="10" y2="18" />
          <line x1="2" y1="10" x2="18" y2="10" />
        </svg>
      </div>

      {/* Mid Left Blue Star */}
      <div
        className="absolute top-[42%] left-[4%] opacity-80 transition-transform duration-75 ease-out"
        style={{ transform: `translateY(${scrollY * -0.03}px)` }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="#5B86C8" className="drop-shadow-sm">
          <path d="M12 0Q12 12 0 12Q12 12 12 24Q12 12 24 12Q12 12 12 0Z" />
        </svg>
      </div>

      {/* Mid Right Pink Heart */}
      <div
        className="absolute top-[52%] right-[5%] opacity-80 transition-transform duration-75 ease-out"
        style={{ transform: `translateY(${scrollY * -0.05}px)` }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="#F58DB8" className="drop-shadow-sm">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </div>

      {/* Bottom Left Yellow Cross (+) */}
      <div
        className="absolute top-[72%] left-[6%] opacity-75 transition-transform duration-75 ease-out"
        style={{ transform: `translateY(${scrollY * -0.02}px)` }}
      >
        <svg width="18" height="18" viewBox="0 0 20 20" stroke="#FFD95A" strokeWidth="3" strokeLinecap="round">
          <line x1="10" y1="2" x2="10" y2="18" />
          <line x1="2" y1="10" x2="18" y2="10" />
        </svg>
      </div>
    </div>
  );
}

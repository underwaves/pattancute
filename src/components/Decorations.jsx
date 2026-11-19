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

      {/* 2. Seamless Ambient Mesh Wash Base (ให้สีฟุ้งนวลสม่ำเสมอทั่วทั้งหน้าจอ) */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#FFF3D6]/25 via-[#FDF0F6]/30 to-[#EBF2FF]/30 dark:from-[#1A263D]/25 dark:via-[#261A2B]/20 dark:to-[#172338]/25 pointer-events-none" />

      {/* 3. Slow Living Aurora Mesh Gradient Blobs (ฟุ้ง นวล ละมุน สม่ำเสมอกัน) */}
      {/* Top Center / Hero Glow (Warm Peach & Vanilla) */}
      <div
        className="absolute -top-28 left-1/2 -translate-x-1/2 w-[46rem] h-[34rem] sm:w-[60rem] sm:h-[42rem] rounded-full bg-[#FFF0E0]/45 dark:bg-[#3B261D]/20 blur-[150px] animate-aurora-slow"
        style={{ animationDuration: '24s' }}
      />

      {/* Top Left (Strawberry Milk Pink) */}
      <div
        className="absolute -top-20 -left-20 w-[42rem] h-[42rem] sm:w-[54rem] sm:h-[54rem] rounded-full bg-[#FADCE8]/45 dark:bg-[#3D1A30]/25 blur-[140px] animate-aurora"
        style={{ animationDuration: '22s' }}
      />

      {/* Top Right (Baby Powder Blue) */}
      <div
        className="absolute -top-20 -right-20 w-[42rem] h-[42rem] sm:w-[54rem] sm:h-[54rem] rounded-full bg-[#DCE7FC]/50 dark:bg-[#1A2C4A]/25 blur-[140px] animate-aurora-slow"
        style={{ animationDuration: '26s' }}
      />

      {/* Mid Center (Soft Lavender Dream) */}
      <div
        className="absolute top-[32%] left-1/2 -translate-x-1/2 w-[44rem] h-[44rem] sm:w-[58rem] sm:h-[58rem] rounded-full bg-[#EFE3FC]/40 dark:bg-[#2A1C3E]/20 blur-[150px] animate-aurora"
        style={{ animationDuration: '25s' }}
      />

      {/* Mid Left (Soft Matcha Cream / Mint) */}
      <div
        className="absolute top-[48%] -left-24 w-[38rem] h-[38rem] sm:w-[50rem] sm:h-[50rem] rounded-full bg-[#E2F7DF]/40 dark:bg-[#183424]/20 blur-[140px] animate-aurora-slow"
        style={{ animationDuration: '28s' }}
      />

      {/* Mid Right (Warm Buttercream Glow) */}
      <div
        className="absolute top-[52%] -right-24 w-[38rem] h-[38rem] sm:w-[50rem] sm:h-[50rem] rounded-full bg-[#FFF3D0]/45 dark:bg-[#382E16]/20 blur-[140px] animate-aurora"
        style={{ animationDuration: '24s' }}
      />

      {/* Bottom Center (Soft Periwinkle & Rose Cushion) */}
      <div
        className="absolute -bottom-28 left-1/2 -translate-x-1/2 w-[46rem] h-[40rem] sm:w-[62rem] sm:h-[46rem] rounded-full bg-gradient-to-r from-[#FADCE8]/35 via-[#DCE7FC]/40 to-[#FFF3D0]/35 dark:from-[#3D1A30]/20 dark:via-[#1A2C4A]/20 dark:to-[#382E16]/20 blur-[150px] animate-aurora-slow"
        style={{ animationDuration: '22s' }}
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

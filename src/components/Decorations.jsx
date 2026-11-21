import React from 'react';

/**
 * Refined Editorial Silk Mesh Background
 * Combines luminous dusty-rose & slate-blue aurora silk, soft architectural grid/dots,
 * and delicate hairline geometric arcs for a mature, modern boutique aesthetic.
 */
export function Decorations() {
  return (
    <div
      className="fixed inset-0 w-full max-w-full pointer-events-none overflow-hidden z-0 select-none"
      aria-hidden="true"
    >
      {/* 1. Base Silk Gradient Wash */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FBF4F7] via-[#F7F6F4] to-[#EFF4FC] dark:from-[#0C1322] dark:via-[#111827] dark:to-[#131C31]" />

      {/* 2. Luminous Multi-Tone Silk Aurora Mesh (ฟุ้ง นวล มีมิติ ไม่จืด) */}
      {/* Top Left: Dusty Rose Silk */}
      <div
        className="absolute -top-28 -left-24 w-[38rem] h-[38rem] sm:w-[52rem] sm:h-[52rem] rounded-full bg-[#F4C4DA]/55 dark:bg-[#5E2344]/35 blur-[120px] animate-aurora"
        style={{ animationDuration: '24s' }}
      />

      {/* Top Right: Periwinkle Slate Silk */}
      <div
        className="absolute -top-24 -right-24 w-[40rem] h-[38rem] sm:w-[54rem] sm:h-[50rem] rounded-full bg-[#C3D8FA]/60 dark:bg-[#1B3763]/40 blur-[125px] animate-aurora-slow"
        style={{ animationDuration: '28s' }}
      />

      {/* Top Center: Warm Champagne Pearl Highlight */}
      <div
        className="absolute -top-20 left-1/2 -translate-x-1/2 w-[36rem] h-[24rem] sm:w-[50rem] sm:h-[30rem] rounded-full bg-[#FBE5CC]/55 dark:bg-[#3A2B26]/25 blur-[110px]"
      />

      {/* Mid Left: Soft Iris Lavender */}
      <div
        className="absolute top-[36%] -left-20 w-[34rem] h-[34rem] sm:w-[46rem] sm:h-[46rem] rounded-full bg-[#DFD2F8]/50 dark:bg-[#2F2152]/30 blur-[130px] animate-aurora-slow"
        style={{ animationDuration: '26s' }}
      />

      {/* Mid Right: Soft Rose Champagne */}
      <div
        className="absolute top-[42%] -right-20 w-[34rem] h-[34rem] sm:w-[46rem] sm:h-[46rem] rounded-full bg-[#F7D2E2]/50 dark:bg-[#4B1F3A]/30 blur-[130px] animate-aurora"
        style={{ animationDuration: '22s' }}
      />

      {/* Bottom Center: Balanced Slate-Rose Cushion */}
      <div
        className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-[48rem] h-[34rem] sm:w-[68rem] sm:h-[42rem] rounded-full bg-gradient-to-r from-[#F4C4DA]/45 via-[#D9D4F5]/45 to-[#C3D8FA]/50 dark:from-[#4B1F3A]/25 dark:via-[#261E47]/25 dark:to-[#1B3763]/30 blur-[135px] animate-aurora-slow"
        style={{ animationDuration: '30s' }}
      />

      {/* 3. Architectural Subtle Hairline Grid (fades smoothly outward) */}
      <div
        className="absolute inset-0 bg-editorial-grid opacity-80 dark:opacity-70"
        style={{
          maskImage: 'radial-gradient(ellipse 80% 65% at 50% 25%, black 20%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 65% at 50% 25%, black 20%, transparent 100%)',
        }}
      />

      {/* 4. Fine Dot Matrix Accent near corners */}
      <div
        className="absolute inset-0 bg-editorial-dots opacity-55 dark:opacity-45"
        style={{
          maskImage: 'radial-gradient(ellipse 65% 55% at 50% 50%, transparent 30%, black 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 65% 55% at 50% 50%, transparent 30%, black 100%)',
        }}
      />

      {/* 5. Delicate Luxury Editorial Line Art (Ultra-thin orbital arcs & silk curves) */}
      <svg
        className="absolute inset-0 w-full h-full opacity-50 dark:opacity-30"
        viewBox="0 0 1440 900"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="silkArc1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#DF6E9B" stopOpacity="0" />
            <stop offset="50%" stopColor="#DF6E9B" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#4B72B0" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="silkArc2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4B72B0" stopOpacity="0" />
            <stop offset="50%" stopColor="#4B72B0" stopOpacity="0.38" />
            <stop offset="100%" stopColor="#DF6E9B" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Sweeping Top Orbital Ring */}
        <ellipse
          cx="720"
          cy="110"
          rx="620"
          ry="210"
          stroke="url(#silkArc1)"
          strokeWidth="1.2"
          transform="rotate(-4 720 110)"
        />

        {/* Secondary Counter Silk Arc */}
        <path
          d="M -80 560 C 320 380, 680 720, 1080 510 C 1260 415, 1380 430, 1520 490"
          stroke="url(#silkArc2)"
          strokeWidth="1.15"
        />

        {/* Lower Soft Ribbon */}
        <path
          d="M -60 760 C 360 660, 740 850, 1180 710 C 1310 670, 1410 690, 1520 730"
          stroke="url(#silkArc1)"
          strokeWidth="1"
          strokeDasharray="4 6"
        />

        {/* Refined Minimalist Hairline Diamond Glints (Subtle & Mature) */}
        <g opacity="0.65">
          <path
            d="M 190 190 L 194 198 L 202 202 L 194 206 L 190 214 L 186 206 L 178 202 L 186 198 Z"
            fill="#DF6E9B"
          />
          <circle cx="1245" cy="175" r="3" fill="#4B72B0" opacity="0.55" />
          <circle cx="1245" cy="175" r="10" stroke="#4B72B0" strokeWidth="0.9" opacity="0.35" />
          <path
            d="M 1295 560 L 1298 566 L 1304 569 L 1298 572 L 1295 578 L 1292 572 L 1286 569 L 1292 566 Z"
            fill="#4B72B0"
          />
          <circle cx="148" cy="645" r="2.5" fill="#DF6E9B" opacity="0.5" />
          <circle cx="148" cy="645" r="9" stroke="#DF6E9B" strokeWidth="0.9" opacity="0.3" />
        </g>
      </svg>

      {/* 6. Fine Paper Grain Overlay for Velvety Finish */}
      <div className="absolute inset-0 bg-noise-overlay pointer-events-none z-10" />
    </div>
  );
}

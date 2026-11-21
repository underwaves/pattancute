import React from 'react';

/**
 * Refined Ambient Mesh Gradient Background + Subtle Paper Grain
 * Soft, even, and atmospheric without distracting floating cartoon stickers.
 */
export function Decorations() {
  return (
    <div
      className="fixed inset-0 w-full max-w-full pointer-events-none overflow-hidden z-0 select-none"
      aria-hidden="true"
    >
      {/* 1. Subtle Paper Grain Overlay */}
      <div className="absolute inset-0 bg-noise-overlay pointer-events-none z-10" />

      {/* 2. Seamless Even Ambient Wash Base */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#FBF4EB]/40 via-[#FAF2F6]/35 to-[#EEF3FB]/40 dark:from-[#0F172A]/40 dark:via-[#1E1B2E]/25 dark:to-[#0F1E33]/35 pointer-events-none" />

      {/* 3. Slow Sophisticated Aurora Mesh Blobs (ฟุ้ง นวล สุขุม สม่ำเสมอ) */}
      {/* Top Center (Champagne & Soft Pearl) */}
      <div
        className="absolute -top-32 left-1/2 -translate-x-1/2 w-[50rem] h-[34rem] sm:w-[66rem] sm:h-[42rem] rounded-full bg-[#F8EFE6]/50 dark:bg-[#2A2230]/20 blur-[150px] animate-aurora-slow"
        style={{ animationDuration: '26s' }}
      />

      {/* Top Left (Dusty Rose Mist) */}
      <div
        className="absolute -top-24 -left-24 w-[42rem] h-[42rem] sm:w-[54rem] sm:h-[54rem] rounded-full bg-[#F3DCE7]/40 dark:bg-[#351B2E]/25 blur-[150px] animate-aurora"
        style={{ animationDuration: '24s' }}
      />

      {/* Top Right (Soft Slate Periwinkle) */}
      <div
        className="absolute -top-24 -right-24 w-[42rem] h-[42rem] sm:w-[54rem] sm:h-[54rem] rounded-full bg-[#DCE6F7]/45 dark:bg-[#162742]/25 blur-[150px] animate-aurora-slow"
        style={{ animationDuration: '28s' }}
      />

      {/* Mid Center (Muted Lavender Silk) */}
      <div
        className="absolute top-[34%] left-1/2 -translate-x-1/2 w-[46rem] h-[42rem] sm:w-[60rem] sm:h-[52rem] rounded-full bg-[#EAE4F5]/35 dark:bg-[#221A35]/20 blur-[160px] animate-aurora"
        style={{ animationDuration: '26s' }}
      />

      {/* Bottom Wash (Balanced Rose & Slate Cushion) */}
      <div
        className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-[48rem] h-[38rem] sm:w-[64rem] sm:h-[46rem] rounded-full bg-gradient-to-r from-[#F3DCE7]/30 via-[#DCE6F7]/35 to-[#F8EFE6]/30 dark:from-[#351B2E]/20 dark:via-[#162742]/20 dark:to-[#242030]/20 blur-[160px] animate-aurora-slow"
        style={{ animationDuration: '24s' }}
      />
    </div>
  );
}

import React from 'react';

/**
 * Cute Cloud / Wave Section Divider (Instead of harsh straight lines)
 */
export function SectionDivider({ className = "my-6", variant = "clouds" }) {
  if (variant === "wave") {
    return (
      <div className={`w-full max-w-2xl mx-auto px-4 overflow-hidden select-none pointer-events-none opacity-40 ${className}`}>
        <svg viewBox="0 0 600 24" fill="none" className="w-full h-4" preserveAspectRatio="none">
          <path
            d="M0 12 Q 75 22 150 12 T 300 12 T 450 12 T 600 12"
            stroke="#5B86C8"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="6 8"
          />
        </svg>
      </div>
    );
  }

  return (
    <div className={`w-full max-w-2xl mx-auto px-4 flex items-center justify-center gap-3 overflow-hidden select-none pointer-events-none opacity-60 ${className}`}>
      <span className="h-0.5 flex-1 bg-gradient-to-r from-transparent via-[#F58DB8]/30 to-[#F58DB8]/50 rounded-full" />
      <div className="flex items-center gap-1.5 text-pattan-pink">
        <svg width="24" height="14" viewBox="0 0 24 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 12h14a4 4 0 0 0 0-8 5.5 5.5 0 0 0-4.8 2.8A4.5 4.5 0 0 0 5 4a4 4 0 0 0 0 8z" fill="#F58DB8" opacity="0.5"/>
        </svg>
        <span className="text-xs text-pattan-yellow font-bold">✦</span>
        <svg width="24" height="14" viewBox="0 0 24 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 12h14a4 4 0 0 0 0-8 5.5 5.5 0 0 0-4.8 2.8A4.5 4.5 0 0 0 5 4a4 4 0 0 0 0 8z" fill="#5B86C8" opacity="0.4"/>
        </svg>
      </div>
      <span className="h-0.5 flex-1 bg-gradient-to-l from-transparent via-[#5B86C8]/30 to-[#5B86C8]/50 rounded-full" />
    </div>
  );
}

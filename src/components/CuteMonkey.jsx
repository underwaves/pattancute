import React from 'react';

/**
 * Super adorable monkey mascot component matching the authentic Pattan Cute logo design.
 * Features:
 * - Golden party hat with pink cherry/pom-pom on top
 * - Cute round ears with peach inner folds
 * - Soft cream-peach heart-shaped face mask
 * - Sparkling anime eyes with double catchlights
 * - Rosy blushing pink cheeks
 * - Expressive moods: 'happy' | 'wink' | 'love' | 'cheer'
 */
export function CuteMonkey({ className = "w-16 h-16", mood = "happy" }) {
  return (
    <svg
      viewBox="0 0 200 170"
      className={`${className} max-w-full max-h-full shrink-0 transition-transform duration-300 hover:scale-110 select-none`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        {/* Soft blush radial gradient */}
        <radialGradient id="monkeyBlush" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FF7CA7" stopOpacity="0.85" />
          <stop offset="65%" stopColor="#FFA6C5" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#FFA6C5" stopOpacity="0" />
        </radialGradient>

        {/* Golden party hat gradient */}
        <linearGradient id="monkeyHatGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFE47A" />
          <stop offset="100%" stopColor="#F5B324" />
        </linearGradient>

        {/* Fur warm brown gradient */}
        <linearGradient id="monkeyFurGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#C98F67" />
          <stop offset="100%" stopColor="#B3754B" />
        </linearGradient>

        {/* Inner ear peach gradient */}
        <linearGradient id="monkeyEarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF2E8" />
          <stop offset="100%" stopColor="#FFD8C7" />
        </linearGradient>

        {/* Filter for glowing love hearts */}
        <filter id="monkeyGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#FF5E93" floodOpacity="0.35" />
        </filter>
      </defs>

      {/* Cheering Little Paws (if mood is 'cheer') */}
      {mood === 'cheer' && (
        <g className="animate-wiggle origin-center">
          <circle cx="36" cy="56" r="14" fill="url(#monkeyFurGrad)" stroke="#8C522B" strokeWidth="3.5" />
          <circle cx="36" cy="56" r="8" fill="url(#monkeyEarGrad)" />
          <circle cx="164" cy="56" r="14" fill="url(#monkeyFurGrad)" stroke="#8C522B" strokeWidth="3.5" />
          <circle cx="164" cy="56" r="8" fill="url(#monkeyEarGrad)" />
        </g>
      )}

      {/* 1. Left & Right Ears */}
      <g id="monkey-ears">
        {/* Left Ear */}
        <circle cx="48" cy="94" r="28" fill="url(#monkeyFurGrad)" stroke="#8C522B" strokeWidth="4.5" />
        <circle cx="50" cy="94" r="16" fill="url(#monkeyEarGrad)" />
        <path d="M 45 86 Q 53 94 46 102" fill="none" stroke="#E8B097" strokeWidth="2.5" strokeLinecap="round" />

        {/* Right Ear */}
        <circle cx="152" cy="94" r="28" fill="url(#monkeyFurGrad)" stroke="#8C522B" strokeWidth="4.5" />
        <circle cx="150" cy="94" r="16" fill="url(#monkeyEarGrad)" />
        <path d="M 155 86 Q 147 94 154 102" fill="none" stroke="#E8B097" strokeWidth="2.5" strokeLinecap="round" />
      </g>

      {/* 2. Main Head Base */}
      <circle cx="100" cy="95" r="58" fill="url(#monkeyFurGrad)" stroke="#8C522B" strokeWidth="5" />

      {/* 3. Cream Peach Face (Heart/M-curved forehead) */}
      <path
        d="
          M 100 62
          C 86 50, 62 52, 56 70
          C 50 88, 52 110, 66 124
          C 78 135, 122 135, 134 124
          C 148 110, 150 88, 144 70
          C 138 52, 114 50, 100 62
          Z
        "
        fill="#FFF6EF"
        stroke="#8C522B"
        strokeWidth="3.2"
      />

      {/* Forehead center notch definition */}
      <path d="M 100 55 L 100 63" stroke="#8C522B" strokeWidth="3" strokeLinecap="round" />

      {/* 4. Rosy Pink Cheeks */}
      <ellipse cx="68" cy="106" rx="14" ry="9" fill="url(#monkeyBlush)" />
      <ellipse cx="132" cy="106" rx="14" ry="9" fill="url(#monkeyBlush)" />

      {/* 5. Eyes & Expressions */}
      {mood === 'wink' ? (
        <g id="monkey-eyes-wink">
          {/* Left eye winking */}
          <path d="M 72 92 Q 82 102 92 92" fill="none" stroke="#2D1C13" strokeWidth="4.5" strokeLinecap="round" />
          {/* Right eye big sparkling anime eye */}
          <ellipse cx="118" cy="92" rx="8.5" ry="11.5" fill="#2D1C13" />
          <circle cx="115.5" cy="88" r="4.2" fill="#FFFFFF" />
          <circle cx="120.5" cy="96" r="2" fill="#FFFFFF" />
        </g>
      ) : mood === 'love' ? (
        <g id="monkey-eyes-love" filter="url(#monkeyGlow)">
          {/* Left heart eye */}
          <path d="M 80 86 C 75 76, 62 76, 62 88 C 62 100, 80 110, 80 110 C 80 110, 98 100, 98 88 C 98 76, 85 76, 80 86 Z" fill="#FF5E93" />
          <circle cx="76" cy="86" r="2.5" fill="#FFFFFF" />
          {/* Right heart eye */}
          <path d="M 120 86 C 115 76, 102 76, 102 88 C 102 100, 120 110, 120 110 C 120 110, 138 100, 138 88 C 138 76, 125 76, 120 86 Z" fill="#FF5E93" />
          <circle cx="116" cy="86" r="2.5" fill="#FFFFFF" />
        </g>
      ) : (
        <g id="monkey-eyes-happy">
          {/* Left Eye */}
          <ellipse cx="82" cy="92" rx="8.5" ry="11.5" fill="#2D1C13" />
          <circle cx="79.5" cy="88" r="4.2" fill="#FFFFFF" />
          <circle cx="84.5" cy="96" r="2" fill="#FFFFFF" />

          {/* Right Eye */}
          <ellipse cx="118" cy="92" rx="8.5" ry="11.5" fill="#2D1C13" />
          <circle cx="115.5" cy="88" r="4.2" fill="#FFFFFF" />
          <circle cx="120.5" cy="96" r="2" fill="#FFFFFF" />
        </g>
      )}

      {/* 6. Cute Little Brown Button Nose */}
      <ellipse cx="100" cy="100" rx="4.8" ry="3.2" fill="#8C522B" />

      {/* 7. Cheerful Smiling Mouth with Pink Tongue */}
      <path
        d="M 91 108 Q 100 120 109 108"
        fill="#FF6891"
        stroke="#8C522B"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Little tooth sparkle */}
      <path d="M 97 108 Q 100 111 103 108 Z" fill="#FFFFFF" />

      {/* 8. Golden Party Hat on Top */}
      <g id="monkey-party-hat">
        {/* Hat cone */}
        <polygon
          points="100,24 114,46 86,46"
          fill="url(#monkeyHatGrad)"
          stroke="#8C522B"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        {/* Hat bottom curve */}
        <path d="M 85 46 Q 100 50 115 46" fill="none" stroke="#8C522B" strokeWidth="3" strokeLinecap="round" />
        
        {/* Pink Pom-pom on top */}
        <circle cx="100" cy="22" r="6.5" fill="#FF5E93" stroke="#8C522B" strokeWidth="2.5" />
        <circle cx="98" cy="20" r="2" fill="#FFFFFF" />
      </g>

      {/* 9. Tasteful Little Sparkles (✨) */}
      <g opacity="0.8">
        <path d="M 34 50 Q 34 56 28 56 Q 34 56 34 62 Q 34 56 40 56 Q 34 56 34 50 Z" fill="#FFD95A" />
        <path d="M 166 44 Q 166 51 159 51 Q 166 51 166 58 Q 166 51 173 51 Q 166 51 166 44 Z" fill="#FFD95A" />
      </g>
    </svg>
  );
}

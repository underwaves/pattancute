import React from 'react';

/**
 * Refined Minimal Hairline Section Divider
 */
export function SectionDivider({ className = 'my-6' }) {
  return (
    <div
      className={`w-full max-w-3xl mx-auto px-4 flex items-center justify-center gap-3 select-none pointer-events-none ${className}`}
      aria-hidden="true"
    >
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-300/60 dark:via-slate-700/60 to-slate-300/30 dark:to-slate-700/30" />
      <span className="w-1.5 h-1.5 rounded-full bg-pattan-pink/50" />
      <span className="h-px flex-1 bg-gradient-to-l from-transparent via-slate-300/60 dark:via-slate-700/60 to-slate-300/30 dark:to-slate-700/30" />
    </div>
  );
}

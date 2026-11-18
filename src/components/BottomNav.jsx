import React from 'react';
import { ArrowUp, MessageSquare, Star, MessageCircle } from 'lucide-react';
import { siteConfig } from '../config';

/**
 * Mobile Bottom Floating Glass Nav Pill
 * Quick navigation: Top / Reviews / Leave Credit / LINE Chat
 */
export function BottomNav({ onScrollToTop, onScrollToReviews, onScrollToForm }) {
  const lineUrl = siteConfig.contacts.line?.url || 'https://line.me/R/ti/p/@078yzbej';

  return (
    <nav
      className="fixed bottom-4 sm:hidden inset-x-4 max-w-[340px] mx-auto z-40 bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl border border-white/90 dark:border-slate-700/80 rounded-full shadow-glass-nav px-3 py-1.5 flex items-center justify-between font-sans"
      style={{ paddingBottom: 'calc(0.4rem + env(safe-area-inset-bottom, 0px))' }}
      aria-label="เมนูนำทางด่วน"
    >
      {/* 1. Scroll to Top */}
      <button
        onClick={onScrollToTop}
        type="button"
        className="flex flex-col items-center justify-center w-14 h-12 rounded-2xl text-slate-500 hover:text-pattan-blue active:scale-95 transition"
        aria-label="ขึ้นบนสุด"
      >
        <ArrowUp className="w-5 h-5 text-pattan-blue" />
        <span className="text-[10px] font-semibold mt-0.5">บนสุด</span>
      </button>

      {/* 2. Scroll to Reviews */}
      <button
        onClick={onScrollToReviews}
        type="button"
        className="flex flex-col items-center justify-center w-14 h-12 rounded-2xl text-slate-500 hover:text-pattan-blue active:scale-95 transition"
        aria-label="ดูรีวิว"
      >
        <MessageSquare className="w-5 h-5 text-pattan-blue" />
        <span className="text-[10px] font-semibold mt-0.5">รีวิว</span>
      </button>

      {/* 3. Leave Credit (Highlighted Pill) */}
      <button
        onClick={onScrollToForm}
        type="button"
        className="flex flex-col items-center justify-center px-3.5 h-10 rounded-full bg-gradient-to-r from-pattan-pink to-[#E26698] text-white shadow-sm active:scale-95 transition"
        aria-label="เขียนรีวิว"
      >
        <div className="flex items-center gap-1">
          <Star className="w-3.5 h-3.5 text-white fill-white" />
          <span className="text-xs font-bold tracking-wide">ให้คะแนน</span>
        </div>
      </button>

      {/* 4. LINE Chat */}
      <a
        href={lineUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col items-center justify-center w-14 h-12 rounded-2xl text-emerald-600 active:scale-95 transition"
        aria-label="แชท LINE ร้าน"
      >
        <div className="w-5 h-5 rounded-full bg-[#06C755] flex items-center justify-center text-white">
          <MessageCircle className="w-3.5 h-3.5 fill-current" />
        </div>
        <span className="text-[10px] font-semibold mt-0.5 text-emerald-700 dark:text-emerald-400">LINE</span>
      </a>
    </nav>
  );
}

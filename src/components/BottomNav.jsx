import React from 'react';
import { ArrowUp, MessageSquare, Star, MessageCircle, Tag } from 'lucide-react';
import { siteConfig } from '../config';

/**
 * Mobile Bottom Floating Glass Nav Pill
 * Quick navigation: Top / Pricing / Reviews / Leave Credit / LINE Chat
 */
export function BottomNav({ onScrollToTop, onScrollToPricing, onScrollToReviews, onScrollToForm }) {
  const lineUrl = siteConfig.contacts.line?.url || 'https://line.me/R/ti/p/@078yzbej';

  return (
    <nav
      className="fixed bottom-4 sm:hidden inset-x-2.5 max-w-[380px] mx-auto z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-white/90 dark:border-slate-700/80 rounded-full shadow-glass-nav px-2 py-1.5 flex items-center justify-between font-sans"
      style={{ paddingBottom: 'calc(0.35rem + env(safe-area-inset-bottom, 0px))' }}
      aria-label="เมนูนำทางด่วน"
    >
      {/* 1. Scroll to Top */}
      <button
        onClick={onScrollToTop}
        type="button"
        className="flex flex-col items-center justify-center flex-1 h-11 rounded-2xl text-slate-500 hover:text-pattan-blue active:scale-95 transition"
        aria-label="ขึ้นบนสุด"
      >
        <ArrowUp className="w-4 h-4 text-pattan-blue" />
        <span className="text-[9px] font-bold mt-0.5">บนสุด</span>
      </button>

      {/* 2. Scroll to Pricing */}
      <button
        onClick={onScrollToPricing}
        type="button"
        className="flex flex-col items-center justify-center flex-1 h-11 rounded-2xl text-slate-500 hover:text-pattan-pink active:scale-95 transition"
        aria-label="ราคาแอพ"
      >
        <Tag className="w-4 h-4 text-pattan-pink" />
        <span className="text-[9px] font-bold mt-0.5">ราคาแอพ</span>
      </button>

      {/* 3. Scroll to Reviews */}
      <button
        onClick={onScrollToReviews}
        type="button"
        className="flex flex-col items-center justify-center flex-1 h-11 rounded-2xl text-slate-500 hover:text-pattan-blue active:scale-95 transition"
        aria-label="ดูรีวิว"
      >
        <MessageSquare className="w-4 h-4 text-pattan-blue" />
        <span className="text-[9px] font-bold mt-0.5">รีวิว</span>
      </button>

      {/* 4. Leave Credit (Highlighted Pill) */}
      <button
        onClick={onScrollToForm}
        type="button"
        className="flex items-center justify-center gap-1 px-3 h-9 rounded-full bg-gradient-to-r from-pattan-pink to-[#E26698] text-white shadow-xs active:scale-95 transition shrink-0"
        aria-label="เขียนรีวิว"
      >
        <Star className="w-3 h-3 text-white fill-white" />
        <span className="text-[11px] font-bold tracking-tight">ให้คะแนน</span>
      </button>

      {/* 5. LINE Chat */}
      <a
        href={lineUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col items-center justify-center flex-1 h-11 rounded-2xl text-emerald-600 active:scale-95 transition"
        aria-label="แชท LINE ร้าน"
      >
        <div className="w-4 h-4 rounded-full bg-[#06C755] flex items-center justify-center text-white">
          <MessageCircle className="w-3 h-3 fill-current" />
        </div>
        <span className="text-[9px] font-bold mt-0.5 text-emerald-700 dark:text-emerald-400">LINE</span>
      </a>
    </nav>
  );
}

import React from 'react';
import { MessageSquare, Star, MessageCircle, Tag } from 'lucide-react';
import { siteConfig } from '../config';

/**
 * Mobile Bottom Floating Glass Nav Pill
 * Separate Pages Navigation: Reviews / Pricing / Rate Form / LINE Chat
 */
export function BottomNav({
  currentPage = 'reviews',
  onNavigateToReviews,
  onNavigateToPricing,
  onScrollToForm,
}) {
  const lineUrl = siteConfig.contacts.line?.url || 'https://line.me/R/ti/p/@078yzbej';

  return (
    <nav
      className="fixed bottom-4 sm:hidden inset-x-3 max-w-[370px] mx-auto z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-glass-nav px-2.5 py-1.5 flex items-center justify-between font-sans"
      style={{ paddingBottom: 'calc(0.35rem + env(safe-area-inset-bottom, 0px))' }}
      aria-label="เมนูนำทางหลัก"
    >
      {/* 1. Switch to Reviews Page */}
      <button
        onClick={onNavigateToReviews}
        type="button"
        className={`flex flex-col items-center justify-center flex-1 h-11 rounded-2xl transition-all active:scale-95 cursor-pointer ${
          currentPage === 'reviews'
            ? 'text-pattan-blue dark:text-pattan-blue-light font-black'
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
        }`}
        aria-label="หน้ารีวิวและเครดิตร้าน"
      >
        <div className="relative">
          <MessageSquare className="w-4 h-4" />
          {currentPage === 'reviews' && (
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-pattan-blue" />
          )}
        </div>
        <span className="text-[10px] mt-0.5">รีวิวร้าน</span>
      </button>

      {/* 2. Switch to Pricing Page */}
      <button
        onClick={onNavigateToPricing}
        type="button"
        className={`flex flex-col items-center justify-center flex-1 h-11 rounded-2xl transition-all active:scale-95 cursor-pointer ${
          currentPage === 'pricing'
            ? 'text-pattan-pink font-black'
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
        }`}
        aria-label="หน้าเรทราคาหารแอพ"
      >
        <div className="relative">
          <Tag className="w-4 h-4" />
          {currentPage === 'pricing' && (
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-pattan-pink" />
          )}
        </div>
        <span className="text-[10px] mt-0.5">เรทราคา</span>
      </button>

      {/* 3. Leave Credit (Highlighted Button) */}
      <button
        onClick={onScrollToForm}
        type="button"
        className="flex items-center justify-center gap-1 px-3.5 h-9 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs active:scale-95 transition shrink-0 cursor-pointer"
        aria-label="ให้คะแนนและรีวิวร้าน"
      >
        <Star className="w-3.5 h-3.5 text-pattan-pink fill-pattan-pink" />
        <span className="text-[11px] font-bold tracking-tight">ให้คะแนน</span>
      </button>

      {/* 4. LINE Chat */}
      <a
        href={lineUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col items-center justify-center flex-1 h-11 rounded-2xl text-emerald-600 active:scale-95 transition"
        aria-label="แชท LINE ร้าน"
      >
        <div className="w-5 h-5 rounded-full bg-[#06C755] flex items-center justify-center text-white shadow-xs">
          <MessageCircle className="w-3.5 h-3.5 fill-current" />
        </div>
        <span className="text-[9px] font-bold mt-0.5 text-emerald-700 dark:text-emerald-400">LINE</span>
      </a>
    </nav>
  );
}

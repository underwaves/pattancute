import React from 'react';
import { Star, ShieldCheck, CheckCircle2, ArrowDown, PenLine } from 'lucide-react';
import { BoutiqueSeal } from './BoutiqueSeal';
import { InteractiveMonkey } from './InteractiveMonkey';

export function Hero({
  onScrollToForm,
  totalReviews,
  averageRating,
  settings,
}) {
  const {
    welcomeChip = 'ศูนย์รวมรีวิวและเครดิตร้าน Pattancute',
    heroTitle = 'Pattancute',
    shopName = 'Pattancute',
    heroSubtitle = 'รวมความประทับใจและเครดิตจากลูกค้าตัวจริง 100%',
    heroCtaText = 'เขียนรีวิวให้เครดิตร้าน',
    badgeTrust1 = 'เปิดรับรีวิวจากลูกค้าทุกท่าน',
    badgeTrust2 = 'ร้านค้าปลอดภัย เชื่อถือได้ 100%',
    logoUrl = '/logo.png',
  } = settings || {};

  const displayTitle = heroTitle || shopName || 'Pattancute';

  return (
    <header className="relative pt-8 sm:pt-12 pb-8 px-4 text-center max-w-3xl mx-auto flex flex-col items-center font-sans">
      {/* 1. Boutique Club Status Pill */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/85 dark:bg-[#131C30]/85 backdrop-blur-md border border-pattan-pink/25 dark:border-slate-700/80 shadow-xs text-[11px] sm:text-xs font-semibold text-pattan-blue-deep dark:text-slate-200 mb-6 max-w-full">
        <span className="w-1.5 h-1.5 rounded-full bg-pattan-pink-deep shrink-0" />
        <span className="truncate">{welcomeChip}</span>
      </div>

      {/* 2. Signature Boutique Club Medallion + Rotating Typographic Seal */}
      <div className="relative my-1">
        <div className="absolute -inset-6 bg-gradient-to-tr from-pattan-pink/25 via-transparent to-pattan-blue/25 rounded-full blur-2xl opacity-80 pointer-events-none" />

        {/* Rotating Boutique Verification Seal orbiting top-left */}
        <div className="absolute -top-6 -left-10 sm:-left-12 z-20 text-pattan-blue-deep/75 dark:text-pattan-blue-light/75">
          <BoutiqueSeal size={76} text="VERIFIED CLUB · 100% REAL · " />
        </div>

        {/* Layered Double-Frame Logo Medallion */}
        <div className="relative p-1.5 rounded-[28px] bg-gradient-to-br from-white via-pattan-pink-soft to-pattan-blue-soft dark:from-slate-800 dark:via-slate-800 dark:to-slate-900 shadow-bento border border-white/90 dark:border-slate-700">
          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-[22px] p-2 bg-white dark:bg-slate-900 flex items-center justify-center overflow-hidden">
            <img
              src={logoUrl || '/logo.png'}
              alt={displayTitle}
              className="w-full h-full object-contain rounded-xl"
              loading="eager"
            />
          </div>
        </div>

        {/* Interactive Crayon Monkey Mascot sitting beside the logo */}
        <InteractiveMonkey
          className="absolute -bottom-2 -right-12 sm:-right-16 z-20"
          imgClassName="w-20 h-20 sm:w-24 sm:h-24"
          quotes={settings?.mascotQuotes}
          eager
        />

        {/* Crisp Verified Mark */}
        <div
          className="absolute -bottom-1.5 -left-1.5 z-20 w-8 h-8 rounded-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700 shadow-sm flex items-center justify-center"
          title="ร้านค้ายืนยันตัวตนแล้ว"
        >
          <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-50 dark:fill-emerald-950" />
        </div>
      </div>

      {/* 3. Signature Cute Brand Name Typography */}
      <h1 className="mt-4 text-4xl sm:text-5xl font-bold text-brand-gradient font-brand tracking-normal">
        {displayTitle}
      </h1>
      <p className="mt-2.5 text-sm sm:text-base font-medium text-slate-500 dark:text-slate-400 max-w-xl leading-relaxed">
        {heroSubtitle}
      </p>

      {/* 4. Clean Trust & Rating Metrics */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs font-semibold">
        {totalReviews > 0 ? (
          <div className="inline-flex items-center gap-1.5 bg-white/90 dark:bg-[#131C30]/90 px-3.5 py-1.5 rounded-full border border-white dark:border-slate-700 shadow-xs text-slate-700 dark:text-slate-200">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />
            <span className="tabular-nums font-bold">{averageRating.toFixed(1)}</span>
            <span className="text-slate-300 dark:text-slate-600">·</span>
            <span className="text-slate-500 dark:text-slate-400">จากทั้งหมด {totalReviews} รีวิว</span>
          </div>
        ) : (
          <div className="inline-flex items-center gap-1.5 bg-white/90 dark:bg-[#131C30]/90 px-3.5 py-1.5 rounded-full border border-white dark:border-slate-700 shadow-xs text-slate-600 dark:text-slate-300">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />
            <span>{badgeTrust1}</span>
          </div>
        )}

        <div className="inline-flex items-center gap-1.5 bg-white/90 dark:bg-[#131C30]/90 px-3.5 py-1.5 rounded-full border border-white dark:border-slate-700 shadow-xs text-slate-700 dark:text-slate-200">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          <span>{badgeTrust2}</span>
        </div>
      </div>

      {/* 5. Signature Midnight Blueberry & Frosted Secondary Actions */}
      <div className="mt-7 flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
        <button
          onClick={onScrollToForm}
          type="button"
          className="btn-jelly btn-signature w-full sm:w-auto min-h-[46px] px-7 py-3 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer"
        >
          <PenLine className="w-4 h-4 text-pattan-pink-light shrink-0" />
          <span>{heroCtaText}</span>
        </button>

        <a
          href="#reviews-section"
          className="w-full sm:w-auto min-h-[46px] px-6 py-3 rounded-2xl bg-white/85 dark:bg-[#131C30]/85 hover:bg-white dark:hover:bg-slate-800 active:scale-[0.98] text-pattan-blue-deep dark:text-slate-200 font-semibold text-sm border border-white dark:border-slate-700 shadow-xs transition-all duration-200 flex items-center justify-center gap-1.5"
        >
          <span>ดูรีวิวทั้งหมด ({totalReviews})</span>
          <ArrowDown className="w-3.5 h-3.5 text-pattan-pink-deep" />
        </a>
      </div>
    </header>
  );
}

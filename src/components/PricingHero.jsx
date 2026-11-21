import React from 'react';
import { ShieldCheck, Zap, Smartphone, Lock, CheckCircle2, Ticket } from 'lucide-react';
import { BoutiqueSeal } from './BoutiqueSeal';

const MARQUEE_ITEMS = [
  'NETFLIX 4K',
  'DISNEY+ HOTSTAR',
  'IQIYI VIP',
  'WETV VIP',
  'VIU PREMIUM',
  'AMAZON PRIME',
  'HBO MAX 4K',
  'YOUTUBE PREMIUM',
  'SPOTIFY PREMIUM',
  'CANVA PRO',
  'BILIBILI',
  'MONOMAX',
  'ONED',
];

export function PricingHero({ shopName = 'Pattancute', totalApps = 15, onOpenAdmin }) {
  return (
    <section className="relative pt-5 sm:pt-7 pb-3 px-4 overflow-hidden font-sans">
      <div className="relative z-10 max-w-6xl mx-auto space-y-4">
        {/* Main Editorial Pass Header Card */}
        <div className="relative overflow-hidden rounded-[26px] bg-white/75 dark:bg-[#131C30]/80 backdrop-blur-xl border border-white/90 dark:border-slate-700/60 shadow-bento p-5 sm:p-6">
          {/* Subtle Silk Brand Aura */}
          <div className="absolute -top-20 -right-12 w-72 h-72 rounded-full bg-gradient-to-br from-pattan-pink/20 to-pattan-blue/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Left: Signature Pass Title & Trust Strip */}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pattan-pink-soft/90 dark:bg-pink-950/40 border border-pattan-pink/25 text-[11px] font-bold text-pattan-pink-deep dark:text-pattan-pink">
                <Ticket className="w-3.5 h-3.5 shrink-0" />
                <span>VIP STREAMING PASS</span>
                <span className="opacity-40">•</span>
                <span className="text-pattan-blue-deep dark:text-pattan-blue-light">{totalApps} แอพแท้ลิขสิทธิ์</span>
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-pattan-blue-deep dark:text-white tracking-tight font-display leading-normal">
                เรทราคาหารแอพ{' '}
                <span className="inline-block font-brand font-bold text-brand-gradient tracking-normal">
                  {shopName}
                </span>
              </h1>

              {/* Compact Single-Line Trust Strip */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-0.5 text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400">
                <span className="inline-flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  ส่งไว 5–10 นาที
                </span>
                <span className="inline-flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  มีประกันดูแลตลอด
                </span>
                <span className="inline-flex items-center gap-1">
                  <Smartphone className="w-3.5 h-3.5 text-pattan-blue" />
                  มือถือ / ไอแพด / คอม / ทีวี
                </span>
                <span className="inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-pattan-pink-deep" />
                  คมชัด 4K HDR
                </span>
              </div>
            </div>

            {/* Right: Rotating Seal + Signature Admin Access */}
            <div className="flex items-center gap-4 shrink-0">
              <div className="hidden lg:block text-pattan-blue-deep/55 dark:text-pattan-blue-light/60">
                <BoutiqueSeal size={74} text="OFFICIAL RATES · FAST DELIVERY · VIP · " />
              </div>

              {onOpenAdmin && (
                <button
                  type="button"
                  onClick={onOpenAdmin}
                  className="btn-jelly btn-signature inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-white text-xs font-bold transition-all cursor-pointer whitespace-nowrap"
                  title="เข้าสู่ระบบหลังบ้านเพื่อแก้ไขเรทราคาและรูปภาพแอพ"
                >
                  <Lock className="w-3.5 h-3.5 text-pattan-pink-light" />
                  <span>เข้าหลังบ้าน / แก้ไขราคา</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Signature Editorial Marquee Ribbon (Unmistakable Boutique Cinema Touch) */}
        <div className="relative overflow-hidden rounded-2xl bg-white/65 dark:bg-[#131C30]/65 backdrop-blur-md border border-white/80 dark:border-slate-800/80 py-2">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-[#FAF6F0] dark:from-[#0D1322] to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-[#FAF6F0] dark:from-[#0D1322] to-transparent z-10" />

          <div className="animate-marquee flex items-center gap-6">
            {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-6 text-[10px] sm:text-[11px] font-bold tracking-[0.18em] text-pattan-blue-deep/65 dark:text-slate-400 whitespace-nowrap"
              >
                <span>{item}</span>
                <span className="text-pattan-pink text-[9px]">✦</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

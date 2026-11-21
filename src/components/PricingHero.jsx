import React from 'react';
import { Sparkles, ShieldCheck, Zap, Smartphone, Lock, CheckCircle2 } from 'lucide-react';

export function PricingHero({ shopName = 'Pattancute', totalApps = 15, onOpenAdmin }) {
  return (
    <section className="relative pt-5 sm:pt-7 pb-3 px-4 overflow-hidden font-sans">
      {/* Subtle Ambient Aura */}
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-[420px] h-40 bg-gradient-to-r from-pattan-pink/20 via-pattan-blue/15 to-pattan-yellow/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-200/70 dark:border-slate-800/80">
          {/* Left: Clean Modern Title & Subtitle */}
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 shadow-xs text-[11px] font-semibold text-slate-600 dark:text-slate-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              <span>ศูนย์รวมเรทราคาหารแอพแท้ 100%</span>
              <span className="text-slate-300 dark:text-slate-600">•</span>
              <span className="text-pattan-blue-deep dark:text-pattan-blue-light font-bold">{totalApps} แอพยอดนิยม</span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-pattan-blue-deep dark:text-white tracking-tight font-display leading-tight">
              เรทราคาหารแอพ{' '}
              <span className="text-pattan-pink-deep dark:text-pattan-pink">
                {shopName}
              </span>
            </h1>

            {/* Compact Single-Line Trust Strip */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-1 text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400">
              <span className="inline-flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                ส่งไว 5–10 นาที
              </span>
              <span className="inline-flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                มีประกันดูแลตลอดการใช้งาน
              </span>
              <span className="inline-flex items-center gap-1">
                <Smartphone className="w-3.5 h-3.5 text-pattan-blue" />
                มือถือ / ไอแพด / คอม / ทีวี
              </span>
              <span className="inline-flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-pattan-pink" />
                ลิขสิทธิ์แท้ คมชัด 4K
              </span>
            </div>
          </div>

          {/* Right: Prominent Admin / Manage Rates Button */}
          {onOpenAdmin && (
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={onOpenAdmin}
                className="btn-jelly inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-pattan-blue-deep dark:hover:bg-slate-100 text-xs font-bold shadow-md transition-all cursor-pointer whitespace-nowrap"
                title="เข้าสู่ระบบหลังบ้านเพื่อแก้ไขเรทราคาและรูปภาพแอพ"
              >
                <Lock className="w-3.5 h-3.5 text-pattan-pink dark:text-pattan-pink-deep" />
                <span>เข้าหลังบ้าน / แก้ไขราคา</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

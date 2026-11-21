import React from 'react';
import { Sparkles, ShieldCheck, Zap, MessageCircle, Smartphone } from 'lucide-react';

export function PricingHero({ shopName = 'Pattancute', totalApps = 15 }) {
  return (
    <section className="relative pt-6 sm:pt-10 pb-6 px-4 text-center overflow-hidden font-sans">
      {/* Decorative Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 bg-gradient-to-tr from-pattan-pink/20 to-pattan-blue/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto space-y-4">
        {/* Cute Welcome Chip */}
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/90 dark:bg-slate-800/90 border border-pattan-pink/30 shadow-xs text-xs font-bold text-pattan-pink-deep dark:text-pattan-pink animate-fade-in">
          <Sparkles className="w-3.5 h-3.5 text-pattan-yellow fill-pattan-yellow" />
          <span>ศูนย์รวมเรทราคาหารแอพแท้ 100%</span>
          <Sparkles className="w-3.5 h-3.5 text-pattan-yellow fill-pattan-yellow" />
        </div>

        {/* Main Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-pattan-blue-deep dark:text-white tracking-tight font-display">
          เรทราคาหารแอพพรีเมียม
        </h1>

        {/* Tagline */}
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-lg mx-auto leading-relaxed font-medium">
          ภาพยนตร์ ซีรีส์ อนิเมะ สตรีมมิ่งเพลง และแอพทำงานลิขสิทธิ์แท้ คมชัด 4K HDR มีทั้งเมลปิดรับเคลม จอส่วนตัว และยกแอคเคาท์ รวม {totalApps} แอพยอดฮิต
        </p>

        {/* 4 Bento Trust Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 max-w-xl mx-auto">
          <div className="p-2.5 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-slate-150 dark:border-slate-700 shadow-xs flex items-center gap-2 justify-center">
            <Zap className="w-4 h-4 text-amber-500 shrink-0" />
            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200">ส่งไวใน 5-10 นาที</span>
          </div>

          <div className="p-2.5 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-slate-150 dark:border-slate-700 shadow-xs flex items-center gap-2 justify-center">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200">มีประกันดูแลตลอด</span>
          </div>

          <div className="p-2.5 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-slate-150 dark:border-slate-700 shadow-xs flex items-center gap-2 justify-center">
            <Smartphone className="w-4 h-4 text-pattan-blue shrink-0" />
            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200">มือถือ / ไอแพด / ทีวี</span>
          </div>

          <div className="p-2.5 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-slate-150 dark:border-slate-700 shadow-xs flex items-center gap-2 justify-center">
            <MessageCircle className="w-4 h-4 text-[#06C755] shrink-0" />
            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200">แอดมินใจดี ตอบแชทไว</span>
          </div>
        </div>
      </div>
    </section>
  );
}

import React from 'react';
import { Heart, Sparkles, Lock } from 'lucide-react';
import { CuteMonkey } from './CuteMonkey';

export function Footer({ onOpenAdmin, settings }) {
  const currentYear = new Date().getFullYear();
  const shopName = settings?.shopName || 'Pattancute';
  const shopSubtitle = settings?.shopSubtitle || 'Pattancute.shop';

  return (
    <footer className="w-full border-t border-white/80 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl py-10 px-4 text-center mt-12 relative z-10 pb-24 sm:pb-10 font-sans">
      <div className="max-w-3xl mx-auto flex flex-col items-center justify-center gap-3">
        <CuteMonkey className="w-11 h-11 anim-float" mood="happy" />

        <div className="flex items-center gap-1.5 text-sm font-bold text-pattan-blue-deep dark:text-slate-200">
          <span>ขอบคุณลูกค้าที่น่ารักทุกคนที่แวะมาให้เครดิตน้า</span>
          <Heart className="w-4 h-4 text-pattan-pink fill-pattan-pink animate-pulse" />
        </div>

        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
          &copy; {currentYear} {shopName} &bull; <span className="text-pattan-blue-deep dark:text-pattan-blue-light font-bold">{shopSubtitle}</span> &bull; All rights reserved.
        </p>

        <div className="flex items-center gap-1 text-[11px] font-normal text-slate-400">
          <Sparkles className="w-3 h-3 text-pattan-yellow fill-pattan-yellow" />
          <span>ระบบบันทึกรีวิวและเครดิตร้านค้า ปลอดภัย โปร่งใส ตรวจสอบได้จริง 100%</span>
        </div>

        {/* Clear Button to Access Admin Panel */}
        <div className="pt-2">
          <button
            onClick={onOpenAdmin}
            type="button"
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-750 text-xs font-semibold text-slate-500 hover:text-pattan-blue dark:text-slate-400 dark:hover:text-pattan-blue-light border border-slate-200/80 dark:border-slate-700 shadow-xs transition active:scale-95 cursor-pointer"
            title="เข้าสู่ระบบจัดการหลังบ้าน (Admin)"
          >
            <Lock className="w-3.5 h-3.5 text-pattan-blue" />
            <span>เข้าสู่ระบบหลังบ้าน (Admin Panel)</span>
          </button>
        </div>
      </div>
    </footer>
  );
}

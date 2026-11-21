import React from 'react';
import { ShieldCheck, Lock } from 'lucide-react';

export function Footer({ onOpenAdmin, settings }) {
  const currentYear = new Date().getFullYear();
  const shopName = settings?.shopName || 'Pattancute';
  const shopSubtitle = settings?.shopSubtitle || 'Pattancute.shop';

  return (
    <footer className="w-full border-t border-slate-200/70 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl py-8 px-4 mt-10 relative z-10 pb-24 sm:pb-8 font-sans">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div className="space-y-1">
          <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-bold text-pattan-blue-deep dark:text-slate-200">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>
              ระบบบันทึกรีวิวและเรทราคา <span className="font-brand text-sm text-pattan-pink-deep dark:text-pattan-pink">{shopName}</span> · โปร่งใส ตรวจสอบได้จริง 100%
            </span>
          </div>
          <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
            &copy; {currentYear} <span className="font-brand font-bold text-slate-700 dark:text-slate-200">{shopName}</span> &bull;{' '}
            <span className="text-slate-700 dark:text-slate-300 font-semibold">{shopSubtitle}</span> &bull; All rights reserved.
          </p>
        </div>

        {/* Clear Button to Access Admin Panel */}
        <button
          onClick={onOpenAdmin}
          type="button"
          className="btn-jelly btn-signature inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-xs font-bold transition active:scale-95 cursor-pointer shrink-0"
          title="เข้าสู่ระบบจัดการหลังบ้าน (Admin)"
        >
          <Lock className="w-3.5 h-3.5 text-pattan-pink-light" />
          <span>เข้าสู่ระบบหลังบ้าน</span>
        </button>
      </div>
    </footer>
  );
}

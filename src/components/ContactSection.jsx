import React from 'react';
import { ExternalLink, Instagram, Facebook, Video, MessageCircle, Headphones } from 'lucide-react';
import { siteConfig } from '../config';

export function ContactSection({ contacts, shopName = 'Pattancute' }) {
  const c = contacts || siteConfig.contacts;
  const line = c.line;
  const ig = c.instagram;
  const fb = c.facebook;
  const tiktok = c.tiktok;
  const badgeText = c.badgeText || 'บริการตอบแชทไว ยินดีให้คำปรึกษา';

  return (
    <section className="w-full max-w-3xl mx-auto px-4 mb-20 font-sans">
      <div className="card-bento p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-pattan-pink/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-pattan-blue/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold border border-emerald-200/70 dark:border-emerald-800/60">
              <Headphones className="w-3.5 h-3.5 text-emerald-600" />
              <span>{badgeText}</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-extrabold text-pattan-blue-deep dark:text-white font-display tracking-tight">
              ติดต่อร้าน {shopName}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md leading-relaxed">
              สอบถามรายละเอียด สั่งซื้อแพ็กเกจ หรือแจ้งปัญหาการใช้งาน ทีมแอดมินพร้อมดูแลตลอดค่ะ
            </p>
          </div>

          {/* Primary LINE CTA */}
          {line && line.url && (
            <div className="shrink-0">
              <a
                href={line.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-jelly w-full sm:w-auto inline-flex items-center justify-center gap-2.5 min-h-[46px] px-6 py-3 rounded-2xl bg-[#06C755] hover:bg-[#05b34c] text-white font-bold text-sm shadow-sm group"
              >
                <MessageCircle className="w-4 h-4 fill-white shrink-0" />
                <span>{line.label || 'แชท LINE @078yzbej'}</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>
          )}
        </div>

        {/* Optional Other Social Links */}
        {((ig && ig.url) || (fb && fb.url) || (tiktok && tiktok.url)) && (
          <div className="relative z-10 mt-6 flex flex-wrap items-center justify-center sm:justify-start gap-2.5 pt-5 border-t border-slate-200/70 dark:border-slate-800">
            {ig && ig.url && (
              <a
                href={ig.url}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[38px] px-4 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold border border-slate-200/80 dark:border-slate-700 transition inline-flex items-center gap-2"
              >
                <Instagram className="w-3.5 h-3.5 text-pink-500" />
                <span>{ig.label || 'Instagram'}</span>
              </a>
            )}

            {fb && fb.url && (
              <a
                href={fb.url}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[38px] px-4 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold border border-slate-200/80 dark:border-slate-700 transition inline-flex items-center gap-2"
              >
                <Facebook className="w-3.5 h-3.5 text-blue-600" />
                <span>{fb.label || 'Facebook'}</span>
              </a>
            )}

            {tiktok && tiktok.url && (
              <a
                href={tiktok.url}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[38px] px-4 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold border border-slate-200/80 dark:border-slate-700 transition inline-flex items-center gap-2"
              >
                <Video className="w-3.5 h-3.5 text-slate-800 dark:text-white" />
                <span>{tiktok.label || 'TikTok'}</span>
              </a>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

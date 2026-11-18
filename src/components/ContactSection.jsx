import React from 'react';
import { ExternalLink, Instagram, Facebook, Video, Sparkles, MessageCircle } from 'lucide-react';
import { siteConfig } from '../config';
import { CuteMonkey } from './CuteMonkey';

export function ContactSection({ contacts, shopName = 'Pattancute' }) {
  const c = contacts || siteConfig.contacts;
  const line = c.line;
  const ig = c.instagram;
  const fb = c.facebook;
  const tiktok = c.tiktok;
  const badgeText = c.badgeText || 'แอดมินใจดี ยินดีให้บริการตอบแชท';

  return (
    <section className="w-full max-w-2xl mx-auto px-4 mb-24 font-sans">
      <div className="card-bento p-6 sm:p-9 text-center relative overflow-hidden">
        {/* Soft decorative background circles */}
        <div className="absolute -top-12 -right-12 w-36 h-36 rounded-full bg-[#FFD1E6]/30 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-36 h-36 rounded-full bg-[#D5DDF0]/40 blur-2xl pointer-events-none" />

        <div className="flex justify-center mb-3">
          <div className="p-1 rounded-full bg-white shadow-sticker anim-float">
            <CuteMonkey className="w-15 h-15 max-w-full max-h-full" mood="love" />
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold mb-2 border border-emerald-200 dark:border-emerald-800">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>{badgeText}</span>
        </div>

        <h3 className="text-2xl sm:text-3xl font-black text-pattan-blue dark:text-pattan-blue-light font-display">
          ติดต่อร้าน {shopName}
        </h3>
        <p className="mt-1 text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
          สอบถามรายละเอียด สั่งซื้อสินค้า หรือแจ้งปัญหาการจัดส่ง ทักแชทหาเราได้ทันทีเลยน้า~ 💖
        </p>

        {/* Big LINE Button in Jelly pill style */}
        {line && line.url && (
          <div className="mt-6">
            <a
              href={line.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-jelly w-full sm:w-auto inline-flex items-center justify-center gap-3 min-h-[52px] px-9 py-3.5 rounded-full bg-gradient-to-r from-[#06C755] to-[#05B34C] text-white font-bold text-base sm:text-lg shadow-jelly group"
            >
              {/* LINE Icon */}
              <div className="w-6 h-6 rounded-full bg-white text-[#06C755] flex items-center justify-center">
                <MessageCircle className="w-4 h-4 fill-current" />
              </div>
              <span className="tracking-wide">{line.label || 'แชท LINE @078yzbej'}</span>
              <ExternalLink className="w-4 h-4 opacity-80 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        )}

        {/* Other Social Links (Conditionally rendered if url is not empty) */}
        {((ig && ig.url) || (fb && fb.url) || (tiktok && tiktok.url)) && (
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 pt-5 border-t border-pattan-blue/10">
            {ig && ig.url && (
              <a
                href={ig.url}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[44px] px-5 py-2 rounded-full bg-white/80 hover:bg-white text-pattan-text-body text-sm font-bold border border-white shadow-xs transition inline-flex items-center gap-2 active:scale-95"
              >
                <Instagram className="w-4 h-4 text-pink-500" />
                <span>{ig.label || 'Instagram'}</span>
              </a>
            )}

            {fb && fb.url && (
              <a
                href={fb.url}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[44px] px-5 py-2 rounded-full bg-white/80 hover:bg-white text-pattan-text-body text-sm font-bold border border-white shadow-xs transition inline-flex items-center gap-2 active:scale-95"
              >
                <Facebook className="w-4 h-4 text-blue-600" />
                <span>{fb.label || 'Facebook'}</span>
              </a>
            )}

            {tiktok && tiktok.url && (
              <a
                href={tiktok.url}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[44px] px-5 py-2 rounded-full bg-white/80 hover:bg-white text-pattan-text-body text-sm font-bold border border-white shadow-xs transition inline-flex items-center gap-2 active:scale-95"
              >
                <Video className="w-4 h-4 text-slate-900" />
                <span>{tiktok.label || 'TikTok'}</span>
              </a>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

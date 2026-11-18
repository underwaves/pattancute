import React from 'react';
import { Star, Award, ShieldCheck, Heart } from 'lucide-react';
import { CuteMonkey } from './CuteMonkey';

/**
 * Score Summary Section in modern Soft Glass Bento Grid Style
 * Desktop: Asymmetric Bento Grid (top: 5 & 7, bottom: 6 & 6)
 * Mobile: Clean vertical stack
 */
export function ScoreSummary({ stats, bento }) {
  const { total = 0, average = 0, breakdown = {} } = stats || {};
  const {
    showGuarantee = false,
    guaranteeTitle = 'การันตีความน่าเชื่อถือ ตรวจสอบได้จริง',
    guaranteeDesc = 'ทุกรีวิวส่งตรงจากลูกค้าผู้มีอุปการคุณของ Pattancute ปลอดภัยและโปร่งใส 100%',
    thankYouTitle = 'ขอบคุณทุกท่านน้า~',
    thankYouDesc = 'ทุกคะแนนและคำติชมคือกำลังใจสำคัญที่ทำให้ร้านพัฒนาอย่างต่อเนื่องค่ะ ✨',
  } = bento || {};

  const getPercent = (count) => {
    if (!total || total === 0) return 0;
    return Math.round((count / total) * 100);
  };

  return (
    <section className="w-full max-w-4xl mx-auto px-4 mb-14 font-sans">
      {/* Bento Grid Container */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 sm:gap-4">
        
        {/* Bento 1: Big Score Card (5 cols on md) */}
        <div className="md:col-span-5 card-bento p-6 sm:p-7 flex flex-col justify-between relative overflow-hidden group">
          {/* Soft inner pastel glow */}
          <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-[#FFF0A0]/30 blur-2xl pointer-events-none" />
          
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-slate-700/60 border border-amber-200/80 text-xs font-bold text-amber-800 dark:text-amber-300 mb-3">
              <Award className="w-3.5 h-3.5 text-pattan-yellow fill-pattan-yellow" />
              <span>ความพึงพอใจโดยรวม</span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-5xl sm:text-6xl font-black text-pattan-blue dark:text-pattan-blue-light font-display tracking-tight">
                {total > 0 ? average.toFixed(1) : '5.0'}
              </span>
              <span className="text-xl font-bold text-slate-400">/ 5.0</span>
            </div>

            {/* Stars */}
            <div className="flex items-center gap-1.5 mt-2.5">
              {[1, 2, 3, 4, 5].map((s) => {
                const filled = s <= Math.round(average || 5);
                return (
                  <Star
                    key={s}
                    className={`w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:scale-110 ${
                      filled
                        ? 'text-pattan-yellow fill-pattan-yellow drop-shadow-xs'
                        : 'text-slate-200 dark:text-slate-700 fill-slate-200 dark:fill-slate-700'
                    }`}
                  />
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-pattan-blue/10 flex items-center justify-between">
            <span className="text-xs sm:text-sm font-semibold text-pattan-text-muted">
              {total > 0 ? `จากทั้งหมด ${total} รีวิว` : 'รอคุณเป็นคนแรกน้า~'}
            </span>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              ลูกค้าจริง 100%
            </span>
          </div>
        </div>

        {/* Bento 2: Rating Breakdown Bars (7 cols on md) */}
        <div className="md:col-span-7 card-bento p-6 sm:p-7 flex flex-col justify-center">
          <div className="text-xs font-bold uppercase tracking-wider text-pattan-blue-deep dark:text-slate-200 mb-3 flex items-center justify-between">
            <span>สัดส่วนคะแนนดาว</span>
            <span className="text-[11px] font-medium text-slate-400">เกณฑ์ 5–1 ดาว</span>
          </div>

          <div className="space-y-2.5">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = breakdown[star] || 0;
              const percent = getPercent(count);

              return (
                <div key={star} className="flex items-center gap-2.5 text-xs sm:text-sm">
                  {/* Star Label */}
                  <div className="flex items-center gap-1 w-12 text-pattan-blue-deep dark:text-slate-200 font-bold">
                    <span>{star}</span>
                    <Star className="w-3.5 h-3.5 text-pattan-yellow fill-pattan-yellow" />
                  </div>

                  {/* Progress Bar Container */}
                  <div className="flex-1 h-3 bg-slate-100/90 dark:bg-slate-700/80 rounded-full overflow-hidden p-0.5 border border-white/60 dark:border-slate-600">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#FFD95A] via-[#F58DB8] to-[#5B86C8] transition-all duration-700 ease-out"
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  {/* Count & Percentage */}
                  <div className="w-16 text-right text-xs font-mono font-semibold text-slate-500 dark:text-slate-400">
                    {count} ({percent}%)
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bento 3: Cute Guarantee Card with Holographic Sheen (Shown only if showGuarantee is enabled) */}
        {showGuarantee && (
          <div className="md:col-span-6 card-bento card-holographic p-5 sm:p-6 flex items-center gap-4 relative overflow-hidden group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800 flex items-center justify-center shrink-0 text-emerald-600 dark:text-emerald-400 shadow-xs">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm sm:text-base font-bold text-pattan-blue dark:text-pattan-blue-light leading-snug">
                {guaranteeTitle}
              </h4>
              <p className="text-xs sm:text-sm font-normal text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                {guaranteeDesc}
              </p>
            </div>
          </div>
        )}

        {/* Bento 4: Cute Mascot Note (Expands to 12 cols when guarantee is hidden) */}
        <div className={`${showGuarantee ? 'md:col-span-6' : 'md:col-span-12'} card-bento p-5 sm:p-6 flex items-center gap-4 bg-gradient-to-r from-white/90 via-[#FFF9FA]/90 to-[#FFF6F0]/90 dark:from-slate-800/90 dark:to-slate-800/90 relative overflow-hidden`}>
          <div className="w-16 h-16 shrink-0 flex items-center justify-center p-1.5 bg-white dark:bg-slate-700 rounded-2xl shadow-sticker">
            <CuteMonkey className="w-13 h-13 max-w-full max-h-full" mood="cheer" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm sm:text-base font-bold text-pattan-pink-deep dark:text-pattan-pink flex items-center gap-1.5 mb-1 leading-snug">
              <span>{thankYouTitle}</span>
              <Heart className="w-4 h-4 text-pattan-pink fill-pattan-pink inline" />
            </p>
            <p className="text-xs sm:text-sm font-normal text-slate-600 dark:text-slate-300 leading-relaxed">
              {thankYouDesc}
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}

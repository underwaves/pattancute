import React from 'react';
import { Star, Award, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { BoutiqueSeal } from './BoutiqueSeal';

/**
 * Score Summary Section in Refined Glass Bento Style
 */
export function ScoreSummary({ stats, bento }) {
  const { total = 0, average = 0, breakdown = {} } = stats || {};
  const {
    showGuarantee = false,
    guaranteeTitle = 'การันตีความน่าเชื่อถือ ตรวจสอบได้จริง',
    guaranteeDesc = 'ทุกรีวิวส่งตรงจากลูกค้าผู้มีอุปการคุณของร้าน ปลอดภัยและโปร่งใส 100%',
    thankYouTitle = 'ขอบคุณทุกความไว้วางใจ',
    thankYouDesc = 'ทุกคะแนนและคำแนะนำจากคุณคือกำลังใจสำคัญที่ช่วยให้ทางร้านพัฒนาบริการให้ดียิ่งขึ้นเสมอค่ะ',
  } = bento || {};

  const getPercent = (count) => {
    if (!total || total === 0) return 0;
    return Math.round((count / total) * 100);
  };

  return (
    <section className="w-full max-w-4xl mx-auto px-4 mb-12 font-sans">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Bento 1: Overall Score Dossier Card with Iridescent Velvet Sheen */}
        <div className="md:col-span-5 card-bento card-holographic p-6 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-36 h-36 rounded-full bg-pattan-pink/15 blur-2xl pointer-events-none" />
          <div className="absolute top-3 right-3 text-pattan-blue-deep/20 dark:text-pattan-blue-light/20 pointer-events-none">
            <BoutiqueSeal size={68} text="REAL REVIEWS · 100% VERIFIED · " />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/40 text-[11px] font-bold text-amber-800 dark:text-amber-300 mb-3">
              <Award className="w-3.5 h-3.5 text-amber-500" />
              <span>ความพึงพอใจโดยรวม</span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-extrabold text-pattan-blue-deep dark:text-white font-display tracking-tight tabular-nums">
                {total > 0 ? average.toFixed(1) : '5.0'}
              </span>
              <span className="text-lg font-semibold text-slate-400 tabular-nums">/ 5.0</span>
            </div>

            <div className="flex items-center gap-1 mt-2.5">
              {[1, 2, 3, 4, 5].map((s) => {
                const filled = s <= Math.round(average || 5);
                return (
                  <Star
                    key={s}
                    className={`w-5 h-5 ${
                      filled
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-slate-200 dark:text-slate-700 fill-slate-200 dark:fill-slate-700'
                    }`}
                  />
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {total > 0 ? `จากทั้งหมด ${total} รีวิว` : 'เปิดรับรีวิวจากลูกค้าจริง'}
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/70 dark:border-emerald-800/60">
              <CheckCircle2 className="w-3 h-3" />
              <span>รีวิวจริง 100%</span>
            </span>
          </div>
        </div>

        {/* Bento 2: Rating Breakdown Bars */}
        <div className="md:col-span-7 card-bento p-6 flex flex-col justify-center">
          <div className="text-xs font-bold text-pattan-blue-deep dark:text-slate-200 mb-3.5 flex items-center justify-between">
            <span>สัดส่วนคะแนนประเมิน</span>
            <span className="text-[11px] font-medium text-slate-400">เกณฑ์ 5–1 ดาว</span>
          </div>

          <div className="space-y-2.5">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = breakdown[star] || 0;
              const percent = getPercent(count);

              return (
                <div key={star} className="flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1 w-10 text-slate-700 dark:text-slate-300 font-bold tabular-nums">
                    <span>{star}</span>
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  </div>

                  <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-pattan-blue to-pattan-pink transition-all duration-700 ease-out"
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  <div className="w-16 text-right text-[11px] font-semibold tabular-nums text-slate-500 dark:text-slate-400">
                    {count} ({percent}%)
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bento 3: Guarantee Card (Optional) */}
        {showGuarantee && (
          <div className="md:col-span-6 card-bento p-5 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/70 dark:border-emerald-800/60 flex items-center justify-center shrink-0 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-pattan-blue-deep dark:text-white leading-snug">
                {guaranteeTitle}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                {guaranteeDesc}
              </p>
            </div>
          </div>
        )}

        {/* Bento 4: Clean Editorial Thank You Note */}
        <div
          className={`${showGuarantee ? 'md:col-span-6' : 'md:col-span-12'} card-bento p-5 flex items-center gap-4`}
        >
          <div className="w-11 h-11 rounded-xl bg-pattan-pink-soft dark:bg-pink-950/40 border border-pattan-pink/25 flex items-center justify-center shrink-0 text-pattan-pink-deep dark:text-pattan-pink">
            <Award className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-pattan-blue-deep dark:text-white leading-snug">
              {thankYouTitle}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
              {thankYouDesc}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

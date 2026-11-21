import React, { useState, useEffect } from 'react';
import { Tag, Check, Sparkles, Share2, Copy, CheckCircle2, MessageCircle, ArrowRight } from 'lucide-react';
import { defaultPricing } from '../config';

export function PricingSection({ pricing = defaultPricing, contacts }) {
  const apps = Array.isArray(pricing) && pricing.length > 0 ? pricing : defaultPricing;
  const [selectedAppId, setSelectedAppId] = useState(apps[0]?.id || 'netflix');
  const [selectedSubGroup, setSelectedSubGroup] = useState('all');
  const [copiedLink, setCopiedLink] = useState(false);

  // Sync with URL hash if it contains #pricing-<appId>
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash.startsWith('#pricing-')) {
        const targetApp = hash.replace('#pricing-', '');
        const exists = apps.find((a) => a.id.toLowerCase() === targetApp);
        if (exists) {
          setSelectedAppId(exists.id);
          setSelectedSubGroup('all');
        }
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [apps]);

  const selectedApp = apps.find((a) => a.id === selectedAppId) || apps[0] || {};
  const plans = selectedApp.plans || [];
  const lineUrl = contacts?.line?.url || 'https://line.me/R/ti/p/@078yzbej';
  const lineId = contacts?.line?.id || '@078yzbej';

  // Subcategory groups in plans (e.g. เมลปิดรับเคลม / เมลปิดไม่เคลม, Gold VIP / Premium 4K)
  const uniqueGroups = Array.from(
    new Set(plans.map((p) => p.group).filter(Boolean))
  );

  const displayedPlans = selectedSubGroup && selectedSubGroup !== 'all'
    ? plans.filter((p) => p.group === selectedSubGroup)
    : plans;

  // Copy app-specific pricing deep link
  const handleCopyAppLink = async () => {
    const cleanOrigin = window.location.origin;
    const url = `${cleanOrigin}/pricing#pricing-${selectedApp.id}`;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const ta = document.createElement('textarea');
        ta.value = url;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    } catch (e) {
      console.warn('Copy failed', e);
    }
  };

  // Build LINE ordering link with pre-filled order text
  const getOrderLineUrl = (plan) => {
    const orderText = `สวัสดีค่ะ สนใจสั่งซื้อ ${selectedApp.name} แพ็กเกจ "${plan.name}" ราคา ${plan.price} บาทค่ะ ✨`;
    const cleanId = lineId.replace('@', '');
    return `https://line.me/R/oaMessage/%40${cleanId}/?${encodeURIComponent(orderText)}`;
  };

  return (
    <section id="pricing-section" className="relative w-full max-w-4xl mx-auto px-4 mb-16 scroll-mt-20 font-sans">
      {/* Anchor for #pricing deep link */}
      <span id="pricing" className="absolute -top-24" />

      {/* 1. App Selection Header Row */}
      <div className="flex items-center justify-between gap-3 mb-3.5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-pattan-pink/20 flex items-center justify-center text-pattan-pink-deep">
            <Tag className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-pattan-blue-deep dark:text-white leading-tight">
              เลือกแอพที่ต้องการ ({apps.length} แอพ)
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-400 dark:text-slate-400">
              จิ้มไอคอนแอพเพื่อดูแพ็กเกจและราคาได้ทันทีค่ะ
            </p>
          </div>
        </div>

        {/* Global Copy Pricing Link Button */}
        <button
          type="button"
          onClick={handleCopyAppLink}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-pattan-pink hover:border-pattan-pink/50 transition shadow-xs cursor-pointer shrink-0"
          title={`คัดลอกลิงก์เรทราคา ${selectedApp.name}`}
        >
          {copiedLink ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">คัดลอกแล้ว! ✨</span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5 text-pattan-pink" />
              <span className="hidden sm:inline">แชร์ลิงก์เรทราคานี้</span>
              <span className="sm:hidden">แชร์ลิงก์</span>
            </>
          )}
        </button>
      </div>

      {/* 2. Bento App Tiles Grid (Symmetric 3/4/5 Columns, zero empty void!) */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2.5 sm:gap-3 mb-6">
        {apps.map((app) => {
          const isSelected = app.id === selectedAppId;
          const minPrice = app.plans?.length > 0
            ? Math.min(...app.plans.map((p) => parseInt(p.price, 10) || 999))
            : null;

          return (
            <button
              key={app.id}
              type="button"
              onClick={() => {
                setSelectedAppId(app.id);
                setSelectedSubGroup('all');
                if (window.history && window.history.replaceState) {
                  window.history.replaceState(null, '', `/pricing#pricing-${app.id}`);
                }
              }}
              className={`group relative flex flex-col items-center justify-between p-2.5 sm:p-3.5 rounded-3xl transition-all duration-200 active:scale-95 cursor-pointer text-center ${
                isSelected
                  ? 'bg-white dark:bg-slate-800 shadow-bento ring-2 ring-pattan-pink scale-[1.02] -translate-y-1'
                  : 'bg-white/80 dark:bg-slate-850/80 hover:bg-white dark:hover:bg-slate-800 border border-white/80 dark:border-slate-750 hover:shadow-xs hover:-translate-y-0.5'
              }`}
            >
              {/* Active Indicator Top Pill */}
              {isSelected && (
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-10">
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-gradient-to-r from-pattan-pink to-[#E06B9A] text-white shadow-xs whitespace-nowrap">
                    เลือกอยู่ ✓
                  </span>
                </div>
              )}

              {/* App Brand Icon Squircle Container */}
              <div
                className={`w-11 h-11 sm:w-13 sm:h-13 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl mb-1.5 transition-transform group-hover:scale-105 shadow-xs ${
                  isSelected ? 'ring-2 ring-pattan-pink/30 dark:ring-slate-700' : ''
                }`}
                style={{
                  backgroundColor: `${app.color}15`,
                }}
              >
                {app.icon || '📱'}
              </div>

              {/* App Name */}
              <span className="text-[11px] sm:text-sm font-black text-slate-800 dark:text-white truncate max-w-full leading-tight mb-1">
                {app.name}
              </span>

              {/* Starting Price Pill */}
              <span className="text-[9px] sm:text-[10px] font-extrabold text-pattan-pink-deep dark:text-pattan-pink bg-pink-50 dark:bg-pink-950/40 px-2 py-0.5 rounded-full border border-pink-100/60 dark:border-pink-900/40 whitespace-nowrap">
                {minPrice && minPrice < 999 ? `เริ่ม ฿${minPrice}` : `${app.plans?.length || 0} แพ็ก`}
              </span>
            </button>
          );
        })}
      </div>

      {/* 3. Selected App Showcase Banner */}
      <div className="relative overflow-hidden rounded-3xl p-5 sm:p-6 mb-6 bg-gradient-to-br from-white/95 to-slate-50/90 dark:from-slate-800/95 dark:to-slate-850/90 border border-white dark:border-slate-700 shadow-bento">
        {/* Ambient brand color aura */}
        <div
          className="absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundColor: selectedApp.color || '#5B86C8' }}
        />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <div
              className="w-13 h-13 rounded-2xl flex items-center justify-center text-3xl shadow-md border-2 border-white dark:border-slate-700 shrink-0"
              style={{ backgroundColor: `${selectedApp.color}18` }}
            >
              {selectedApp.icon || '📱'}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg sm:text-xl font-black text-slate-800 dark:text-white font-display">
                  {selectedApp.name}
                </h3>
                {selectedApp.category && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                    {selectedApp.category}
                  </span>
                )}
                {selectedApp.badge && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-300">
                    {selectedApp.badge}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {selectedApp.description || 'แพ็กเกจพรีเมียมราคาพิเศษ รับประกันดูแลตลอดการใช้งาน'}
              </p>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 self-start sm:self-auto text-xs font-bold text-pattan-pink-deep dark:text-pattan-pink bg-pink-50 dark:bg-pink-950/40 px-3.5 py-1 rounded-full border border-pink-100 dark:border-pink-900/50 shrink-0">
            <span>มีทั้งหมด {plans.length} แพ็กเกจ</span>
          </div>
        </div>
      </div>

      {/* 4. Subcategory Group Filter Pills (e.g. เมลปิดรับเคลม / เมลปิดไม่เคลม, Gold VIP / Premium 4K) */}
      {uniqueGroups.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none select-none">
          <button
            type="button"
            onClick={() => setSelectedSubGroup('all')}
            className={`min-h-[34px] px-3.5 rounded-full text-xs font-black transition-all shrink-0 active:scale-95 cursor-pointer ${
              selectedSubGroup === 'all'
                ? 'bg-slate-800 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                : 'bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-white border border-slate-200/60 dark:border-slate-700'
            }`}
          >
            ทั้งหมด ({plans.length})
          </button>

          {uniqueGroups.map((grp) => {
            const count = plans.filter((p) => p.group === grp).length;
            const isSelected = selectedSubGroup === grp;

            return (
              <button
                key={grp}
                type="button"
                onClick={() => setSelectedSubGroup(grp)}
                className={`min-h-[34px] px-3.5 rounded-full text-xs font-black transition-all shrink-0 active:scale-95 flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-pattan-pink to-[#E06B9A] text-white shadow-xs'
                    : 'bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-white border border-slate-200/60 dark:border-slate-700'
                }`}
              >
                <span>{grp}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* 5. Pricing Cards Grid for Selected App */}
      {displayedPlans.length === 0 ? (
        <div className="card-bento p-8 text-center">
          <p className="text-sm font-bold text-slate-500">กำลังอัปเดตแพ็กเกจราคาของแอพนี้ กรุณาสอบถามแอดมินทาง LINE ได้เลยค่ะ 🌸</p>
          <a
            href={lineUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-jelly inline-flex items-center gap-2 mt-4 px-6 py-2.5 rounded-full bg-[#06C755] text-white text-xs font-bold shadow-sm"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>สอบถามราคาทาง LINE</span>
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {displayedPlans.map((plan, idx) => {
            const isPopular = plan.badge && (plan.badge.includes('ขายดี') || plan.badge.includes('ยอดนิยม') || plan.badge.includes('แนะนำ') || plan.badge.includes('4K'));

            return (
              <div
                key={plan.id || idx}
                className={`relative flex flex-col justify-between p-5 rounded-3xl transition-all duration-300 hover:-translate-y-1 ${
                  isPopular
                    ? 'bg-white dark:bg-slate-800 shadow-bento border-2 border-pattan-pink/60 dark:border-pattan-pink/40 ring-4 ring-pink-500/10'
                    : 'bg-white/85 dark:bg-slate-800/85 shadow-bento border border-white dark:border-slate-700'
                }`}
              >
                {/* Popular / Best Value Badge */}
                {plan.badge && (
                  <div className="absolute -top-3 right-4 z-10">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wide shadow-xs bg-gradient-to-r from-pattan-pink to-[#E06B9A] text-white">
                      {plan.badge}
                    </span>
                  </div>
                )}

                {/* Plan Header */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[11px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">
                      {plan.period || 'แพ็กเกจ'}
                    </span>
                    {plan.group && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700/80 text-slate-500 dark:text-slate-300">
                        {plan.group}
                      </span>
                    )}
                  </div>

                  <h4 className="text-base font-black text-slate-800 dark:text-white leading-snug mb-3">
                    {plan.name}
                  </h4>

                  {/* Price Tag */}
                  <div className="flex items-baseline gap-1.5 mb-4 pb-3 border-b border-slate-100 dark:border-slate-700">
                    <span className="text-2xl sm:text-3xl font-black text-pattan-blue-deep dark:text-pattan-blue-light font-display">
                      ฿{plan.price}
                    </span>
                    {plan.originalPrice && (
                      <span className="text-xs font-semibold text-slate-400 line-through">
                        ฿{plan.originalPrice}
                      </span>
                    )}
                    <span className="text-xs text-slate-400 font-medium">
                      / {plan.period || 'รอบ'}
                    </span>
                  </div>

                  {/* Feature Bullets */}
                  {plan.features && plan.features.length > 0 && (
                    <ul className="space-y-2 mb-6">
                      {plan.features.map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300 font-medium">
                          <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span className="leading-tight">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Order Action Button */}
                <a
                  href={getOrderLineUrl(plan)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-jelly w-full min-h-[42px] px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-black text-xs shadow-md flex items-center justify-center gap-1.5 transition-all text-center group cursor-pointer"
                  title="สั่งซื้อแพ็กเกจนี้ผ่าน LINE"
                >
                  <MessageCircle className="w-4 h-4 fill-white shrink-0" />
                  <span>สั่งซื้อทาง LINE</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </a>
              </div>
            );
          })}
        </div>
      )}

      {/* Copy notification popup bar */}
      {copiedLink && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-modal-pop max-w-sm w-[92%] sm:w-auto pointer-events-auto">
          <div className="bg-emerald-500 text-white px-4 py-2.5 rounded-full shadow-xl flex items-center gap-2 text-xs font-bold justify-center border border-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <span>คัดลอกลิงก์เรทราคา {selectedApp.name} แล้ว! สามารถแชร์ได้เลยค่ะ 📋✨</span>
          </div>
        </div>
      )}
    </section>
  );
}

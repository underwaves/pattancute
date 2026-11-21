import React, { useState, useEffect, useMemo } from 'react';
import {
  Check,
  Share2,
  CheckCircle2,
  MessageCircle,
  ArrowRight,
  Image as ImageIcon,
  Maximize2,
  X,
  Search,
  Settings,
  LayoutGrid,
  List,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ShieldCheck,
  Grid2X2,
} from 'lucide-react';
import { defaultPricing } from '../config';

/**
 * Clean up redundant duration prefix & square brackets in plan title
 * for crisp visual presentation (while keeping original plan.name in LINE order text).
 */
function formatPlanTitle(plan) {
  const raw = (plan?.name || '').trim();
  if (!raw) return 'แพ็กเกจพรีเมียม';
  let cleaned = raw;
  if (plan?.period) {
    const escapedPeriod = plan.period.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    cleaned = cleaned.replace(new RegExp(`^${escapedPeriod}\\s*[:\\-–]\\s*`, 'i'), '');
  }
  // Remove outer square brackets e.g. "[ มือถือ/ไอแพด/คอม ]" -> "มือถือ/ไอแพด/คอม"
  const bracketMatch = cleaned.match(/^\[\s*(.+?)\s*\]$/);
  if (bracketMatch) {
    cleaned = bracketMatch[1];
  }
  return cleaned.trim() || raw;
}

function getAppCategoryKey(app) {
  const id = (app?.id || '').toLowerCase();
  if (['bilibili', 'youtube'].includes(id)) return 'anime_video';
  if (['spotify', 'canva'].includes(id)) return 'music_work';
  return 'movies';
}

function getMinPrice(app) {
  if (!app?.plans || app.plans.length === 0) return null;
  const nums = app.plans
    .map((p) => parseInt(String(p.price).replace(/[^\d]/g, ''), 10))
    .filter((n) => !Number.isNaN(n) && n > 0);
  return nums.length > 0 ? Math.min(...nums) : null;
}

function AppIconBox({ app, size = 'md' }) {
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    setImgFailed(false);
  }, [app?.imageUrl, app?.id]);

  const sizeClasses = {
    xs: 'w-6 h-6 rounded-lg text-sm',
    sm: 'w-9 h-9 rounded-xl text-lg',
    md: 'w-11 h-11 rounded-2xl text-2xl',
    lg: 'w-14 h-14 rounded-2xl text-3xl',
  }[size] || 'w-10 h-10 rounded-xl text-xl';

  return (
    <div
      className={`${sizeClasses} flex items-center justify-center shrink-0 overflow-hidden shadow-xs border border-white/80 dark:border-slate-700/80`}
      style={{ backgroundColor: `${app?.color || '#5B86C8'}18` }}
    >
      {app?.imageUrl && !imgFailed ? (
        <img
          src={app.imageUrl}
          alt={app.name || 'App'}
          className="w-full h-full object-contain p-1"
          onError={() => setImgFailed(true)}
        />
      ) : (
        <span className="leading-none select-none">{app?.icon || '📱'}</span>
      )}
    </div>
  );
}

export function PricingSection({ pricing = defaultPricing, contacts, onOpenAdmin }) {
  const apps = Array.isArray(pricing) && pricing.length > 0 ? pricing : defaultPricing;
  const [selectedAppId, setSelectedAppId] = useState(apps[0]?.id || 'netflix');
  const [selectedSubGroup, setSelectedSubGroup] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [planLayout, setPlanLayout] = useState('list'); // 'list' (modern scannable rows) | 'cards'
  const [expandedPlanIds, setExpandedPlanIds] = useState({});
  const [showMobilePicker, setShowMobilePicker] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [zoomImageUrl, setZoomImageUrl] = useState('');

  // Sync with URL hash #pricing-<appId>
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

  // Close lightbox / mobile picker on ESC
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        setZoomImageUrl('');
        setShowMobilePicker(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const filteredApps = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return apps.filter((app) => {
      const matchesCat = categoryFilter === 'all' || getAppCategoryKey(app) === categoryFilter;
      if (!matchesCat) return false;
      if (!q) return true;
      return (
        (app.name || '').toLowerCase().includes(q) ||
        (app.id || '').toLowerCase().includes(q) ||
        (app.category || '').toLowerCase().includes(q) ||
        (app.description || '').toLowerCase().includes(q)
      );
    });
  }, [apps, categoryFilter, searchQuery]);

  const selectedApp = apps.find((a) => a.id === selectedAppId) || apps[0] || {};
  const plans = selectedApp.plans || [];
  const lineUrl = contacts?.line?.url || 'https://line.me/R/ti/p/@078yzbej';
  const lineId = contacts?.line?.id || '@078yzbej';

  const uniqueGroups = useMemo(
    () => Array.from(new Set(plans.map((p) => p.group).filter(Boolean))),
    [plans]
  );

  const displayedPlans = useMemo(() => {
    if (selectedSubGroup && selectedSubGroup !== 'all') {
      return plans.filter((p) => p.group === selectedSubGroup);
    }
    return plans;
  }, [plans, selectedSubGroup]);

  // Group plans cleanly for visual sectioning when "all" is active & groups exist
  const groupedPlanSections = useMemo(() => {
    if (uniqueGroups.length <= 1 || selectedSubGroup !== 'all') {
      return [{ title: null, items: displayedPlans }];
    }
    const sections = uniqueGroups.map((grp) => ({
      title: grp,
      items: displayedPlans.filter((p) => p.group === grp),
    }));
    const ungrouped = displayedPlans.filter((p) => !p.group);
    if (ungrouped.length > 0) {
      sections.push({ title: 'แพ็กเกจอื่นๆ', items: ungrouped });
    }
    return sections.filter((s) => s.items.length > 0);
  }, [displayedPlans, uniqueGroups, selectedSubGroup]);

  const selectApp = (appId) => {
    setSelectedAppId(appId);
    setSelectedSubGroup('all');
    setExpandedPlanIds({});
    setShowMobilePicker(false);
    if (window.history && window.history.replaceState) {
      window.history.replaceState(null, '', `/pricing#pricing-${appId}`);
    }
  };

  const toggleExpandPlan = (key) => {
    setExpandedPlanIds((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleCopyAppLink = async () => {
    const url = `${window.location.origin}/pricing#pricing-${selectedApp.id}`;
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
      setTimeout(() => setCopiedLink(false), 2800);
    } catch (e) {
      console.warn('Copy failed', e);
    }
  };

  const getOrderLineUrl = (plan) => {
    const groupText = plan.group ? ` (${plan.group})` : '';
    const orderText = `สวัสดีค่ะ สนใจสั่งซื้อ ${selectedApp.name}${groupText} แพ็กเกจ "${plan.name}" ราคา ${plan.price} บาทค่ะ ✨`;
    const cleanId = lineId.replace('@', '');
    return `https://line.me/R/oaMessage/%40${cleanId}/?${encodeURIComponent(orderText)}`;
  };

  const categoryChips = [
    { id: 'all', label: 'ทั้งหมด', count: apps.length },
    { id: 'movies', label: 'หนัง/ซีรีส์', count: apps.filter((a) => getAppCategoryKey(a) === 'movies').length },
    { id: 'anime_video', label: 'อนิเมะ/วิดีโอ', count: apps.filter((a) => getAppCategoryKey(a) === 'anime_video').length },
    { id: 'music_work', label: 'เพลง/ทำงาน', count: apps.filter((a) => getAppCategoryKey(a) === 'music_work').length },
  ];

  const brandColor = selectedApp.color || '#5B86C8';

  return (
    <section id="pricing-section" className="relative w-full max-w-6xl mx-auto px-4 pt-3 pb-16 scroll-mt-20 font-sans">
      <span id="pricing" className="absolute -top-24" />

      {/* ==================== MOBILE CONTROLS (< lg) ==================== */}
      <div className="lg:hidden space-y-3 mb-4">
        {/* Mobile Search + All Apps Sheet Trigger */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหาแอพ... เช่น Netflix, YouTube"
              className="w-full h-10 pl-9 pr-8 rounded-2xl bg-white/90 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-pattan-pink/40 shadow-xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-slate-400 hover:text-slate-600 cursor-pointer"
                aria-label="ล้างคำค้นหา"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setShowMobilePicker(true)}
            className="h-10 px-3.5 rounded-2xl bg-white/90 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 text-xs font-bold text-pattan-blue-deep dark:text-white flex items-center gap-1.5 shadow-xs shrink-0 active:scale-95 transition cursor-pointer"
          >
            <Grid2X2 className="w-4 h-4 text-pattan-pink" />
            <span>ทั้งหมด ({apps.length})</span>
          </button>
        </div>

        {/* Mobile Compact Horizontal App Pill Strip */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none snap-x -mx-1 px-1">
          {filteredApps.length === 0 ? (
            <div className="text-xs text-slate-400 py-2 px-2">ไม่พบแอพที่ค้นหา ลองคำอื่นนะคะ</div>
          ) : (
            filteredApps.map((app) => {
              const isSelected = app.id === selectedApp.id;
              return (
                <button
                  key={app.id}
                  type="button"
                  onClick={() => selectApp(app.id)}
                  className={`snap-start shrink-0 h-10 pl-2 pr-3.5 rounded-full flex items-center gap-2 text-xs font-bold transition-all cursor-pointer active:scale-95 ${
                    isSelected
                      ? 'btn-signature text-white'
                      : 'bg-white/85 dark:bg-[#131C30]/85 text-pattan-blue-deep dark:text-slate-200 border border-white dark:border-slate-700 hover:bg-white'
                  }`}
                >
                  <AppIconBox app={app} size="xs" />
                  <span className="whitespace-nowrap">{app.name}</span>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* ==================== MASTER-DETAIL WORKSPACE ==================== */}
      <div className="grid grid-cols-1 lg:grid-cols-[276px_1fr] gap-5 items-start">
        {/* ---------- LEFT SIDEBAR: STICKY BOUTIQUE CLUB DIRECTORY (Desktop) ---------- */}
        <aside className="hidden lg:flex lg:flex-col sticky top-24 bg-white/85 dark:bg-[#131C30]/85 backdrop-blur-xl border border-white/90 dark:border-slate-700/60 rounded-[26px] shadow-bento overflow-hidden">
          {/* Directory Micro Header */}
          <div className="px-4 pt-3.5 pb-2 flex items-center justify-between">
            <span className="text-[10px] font-extrabold tracking-[0.16em] text-pattan-blue-deep/55 dark:text-slate-400 uppercase">
              Club Directory
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pattan-pink-soft dark:bg-pink-950/50 text-pattan-pink-deep dark:text-pattan-pink">
              {apps.length} แอพ
            </span>
          </div>

          {/* Sidebar Search + Category Filter */}
          <div className="px-3.5 pb-3.5 border-b border-slate-100 dark:border-slate-800 space-y-2.5">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ค้นหาแอพที่ต้องการ..."
                className="w-full h-9 pl-8 pr-7 rounded-xl bg-pattan-blue-soft/60 dark:bg-slate-800 border border-transparent focus:border-pattan-pink/40 focus:bg-white dark:focus:bg-slate-800 text-xs font-semibold text-pattan-blue-deep dark:text-slate-100 placeholder:text-slate-400 focus:outline-none transition"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Mini Category Chips */}
            <div className="flex flex-wrap gap-1">
              {categoryChips.map((chip) => {
                const active = categoryFilter === chip.id;
                return (
                  <button
                    key={chip.id}
                    type="button"
                    onClick={() => setCategoryFilter(chip.id)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                      active
                        ? 'btn-signature text-white'
                        : 'bg-pattan-blue-soft/60 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-pattan-blue-deep dark:hover:text-slate-200'
                    }`}
                  >
                    {chip.label} ({chip.count})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Vertical App Directory List */}
          <div className="p-2 space-y-1 max-h-[calc(100vh-230px)] overflow-y-auto">
            {filteredApps.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                ไม่พบแอพที่ตรงกับคำค้นหา
              </div>
            ) : (
              filteredApps.map((app) => {
                const isSelected = app.id === selectedApp.id;
                const minPrice = getMinPrice(app);

                return (
                  <button
                    key={app.id}
                    type="button"
                    onClick={() => selectApp(app.id)}
                    className={`group relative w-full flex items-center justify-between gap-2.5 px-2.5 py-2 rounded-2xl text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-slate-900/[0.05] dark:bg-white/[0.08] shadow-xs'
                        : 'hover:bg-slate-100/70 dark:hover:bg-slate-800/70'
                    }`}
                  >
                    {/* Dynamic Left Brand Accent Bar when active */}
                    {isSelected && (
                      <span
                        className="absolute left-0 top-2.5 bottom-2.5 w-1 rounded-r-full"
                        style={{ backgroundColor: app.color || '#F58DB8' }}
                      />
                    )}

                    <div className="flex items-center gap-2.5 min-w-0">
                      <AppIconBox app={app} size="sm" />
                      <div className="min-w-0">
                        <div
                          className={`text-xs truncate leading-tight ${
                            isSelected
                              ? 'font-black text-pattan-blue-deep dark:text-white'
                              : 'font-bold text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white'
                          }`}
                        >
                          {app.name}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate mt-0.5">
                          {app.plans?.length || 0} แพ็กเกจ
                        </div>
                      </div>
                    </div>

                    {minPrice && (
                      <span
                        className={`text-[11px] font-black tabular-nums px-2 py-0.5 rounded-lg shrink-0 ${
                          isSelected
                            ? 'bg-pattan-pink/15 text-pattan-pink-deep dark:text-pattan-pink'
                            : 'text-slate-500 dark:text-slate-400 bg-slate-100/80 dark:bg-slate-800'
                        }`}
                      >
                        ฿{minPrice}+
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </aside>

        {/* ---------- RIGHT PANEL: VIP STREAMING PASS STUDIO ---------- */}
        <div className="min-w-0 bg-white/90 dark:bg-[#131C30]/85 backdrop-blur-xl border border-white/95 dark:border-slate-700/60 rounded-[28px] shadow-bento overflow-hidden">
          {/* Thin Dynamic Brand Color Top Ribbon */}
          <div
            className="h-1.5 w-full transition-colors duration-300 opacity-90"
            style={{
              background: `linear-gradient(90deg, ${brandColor}, #DF6E9B, #4B72B0)`,
            }}
          />

          {/* 1. Selected App VIP Pass Header */}
          <div className="relative card-holographic p-5 sm:p-6 border-b border-dashed border-slate-200/85 dark:border-slate-700/80 overflow-hidden">
            {/* Soft Dynamic Ambient Glow */}
            <div
              className="absolute -top-16 -right-16 w-60 h-60 rounded-full blur-3xl opacity-20 pointer-events-none transition-colors duration-500"
              style={{ backgroundColor: brandColor }}
            />

            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                <AppIconBox app={selectedApp} size="lg" />
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[9px] font-extrabold tracking-[0.2em] uppercase text-pattan-blue/70 dark:text-pattan-blue-light/70">
                      PASS NO. {String(Math.max(1, apps.findIndex((a) => a.id === selectedApp.id) + 1)).padStart(2, '0')} · OFFICIAL RATE
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-xl sm:text-2xl font-black text-pattan-blue-deep dark:text-white font-display tracking-tight">
                      {selectedApp.name}
                    </h2>
                    {selectedApp.badge && (
                      <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-pattan-pink-soft text-pattan-pink-deep dark:bg-pink-950/60 dark:text-pink-300 border border-pattan-pink/25">
                        {selectedApp.badge}
                      </span>
                    )}
                    {selectedApp.category && (
                      <span className="hidden sm:inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-pattan-blue-soft/80 dark:bg-slate-800 text-pattan-blue-deep/75 dark:text-slate-300">
                        {selectedApp.category}
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-[13px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {selectedApp.description || 'แพ็กเกจพรีเมียมลิขสิทธิ์แท้ รับประกันดูแลตลอดการใช้งาน'}
                  </p>
                </div>
              </div>

              {/* Action Buttons: Share Link & Edit in Admin */}
              <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
                <button
                  type="button"
                  onClick={handleCopyAppLink}
                  className="h-9 px-3.5 rounded-xl bg-slate-100/90 dark:bg-slate-800 hover:bg-slate-200/80 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap"
                  title={`คัดลอกลิงก์เรทราคา ${selectedApp.name}`}
                >
                  {copiedLink ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">คัดลอกแล้ว!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5 text-pattan-pink" />
                      <span>แชร์ลิงก์</span>
                    </>
                  )}
                </button>

                {onOpenAdmin && (
                  <button
                    type="button"
                    onClick={() => onOpenAdmin('pricing', selectedApp.id)}
                    className="h-9 px-3 rounded-xl bg-pattan-blue-soft dark:bg-slate-800 hover:bg-pattan-blue/15 text-pattan-blue-deep dark:text-pattan-blue-light border border-pattan-blue/15 dark:border-slate-700 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap"
                    title={`แก้ไขราคาหรืออัปโหลดรูปภาพของ ${selectedApp.name} ในหลังบ้าน`}
                  >
                    <Settings className="w-3.5 h-3.5 text-pattan-blue" />
                    <span>แก้ไขแอพนี้</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* 2. Optional Uploaded Rate Poster / Graphic */}
          {selectedApp.posterUrl && (
            <div className="px-5 sm:px-6 pt-5">
              <div className="p-3.5 rounded-2xl bg-slate-50/90 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/80">
                <div className="flex items-center justify-between mb-2.5 px-1">
                  <div className="flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-pattan-pink" />
                    <span className="text-xs font-black text-slate-700 dark:text-slate-200">
                      ภาพป้ายเรทราคา &amp; โปรโมชั่น ({selectedApp.name})
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setZoomImageUrl(selectedApp.posterUrl)}
                    className="text-[11px] font-bold text-pattan-pink-deep dark:text-pattan-pink hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>ซูมดูรูปเต็ม</span>
                  </button>
                </div>

                <div
                  onClick={() => setZoomImageUrl(selectedApp.posterUrl)}
                  className="group relative rounded-xl overflow-hidden cursor-zoom-in border border-slate-200/60 dark:border-slate-700 bg-white dark:bg-slate-900/50 flex items-center justify-center max-h-[340px]"
                >
                  <img
                    src={selectedApp.posterUrl}
                    alt={`ป้ายเรทราคา ${selectedApp.name}`}
                    className="w-full h-auto max-h-[340px] object-contain transition-transform duration-300 group-hover:scale-[1.01]"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-slate-900/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white text-xs font-black backdrop-blur-[1px]">
                    <Maximize2 className="w-4 h-4" />
                    <span>แตะเพื่อดูภาพเต็มจอ</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3. Toolbar: Subcategory Segmented Switch + Plan View Mode */}
          <div className="px-5 sm:px-6 pt-5 pb-3 flex flex-wrap items-center justify-between gap-3">
            {/* Left: Segmented Group Filter OR Plan Count */}
            {uniqueGroups.length > 1 ? (
              <div className="flex items-center gap-1 p-1 rounded-2xl bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200/60 dark:border-slate-700/80 overflow-x-auto scrollbar-none max-w-full">
                <button
                  type="button"
                  onClick={() => setSelectedSubGroup('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    selectedSubGroup === 'all'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-black'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  ทั้งหมด ({plans.length})
                </button>
                {uniqueGroups.map((grp) => {
                  const count = plans.filter((p) => p.group === grp).length;
                  const active = selectedSubGroup === grp;
                  return (
                    <button
                      key={grp}
                      type="button"
                      onClick={() => setSelectedSubGroup(grp)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                        active
                          ? 'btn-signature text-white'
                          : 'text-slate-500 dark:text-slate-400 hover:text-pattan-blue-deep dark:hover:text-slate-200'
                      }`}
                    >
                      <span>{grp}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                          active
                            ? 'bg-white/20 text-white'
                            : 'bg-slate-200/80 dark:bg-slate-700 text-slate-500'
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
                <Sparkles className="w-3.5 h-3.5 text-pattan-pink" />
                <span>แพ็กเกจทั้งหมด ({displayedPlans.length} รายการ)</span>
              </div>
            )}

            {/* Right: List vs Card Display Switcher */}
            <div className="hidden sm:flex items-center p-0.5 rounded-xl bg-slate-100/90 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 shrink-0">
              <button
                type="button"
                onClick={() => setPlanLayout('list')}
                className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1 transition cursor-pointer ${
                  planLayout === 'list'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
                title="มุมมองตารางรายการ (เปรียบเทียบราคาง่าย)"
              >
                <List className="w-3.5 h-3.5" />
                <span>รายการ</span>
              </button>
              <button
                type="button"
                onClick={() => setPlanLayout('cards')}
                className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1 transition cursor-pointer ${
                  planLayout === 'cards'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
                title="มุมมองการ์ด"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>การ์ด</span>
              </button>
            </div>
          </div>

          {/* 4. Plans Content Area */}
          <div className="px-5 sm:px-6 pb-6 space-y-6">
            {displayedPlans.length === 0 ? (
              <div className="py-12 px-4 text-center rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-dashed border-slate-200 dark:border-slate-700">
                <p className="text-sm font-bold text-slate-500 dark:text-slate-300">
                  กำลังอัปเดตแพ็กเกจราคาของแอพนี้ สามารถทักสอบถามแอดมินทาง LINE ได้เลยค่ะ 🌸
                </p>
                <a
                  href={lineUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-jelly inline-flex items-center gap-2 mt-4 px-5 py-2.5 rounded-full bg-[#06C755] text-white text-xs font-bold shadow-sm"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>สอบถามราคาทาง LINE</span>
                </a>
              </div>
            ) : (
              groupedPlanSections.map((section, sIdx) => (
                <div key={section.title || sIdx} className="space-y-2.5">
                  {/* Section Group Title (when viewing all groups together) */}
                  {section.title && (
                    <div className="flex items-center gap-2 pt-1">
                      <span className="inline-flex items-center gap-1.5 text-xs font-black text-pattan-blue-deep dark:text-white bg-slate-100/90 dark:bg-slate-800 px-3 py-1 rounded-full">
                        <ShieldCheck className="w-3.5 h-3.5 text-pattan-pink" />
                        {section.title}
                      </span>
                      <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800" />
                    </div>
                  )}

                  {planLayout === 'list' ? (
                    /* ===== MODERN ULTRA-SCANNABLE RATE ROWS ===== */
                    <div className="space-y-2">
                      {section.items.map((plan, pIdx) => {
                        const planKey = plan.id || `${sIdx}-${pIdx}`;
                        const isPopular =
                          plan.badge &&
                          (plan.badge.includes('ขายดี') ||
                            plan.badge.includes('ยอดนิยม') ||
                            plan.badge.includes('แนะนำ'));
                        const features = Array.isArray(plan.features) ? plan.features : [];
                        const isExpanded = !!expandedPlanIds[planKey];
                        const previewFeatures = isExpanded ? features : features.slice(0, 2);

                        return (
                          <div
                            key={planKey}
                            className={`group relative rounded-2xl p-3.5 sm:px-4 sm:py-3.5 transition-all duration-200 border overflow-hidden ${
                              isPopular
                                ? 'bg-gradient-to-r from-pattan-pink-soft/90 via-white to-white dark:from-pink-950/30 dark:via-[#182238] dark:to-[#182238] border-pattan-pink/45 dark:border-pattan-pink/35 shadow-xs'
                                : 'bg-[#FAF8F5]/90 dark:bg-slate-800/55 hover:bg-white dark:hover:bg-slate-800 border-slate-200/80 dark:border-slate-700/70 hover:border-pattan-blue/35 hover:shadow-xs'
                            }`}
                          >
                            {/* Subtle Left Brand Ticket Strip */}
                            <span
                              className="absolute left-0 top-2.5 bottom-2.5 w-[3px] rounded-r-full transition-opacity"
                              style={{
                                backgroundColor: isPopular ? '#DF6E9B' : brandColor,
                                opacity: isPopular ? 0.95 : 0.45,
                              }}
                            />

                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pl-1.5">
                              {/* Left & Middle: Duration Stamp + Title + Inline Perks */}
                              <div className="flex items-start gap-3 min-w-0 flex-1">
                                {/* Fixed-width Duration Stamp */}
                                <div
                                  className="min-w-[68px] px-2.5 py-1.5 rounded-xl text-center shrink-0 font-extrabold text-xs border"
                                  style={{
                                    backgroundColor: isPopular ? '#DF6E9B1C' : `${brandColor}12`,
                                    borderColor: isPopular ? '#DF6E9B45' : `${brandColor}28`,
                                  }}
                                >
                                  <span className={isPopular ? 'text-pattan-pink-deep dark:text-pattan-pink' : 'text-pattan-blue-deep dark:text-white'}>
                                    {plan.period || 'แพ็กเกจ'}
                                  </span>
                                </div>

                                {/* Title + Badges + Compact Features */}
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <h4 className="text-sm font-extrabold text-pattan-blue-deep dark:text-white leading-snug">
                                      {formatPlanTitle(plan)}
                                    </h4>
                                    {plan.badge && (
                                      <span
                                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap ${
                                          isPopular
                                            ? 'btn-rose text-white'
                                            : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-200 border border-slate-200/80 dark:border-slate-600'
                                        }`}
                                      >
                                        {plan.badge}
                                      </span>
                                    )}
                                  </div>

                                  {/* Compact Inline Feature Highlights */}
                                  {features.length > 0 && (
                                    <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                                      {previewFeatures.map((feat, fIdx) => (
                                        <span
                                          key={fIdx}
                                          className="inline-flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 font-medium"
                                        >
                                          <Check className="w-3 h-3 text-emerald-500 shrink-0" />
                                          <span>{feat}</span>
                                        </span>
                                      ))}

                                      {features.length > 2 && (
                                        <button
                                          type="button"
                                          onClick={() => toggleExpandPlan(planKey)}
                                          className="inline-flex items-center gap-0.5 text-[11px] font-bold text-pattan-blue dark:text-pattan-blue-light hover:underline cursor-pointer"
                                        >
                                          <span>{isExpanded ? 'ซ่อน' : `+${features.length - 2} รายละเอียด`}</span>
                                          {isExpanded ? (
                                            <ChevronUp className="w-3 h-3" />
                                          ) : (
                                            <ChevronDown className="w-3 h-3" />
                                          )}
                                        </button>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Right: Perforated VIP Ticket Stub (Price + Order CTA) */}
                              <div className="ticket-stub-divider flex items-center justify-between sm:justify-end gap-3.5 pt-2.5 sm:pt-0 sm:pl-5 border-t sm:border-t-0 sm:border-l border-dashed border-slate-300/80 dark:border-slate-700 shrink-0">
                                <div className="text-left sm:text-right">
                                  <div className="flex items-baseline sm:justify-end gap-1.5">
                                    {plan.originalPrice && (
                                      <span className="text-xs font-semibold text-slate-400 line-through tabular-nums">
                                        ฿{plan.originalPrice}
                                      </span>
                                    )}
                                    <span className="text-xl sm:text-2xl font-extrabold text-pattan-blue-deep dark:text-white font-display tabular-nums leading-none">
                                      ฿{plan.price}
                                    </span>
                                  </div>
                                  <span className="text-[10px] font-semibold text-slate-400 block mt-0.5">
                                    / {plan.period || 'รอบ'}
                                  </span>
                                </div>

                                <a
                                  href={getOrderLineUrl(plan)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="btn-jelly h-9 px-4 rounded-xl bg-[#06C755] hover:bg-[#05b34c] text-white font-black text-xs shadow-sm flex items-center justify-center gap-1.5 transition-all whitespace-nowrap cursor-pointer"
                                  title={`สั่งซื้อ ${selectedApp.name} - ${plan.name}`}
                                >
                                  <MessageCircle className="w-3.5 h-3.5 fill-white shrink-0" />
                                  <span>สั่งซื้อ</span>
                                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                                </a>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    /* ===== OPTIONAL MODERN CARD GRID VIEW ===== */
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3.5">
                      {section.items.map((plan, pIdx) => {
                        const planKey = plan.id || `${sIdx}-${pIdx}`;
                        const isPopular =
                          plan.badge &&
                          (plan.badge.includes('ขายดี') ||
                            plan.badge.includes('ยอดนิยม') ||
                            plan.badge.includes('แนะนำ'));
                        const features = Array.isArray(plan.features) ? plan.features : [];

                        return (
                          <div
                            key={planKey}
                            className={`relative flex flex-col justify-between p-4 rounded-2xl transition-all duration-200 border hover:-translate-y-0.5 ${
                              isPopular
                                ? 'bg-gradient-to-b from-pattan-pink-soft/70 to-white dark:from-pink-950/30 dark:to-slate-800 border-pattan-pink/50 shadow-sm'
                                : 'bg-slate-50/70 dark:bg-slate-800/60 border-slate-200/70 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800'
                            }`}
                          >
                            <div>
                              <div className="flex items-center justify-between gap-2 mb-2">
                                <span className="text-[11px] font-black px-2.5 py-0.5 rounded-lg bg-white dark:bg-slate-700 text-pattan-blue-deep dark:text-white border border-slate-200/70 dark:border-slate-600">
                                  {plan.period || 'แพ็กเกจ'}
                                </span>
                                {plan.badge && (
                                  <span
                                    className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                                      isPopular
                                        ? 'bg-gradient-to-r from-pattan-pink to-[#E06B9A] text-white'
                                        : 'bg-slate-200/70 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                                    }`}
                                  >
                                    {plan.badge}
                                  </span>
                                )}
                              </div>

                              <h4 className="text-sm font-black text-slate-800 dark:text-white leading-snug mb-2">
                                {formatPlanTitle(plan)}
                              </h4>

                              <div className="flex items-baseline gap-1.5 pb-3 mb-3 border-b border-slate-200/70 dark:border-slate-700">
                                <span className="text-2xl font-black text-pattan-blue-deep dark:text-white font-display tabular-nums">
                                  ฿{plan.price}
                                </span>
                                {plan.originalPrice && (
                                  <span className="text-xs text-slate-400 line-through tabular-nums">
                                    ฿{plan.originalPrice}
                                  </span>
                                )}
                                <span className="text-[11px] text-slate-400 font-medium">
                                  / {plan.period || 'รอบ'}
                                </span>
                              </div>

                              {features.length > 0 && (
                                <ul className="space-y-1.5 mb-4">
                                  {features.map((feat, fIdx) => (
                                    <li key={fIdx} className="flex items-start gap-1.5 text-[11px] text-slate-600 dark:text-slate-300 font-medium">
                                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                                      <span className="leading-snug">{feat}</span>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>

                            <a
                              href={getOrderLineUrl(plan)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn-jelly w-full h-9 px-4 rounded-xl bg-[#06C755] hover:bg-[#05b34c] text-white font-black text-xs shadow-xs flex items-center justify-center gap-1.5 transition"
                            >
                              <MessageCircle className="w-3.5 h-3.5 fill-white" />
                              <span>สั่งซื้อทาง LINE</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* 5. Compact Helper Footer Bar inside Studio */}
          <div className="px-5 sm:px-6 py-3.5 bg-slate-50/90 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
            <span className="text-slate-500 dark:text-slate-400 font-medium">
              ไม่แน่ใจว่าแพ็กเกจไหนเหมาะกับมือถือหรือทีวีของคุณ? ทักให้แอดมินช่วยแนะนำได้เลยค่ะ 💬
            </span>
            <a
              href={lineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-black text-[#06C755] hover:underline shrink-0"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>ทักแชท LINE ({lineId})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* ==================== MOBILE ALL-APPS PICKER SHEET ==================== */}
      {showMobilePicker && (
        <div
          className="fixed inset-0 z-50 lg:hidden flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setShowMobilePicker(false)}
        >
          <div
            className="w-full sm:max-w-md bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl p-5 max-h-[82vh] flex flex-col shadow-2xl border border-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-black text-pattan-blue-deep dark:text-white">
                  เลือกแอพทั้งหมด ({apps.length} แอพ)
                </h3>
                <p className="text-[11px] text-slate-400">แตะแอพที่ต้องการเพื่อดูเรทราคาทันที</p>
              </div>
              <button
                type="button"
                onClick={() => setShowMobilePicker(false)}
                className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2.5 pt-4 pb-2 overflow-y-auto">
              {apps.map((app) => {
                const isSelected = app.id === selectedApp.id;
                const minPrice = getMinPrice(app);
                return (
                  <button
                    key={app.id}
                    type="button"
                    onClick={() => selectApp(app.id)}
                    className={`p-2.5 rounded-2xl flex flex-col items-center text-center gap-1.5 transition active:scale-95 cursor-pointer border ${
                      isSelected
                        ? 'bg-pattan-pink-soft/80 dark:bg-pink-950/40 border-pattan-pink ring-1 ring-pattan-pink'
                        : 'bg-slate-50/80 dark:bg-slate-800/80 border-slate-200/60 dark:border-slate-700'
                    }`}
                  >
                    <AppIconBox app={app} size="sm" />
                    <span className="text-[11px] font-black text-slate-800 dark:text-white truncate max-w-full leading-tight">
                      {app.name}
                    </span>
                    {minPrice && (
                      <span className="text-[10px] font-bold text-pattan-pink-deep dark:text-pattan-pink tabular-nums">
                        เริ่ม ฿{minPrice}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ==================== COPY TOAST NOTIFICATION ==================== */}
      {copiedLink && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-toast max-w-sm w-[92%] sm:w-auto pointer-events-auto">
          <div className="bg-emerald-500 text-white px-4 py-2.5 rounded-full shadow-xl flex items-center gap-2 text-xs font-bold justify-center border border-emerald-400">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>คัดลอกลิงก์เรทราคา {selectedApp.name} แล้ว! แชร์ได้เลยค่ะ ✨</span>
          </div>
        </div>
      )}

      {/* ==================== POSTER IMAGE LIGHTBOX MODAL ==================== */}
      {zoomImageUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in"
          onClick={() => setZoomImageUrl('')}
        >
          <div
            className="relative max-w-4xl max-h-[92vh] w-full flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setZoomImageUrl('')}
              className="absolute -top-12 right-0 p-2 rounded-full bg-white/20 hover:bg-white/40 text-white transition cursor-pointer backdrop-blur-sm"
              title="ปิดรูปภาพ (ESC)"
            >
              <X className="w-6 h-6" />
            </button>

            <img
              src={zoomImageUrl}
              alt="ภาพขยายใหญ่"
              className="max-h-[85vh] max-w-full rounded-2xl object-contain shadow-2xl border border-white/20 bg-black/20"
            />

            <div className="mt-3 flex items-center gap-2.5">
              <a
                href={zoomImageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition flex items-center gap-1.5 backdrop-blur-sm"
              >
                <span>เปิดรูปภาพในแท็บใหม่ ↗</span>
              </a>
              <button
                type="button"
                onClick={() => setZoomImageUrl('')}
                className="px-4 py-1.5 rounded-full bg-pattan-pink hover:bg-pink-600 text-white text-xs font-bold transition shadow-sm cursor-pointer"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

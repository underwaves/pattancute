import React, { useState, useEffect, useCallback } from 'react';
import { Hero } from './components/Hero';
import { ScoreSummary } from './components/ScoreSummary';
import { ReviewForm } from './components/ReviewForm';
import { ReviewList } from './components/ReviewList';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { MusicPlayer } from './components/MusicPlayer';
import { Decorations } from './components/Decorations';
import { ThemeToggle } from './components/ThemeToggle';
import { BottomNav } from './components/BottomNav';
import { SectionDivider } from './components/SectionDivider';
import { AdminModal } from './components/AdminModal';
import { PricingHero } from './components/PricingHero';
import { PricingSection } from './components/PricingSection';
import { Star, Lock, Tag, MessageSquare, MessageCircle } from 'lucide-react';
import { defaultSettings } from './config';

export function App() {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    average: 5.0,
    breakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
  });
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [settings, setSettings] = useState(defaultSettings);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminInitialTab, setAdminInitialTab] = useState('overview');
  const [adminInitialAppId, setAdminInitialAppId] = useState('');

  const openAdmin = (tab = 'overview', appId = '') => {
    setAdminInitialTab(tab || 'overview');
    setAdminInitialAppId(appId || '');
    setShowAdminModal(true);
  };

  // Separate Pages State: 'reviews' (Credit & Review Page) | 'pricing' (App Rates Page)
  const getInitialPage = () => {
    const pathname = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    if (pathname.startsWith('/pricing') || hash.startsWith('#pricing')) {
      return 'pricing';
    }
    return 'reviews';
  };

  const [currentPage, setCurrentPage] = useState(getInitialPage);

  // Fetch full settings from backend
  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        if (data.settings) {
          setSettings((prev) => ({
            ...prev,
            ...data.settings,
            pricing: Array.isArray(data.settings.pricing) && data.settings.pricing.length > 0
              ? data.settings.pricing
              : (prev.pricing || defaultSettings.pricing),
            music: { ...prev.music, ...(data.settings.music || {}) },
            bento: { ...prev.bento, ...(data.settings.bento || {}) },
            contacts: {
              ...prev.contacts,
              ...(data.settings.contacts || {}),
              line: { ...prev.contacts.line, ...(data.settings.contacts?.line || {}) },
              instagram: { ...prev.contacts.instagram, ...(data.settings.contacts?.instagram || {}) },
              facebook: { ...prev.contacts.facebook, ...(data.settings.contacts?.facebook || {}) },
              tiktok: { ...prev.contacts.tiktok, ...(data.settings.contacts?.tiktok || {}) },
            },
          }));
        }
      }
    } catch (err) {
      console.warn('Failed to fetch settings from backend:', err);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // Fetch Reviews Function
  const fetchReviews = useCallback(async (nextCursor = null, append = false) => {
    try {
      if (!append) setIsLoadingInitial(true);
      else setIsLoadingMore(true);

      const url = new URL('/api/reviews', window.location.origin);
      url.searchParams.set('limit', '10');
      if (nextCursor) {
        url.searchParams.set('cursor', nextCursor);
      }

      const res = await fetch(url.toString());
      if (!res.ok) throw new Error('Failed to fetch reviews');

      const data = await res.json();

      if (append) {
        setReviews((prev) => [...prev, ...(data.reviews || [])]);
      } else {
        setReviews(data.reviews || []);
        if (data.stats) setStats(data.stats);
      }

      setCursor(data.nextCursor);
      setHasMore(data.hasMore);
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setIsLoadingInitial(false);
      setIsLoadingMore(false);
    }
  }, []);

  // Initial load reviews
  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // Load More handler
  const handleLoadMore = () => {
    if (!cursor || isLoadingMore) return;
    fetchReviews(cursor, true);
  };

  // Called when a new review is submitted
  const handleReviewSubmitted = () => {
    fetchReviews(null, false);
  };

  // Called when a customer edits their own review
  const handleReviewUpdated = (updated) => {
    setReviews((prev) => prev.map((r) => (r.id === updated.id ? { ...r, ...updated } : r)));
    fetchReviews(null, false);
  };

  // Page Navigation Router
  const navigate = (page, options = {}) => {
    setCurrentPage(page);

    let targetUrl = page === 'pricing' ? '/pricing' : '/';
    if (options.hash) {
      targetUrl += options.hash;
    } else if (page === 'reviews' && options.scrollToForm) {
      targetUrl += '#review-form';
    }

    if (window.history && window.history.pushState) {
      window.history.pushState({ page }, '', targetUrl);
    }

    if (options.scrollToForm) {
      setTimeout(() => {
        const el = document.getElementById('review-form');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // URL PopState & Hash Listener
  useEffect(() => {
    const handleUrlChange = () => {
      const pathname = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();

      if (pathname.startsWith('/pricing') || hash.startsWith('#pricing')) {
        setCurrentPage('pricing');
      } else {
        setCurrentPage('reviews');
        if (hash === '#review-form' || hash === '#form' || hash === '#rate') {
          setTimeout(() => {
            const el = document.getElementById('review-form');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }, 150);
        }
      }
    };

    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  const scrollToForm = () => {
    if (currentPage !== 'reviews') {
      navigate('reviews', { scrollToForm: true });
    } else {
      const el = document.getElementById('review-form');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const currentLogo = settings.logoUrl || '/logo.png';
  const currentShopName = settings.shopName || 'Pattancute';
  const currentShopSubtitle = settings.shopSubtitle || 'pattancute.wo-nad.workers.dev';
  const lineUrl = settings.contacts?.line?.url || 'https://line.me/R/ti/p/@078yzbej';

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden relative flex flex-col font-sans selection:bg-pattan-pink-light selection:text-pattan-blue-deep">
      {/* 1. Refined Ambient Mesh Background */}
      <Decorations />

      {/* 2. Floating Frosted Boutique Top Nav Dock */}
      <div className="sticky top-0 sm:top-2.5 z-40 w-full sm:px-4 transition-all">
        <header className="max-w-6xl mx-auto bg-white/85 dark:bg-[#131C30]/85 backdrop-blur-xl sm:rounded-2xl border-b sm:border border-white/90 dark:border-slate-700/60 shadow-[0_8px_30px_-12px_rgba(27,42,74,0.12)] transition-colors">
          <div className="px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between gap-2">
            {/* Brand Logo & Cute Signature Shop Name */}
            <div
              className="flex items-center gap-2.5 cursor-pointer group min-w-0 shrink"
              onClick={() => navigate('reviews')}
            >
              <div className="w-9 h-9 rounded-xl bg-white dark:bg-slate-800 border border-pattan-pink/25 dark:border-slate-700 shadow-xs p-0.5 overflow-hidden flex items-center justify-center transition-transform group-hover:scale-105 shrink-0">
                <img src={currentLogo} alt={currentShopName} className="w-full h-full object-contain rounded-lg" />
              </div>
              <div className="min-w-0">
                <span className="font-bold text-base sm:text-xl text-brand-gradient tracking-normal block font-brand truncate -my-1">
                  {currentShopName}
                </span>
                <span className="hidden sm:block text-[10px] font-semibold text-slate-400 tracking-wide truncate">
                  {currentShopSubtitle}
                </span>
              </div>
            </div>

            {/* Center (Desktop md+): Dedicated Page Navigation Tabs */}
            <nav className="hidden md:flex items-center p-1 rounded-xl bg-pattan-blue-soft/75 dark:bg-slate-800/90 border border-pattan-blue/10 dark:border-slate-700 shrink-0 select-none">
              <button
                type="button"
                onClick={() => navigate('reviews')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
                  currentPage === 'reviews'
                    ? 'bg-white dark:bg-slate-700 text-pattan-blue-deep dark:text-white shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-pattan-blue-deep dark:hover:text-slate-200'
                }`}
                aria-label="ไปยังหน้าเครดิตและรีวิวร้าน"
              >
                <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${currentPage === 'reviews' ? 'text-pattan-blue' : 'text-slate-400'}`} />
                <span className="whitespace-nowrap leading-none">รีวิว &amp; เครดิตร้าน</span>
              </button>

              <button
                type="button"
                onClick={() => navigate('pricing')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
                  currentPage === 'pricing'
                    ? 'bg-white dark:bg-slate-700 text-pattan-blue-deep dark:text-white shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-pattan-pink-deep dark:hover:text-slate-200'
                }`}
                aria-label="ไปยังหน้าเรทราคาหารแอพ"
              >
                <Tag className={`w-3.5 h-3.5 shrink-0 ${currentPage === 'pricing' ? 'text-pattan-pink-deep dark:text-pattan-pink' : 'text-slate-400'}`} />
                <span className="whitespace-nowrap leading-none">เรทราคาหารแอพ</span>
              </button>
            </nav>

            {/* Right Actions: Signature Midnight Blueberry Admin Button + Theme Toggle + Page CTA */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <button
                onClick={() => openAdmin(currentPage === 'pricing' ? 'pricing' : 'overview')}
                type="button"
                className="btn-jelly btn-signature h-9 px-3 sm:px-3.5 rounded-xl text-white active:scale-[0.98] transition-all flex items-center gap-1.5 text-xs font-bold cursor-pointer whitespace-nowrap shrink-0"
                title="เข้าสู่ระบบหลังบ้าน (Admin Dashboard)"
                aria-label="เข้าสู่ระบบหลังบ้าน"
              >
                <Lock className="w-3.5 h-3.5 text-pattan-pink-light shrink-0" />
                <span className="text-[11px] sm:text-xs font-bold">หลังบ้าน</span>
              </button>

              <ThemeToggle />

              {/* Dynamic CTA button depending on current page */}
              {currentPage === 'reviews' ? (
                <button
                  onClick={scrollToForm}
                  type="button"
                  className="btn-jelly btn-rose hidden lg:inline-flex items-center gap-1.5 h-9 px-4 rounded-xl text-white font-bold text-xs transition-all cursor-pointer whitespace-nowrap shrink-0"
                >
                  <Star className="w-3.5 h-3.5 fill-white text-white shrink-0" />
                  <span>ให้เครดิตร้าน</span>
                </button>
              ) : (
                <a
                  href={lineUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-jelly hidden lg:inline-flex items-center gap-1.5 h-9 px-4 rounded-xl bg-[#06C755] hover:bg-[#05b34c] text-white font-bold text-xs shadow-xs transition-all cursor-pointer whitespace-nowrap shrink-0"
                >
                  <MessageCircle className="w-4 h-4 fill-white shrink-0" />
                  <span>สั่งซื้อทาง LINE</span>
                </a>
              )}
            </div>
          </div>

          {/* Mobile Sub-Row (< md): Clean Full-Width Segmented Page Switcher */}
          <div className="md:hidden px-3 pb-2.5">
            <nav className="grid grid-cols-2 p-1 rounded-xl bg-pattan-blue-soft/80 dark:bg-slate-800/90 border border-pattan-blue/10 dark:border-slate-700 select-none">
              <button
                type="button"
                onClick={() => navigate('reviews')}
                className={`py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  currentPage === 'reviews'
                    ? 'bg-white dark:bg-slate-700 text-pattan-blue-deep dark:text-white shadow-xs'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${currentPage === 'reviews' ? 'text-pattan-blue' : 'text-slate-400'}`} />
                <span>รีวิว &amp; เครดิตร้าน</span>
              </button>

              <button
                type="button"
                onClick={() => navigate('pricing')}
                className={`py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  currentPage === 'pricing'
                    ? 'bg-white dark:bg-slate-700 text-pattan-blue-deep dark:text-white shadow-xs'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                <Tag className={`w-3.5 h-3.5 shrink-0 ${currentPage === 'pricing' ? 'text-pattan-pink-deep dark:text-pattan-pink' : 'text-slate-400'}`} />
                <span>เรทราคาหารแอพ</span>
              </button>
            </nav>
          </div>
        </header>
      </div>

      {/* 4. Main Content Flow (Separated Pages) */}
      <main className="flex-1 relative z-10">
        {currentPage === 'reviews' ? (
          /* ================= PAGE 1: REVIEWS & STORE CREDITS ================= */
          <div className="animate-fade-in space-y-6">
            {/* Hero Section */}
            <Hero
              onScrollToForm={scrollToForm}
              totalReviews={stats.total}
              averageRating={stats.average}
              settings={settings}
            />

            {/* Section Divider: Cute Cloud */}
            <SectionDivider />

            {/* Bento Grid Score Summary Section */}
            <ScoreSummary stats={stats} bento={settings.bento} />

            {/* Section Divider: Soft Wave */}
            <SectionDivider variant="wave" />

            {/* Review Form Section */}
            <ReviewForm onReviewSubmitted={handleReviewSubmitted} />

            {/* Section Divider: Cloud */}
            <SectionDivider />

            {/* Review List Section */}
            <ReviewList
              reviews={reviews}
              isLoadingInitial={isLoadingInitial}
              isLoadingMore={isLoadingMore}
              hasMore={hasMore}
              onLoadMore={handleLoadMore}
              onScrollToForm={scrollToForm}
              onReviewUpdated={handleReviewUpdated}
            />

            {/* Contact Shop Section */}
            <ContactSection contacts={settings.contacts} shopName={settings.shopName} />
          </div>
        ) : (
          /* ================= PAGE 2: MODERN APP PRICING WORKSPACE ================= */
          <div className="animate-fade-in">
            {/* Compact Modern Pricing Header with Admin Access */}
            <PricingHero
              shopName={settings.shopName}
              totalApps={settings.pricing?.length || 15}
              onOpenAdmin={() => openAdmin('pricing')}
            />

            {/* Modern Master-Detail App Pricing Workspace */}
            <PricingSection
              pricing={settings.pricing}
              contacts={settings.contacts}
              onOpenAdmin={openAdmin}
            />

            {/* Contact Shop Section */}
            <ContactSection contacts={settings.contacts} shopName={settings.shopName} />
          </div>
        )}
      </main>

      {/* 5. Footer */}
      <Footer onOpenAdmin={() => openAdmin(currentPage === 'pricing' ? 'pricing' : 'overview')} settings={settings} />

      {/* 6. Floating Music Button */}
      <MusicPlayer musicSettings={settings.music} />

      {/* 7. Mobile Bottom Floating Glass Nav Pill */}
      <BottomNav
        currentPage={currentPage}
        onNavigateToReviews={() => navigate('reviews')}
        onNavigateToPricing={() => navigate('pricing')}
        onScrollToForm={() => navigate('reviews', { scrollToForm: true })}
      />

      {/* 8. Full Comprehensive Admin Dashboard Modal */}
      <AdminModal
        isOpen={showAdminModal}
        onClose={() => setShowAdminModal(false)}
        settings={settings}
        stats={stats}
        initialTab={adminInitialTab}
        initialAppId={adminInitialAppId}
        onSettingsUpdated={(newSettings) => setSettings(newSettings)}
        onLogoUpdated={(newLogoUrl) => setSettings((prev) => ({ ...prev, logoUrl: newLogoUrl }))}
        onReviewDeleted={() => fetchReviews(null, false)}
      />
    </div>
  );
}

export default App;

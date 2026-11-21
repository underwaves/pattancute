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
import { CuteSparkleTrail } from './components/CuteSparkleTrail';
import { AdminModal } from './components/AdminModal';
import { PricingSection } from './components/PricingSection';
import { Star, Lock, Tag } from 'lucide-react';
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

  // Initial load
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
    // Refresh stats in case the star rating changed
    fetchReviews(null, false);
  };

  // Scroll Helpers
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToPricing = (appId) => {
    const el = document.getElementById('pricing-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    if (appId) {
      window.location.hash = `#pricing-${appId}`;
    }
  };

  const scrollToForm = () => {
    const el = document.getElementById('review-form');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToReviews = () => {
    const el = document.getElementById('reviews-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Deep linking handler: #reviews, #pricing, #pricing-<app>, #review-form, #contacts
  useEffect(() => {
    const handleDeepLink = () => {
      const hash = window.location.hash.toLowerCase();
      if (!hash) return;

      const timer = setTimeout(() => {
        if (hash === '#reviews' || hash === '#reviews-section') {
          const el = document.getElementById('reviews-section') || document.getElementById('reviews');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        } else if (hash === '#pricing' || hash === '#pricing-section' || hash.startsWith('#pricing-')) {
          const el = document.getElementById('pricing-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        } else if (hash === '#review-form' || hash === '#form' || hash === '#rate') {
          const el = document.getElementById('review-form');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        } else if (hash === '#contact' || hash === '#contacts' || hash === '#contact-section') {
          const el = document.getElementById('contact-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 250);

      return () => clearTimeout(timer);
    };

    handleDeepLink();
    window.addEventListener('hashchange', handleDeepLink);
    return () => window.removeEventListener('hashchange', handleDeepLink);
  }, []);

  const currentLogo = settings.logoUrl || '/logo.png';
  const currentShopName = settings.shopName || 'Pattancute';
  const currentShopSubtitle = settings.shopSubtitle || 'Pattancute.shop';

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden relative flex flex-col font-sans selection:bg-pattan-pink-light selection:text-pattan-blue-deep">
      {/* 1. Living Aurora Blobs + Subtle Paper Texture */}
      <Decorations />

      {/* 2. Tactile Pastel Sparkle Tap Effect */}
      <CuteSparkleTrail />

      {/* 2. Glass Sticky Top Nav Bar */}
      <header className="sticky top-0 z-40 w-full bg-white/75 dark:bg-slate-900/75 backdrop-blur-xl border-b border-white/80 dark:border-slate-800 transition-colors">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 h-16 flex items-center justify-between gap-2">
          {/* Brand */}
          <div
            className="flex items-center gap-2 sm:gap-2.5 cursor-pointer group shrink-0"
            onClick={scrollToTop}
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-white shadow-sticker p-0.5 overflow-hidden flex items-center justify-center transition-transform group-hover:scale-105">
              <img src={currentLogo} alt={currentShopName} className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="font-extrabold text-base sm:text-xl text-pattan-blue dark:text-pattan-blue-light tracking-tight block leading-none font-display">
                {currentShopName}
              </span>
              <span className="text-[9px] sm:text-[10px] font-black text-pattan-pink tracking-wider">
                {currentShopSubtitle}
              </span>
            </div>
          </div>

          {/* Navigation Links (Desktop) & Actions: Admin Panel + Theme Toggle + Jump to Form */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Quick Section Nav (Desktop) */}
            <div className="hidden md:flex items-center gap-1 mr-1">
              <button
                type="button"
                onClick={() => scrollToPricing()}
                className="px-3 py-1.5 rounded-full text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-pattan-pink hover:bg-pink-50/70 dark:hover:bg-slate-800 transition flex items-center gap-1.5 cursor-pointer"
              >
                <Tag className="w-3.5 h-3.5 text-pattan-pink" />
                <span>เรทราคาแอพ</span>
              </button>

              <button
                type="button"
                onClick={scrollToReviews}
                className="px-3 py-1.5 rounded-full text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-pattan-blue hover:bg-blue-50/70 dark:hover:bg-slate-800 transition flex items-center gap-1.5 cursor-pointer"
              >
                <span>💬 รีวิวลูกค้า</span>
              </button>
            </div>

            <button
              onClick={() => setShowAdminModal(true)}
              type="button"
              className="px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-full bg-white/85 dark:bg-slate-800/85 backdrop-blur-md border border-pattan-blue/20 dark:border-slate-700 text-pattan-blue-deep dark:text-pattan-blue-light hover:text-pattan-blue hover:scale-105 active:scale-95 transition-all shadow-xs flex items-center gap-1 text-xs font-bold cursor-pointer"
              title="เข้าสู่ระบบหลังบ้าน (Admin Dashboard)"
              aria-label="เข้าสู่ระบบหลังบ้าน"
            >
              <Lock className="w-3.5 h-3.5 text-pattan-blue shrink-0" />
              <span className="text-[11px] sm:text-xs font-bold">หลังบ้าน</span>
            </button>

            <ThemeToggle />
            <button
              onClick={scrollToForm}
              type="button"
              className="btn-jelly hidden sm:inline-flex items-center gap-2 min-h-[40px] px-5 py-2 rounded-full bg-gradient-to-r from-pattan-pink to-[#E26698] text-white font-bold text-xs sm:text-sm shadow-jelly-pink hover:shadow-lg transition-all"
            >
              <Star className="w-3.5 h-3.5 fill-white text-white shrink-0" />
              <span className="tracking-wide font-sans">ให้เครดิตร้าน</span>
            </button>
          </div>
        </div>
      </header>

      {/* 3. Main Content Flow */}
      <main className="flex-1 relative z-10">
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

        {/* App-by-app Pricing Rate Cards Section */}
        <PricingSection pricing={settings.pricing} contacts={settings.contacts} />

        {/* Section Divider: Cute Cloud */}
        <SectionDivider />

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
      </main>

      {/* 4. Footer */}
      <Footer onOpenAdmin={() => setShowAdminModal(true)} settings={settings} />

      {/* 5. Floating Music Button */}
      <MusicPlayer musicSettings={settings.music} />

      {/* 6. Mobile Bottom Floating Glass Nav Pill */}
      <BottomNav
        onScrollToTop={scrollToTop}
        onScrollToPricing={scrollToPricing}
        onScrollToReviews={scrollToReviews}
        onScrollToForm={scrollToForm}
      />

      {/* 7. Full Comprehensive Admin Dashboard Modal */}
      <AdminModal
        isOpen={showAdminModal}
        onClose={() => setShowAdminModal(false)}
        settings={settings}
        stats={stats}
        onSettingsUpdated={(newSettings) => setSettings(newSettings)}
        onLogoUpdated={(newLogoUrl) => setSettings((prev) => ({ ...prev, logoUrl: newLogoUrl }))}
        onReviewDeleted={() => fetchReviews(null, false)}
      />
    </div>
  );
}

export default App;

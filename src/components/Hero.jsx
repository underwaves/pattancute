import React, { useState } from 'react';
import { Star, Sparkles, ShieldCheck, Heart } from 'lucide-react';
import { CuteMonkey } from './CuteMonkey';

const MASCOT_MOODS = ['wink', 'love', 'cheer', 'happy'];

const DEFAULT_MASCOT_QUOTES = [
  'ยินดีต้อนรับน้า~ ✨',
  'งื้ออ จิ้มน้องลิงแล้วแก้มแดงเลย 💖',
  'ขอให้วันนี้เป็นวันที่น่ารักและสดใสค่ะ 🌸',
  'ส่งพลังใจให้ +100 ดวงเลยยย 🐒✨',
  'กล้วยอร่อยจังงั่มๆ 🍌 ขอบคุณที่แวะมาหาน้า',
  'ร้าน Pattancute ยินดีให้บริการเสมอนะคะ 🎀',
  'แตะอีกทีสิคะ น้องลิงชอบรอยยิ้มของคุณนะ 🥰',
  'รักลูกค้าทุกคนที่สุดในโลกเลยยย 🎉💖',
];

const FLOATING_ICONS = ['💖', '✨', '🍌', '🌸', '🐒', '⭐'];

export function Hero({
  onScrollToForm,
  totalReviews,
  averageRating,
  settings,
}) {
  const {
    welcomeChip = 'ศูนย์รวมรีวิวและเครดิตร้าน Pattancute',
    welcomeBubble = 'ยินดีต้อนรับน้า~ ✨',
    heroTitle = 'Pattancute',
    shopName = 'Pattancute',
    heroSubtitle = 'รวมความประทับใจและเครดิตจากลูกค้าตัวจริง 100% 🌸',
    heroCtaText = 'ให้เครดิตร้าน Pattancute ✨',
    badgeTrust1 = 'เปิดรับรีวิวแรกจากคุณอยู่น้า~',
    badgeTrust2 = 'ร้านค้าปลอดภัย เชื่อถือได้',
    mascotQuotes = DEFAULT_MASCOT_QUOTES,
    logoUrl = '/logo.png',
  } = settings || {};

  const baseQuotes = mascotQuotes && mascotQuotes.length > 0 ? mascotQuotes : DEFAULT_MASCOT_QUOTES;
  const quotes = welcomeBubble
    ? [welcomeBubble, ...baseQuotes.filter((q) => q !== welcomeBubble)]
    : baseQuotes;

  const [patCount, setPatCount] = useState(0);
  const [moodIndex, setMoodIndex] = useState(0);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [floatingEmojis, setFloatingEmojis] = useState([]);
  const [isBouncing, setIsBouncing] = useState(false);

  const handleMascotClick = () => {
    // Increment love counter
    setPatCount((prev) => prev + 1);

    // Cycle mood
    setMoodIndex((prev) => (prev + 1) % MASCOT_MOODS.length);

    // Pick a new quote from dynamic quotes (start from index 1 after initial quote)
    setQuoteIndex((prev) => (prev + 1) % quotes.length);

    // Trigger bouncy animation
    setIsBouncing(true);
    setTimeout(() => setIsBouncing(false), 400);

    // Spawn floating emoji particle
    const randomEmoji = FLOATING_ICONS[Math.floor(Math.random() * FLOATING_ICONS.length)];
    const id = Date.now() + Math.random();
    const xOffset = (Math.random() - 0.5) * 50;

    setFloatingEmojis((prev) => [...prev.slice(-6), { id, emoji: randomEmoji, xOffset }]);

    setTimeout(() => {
      setFloatingEmojis((prev) => prev.filter((item) => item.id !== id));
    }, 900);
  };

  const currentMood = MASCOT_MOODS[moodIndex];
  const currentQuote = patCount === 0 && welcomeBubble ? welcomeBubble : quotes[quoteIndex % quotes.length];
  const displayTitle = heroTitle || shopName || 'Pattancute';

  return (
    <header className="relative pt-6 sm:pt-10 pb-10 px-4 text-center max-w-3xl mx-auto flex flex-col items-center select-none font-sans">
      {/* 1. Welcoming Cute Pill Chip */}
      <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/85 dark:bg-slate-800/85 backdrop-blur-md border border-white/90 dark:border-slate-700/60 shadow-sm text-[11px] sm:text-xs font-semibold text-pattan-blue-deep mb-5 anim-float max-w-full">
        <Sparkles className="w-3.5 h-3.5 text-pattan-yellow fill-pattan-yellow shrink-0" />
        <span className="truncate">{welcomeChip}</span>
        <span className="text-pattan-pink shrink-0">✨</span>
      </div>

      {/* 2. Interactive Central Logo Container with Tap-To-React Mascot */}
      <div
        className="relative group my-2 cursor-pointer transition-transform select-none active:scale-95"
        onClick={handleMascotClick}
        title="แตะน้องลิงเพื่อเล่นและรับพลังความสดใสน้า~"
        aria-label="แตะน้องลิง Pattancute เพื่อรับความรัก"
      >
        {/* Luminous Soft Aurora Glow behind logo */}
        <div className="absolute -inset-6 bg-gradient-to-tr from-[#FADCE8]/45 via-[#FFF3D0]/40 to-[#DCE7FC]/45 rounded-full blur-3xl opacity-80 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        {/* Floating Hearts/Emojis when tapped */}
        {floatingEmojis.map((item) => (
          <span
            key={item.id}
            className="absolute top-0 right-2 z-30 pointer-events-none text-2xl font-bold animate-star-pop"
            style={{
              transform: `translate(${item.xOffset}px, -45px)`,
              transition: 'transform 0.9s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.9s ease-out',
            }}
          >
            {item.emoji}
          </span>
        ))}

        {/* Monkey Sticker Peek over the top-right of logo card */}
        <div
          className={`absolute -top-6 -right-5 sm:-right-7 z-20 ${
            isBouncing ? 'scale-125 -rotate-12' : 'anim-float-alt'
          } transition-transform duration-300`}
        >
          <div className="relative p-1 rounded-full bg-white shadow-sticker group-hover:shadow-bento-hover transition-all">
            <CuteMonkey
              className="w-13 h-13 sm:w-15 sm:h-15 max-w-full max-h-full"
              mood={currentMood}
            />
          </div>
        </div>

        {/* Floating Sparkle Star Sticker (Top Left) */}
        <div className="absolute -top-2 -left-3 z-20 anim-float pointer-events-none">
          <div className="w-8 h-8 rounded-full bg-white shadow-sticker flex items-center justify-center text-pattan-yellow group-hover:rotate-45 transition-transform duration-300">
            <Sparkles className="w-4 h-4 fill-current" />
          </div>
        </div>

        {/* Circular Logo Card with sticker outline */}
        <div
          className={`relative w-36 h-36 sm:w-44 sm:h-44 rounded-full p-2 bg-white/95 dark:bg-slate-800 shadow-bento border-4 border-white flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:scale-105 group-hover:shadow-bento-hover ${
            isBouncing ? 'scale-95' : ''
          }`}
        >
          <img
            src={logoUrl || '/logo.png'}
            alt="Pattancute Logo"
            className="w-full h-full object-contain rounded-full"
            loading="eager"
          />
        </div>

        {/* Dynamic Cute Speech Bubble with Random Quotes */}
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-20 whitespace-nowrap bg-white/95 dark:bg-slate-800 px-3.5 py-1 rounded-full shadow-sticker border border-white text-xs font-bold text-pattan-blue-deep flex items-center gap-1.5 transition-all duration-300 group-hover:scale-105">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
          <span className="font-cute text-xs text-[#446699] dark:text-[#A7C7FF]">
            {currentQuote}
          </span>
        </div>
      </div>

      {/* Love Meter Chip if user tapped mascot */}
      {patCount > 0 && (
        <div className="mt-4 animate-star-pop inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-slate-800 border border-rose-200/80 text-[11px] font-bold text-rose-600 dark:text-rose-300 shadow-xs">
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" />
          <span>ส่งความรักให้น้องลิงแล้ว {patCount} ครั้ง 💖</span>
        </div>
      )}

      {/* 3. Hero Brand Typography */}
      <h1 className="mt-5 text-4xl sm:text-5xl font-black text-pattan-blue dark:text-pattan-blue-light font-display tracking-tight leading-none drop-shadow-xs">
        {displayTitle}
      </h1>
      <p className="mt-2 text-base sm:text-lg font-bold text-slate-700 dark:text-slate-200 flex items-center justify-center gap-1.5 flex-wrap">
        <span>{heroSubtitle}</span>
      </p>

      {/* 4. Social Proof & Trust Badges */}
      <div className="mt-3.5 flex flex-wrap items-center justify-center gap-2 text-xs font-semibold">
        {totalReviews > 0 ? (
          <div className="inline-flex items-center gap-1.5 bg-white/90 dark:bg-slate-800/90 px-3 py-1.5 rounded-full border border-amber-200/80 shadow-xs text-amber-900 dark:text-amber-300">
            <Star className="w-3.5 h-3.5 text-pattan-yellow fill-pattan-yellow shrink-0" />
            <span>คะแนนเฉลี่ย {averageRating.toFixed(1)} · ทั้งหมด {totalReviews} รีวิว</span>
          </div>
        ) : (
          <div className="inline-flex items-center gap-1.5 bg-white/90 dark:bg-slate-800/90 px-3 py-1.5 rounded-full border border-pink-200/80 shadow-xs text-pattan-pink-deep">
            <Heart className="w-3.5 h-3.5 text-pattan-pink fill-pattan-pink shrink-0" />
            <span>{badgeTrust1}</span>
          </div>
        )}

        <div className="inline-flex items-center gap-1.5 bg-white/90 dark:bg-slate-800/90 px-3 py-1.5 rounded-full border border-emerald-200/80 shadow-xs text-emerald-800 dark:text-emerald-300">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          <span>{badgeTrust2}</span>
        </div>
      </div>

      {/* 5. Pill Jelly Buttons */}
      <div className="mt-7 flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
        <button
          onClick={onScrollToForm}
          type="button"
          className="btn-jelly w-full sm:w-auto min-h-[50px] px-8 py-3.5 rounded-full bg-gradient-to-r from-pattan-blue via-[#6E98DC] to-pattan-pink text-white font-bold text-base shadow-jelly flex items-center justify-center gap-2.5"
        >
          <Star className="w-5 h-5 text-white fill-white drop-shadow-xs shrink-0" />
          <span className="tracking-wide">{heroCtaText}</span>
        </button>

        <a
          href="#reviews-section"
          className="w-full sm:w-auto min-h-[50px] px-7 py-3.5 rounded-full bg-white/85 dark:bg-slate-800/80 hover:bg-white active:scale-95 text-pattan-blue-deep font-semibold text-sm sm:text-base border border-white/90 shadow-sm transition-all duration-200 flex items-center justify-center gap-1.5"
        >
          <span>ดูรีวิวทั้งหมด ({totalReviews})</span>
        </a>
      </div>
    </header>
  );
}

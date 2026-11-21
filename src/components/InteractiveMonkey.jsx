import React, { useState, useRef, useEffect } from 'react';

const DEFAULT_QUOTES = [
  'ยินดีต้อนรับค่ะ ✦',
  'แวะดูเรทราคาแอพได้น้า',
  'ส่งไว 5–10 นาที มีประกันดูแล',
  'รีวิวจริง 100% วางใจได้ค่ะ ♡',
  'ทัก LINE สอบถามได้ตลอดเลย',
  'ขอบคุณที่แวะมาชมร้านนะคะ ✨',
];

const PARTICLES = [
  { char: '♡', color: '#DF6E9B' },
  { char: '✦', color: '#4B72B0' },
  { char: '♡', color: '#BE4B7A' },
  { char: '🍌', color: '#EAB308' },
  { char: '✦', color: '#EAB308' },
];

/**
 * Interactive Crayon Monkey Mascot
 * - Gentle breathing & swaying idle motion
 * - Tap/click to make the monkey hop happily, emit soft pastel sparkles, and show a mini glass speech bubble
 * - 5-tap combo triggers a joyful spin-hop easter egg!
 */
export function InteractiveMonkey({
  className = '',
  imgClassName = 'w-20 h-20 sm:w-24 sm:h-24',
  quotes = DEFAULT_QUOTES,
  bubblePosition = 'top', // 'top' | 'top-left'
  eager = false,
}) {
  const activeQuotes = Array.isArray(quotes) && quotes.length > 0 ? quotes : DEFAULT_QUOTES;

  const [animMode, setAnimMode] = useState('idle'); // 'idle' | 'jump' | 'spin'
  const [tapCount, setTapCount] = useState(0);
  const [bubbleText, setBubbleText] = useState('');
  const [particles, setParticles] = useState([]);

  const animTimerRef = useRef(null);
  const bubbleTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (animTimerRef.current) clearTimeout(animTimerRef.current);
      if (bubbleTimerRef.current) clearTimeout(bubbleTimerRef.current);
    };
  }, []);

  const handleTap = (e) => {
    e.stopPropagation();

    const nextCount = tapCount + 1;
    setTapCount(nextCount);

    // Every 5th tap triggers a joyful spin-hop easter egg
    const isCombo = nextCount % 5 === 0;
    setAnimMode('idle');
    requestAnimationFrame(() => {
      setAnimMode(isCombo ? 'spin' : 'jump');
    });

    if (animTimerRef.current) clearTimeout(animTimerRef.current);
    animTimerRef.current = setTimeout(() => {
      setAnimMode('idle');
    }, isCombo ? 750 : 580);

    // Show clean frosted mini speech bubble
    const msg = isCombo
      ? `เอ็นดูน้องครบ ${nextCount} ครั้งแล้ว ♡`
      : activeQuotes[(nextCount - 1) % activeQuotes.length];
    setBubbleText(msg);

    if (bubbleTimerRef.current) clearTimeout(bubbleTimerRef.current);
    bubbleTimerRef.current = setTimeout(() => {
      setBubbleText('');
    }, 2800);

    // Emit 3 delicate floating particles
    const burstCount = isCombo ? 5 : 3;
    const now = Date.now();
    const newParticles = Array.from({ length: burstCount }, (_, i) => {
      const pick = PARTICLES[Math.floor(Math.random() * PARTICLES.length)];
      return {
        id: `${now}-${i}-${Math.random()}`,
        char: pick.char,
        color: pick.color,
        x: Math.round((Math.random() - 0.5) * 68),
        r: Math.round((Math.random() - 0.5) * 32),
        delay: i * 55,
      };
    });

    setParticles((prev) => [...prev.slice(-8), ...newParticles]);
    setTimeout(() => {
      const ids = new Set(newParticles.map((p) => p.id));
      setParticles((prev) => prev.filter((p) => !ids.has(p.id)));
    }, 1050);
  };

  const animClass =
    animMode === 'spin'
      ? 'animate-monkey-spin'
      : animMode === 'jump'
      ? 'animate-monkey-jump'
      : 'animate-monkey-idle';

  return (
    <button
      type="button"
      onClick={handleTap}
      className={`group/monkey relative inline-flex items-center justify-center cursor-pointer select-none focus:outline-none ${className}`}
      title="แตะเล่นกับน้องลิงได้นะคะ"
      aria-label="แตะเล่นกับมาสคอตน้องลิง"
    >
      {/* Floating Mini Frosted Speech Bubble */}
      {bubbleText && (
        <div
          className={`pointer-events-none absolute -top-9 z-30 whitespace-nowrap px-3 py-1 rounded-full bg-white/95 dark:bg-[#131C30]/95 backdrop-blur-md border border-pattan-pink/30 dark:border-slate-700 shadow-md text-[11px] font-bold text-pattan-blue-deep dark:text-white animate-speech-pop ${
            bubblePosition === 'top-left' ? 'left-1/3' : 'left-1/2'
          }`}
        >
          <span>{bubbleText}</span>
          {/* Tiny speech pointer */}
          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-white dark:bg-[#131C30] border-r border-b border-pattan-pink/30 dark:border-slate-700" />
        </div>
      )}

      {/* Floating Sparkle / Heart Particles */}
      {particles.map((p) => (
        <span
          key={p.id}
          aria-hidden="true"
          className="pointer-events-none absolute top-1 left-1/2 z-30 text-sm font-bold animate-monkey-particle"
          style={{
            color: p.color,
            '--mx': `${p.x}px`,
            '--mr': `${p.r}deg`,
            animationDelay: `${p.delay}ms`,
          }}
        >
          {p.char}
        </span>
      ))}

      {/* Subtle Soft Ground Shadow under Monkey */}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute bottom-0.5 left-1/2 -translate-x-1/2 w-12 h-2 rounded-full bg-pattan-blue-deep/10 dark:bg-black/35 blur-[2px] transition-transform duration-300 ${
          animMode !== 'idle' ? 'scale-75 opacity-50' : 'group-hover/monkey:scale-90'
        }`}
      />

      {/* Monkey Mascot Image */}
      <img
        src="/mascot-monkey.png"
        alt="มาสคอตร้าน"
        className={`${imgClassName} object-contain select-none drop-shadow-[0_6px_12px_rgba(27,42,74,0.1)] transition-transform duration-200 group-hover/monkey:scale-105 ${animClass}`}
        loading={eager ? 'eager' : 'lazy'}
        draggable={false}
      />
    </button>
  );
}

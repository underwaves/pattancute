import React, { useEffect, useState } from 'react';

/**
 * Lightweight cute pastel star & heart confetti (No heavy external libs)
 * Respects prefers-reduced-motion
 */
export function Confetti({ onComplete }) {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Check reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      if (onComplete) onComplete();
      return;
    }

    const items = [];
    const colors = ['#FFD95A', '#F58DB8', '#5B86C8', '#CDF5B5', '#FFF0A0'];
    const shapes = ['★', '✦', '💖', '🐵', '🌸', '✨'];

    for (let i = 0; i < 36; i++) {
      items.push({
        id: i,
        left: Math.random() * 100, // 0 - 100%
        delay: Math.random() * 0.4, // 0 - 0.4s
        duration: 1.8 + Math.random() * 1.2, // 1.8 - 3s
        size: 14 + Math.random() * 16,
        color: colors[Math.floor(Math.random() * colors.length)],
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        rotation: (Math.random() - 0.5) * 360,
      });
    }

    setParticles(items);

    const timer = setTimeout(() => {
      setParticles([]);
      if (onComplete) onComplete();
    }, 3200);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!particles.length) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden" aria-hidden="true">
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute select-none font-bold block"
          style={{
            left: `${p.left}%`,
            top: '-20px',
            fontSize: `${p.size}px`,
            color: p.color,
            animation: `confettiFall ${p.duration}s cubic-bezier(0.25, 1, 0.5, 1) ${p.delay}s forwards`,
          }}
        >
          {p.shape}
        </span>
      ))}
      <style>{`
        @keyframes confettiFall {
          0% {
            transform: translateY(0px) rotate(0deg) scale(0.6);
            opacity: 1;
          }
          75% {
            opacity: 1;
          }
          100% {
            transform: translateY(105vh) rotate(${particles[0]?.rotation || 180}deg) scale(1);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

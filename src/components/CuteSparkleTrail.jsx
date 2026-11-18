import React, { useEffect, useState } from 'react';

/**
 * CuteSparkleTrail
 * Interactive tactile signature effect:
 * Spawns gentle pastel star & heart particles whenever the user taps or clicks.
 * Lightweight, zero-dependency, throttled, respecting prefers-reduced-motion.
 */
const PARTICLE_COLORS = ['#FFD95A', '#F58DB8', '#5B86C8', '#CDF5B5', '#FF9EAA'];
const SHAPES = ['★', '✦', '💖', '✨', '🌸'];

export function CuteSparkleTrail() {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Respect reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    let idCounter = 0;

    const handlePointerDown = (e) => {
      // Don't spawn if tapping on an input/textarea so it doesn't distract typing
      const tag = (e.target?.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea') return;

      const x = e.clientX;
      const y = e.clientY;

      // Spawn 3 mini particles per tap
      const newItems = Array.from({ length: 3 }).map((_, i) => {
        const id = ++idCounter;
        const color = PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)];
        const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
        const angle = (Math.PI * 2 * i) / 3 + (Math.random() - 0.5) * 0.8;
        const speed = 25 + Math.random() * 25;
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed - 20; // slight upward drift
        const size = 12 + Math.random() * 6;

        return { id, x, y, vx, vy, color, shape, size };
      });

      setParticles((prev) => [...prev.slice(-15), ...newItems]);

      // Auto-remove particles after animation completes
      setTimeout(() => {
        setParticles((prev) => prev.filter((p) => !newItems.some((n) => n.id === p.id)));
      }, 650);
    };

    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    return () => window.removeEventListener('pointerdown', handlePointerDown);
  }, []);

  if (particles.length === 0) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-50 overflow-hidden select-none"
      aria-hidden="true"
    >
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute animate-sparkle-burst font-sans font-bold leading-none pointer-events-none inline-block drop-shadow-xs"
          style={{
            left: `${p.x}px`,
            top: `${p.y}px`,
            color: p.color,
            fontSize: `${p.size}px`,
            '--vx': `${p.vx}px`,
            '--vy': `${p.vy}px`,
          }}
        >
          {p.shape}
        </span>
      ))}
    </div>
  );
}

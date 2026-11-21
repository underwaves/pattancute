import React from 'react';

/**
 * Minimalist Rotating Circular Boutique Stamp Seal
 * Signature visual hallmark for Pattancute Digital Boutique Club.
 */
export function BoutiqueSeal({ text = 'VERIFIED SHOP · 100% REAL · PREMIUM · ', size = 76, className = '' }) {
  const uniqueId = React.useId().replace(/:/g, '');
  const pathId = `sealCircle-${uniqueId}`;

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none pointer-events-none ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full animate-spin-slow"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <path
            id={pathId}
            d="M 50, 50 m -36, 0 a 36,36 0 1,1 72,0 a 36,36 0 1,1 -72,0"
          />
        </defs>
        <circle
          cx="50"
          cy="50"
          r="46"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.8"
          strokeDasharray="2 3"
          opacity="0.35"
        />
        <text
          fill="currentColor"
          fontSize="8.3"
          fontWeight="700"
          letterSpacing="2.1"
          className="uppercase"
        >
          <textPath href={`#${pathId}`} startOffset="0%">
            {text}
          </textPath>
        </text>
      </svg>

      {/* Center Minimalist 4-Point Diamond Glint */}
      <svg
        width={size * 0.24}
        height={size * 0.24}
        viewBox="0 0 24 24"
        fill="none"
        className="absolute text-pattan-pink-deep dark:text-pattan-pink"
      >
        <path
          d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}

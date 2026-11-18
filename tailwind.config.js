/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        pattan: {
          blue: '#5B86C8',
          'blue-deep': '#1E3C6E',
          'blue-dark': '#3A68AE',
          'blue-light': '#98B6E8',
          'blue-soft': '#EBF2FF',
          pink: '#F58DB8',
          'pink-deep': '#D45B8B',
          'pink-dark': '#E26D9E',
          'pink-light': '#FFE2EE',
          'pink-soft': '#FFF2F7',
          yellow: '#FFD95A',
          'yellow-deep': '#D69E00',
          'yellow-light': '#FFF0A0',
          'yellow-soft': '#FFFBEB',
          brown: '#A8693F',
          'brown-light': '#C48A63',
          'text-main': '#233E67',
          'text-body': '#36517A',
          'text-muted': '#6B82A6',
          'blob-mint': '#CDF5B5',
          'blob-purple': '#D5DDF0',
          'blob-pink': '#E8B4D6',
          'blob-yellow': '#FFF0A0',
        }
      },
      fontFamily: {
        sans: ['Nunito', 'Mitr', 'system-ui', 'sans-serif'],
        display: ['Nunito', 'Mitr', 'sans-serif'],
        cute: ['Mali', 'cursive', 'sans-serif'],
      },
      borderRadius: {
        '3xl': '24px',
        'bento': '28px',
        'bento-lg': '32px',
        'pill': '9999px',
      },
      boxShadow: {
        'bento': '0 20px 45px -15px rgba(91, 134, 200, 0.12), 0 0 0 1px rgba(255, 255, 255, 0.8) inset, 0 8px 20px -6px rgba(245, 141, 184, 0.08)',
        'bento-hover': '0 25px 50px -12px rgba(91, 134, 200, 0.20), 0 0 0 1.5px rgba(255, 255, 255, 0.95) inset, 0 12px 28px -4px rgba(245, 141, 184, 0.14)',
        'jelly': '0 10px 25px -4px rgba(91, 134, 200, 0.35), 0 4px 12px -2px rgba(245, 141, 184, 0.25)',
        'jelly-pink': '0 10px 25px -4px rgba(245, 141, 184, 0.4), 0 4px 12px -2px rgba(255, 217, 90, 0.3)',
        'sticker': '0 8px 18px -4px rgba(168, 105, 63, 0.15), 0 0 0 3px #FFFFFF, 0 0 0 4px rgba(245, 141, 184, 0.2)',
        'glass-nav': '0 12px 32px -8px rgba(91, 134, 200, 0.22), 0 0 0 1px rgba(255, 255, 255, 0.85) inset',
      },
      keyframes: {
        aurora: {
          '0%, 100%': { transform: 'scale(1) translate(0px, 0px) rotate(0deg)' },
          '33%': { transform: 'scale(1.08) translate(25px, -20px) rotate(2deg)' },
          '66%': { transform: 'scale(0.95) translate(-15px, 20px) rotate(-2deg)' },
        },
        jellyBounce: {
          '0%, 100%': { transform: 'scale(1)' },
          '40%': { transform: 'scale(1.04, 0.96)' },
          '70%': { transform: 'scale(0.98, 1.02)' },
        },
        starPop: {
          '0%': { transform: 'scale(0.8) rotate(-10deg)', opacity: '0.5' },
          '50%': { transform: 'scale(1.25) rotate(10deg)', opacity: '1' },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
        }
      },
      animation: {
        aurora: 'aurora 18s ease-in-out infinite',
        'aurora-slow': 'aurora 25s ease-in-out infinite alternate',
        'jelly': 'jellyBounce 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'star-pop': 'starPop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }
    },
  },
  plugins: [],
}

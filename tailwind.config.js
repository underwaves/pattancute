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
          blue: '#4B72B0',
          'blue-deep': '#1A2B49',
          'blue-dark': '#335691',
          'blue-light': '#8BA9DB',
          'blue-soft': '#EFF4FB',
          pink: '#DF6E9B',
          'pink-deep': '#BE4B7A',
          'pink-dark': '#CB5887',
          'pink-light': '#FCE5EE',
          'pink-soft': '#FDF4F8',
          yellow: '#EAB308',
          'yellow-deep': '#B45309',
          'yellow-light': '#FEF3C7',
          'yellow-soft': '#FFFBEB',
          brown: '#8D5B3C',
          'brown-light': '#B58363',
          'text-main': '#1E293B',
          'text-body': '#334155',
          'text-muted': '#64748B',
          'blob-mint': '#DDF3E4',
          'blob-purple': '#E2E6F3',
          'blob-pink': '#F3DCE6',
          'blob-yellow': '#FBF1D6',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'IBM Plex Sans Thai', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'IBM Plex Sans Thai', 'system-ui', 'sans-serif'],
        brand: ['Fredoka', 'Mali', 'IBM Plex Sans Thai', 'sans-serif'],
        cute: ['Fredoka', 'Mali', 'IBM Plex Sans Thai', 'sans-serif'],
      },
      borderRadius: {
        '3xl': '20px',
        'bento': '20px',
        'bento-lg': '24px',
        'pill': '9999px',
      },
      boxShadow: {
        'bento': '0 10px 30px -12px rgba(26, 43, 73, 0.08), 0 1px 3px rgba(26, 43, 73, 0.04)',
        'bento-hover': '0 18px 40px -12px rgba(26, 43, 73, 0.12), 0 2px 6px rgba(26, 43, 73, 0.05)',
        'jelly': '0 8px 20px -4px rgba(26, 43, 73, 0.22), 0 2px 6px -2px rgba(26, 43, 73, 0.1)',
        'jelly-pink': '0 8px 22px -4px rgba(190, 75, 122, 0.30), 0 2px 8px -2px rgba(190, 75, 122, 0.15)',
        'sticker': '0 4px 12px -2px rgba(26, 43, 73, 0.08), 0 0 0 1px rgba(226, 232, 240, 0.9)',
        'glass-nav': '0 12px 32px -8px rgba(15, 23, 42, 0.14), 0 0 0 1px rgba(255, 255, 255, 0.8) inset',
      },
      keyframes: {
        aurora: {
          '0%, 100%': { transform: 'scale(1) translate(0px, 0px)' },
          '50%': { transform: 'scale(1.05) translate(16px, -12px)' },
        },
        jellyBounce: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.02)' },
        },
        starPop: {
          '0%': { transform: 'scale(0.85)', opacity: '0.6' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        }
      },
      animation: {
        aurora: 'aurora 22s ease-in-out infinite',
        'aurora-slow': 'aurora 28s ease-in-out infinite alternate',
        'jelly': 'jellyBounce 0.25s ease-out',
        'star-pop': 'starPop 0.2s ease-out',
      }
    },
  },
  plugins: [],
}

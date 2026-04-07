/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#C8963E',
          light: '#E0B060',
          dark: '#A07030',
        },
        brown: {
          DEFAULT: '#000000',
          dark: '#000000',
          light: '#111111',
          mid: '#1A1A1A',
        },
        cream: {
          DEFAULT: '#FAF6F0',
          dark: '#EDE8E0',
        },
        terracotta: {
          DEFAULT: '#8D1B3D',
          light: '#A62248',
        },
        crimson: {
          DEFAULT: '#8D1B3D',
          light: '#A62248',
          dark: '#6E1530',
        },
      },
      fontFamily: {
        tajawal: ['Tajawal', 'sans-serif'],
        playfair: ['"Playfair Display"', 'serif'],
        inter: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #000000 0%, #0A0A0A 35%, #111111 65%, #000000 100%)',
        'card-gradient': 'linear-gradient(135deg, #111111 0%, #C8963E 100%)',
        'gold-gradient': 'linear-gradient(135deg, #C8963E 0%, #E0B060 50%, #C8963E 100%)',
      },
      animation: {
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}

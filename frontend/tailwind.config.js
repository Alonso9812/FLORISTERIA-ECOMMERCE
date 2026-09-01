/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        rose: {
          50: '#FDF2F8',
          100: '#FCE7F3',
          200: '#FBCFE8',
          300: '#F9A8D4',
          400: '#F472B6',
          500: '#EC4899',
          600: '#E91E8C',   // ← Rosa principal del logo MAKA
          700: '#C21878',   // ← Hover
          800: '#9D174D',
          900: '#831843',
        },
        dark: {
          DEFAULT: '#1F1F1F',  // ← Negro del texto "MAKA"
          light: '#4A4A4A',
        }
      }
    },
  },
  plugins: [],
}
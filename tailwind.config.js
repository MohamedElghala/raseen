/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        raseen: {
          dark: '#0b1329',
          navy: '#101d3a',
          accent: '#1a2744',
          border: '#243352',
          gold: '#f5b731',
          'gold-hover': '#f7c948',
          'gold-light': '#fef3c7',
          surface: '#0f1a33',
        },
        rawnaq: {
          dark: '#0b1329',
          navy: '#101d3a',
          accent: '#1a2744',
          border: '#243352',
          gold: '#f5b731',
          'gold-hover': '#f7c948',
          'gold-light': '#fef3c7',
          surface: '#0f1a33',
        },
      },
      fontFamily: {
        cairo: ['Cairo', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

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
        brand: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          300: '#7cc7fb',
          400: '#36abf7',
          500: '#0c8fe9',
          600: '#0171c7',
          700: '#025ba1',
          800: '#064d85',
          900: '#0b416f',
          950: '#072949',
        },
        navy: {
          800: '#0f172a',
          850: '#0c1322',
          900: '#0a0f1d',
          950: '#060a13',
        },
        accent: {
          cyan: '#06b6d4',
          emerald: '#10b981',
          amber: '#f59e0b',
          violet: '#8b5cf6',
          rose: '#f43f5e'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow': '0 0 25px -5px rgba(12, 143, 233, 0.25)',
        'card': '0 4px 20px -2px rgba(0, 0, 0, 0.2)',
      }
    },
  },
  plugins: [],
}

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
        primary: {
          DEFAULT: '#2563EB',
          dark: '#1D4ED8',
          light: '#60A5FA'
        },
        secondary: {
          DEFAULT: '#7C3AED',
          dark: '#6D28D9',
          light: '#A78BFA'
        },
        accent: {
          DEFAULT: '#06B6D4',
          dark: '#0891B2',
          light: '#67E8F9'
        },
        success: {
          DEFAULT: '#22C55E',
          dark: '#16A34A',
          light: '#86EFAC'
        },
        background: {
          light: '#F8FAFC',
          dark: '#0F172A'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

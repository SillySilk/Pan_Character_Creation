/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Custom colors for medieval/fantasy theme
        parchment: {
          50: '#fdfcf7',
          100: '#faf7e8',
          200: '#f5eed5',
          300: '#ede0b8',
          400: '#e3cd94',
          500: '#d4b877',
          600: '#c4a461',
          700: '#a38851',
          800: '#846e47',
          900: '#6c5a3c',
        },
        medieval: {
          50: '#f8f6f3',
          100: '#ede8e0',
          200: '#ddd2c2',
          300: '#c6b69d',
          400: '#b19a78',
          500: '#9e8562',
          600: '#8a7256',
          700: '#725e48',
          800: '#5e4d3e',
          900: '#4d4034',
        }
      },
      fontFamily: {
        'medieval': ['Cinzel', 'serif'],
        'body': ['Crimson Text', 'serif'],
      }
    },
  },
  plugins: [],
}
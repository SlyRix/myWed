/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        gold: { DEFAULT: '#8B6914', light: '#C4A84F', dark: '#5C460E' },
        cream: { DEFAULT: '#FAF8F5', dark: '#F0EBE0' },
        brown: { DEFAULT: '#3D2B1F', light: '#6B4C3B' },
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
        body: ['Montserrat', 'system-ui', 'sans-serif'],
      }
    }
  },
  plugins: []
};

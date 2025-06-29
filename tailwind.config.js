/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'heavyrust': ['HEAVYRUST', 'Creepster', 'cursive'],
        'heavyrust-primary': ['HEAVYRUST', 'Creepster', 'cursive'],
      },
    },
  },
  plugins: [],
};
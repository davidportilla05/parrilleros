/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'heavyrust': ['HEAVYRUST', 'Creepster', 'cursive'],
        'heavyrust-primary': ['HEAVYRUST', 'Creepster', 'cursive'],
        'bebas-neue': ['BEBAS NEUE', 'Bebas Neue', 'cursive'],
        'bebas-neue-primary': ['BEBAS NEUE', 'Bebas Neue', 'cursive'],
      },
    },
  },
  plugins: [],
};
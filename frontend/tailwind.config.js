/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        pluxeeBlue: '#202020',
        pluxeeBlueLight: '#d0d0d0',
        pluxeeGreen: '#a5d031',
        pluxeeYellow: '#f0f0f0',
        pluxeePink: '#524f9c',
        pluxeeRed: '#d72d23',
        tolkoRed: '#cc0032',
      },
    },
  },
  plugins: [],
}

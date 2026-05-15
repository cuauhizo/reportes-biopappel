/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        pluxeeBlue: '#221c46',
        pluxeeBlueLight: '#17ccf9',
        pluxeeGreen: '#93d50a',
        pluxeeYellow: '#f4cf3e',
        pluxeePink: '#e2211c',
        tolkoRed: '#cc0032',
      },
    },
  },
  plugins: [],
}

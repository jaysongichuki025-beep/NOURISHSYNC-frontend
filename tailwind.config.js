/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Plus Jakarta Sans', 'sans-serif'],
      },
      colors: {
        food: {
          light: '#F1FDF0',
          primary: '#4CAF50',
          dark: '#1B5E20',
          accent: '#FFC107',
        }
      },
    },
  },
  plugins: [],
}
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        olive: {
          50: '#f6f7f3',
          100: '#ebede2',
          200: '#d7dcc6',
          300: '#bac4a1',
          400: '#9baa7b',
          500: '#7f915b',
          600: '#637444',
          700: '#4d5b35',
          800: '#3f492d',
          900: '#353e27',
          950: '#1b2113',
        },
      },
    },
  },
  plugins: [],
}

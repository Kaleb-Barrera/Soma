/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app.tsx",
    "./src/layout.tsx",
    "./src/screens/*.{js,jsx,ts,tsx}",
    "./src/components/*.{js,jsx,ts,tsx}",
  ],

  otheme: {
    extend: {},
  },
  plugins: [],
}

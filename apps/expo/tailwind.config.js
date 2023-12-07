/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],

  otheme: {
    extend: {
    },
  },
  theme: {
    extend: {
      colors: {
        "dark": "slate-950",
        "light": "white"
      }
    }
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    screens: {
      usm: "460px", // 👈 small custom
      sm: "640px",
      md: "768px",
      lg_mid: "960px", // 👈 medium custom
      lg: "1024px",
      xl: "1280px",
    },
  },
  plugins: [],
}

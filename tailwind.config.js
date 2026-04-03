/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ziro: "#0dcaf0", // Aksen Cyan Zirocraft
        dark: "#121416", // Dark mode background
      },
    },
  },
  plugins: [],
};

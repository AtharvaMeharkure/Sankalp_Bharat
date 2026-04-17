/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0f172a",
        mist: "#eef2f7",
        pine: "#0f766e",
        steel: "#475569",
      },
    },
  },
  plugins: [],
};

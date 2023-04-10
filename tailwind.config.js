/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./components/**/*.{js,ts,jsx,tsx}", "./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        chirp: ["Chirp", "sans-serif"],
        "chirp-extended": ["ChirpExtendedHeavy", "sans-serif"],
      },
    },
  },
  plugins: [],
};

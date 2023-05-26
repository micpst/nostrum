/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./components/**/*.{js,ts,jsx,tsx}", "./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        chirp: ["Chirp", "sans-serif"],
        "chirp-extended": ["ChirpExtendedHeavy", "sans-serif"],
      },
      // prettier-ignore
      colors: {
        "main-primary": "rgb(var(--main-primary) / <alpha-value>)",
        "main-secondary": "rgb(var(--main-secondary) / <alpha-value>)",
        "main-background": "rgb(var(--main-background) / <alpha-value>)",
        "main-search-background": "rgb(var(--main-search-background) / <alpha-value>)",
        "main-sidebar-background": "rgb(var(--main-sidebar-background) / <alpha-value>)",
        "main-accent": "rgb(var(--main-accent) / <alpha-value>)",
        "accent-yellow": "rgb(var(--accent-yellow) / <alpha-value>)",
        "accent-blue": "rgb(var(--accent-blue) / <alpha-value>)",
        "accent-pink": "rgb(var(--accent-pink) / <alpha-value>)",
        "accent-purple": "rgb(var(--accent-purple) / <alpha-value>)",
        "accent-orange": "rgb(var(--accent-orange) / <alpha-value>)",
        "accent-green": "rgb(var(--accent-green) / <alpha-value>)",
        "accent-red": "#F4212E",
        "dark-primary": "#E7E9EA",
        "dark-secondary": "#71767B",
        "light-primary": "#0F1419",
        "light-secondary": "#536471",
        "dark-border": "#2F3336",
        "light-border": "#EFF3F4",
        "dark-line-reply": "#333639",
        "light-line-reply": "#CFD9DE",
        "nostrum-icon": "#D6D9DB",
        "image-preview-hover": "#272C30",
      },
    },
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1295px",
      "2xl": "1536px",
    },
  },
  plugins: [],
};

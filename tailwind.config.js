/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#212121",
        accent: "#FF7F50",
        "background-light": "#F8F9FA",
        "background-dark": "#101922",
        "text-light": "#212121",
        "text-dark": "#F8F9FA",
        "subtle-light": "#616161",
        "subtle-dark": "#9E9E9E",
        "border-light": "#E0E0E0",
        "border-dark": "#424242",
        "card-light": "#FFFFFF",
        "card-dark": "#1a242f",
      },
      fontFamily: {
        display: ["Inter", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px",
      },
    },
  },
  plugins: [],
}


/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        display: ["'Playfair Display'", "Georgia", "serif"],
        body: ["'DM Sans'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        brand: {
          50:  "#eef2ff",
          100: "#dde5ff",
          200: "#c0caff",
          300: "#93a5fd",
          400: "#5f77f9",
          500: "#1a3a6e",
          600: "#152f59",
          700: "#102446",
          800: "#0b1933",
          900: "#060d1f",
        },
        accent: {
          DEFAULT: "#c9a84c",
          light:   "#e3c872",
          dark:    "#a07830",
        },
        surf: {
          DEFAULT: "#ffffff",
          2: "#f6f8fc",
          3: "#eef1f8",
          border: "#e2e8f3",
        },
        dk: {
          bg:     "#0d1117",
          card:   "#161b27",
          card2:  "#1e2536",
          border: "#2a3147",
          text:   "#dde3f0",
          muted:  "#8492b0",
        },
      },
      boxShadow: {
        card:  "0 1px 12px rgba(26,58,110,0.07), 0 1px 3px rgba(26,58,110,0.04)",
        hover: "0 8px 30px rgba(26,58,110,0.13), 0 2px 8px rgba(26,58,110,0.06)",
        glow:  "0 0 28px rgba(201,168,76,0.22)",
      },
      animation: {
        "fade-in":  "fadeIn 0.35s ease forwards",
        "slide-up": "slideUp 0.4s cubic-bezier(.22,.68,0,1.2) forwards",
        "spin-slow":"spin 2s linear infinite",
      },
      keyframes: {
        fadeIn:  { from: { opacity: 0 },                            to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform:"translateY(18px)" }, to: { opacity: 1, transform:"translateY(0)" } },
      },
    },
  },
  plugins: [],
};

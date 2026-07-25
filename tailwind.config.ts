import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./context/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#e9f7ec",
          100: "#cdedd4",
          200: "#98d9a8",
          300: "#5fc178",
          400: "#2fa651",
          500: "#0e8a3c", // primary — buttons, links, active states (Upwork-style vivid green)
          600: "#0b6f30",
          700: "#095826",
          800: "#07421c",
          900: "#053015",
        },
        cream: "#ffffff",   // page background — Upwork runs on white, not warm cream
        sand: "#f7f8f7",    // alternating section background — cool neutral, not warm
        ink: "#14171f",     // near-black text, Upwork's signature high-contrast body copy
        muted: "#5e6b7a",   // cool gray secondary text
        line: "#e4e6e8",    // hairline border color used on cards/inputs
      },
      fontFamily: {
        sans: [
          "var(--font-inter)",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      boxShadow: {
        card: "0 1px 2px rgba(20,23,31,0.04)",
        soft: "0 4px 16px -4px rgba(20,23,31,0.10)",
      },
      maxWidth: {
        content: "1200px",
      },
    },
  },
  plugins: [],
};

export default config;

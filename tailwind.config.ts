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
          50: "#eef6f3",
          100: "#d9ebe4",
          200: "#b3d6c8",
          300: "#82b9a5",
          400: "#4f9781",
          500: "#12695a", // primary teal — buttons, links, headings
          600: "#0e5549",
          700: "#0b433a",
          800: "#08322c",
          900: "#06231f",
        },
        cream: "#f6f5f1",
        sand: "#eef0ec",
        ink: "#16211e",
        muted: "#5c6b66",
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
        card: "0 1px 2px rgba(22,33,30,0.04), 0 8px 24px -8px rgba(22,33,30,0.08)",
        soft: "0 2px 20px rgba(22,33,30,0.06)",
      },
      maxWidth: {
        content: "1200px",
      },
    },
  },
  plugins: [],
};

export default config;

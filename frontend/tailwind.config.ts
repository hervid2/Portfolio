import type { Config } from "tailwindcss";

/**
 * Defines Tailwind design tokens aligned with the portfolio mockup.
 *
 * @returns Tailwind configuration object.
 */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "surface-base": "#06090f",
        "surface-card": "#0d121b",
        "surface-muted": "#131a25",
        "text-primary": "#f4f7ff",
        "text-secondary": "#c4cad8",
        "border-subtle": "#1e293b",
        "accent-cyan": "#10d9e5",
        "accent-cyan-strong": "#06c7d3"
      },
      boxShadow: {
        card: "0 14px 40px rgba(0, 0, 0, 0.35)"
      },
      fontFamily: {
        display: ["Poppins", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
} satisfies Config;

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
                "surface-base": "rgb(var(--surface-base) / <alpha-value>)",
                "surface-card": "rgb(var(--surface-card) / <alpha-value>)",
                "surface-muted": "rgb(var(--surface-muted) / <alpha-value>)",
                "text-primary": "rgb(var(--text-primary) / <alpha-value>)",
                "text-secondary": "rgb(var(--text-secondary) / <alpha-value>)",
                "border-subtle": "rgb(var(--border-subtle) / <alpha-value>)",
                "accent-cyan": "rgb(var(--accent-cyan) / <alpha-value>)",
                "accent-cyan-strong": "rgb(var(--accent-cyan-strong) / <alpha-value>)"
            },
            boxShadow: {
                card: "var(--shadow-card)"
            },
            fontFamily: {
                display: ["Poppins", "system-ui", "sans-serif"],
                body: ["Inter", "system-ui", "sans-serif"]
            }
        }
    },
    plugins: []
};

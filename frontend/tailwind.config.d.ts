/**
 * Defines Tailwind design tokens aligned with the portfolio mockup.
 *
 * @returns Tailwind configuration object.
 */
declare const _default: {
    content: string[];
    darkMode: "class";
    theme: {
        extend: {
            colors: {
                "surface-base": string;
                "surface-card": string;
                "surface-muted": string;
                "text-primary": string;
                "text-secondary": string;
                "border-subtle": string;
                "accent-cyan": string;
                "accent-cyan-strong": string;
            };
            boxShadow: {
                card: string;
            };
            fontFamily: {
                display: [string, string, string];
                body: [string, string, string];
            };
        };
    };
    plugins: never[];
};
export default _default;

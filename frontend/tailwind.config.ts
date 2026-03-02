import type { Config } from "tailwindcss"

export default {
    content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
    theme: {
        extend: {
            fontFamily: {
                sans: ["Inter", "system-ui", "sans-serif"],
            },
            colors: {
                bg: "rgb(var(--bg) / <alpha-value>)",
                card: "rgb(var(--card) / <alpha-value>)",
                text: "rgb(var(--text) / <alpha-value>)",
                muted: "rgb(var(--muted) / <alpha-value>)",
                primary: "rgb(var(--primary) / <alpha-value>)",
            },
            borderRadius: {
                xl2: "var(--radius)",
            },
            boxShadow: {
                soft: "var(--shadow-soft)",
                premium: "var(--shadow-premium)",
            },
            backgroundImage: {
                "accent-gradient": "var(--gradient-accent)",
            },
        },
    },
    plugins: [],
} satisfies Config
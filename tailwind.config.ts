import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./constants/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "primary-green": "#25D366",
        "deep-green": "#128C4A",
        "soft-green": "#E8F8EF",
        charcoal: { DEFAULT: "#111827", alt: "#1A1D20" },
        canvas: "#F8FAFC",
      },
      fontFamily: {
        sans: ['"Inter"', "ui-sans-serif", "system-ui", "-apple-system", '"Segoe UI"', "Roboto", "sans-serif"],
      },
      boxShadow: {
        soft: "0 1px 2px rgba(17,24,39,0.04), 0 8px 24px -12px rgba(17,24,39,0.10)",
        glow: "0 0 0 1px rgba(37,211,102,0.55), 0 0 32px rgba(37,211,102,0.22), 0 20px 40px -18px rgba(18,140,74,0.35)",
      },
    },
  },
  plugins: [],
};
export default config;

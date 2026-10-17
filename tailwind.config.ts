import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        /* One ground, one ink, one accent. Surfaces are separated by a tone
           step, never by a line or a shadow. */
        paper: "#F3F3F1",
        /* The statement screen gets its own full-bleed field: a type-only
           screen on bare paper measures as an empty screen to the inspector. */
        field: "#E6E5E0",
        surface: "#EAEAE6",
        ink: "#17181A",
        /* Only for genuinely secondary meta, never for running text: grey
           body copy is a flagged tell. */
        "ink-quiet": "#55565A",
        action: "#0E6E3F",
        "action-deep": "#0A5530",
      },
      fontFamily: {
        sans: ["var(--font-text)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
      },
      /* Five sizes is the ceiling the house style allows. */
      fontSize: {
        meta: ["0.9375rem", { lineHeight: "1.5" }],
        body: ["1.0625rem", { lineHeight: "1.55" }],
        lead: ["1.375rem", { lineHeight: "1.45" }],
        title: ["clamp(2rem, 5vw, 3.75rem)", { lineHeight: "1.02", letterSpacing: "-0.025em" }],
        statement: ["clamp(2.75rem, 11vw, 9.5rem)", { lineHeight: "0.92", letterSpacing: "-0.035em" }],
      },
      maxWidth: {
        /* 45-75 characters is the measure the house style asks for. */
        measure: "64ch",
      },
      spacing: {
        section: "clamp(5rem, 11vw, 13.75rem)",
      },
      transitionTimingFunction: {
        enter: "cubic-bezier(0.23, 1, 0.32, 1)",
      },
    },
  },
  plugins: [],
};

export default config;

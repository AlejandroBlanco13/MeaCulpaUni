import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        dnd: {
          /* Mantener nombres pero con nueva paleta oscura */
          parchment: "#1e1410",
          ink: "#f9f5e9",
          gold: "#f4b544",
          red: "#b3262b",
          forest: "#234537",
          "coffee-cream": "#1a0f0a",
          "coffee-mid": "#2a1510",
          "coffee-dark": "#3a1a12",
        },
      },
      fontFamily: {
        medieval: ["Cinzel", "serif"],
      },
    },
  },
  plugins: [],
};
export default config;

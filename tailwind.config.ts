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
          "coffee-cream": "#120f16",
          "coffee-mid": "#1c151f",
          "coffee-dark": "#26151a",
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

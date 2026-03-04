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
          parchment: "#f4e4bc",
          ink: "#1a1510",
          gold: "#c9a227",
          red: "#8b0000",
          forest: "#2d5016",
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

import type { Config } from "tailwindcss";
import scrollbarHide from "tailwind-scrollbar-hide";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: "#000000",
        light: "#ffffff",
        beige: "#f5f5f5",
      },
      fontFamily: {
        pixel: ["Typewriter", "Pixel Operator", "monospace"],
        vcr: ["VT323", "monospace"],
      },
    },
  },
  plugins: [scrollbarHide],
};
export default config;

import type { Config } from "tailwindcss";
import scrollbarHide from "tailwind-scrollbar-hide";
import flowbite from "flowbite-react/plugin/tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "node_modules/flowbite-react/lib/esm/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        dark: "#000000",
        light: "#ffffff",
        beige: "#f6f6f6",
      },
      fontFamily: {
        retro: ["Typewriter", "monospace"],
      },
    },
  },
  plugins: [scrollbarHide, flowbite],
};
export default config;

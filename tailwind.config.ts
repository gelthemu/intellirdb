import type { Config } from "tailwindcss";

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
        dark: "#000",
        light: "#fff",
        beige: "#f5f5f5",
      },
      fontFamily: {
        pixel: ["Pixel Operator", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;

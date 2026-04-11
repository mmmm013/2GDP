import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#000000",
        foreground: "#F5F5F5",
        primary: {
          DEFAULT: "#F59E0B", // amber-500 — K-KUT brand
        },
      },
      fontFamily: {
        sans: ['"Space Grotesk"', "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;

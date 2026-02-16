import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}", // <--- THIS IS THE KEY LINE
        "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // FLAGSHIP BRANDING (The Golden Lock)
        background: '#000000',      // Corporate Black
        foreground: '#F5F5F5',      // Off-White Text
        primary: {
          DEFAULT: '#FFD700',       // GOLD (The FLAGSHIP Color)
          glow: '#FFD700',
        },
        secondary: '#F5DEB3',       // WHEAT (The Accent)
        muted: '#A1887F',           // Muted Text
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        sans: ['"Space Grotesk"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;

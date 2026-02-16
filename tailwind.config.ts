import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}", // <--- THIS IS THE KEY LINE
        "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
    safelist: [
    'from-amber-600', 'to-yellow-500', 'from-yellow-300', 'to-amber-400',
    'from-amber-400', 'to-orange-500', 'from-yellow-400', 'to-amber-500',
    'bg-gradient-to-r', 'shadow-yellow-500/20',
    'border-amber-500/40', 'border-orange-400/40', 'border-yellow-400/40',
    'ring-yellow-400/50', 'from-yellow-900/10',
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

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
        pink: {
          DEFAULT: "#F8AFC8",
          deep: "#F38DB5",
          light: "#ffe3f1",
        },
        ink: "#1F1B24",
        muted: "#6b7280",
        border: "#e5e7eb",
        cream: "#fff8fb",
        dark: "#0b0b0f",
      },
      borderRadius: {
        'xl': '14px',
        '2xl': '18px',
        '3xl': '24px',
      },
    },
  },
  plugins: [],
};
export default config;

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta MindRich (seção 6.1 do escopo)
        night: {
          DEFAULT: "#1A1A2E", // azul-noturno profundo (fundo)
          800: "#16213E", // azul escuro (superfícies)
          700: "#0F3460", // azul médio (acentos)
        },
        gold: {
          DEFAULT: "#E8B84B", // dourado quente (ação/destaque)
          soft: "#F2D285",
          deep: "#C99A2E",
        },
        ember: "#E94560", // vermelho energético (alertas/streak)
        ink: {
          DEFAULT: "#F5F5FA",
          muted: "#A9AEC4",
          faint: "#6B7090",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-playfair)", "Georgia", "serif"],
      },
      boxShadow: {
        glow: "0 0 40px -12px rgba(232, 184, 75, 0.45)",
        card: "0 8px 30px -12px rgba(0, 0, 0, 0.6)",
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #F2D285 0%, #E8B84B 50%, #C99A2E 100%)",
        "night-gradient": "linear-gradient(180deg, #1A1A2E 0%, #16213E 100%)",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.8)", opacity: "0.6" },
          "100%": { transform: "scale(1.6)", opacity: "0" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.4s ease-out both",
        shimmer: "shimmer 1.6s infinite",
        "pulse-ring": "pulse-ring 1.6s ease-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;

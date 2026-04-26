import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,js,jsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: "rgb(var(--bg) / <alpha-value>)",
          deep: "rgb(var(--bg-deep) / <alpha-value>)",
          panel: "rgb(var(--bg-panel) / <alpha-value>)",
        },
        fg: {
          DEFAULT: "rgb(var(--fg) / <alpha-value>)",
          dim: "rgb(var(--fg-dim) / <alpha-value>)",
          muted: "rgb(var(--fg-muted) / <alpha-value>)",
        },
        neon: {
          cyan: "rgb(var(--neon-cyan) / <alpha-value>)",
          magenta: "rgb(var(--neon-magenta) / <alpha-value>)",
          yellow: "rgb(var(--neon-yellow) / <alpha-value>)",
          purple: "rgb(var(--neon-purple) / <alpha-value>)",
          green: "rgb(var(--neon-green) / <alpha-value>)",
          red: "rgb(var(--neon-red) / <alpha-value>)",
        },
        border: {
          DEFAULT: "rgb(var(--border) / <alpha-value>)",
          neon: "rgb(var(--border-neon) / <alpha-value>)",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      boxShadow: {
        "neon-cyan": "0 0 8px rgb(var(--neon-cyan)), 0 0 24px rgb(var(--neon-cyan) / 0.5)",
        "neon-magenta": "0 0 8px rgb(var(--neon-magenta)), 0 0 24px rgb(var(--neon-magenta) / 0.5)",
        "neon-yellow": "0 0 8px rgb(var(--neon-yellow)), 0 0 24px rgb(var(--neon-yellow) / 0.5)",
        "neon-purple": "0 0 8px rgb(var(--neon-purple)), 0 0 24px rgb(var(--neon-purple) / 0.5)",
        "inner-neon": "inset 0 0 12px rgb(var(--neon-cyan) / 0.3)",
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(rgba(0,240,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,0.05) 1px, transparent 1px)",
        "neon-gradient":
          "linear-gradient(135deg, rgb(var(--neon-cyan)) 0%, rgb(var(--neon-magenta)) 100%)",
      },
      backgroundSize: {
        "grid-md": "40px 40px",
        "grid-lg": "80px 80px",
      },
      animation: {
        glitch: "glitch 2.5s infinite",
        "glitch-skew": "glitch-skew 4s infinite",
        flicker: "flicker 3s linear infinite",
        scan: "scan 8s linear infinite",
        "pulse-neon": "pulse-neon 2s ease-in-out infinite",
        "slide-up": "slide-up 0.5s ease-out",
        "fade-in": "fade-in 0.4s ease-out",
        "border-pulse": "border-pulse 3s ease-in-out infinite",
      },
      keyframes: {
        glitch: {
          "0%, 100%": { transform: "translate(0)" },
          "20%": { transform: "translate(-2px, 2px)" },
          "40%": { transform: "translate(-2px, -2px)" },
          "60%": { transform: "translate(2px, 2px)" },
          "80%": { transform: "translate(2px, -2px)" },
        },
        "glitch-skew": {
          "0%, 100%": { transform: "skew(0deg)" },
          "10%": { transform: "skew(-1deg)" },
          "20%": { transform: "skew(0deg)" },
        },
        flicker: {
          "0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100%": {
            opacity: "1",
          },
          "20%, 21.999%, 63%, 63.999%, 65%, 69.999%": { opacity: "0.6" },
        },
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        "pulse-neon": {
          "0%, 100%": { opacity: "1", filter: "brightness(1)" },
          "50%": { opacity: "0.85", filter: "brightness(1.3)" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "border-pulse": {
          "0%, 100%": { borderColor: "rgb(var(--neon-cyan) / 0.6)" },
          "50%": { borderColor: "rgb(var(--neon-magenta) / 0.6)" },
        },
      },
      typography: {
        DEFAULT: {
          css: {
            color: "rgb(var(--fg))",
          },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;

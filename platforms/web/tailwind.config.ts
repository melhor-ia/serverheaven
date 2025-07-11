import type { Config } from 'tailwindcss'

export default {
  theme: {
    extend: {
      colors: {
        border: "hsl(0 0% 14.9%)",
        input: "hsl(0 0% 14.9%)",
        ring: "hsl(0 0% 83.1%)",
        background: "hsl(0 0% 3.9%)",
        foreground: "hsl(0 0% 98%)",
        primary: {
          DEFAULT: "hsl(0 0% 98%)",
          foreground: "hsl(0 0% 9%)",
        },
        secondary: {
          DEFAULT: "hsl(0 0% 14.9%)",
          foreground: "hsl(0 0% 98%)",
        },
        destructive: {
          DEFAULT: "hsl(0 84.2% 60.2%)",
          foreground: "hsl(0 0% 98%)",
        },
        muted: {
          DEFAULT: "hsl(0 0% 14.9%)",
          foreground: "hsl(0 0% 63.9%)",
        },
        accent: {
          DEFAULT: "hsl(0 0% 14.9%)",
          foreground: "hsl(0 0% 98%)",
        },
        popover: {
          DEFAULT: "hsl(0 0% 3.9%)",
          foreground: "hsl(0 0% 98%)",
        },
        card: {
          DEFAULT: "hsl(0 0% 3.9%)",
          foreground: "hsl(0 0% 98%)",
        },
        // Gaming HUD-inspired emerald theme
        emerald: {
          300: "#6EE7B7",
          400: "#34D399",
          500: "#10B981",
          600: "#059669",
          700: "#047857",
          800: "#065F46",
          900: "#064E3B",
          950: "#022C22",
        },
        stone: {
          300: "#A8A29E",
          400: "#78716C",
          500: "#57534E",
          600: "#44403C",
          700: "#292524",
          800: "#1C1917",
        },
        // HUD accent colors
        cyan: {
          400: "#22D3EE",
          500: "#06B6D4",
          600: "#0891B2",
        },
        orange: {
          400: "#FB923C",
          500: "#F97316",
          600: "#EA580C",
        },
      },
      borderRadius: {
        lg: "0.5rem",
        md: "calc(0.5rem - 2px)",
        sm: "calc(0.5rem - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "Liberation Mono", "Courier New", "monospace"],
      },
      backdropBlur: {
        xs: '2px',
      },
             boxShadow: {
         'glow-sm': '0 0 10px rgba(52, 211, 153, 0.3)',
         'glow': '0 0 20px rgba(52, 211, 153, 0.4)',
         'glow-lg': '0 0 30px rgba(52, 211, 153, 0.5)',
         'glow-emerald': '0 0 25px rgba(16, 185, 129, 0.4)',
         'hud': '0 0 15px rgba(0, 0, 0, 0.8), inset 0 0 15px rgba(52, 211, 153, 0.1)',
         'hud-active': '0 0 25px rgba(52, 211, 153, 0.6), inset 0 0 15px rgba(52, 211, 153, 0.2)',
       },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        kenBurnsHorizontal: {
          '0%': { backgroundPosition: '0% 0%' },
          '100%': { backgroundPosition: '100% 0%' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        'grid-flow': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'scanner': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100vw)' },
        },
        'hud-blink': {
          '0%, 100%': { opacity: '0.8' },
          '50%': { opacity: '0.3' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 1s ease-in',
        'ken-burns-horizontal': 'kenBurnsHorizontal 40s ease-in-out infinite alternate',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'grid-flow': 'grid-flow 20s linear infinite',
        'scanner': 'scanner 4s linear infinite',
        'hud-blink': 'hud-blink 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
} satisfies Config 
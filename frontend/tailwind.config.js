/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        neon: {
          blue: "#00b7ff",
          purple: "#8a2be2",
          pink: "#ff2d95",
          cyan: "#00f0ea",
          soft: "#0f1724"
        },
        ui: {
          surface: "#07070b",
          panel: "rgba(255,255,255,0.03)"
        }
      },
      boxShadow: {
        "neon-blue": "0 6px 30px rgba(0,183,255,0.08), 0 0 12px rgba(0,183,255,0.16)",
        "neon-purple": "0 6px 30px rgba(138,43,226,0.06), 0 0 18px rgba(138,43,226,0.12)"
      },
      backdropBlur: {
        xs: "2px"
      },
      keyframes: {
        float: {
          '0%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
          '100%': { transform: 'translateY(0px)' }
        }
      },
      animation: {
        float: 'float 6s ease-in-out infinite'
      }
    }
  },
  plugins: [],
};

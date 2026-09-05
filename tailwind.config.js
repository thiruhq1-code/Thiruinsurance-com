/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          50: "#eef1f7",
          100: "#d6ddec",
          200: "#adbbd9",
          300: "#8499c6",
          400: "#5b77b3",
          500: "#3a5694",
          600: "#294073",
          700: "#1c2d54",
          800: "#111d3a",
          900: "#0a1226",
          950: "#060b18",
        },
        emerald: {
          50: "#e9fbf3",
          100: "#c8f5e0",
          200: "#93ebc4",
          300: "#5edaa4",
          400: "#33c286",
          500: "#17a06b",
          600: "#0f8557",
          700: "#0c6a46",
          800: "#0a5238",
          900: "#08402c",
        },
        sand: {
          50: "#f9f8f4",
          100: "#f1efe6",
        },
        gold: {
          400: "#e6b84f",
          500: "#d4a437",
        },
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Inter", "system-ui", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
      boxShadow: {
        soft: "0 2px 10px rgba(10, 18, 38, 0.06)",
        card: "0 4px 24px rgba(10, 18, 38, 0.08)",
        lifted: "0 12px 40px rgba(10, 18, 38, 0.14)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
}


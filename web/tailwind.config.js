/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Current brand palette - warm cyan pastels with deep teals
        current: {
          // Backgrounds / Accents (warm cyan pastels)
          mist: "#E0FBFC", // Soft Cyan Mist
          aqua: "#CFFAFE", // Light Aqua
          glow: "#A5F3FC", // Warm Cyan Glow

          // Text (deep rich teals)
          deep: "#134E4A", // Deep Teal - headings
          rich: "#115E59", // Rich Teal - body text
          accent: "#0F766E", // Accent for buttons/links

          // Highlight / Action Colors
          bright: "#22D3EE", // Bright Cyan CTA
          hover: "#14B8A6", // Teal Hover/Active State
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.6s ease-out",
        wave: "wave 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        wave: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
      },
    },
  },
  plugins: [],
};

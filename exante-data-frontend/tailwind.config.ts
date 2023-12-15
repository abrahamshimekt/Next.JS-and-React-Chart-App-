import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors:{
        primarySidebar: "var(--primary-sidebar-bg)",
        primaryButtonColor: "var(--primary-button-bg)",
        primaryButtonHover: "var(--primary-button-hover)",
        primaryBorderColor: "var(--primary-border-color)",
        secondaryButtonColor: "var(--secondary-button-bg)",
        thirdButtonColor: "var(--third-button-bg)",
        textColorBlack: "var(--text-color-1)",
        textColorGray: "var(--text-color-2)",
        textColorBlueGray: "var(--text-color-3)",
        textColorLightGray: "var(--color-grey-0)"
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      screens: {
        'xs': '400px',
        '3xl': '1680px',
        '4xl': '2200px',
      },
    },
  },
  plugins: [],
};
export default config;
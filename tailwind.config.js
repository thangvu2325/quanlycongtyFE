/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    colors: {
      blue: "#1fb6ff",
      purple: "#7e5bef",
      pink: "#ff49db",
      orange: "#ff7849",
      green: "#13ce66",
      yellow: "#ffc82c",
      "gray-dark": "#273444",
      gray: "#8492a6",
      "gray-light": "#d3dce6",
    },

    extend: {
      spacing: {
        "8xl": "96rem",
        "9xl": "128rem",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      animation: {
        sidebarShow: "sidebarShow 0.6s ease",
        sidebarHidden: "sidebarHidden 0.6s ease",
      },
      keyframes: () => ({
        sidebarShow: {
          "0%": { right: "-280px" },
          "100%": { right: "0px" },
        },
        sidebarHidden: {
          "0%": { right: "0" },
          "100%": { right: "-280px" },
        },
      }),
    },
  },
};

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{html,ts}",
    ],
    theme: {
      extend: {
        screens: {
          wide: "2000px"
        }
      }
    },
    plugins: [require("tailwind-gradient-mask-image")],
  }
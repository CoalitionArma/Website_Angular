/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{html,ts}",
    ],
    important: true, // Make all utilities !important to override Material Design
    theme: {
      extend: {
        screens: {
          wide: "2000px"
        }
      }
    },
    plugins: [require("tailwind-gradient-mask-image")],
  }
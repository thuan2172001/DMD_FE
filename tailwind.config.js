
const colors = require("tailwindcss/colors");module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        main: '#1f2937',
        primary: colors.gray
      }
    },
  },
  plugins: [],
}

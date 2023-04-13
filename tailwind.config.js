/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./public/**/*.{html,js}",
    "./views/*.ejs"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

// npx tailwindcss -i ./public/css/input.css -o ./public/dist/output.css --watch
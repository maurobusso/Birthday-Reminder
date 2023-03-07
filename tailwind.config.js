/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./views/*.ejs'],
  theme: {
    extend: {},
  },
  plugins: [],
}

// npx tailwindcss -i ./public/css/input.css -o ./public/css/output.css --watch
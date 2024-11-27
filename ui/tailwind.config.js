/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
    "./node_modules/primeng/**/*.{html,ts}"
  ],
  theme: {
    extend: {
      darkMode: ['selector', '[data-mode="dark-theme"]'],
    },
  },
  plugins: [],
  darkMode: 'selector',
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // すべてのJS、JSX、TS、TSXファイルをスキャン
  ],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      "light",
      "dark",
      "cupcake",
    ],
  },
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily:{
        "cinzel":['Cinzel', 'serif'],
        "foana":['Fauna One','serif'],
        "Roboto": ['Roboto Mono',' monospace']

      },
      colors:{
        primary:"#03324a"
      },
      height:{
        "full":"100vh"
      }
    },
  },
  plugins: [require('tailwind-scrollbar')],
}


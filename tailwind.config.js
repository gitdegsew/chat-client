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
        "RobotoM": ['Roboto Mono',' monospace'],
        "Roboto": ['Roboto','serif'],
        "slab": ['Roboto Slab', 'serif'],
        "marry":['Merriweather', 'serif']

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


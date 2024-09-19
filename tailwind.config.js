const flowbite = require("flowbite-react/tailwind");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
      "./node_modules/flowbite-react/**/*.js", 
    
    flowbite.content(),
  ],
  plugins: [
    flowbite.plugin(),
    require('tailwind-scrollbar'),
  ],
};
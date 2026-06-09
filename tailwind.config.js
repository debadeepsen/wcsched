/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  // Tailwind config
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'world-cup': {
          blue: '#0066CC',
          red: '#FF0000',
          gold: '#FFD700',
        }
      },
    },
  },
  plugins: [],
};

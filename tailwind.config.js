/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './node_modules/heroui-native/lib/**/*.{js,ts,jsx,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Add your custom colors here if needed
        'deck-friends': '#FF6B35',
        'deck-family': '#4ECDC4',
        'deck-romantic': '#E74C3C',
        'deck-professional': '#3498DB',
      },
    },
  },
  plugins: [
    require('heroui-native/tailwind-plugin'),
  ],
}
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        Nunito_300Light: ['Nunito_300Light'],
        Nunito_400Regular: ['Nunito_400Regular'],
        Nunito_500Medium: ['Nunito_500Medium'],
        Nunito_600SemiBold: ['Nunito_600SemiBold'],
        Nunito_700Bold: ['Nunito_700Bold'],
        Nunito_800ExtraBold: ['Nunito_800ExtraBold'],
        Nunito_900Black: ['Nunito_900Black'],
      },
    },
  },
  plugins: [],
}

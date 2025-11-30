/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Space Grotesk', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#f0f2f8',
          100: '#d9ddf0',
          200: '#b3bbe1',
          300: '#8d99d2',
          400: '#6777c3',
          500: '#4a5db5',
          600: '#3d4da3',
          700: '#1D328D',
          800: '#162770',
          900: '#0f1c53',
        },
        dark: {
          blue: '#1D328D',
          navy: '#0f1c53',
        },
      },
      animation: {
        'fadeIn': 'fadeIn 0.3s ease-out',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}


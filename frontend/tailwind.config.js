/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        verida: {
          'dark-teal': {
            DEFAULT: '#16302b',
            light: '#1f3e38',
            dark: '#0f241f',
          },
          'dark-purple': {
            DEFAULT: '#694873',
            light: '#7a5583',
            dark: '#533a5a',
          },
          'purple': {
            DEFAULT: '#8b728e',
            light: '#a08ca3',
            dark: '#715970',
          },
          'green': {
            DEFAULT: '#85b79d',
            light: '#9bc4ab',
            dark: '#6fa085',
          },
          'light-green': {
            DEFAULT: '#c0e5c8',
            light: '#d4ebd9',
            dark: '#b0d9b7',
          },
        },
        primary: '#16302b',
        secondary: '#85b79d',
        accent: '#8b728e',
        success: '#c0e5c8',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#694873',
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Oxygen',
          'Ubuntu',
          'Cantarell',
          'Fira Sans',
          'Droid Sans',
          'Helvetica Neue',
          'sans-serif',
        ],
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #16302b 0%, #694873 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #85b79d 0%, #c0e5c8 100%)',
        'gradient-accent': 'linear-gradient(135deg, #8b728e 0%, #85b79d 100%)',
      },
      boxShadow: {
        'verida-sm': '0 1px 2px 0 rgba(22, 48, 43, 0.05)',
        'verida-md': '0 4px 6px -1px rgba(22, 48, 43, 0.1), 0 2px 4px -1px rgba(22, 48, 43, 0.06)',
        'verida-lg': '0 10px 15px -3px rgba(22, 48, 43, 0.1), 0 4px 6px -2px rgba(22, 48, 43, 0.05)',
        'verida-xl': '0 20px 25px -5px rgba(22, 48, 43, 0.1), 0 10px 10px -5px rgba(22, 48, 43, 0.04)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-in': 'slideIn 0.4s ease-out forwards',
        'pulse-slow': 'pulse 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      screens: {
        'xs': '475px',
      },
    },
  },
  plugins: [],
} 
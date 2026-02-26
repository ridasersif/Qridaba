/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: '#F97316',
          'orange-light': '#FB923C',
          'orange-dark': '#EA580C',
          amber: '#F59E0B',
          'amber-light': '#FCD34D',
          yellow: '#EAB308',
          black: '#0A0A0A',
          'gray-dark': '#1A1A1A',
          'gray-mid': '#2A2A2A',
          'gray-soft': '#3A3A3A',
          green: '#22C55E',
          'green-dark': '#16A34A',
          cream: '#FFF7ED',
          'cream-dark': '#FED7AA',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
      },
      backgroundImage: {
        'warm-gradient': 'linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 50%, #2A1A08 100%)',
        'orange-glow': 'radial-gradient(ellipse at center, rgba(249,115,22,0.15) 0%, transparent 70%)',
      },
      boxShadow: {
        'orange-glow': '0 0 40px rgba(249,115,22,0.25)',
        'orange-sm': '0 0 20px rgba(249,115,22,0.15)',
        'card': '0 8px 32px rgba(0,0,0,0.4)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-orange': 'pulse-orange 2s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'pulse-orange': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(249,115,22,0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(249,115,22,0.6)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
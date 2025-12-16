/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Cosmic Theme Colors
        cosmic: {
          // Background colors
          'deep': '#0a0e27', // Deep navy/dark blue
          'dark': '#131829', // Slightly lighter for cards
          'darker': '#1a1f3a', // Even lighter variant
          
          // Accent colors
          'purple': '#a855f7', // Neon purple
          'purple-light': '#c084fc', // Light purple for borders
          'purple-dark': '#7c3aed', // Dark purple
          'cyan': '#22d3ee', // Bright cyan
          'cyan-light': '#67e8f9', // Light cyan
          'cyan-dark': '#06b6d4', // Dark cyan
          
          // Text colors
          'text': '#e2e8f0', // Light gray
          'text-dim': '#94a3b8', // Dimmed text
        },
      },
      backgroundImage: {
        'cosmic-gradient': 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #0f1420 100%)',
        'cosmic-radial': 'radial-gradient(circle at 50% 50%, #1a1f3a, #0a0e27)',
        'glow-purple': 'radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, transparent 70%)',
        'glow-cyan': 'radial-gradient(circle, rgba(34, 211, 238, 0.15) 0%, transparent 70%)',
      },
      boxShadow: {
        'glow-purple': '0 0 20px rgba(168, 85, 247, 0.5), 0 0 40px rgba(168, 85, 247, 0.3)',
        'glow-purple-lg': '0 0 30px rgba(168, 85, 247, 0.6), 0 0 60px rgba(168, 85, 247, 0.4)',
        'glow-cyan': '0 0 20px rgba(34, 211, 238, 0.5), 0 0 40px rgba(34, 211, 238, 0.3)',
        'glow-cyan-lg': '0 0 30px rgba(34, 211, 238, 0.6), 0 0 60px rgba(34, 211, 238, 0.4)',
        'cosmic': '0 8px 32px rgba(168, 85, 247, 0.15)',
      },
      backdropBlur: {
        'xs': '2px',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}

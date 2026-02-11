module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Christian theme - navy blue & gold palette
                'christian': {
                    primary: '#faf9f6',       // Warm white background
                    secondary: '#d4af37',     // Classic gold
                    accent: '#1a3a5c',        // Royal navy (main color)
                    accent2: '#e8d48b',       // Champagne gold
                    text: '#0f1c2e',          // Deep navy text
                },
                // Hindu theme - navy blue & gold palette
                'hindu': {
                    primary: '#faf9f6',       // Warm white background
                    secondary: '#d4af37',     // Classic gold
                    accent: '#1a3a5c',        // Royal navy (main color)
                    accent2: '#e8d48b',       // Champagne gold
                    text: '#0f1c2e',          // Deep navy text
                },
                // Shared colors
                'wedding': {
                    background: '#faf9f6',    // Warm white background
                    love: '#d4af37',          // Classic gold
                    gold: '#e8d48b',          // Champagne gold for decorative elements
                    cream: '#faf9f6',         // Warm white for sections
                    gray: '#0f1c2e',          // Deep navy
                },
            },
            fontFamily: {
                'display': ['Cormorant Garamond', 'Georgia', 'serif'],
                'body': ['Montserrat', 'sans-serif'],
                'script': ['Tangerine', 'cursive'],
            },
            boxShadow: {
                'elegant': '0 4px 20px rgba(0, 0, 0, 0.05)',
                'card': '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.03)',
            },
            // REMOVED svg background images
            // backgroundImage: {
            //   'floral-pattern': "url('/images/floral-pattern.svg')",
            //   'ornament': "url('/images/ornament.svg')",
            // },
            animation: {
                'float': 'float 6s ease-in-out infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                }
            },
        },
    },
    plugins: [],
}
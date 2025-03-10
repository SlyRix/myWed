module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'christian': {
                    primary: '#ffffff',
                    secondary: '#f0f4f8',
                    accent: '#d4b08c',
                    text: '#2d3748'
                },
                'hindu': {
                    primary: '#ffcb05',
                    secondary: '#ff5722',
                    accent: '#9c27b0',
                    text: '#2d3748'
                }
            },
            fontFamily: {
                'primary': ['"Cormorant Garamond"', 'Georgia', 'serif'],
                'secondary': ['"Montserrat"', 'sans-serif']
            },
            animation: {
                'bounce-slow': 'bounce 2s infinite',
                'pulse-slow': 'pulse 3s infinite'
            },
            transitionDuration: {
                '2000': '2000ms',
            }
        },
    },
    plugins: [],
}
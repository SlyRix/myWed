import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState({
        christianColors: {
            primary: '#fff',
            secondary: '#f0f4f8',
            accent: '#d4b08c',
            text: '#2d3748'
        },
        hinduColors: {
            primary: '#ffcb05',
            secondary: '#ff5722',
            accent: '#9c27b0',
            text: '#2d3748'
        }
    });

    // Function to update theme colors
    const updateTheme = (newTheme) => {
        setTheme(prevTheme => ({
            ...prevTheme,
            ...newTheme
        }));
    };

    // Apply theme colors to CSS variables
    useEffect(() => {
        const root = document.documentElement;

        // Set Christian ceremony colors
        root.style.setProperty('--christian-primary', theme.christianColors.primary);
        root.style.setProperty('--christian-secondary', theme.christianColors.secondary);
        root.style.setProperty('--christian-accent', theme.christianColors.accent);
        root.style.setProperty('--christian-text', theme.christianColors.text);

        // Set Hindu ceremony colors
        root.style.setProperty('--hindu-primary', theme.hinduColors.primary);
        root.style.setProperty('--hindu-secondary', theme.hinduColors.secondary);
        root.style.setProperty('--hindu-accent', theme.hinduColors.accent);
        root.style.setProperty('--hindu-text', theme.hinduColors.text);
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, updateTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children, value }) => {
    // Fix the conditional useState issue
    const defaultIsAuthenticated = false;
    const defaultSetIsAuthenticated = () => {};

    // Use the provided value or create a new state
    const [isAuthenticated, setIsAuthenticated] = useState(
        value?.isAuthenticated !== undefined ? value.isAuthenticated : defaultIsAuthenticated
    );

    // Use the setter function from props or use the one from useState
    const contextSetIsAuthenticated = value?.setIsAuthenticated || setIsAuthenticated;

    return (
        <AuthContext.Provider value={{
            isAuthenticated: isAuthenticated,
            setIsAuthenticated: contextSetIsAuthenticated
        }}>
            {children}
        </AuthContext.Provider>
    );
};
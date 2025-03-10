import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children, value }) => {
    // If value is provided, use it, otherwise create a new state
    const [isAuthenticated, setIsAuthenticated] = value?.isAuthenticated !== undefined ?
        [value.isAuthenticated, value.setIsAuthenticated] :
        useState(false);

    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};
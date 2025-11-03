import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const useAuth = () => {
    const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);

    const login = (password) => {
        // In a real app, verify against a secure source
        if (password === 'wedding2026') {
            setIsAuthenticated(true);
            localStorage.setItem('weddingAuth', 'true');
            return true;
        }
        return false;
    };

    const logout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('weddingAuth');
    };

    return {
        isAuthenticated,
        login,
        logout
    };
};

export default useAuth;
// src/contexts/GuestContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { validateAccessCode } from '../api/guestApi';

const GuestContext = createContext();

export const useGuest = () => {
    const context = useContext(GuestContext);
    if (!context) {
        throw new Error('useGuest must be used within a GuestProvider');
    }
    return context;
};

export const GuestProvider = ({ children }) => {
    const [guestData, setGuestData] = useState({
        code: null,
        name: null,
        ceremonies: [],
        isLoading: true,
        isValidated: false
    });

    // Load guest data from localStorage and validate on mount
    useEffect(() => {
        const loadGuestData = async () => {
            const invitationCode = localStorage.getItem('invitationCode');
            const adminToken = localStorage.getItem('adminToken');

            // Admin has access to everything
            if (adminToken) {
                setGuestData({
                    code: 'ADMIN',
                    name: 'Administrator',
                    ceremonies: ['christian', 'hindu'],
                    isLoading: false,
                    isValidated: true
                });
                return;
            }

            // Try to validate invitation code
            if (invitationCode) {
                try {
                    const validation = await validateAccessCode(invitationCode);

                    if (validation.valid) {
                        setGuestData({
                            code: invitationCode,
                            name: validation.guest?.name || null,
                            ceremonies: validation.ceremonies || [],
                            isLoading: false,
                            isValidated: true
                        });
                    } else {
                        // Invalid code, clear it
                        localStorage.removeItem('invitationCode');
                        setGuestData({
                            code: null,
                            name: null,
                            ceremonies: [],
                            isLoading: false,
                            isValidated: false
                        });
                    }
                } catch (error) {
                    if (process.env.NODE_ENV === 'development') {
                        console.error('Error validating invitation code:', error);
                    }
                    setGuestData({
                        code: null,
                        name: null,
                        ceremonies: [],
                        isLoading: false,
                        isValidated: false
                    });
                }
            } else {
                // No code found
                setGuestData({
                    code: null,
                    name: null,
                    ceremonies: [],
                    isLoading: false,
                    isValidated: false
                });
            }
        };

        loadGuestData();
    }, []);

    // Function to update guest data when a new code is validated
    const setGuestAccess = (code, name, ceremonies) => {
        setGuestData({
            code,
            name,
            ceremonies,
            isLoading: false,
            isValidated: true
        });
        localStorage.setItem('invitationCode', code);
    };

    // Function to check if guest has access to a specific ceremony
    const hasAccessTo = (ceremony) => {
        return guestData.ceremonies.includes(ceremony);
    };

    // Function to clear guest data (logout)
    const clearGuestAccess = () => {
        localStorage.removeItem('invitationCode');
        setGuestData({
            code: null,
            name: null,
            ceremonies: [],
            isLoading: false,
            isValidated: false
        });
    };

    const value = {
        ...guestData,
        setGuestAccess,
        hasAccessTo,
        clearGuestAccess
    };

    return (
        <GuestContext.Provider value={value}>
            {children}
        </GuestContext.Provider>
    );
};

export default GuestContext;

// src/api/guestApi.js
const API_URL = process.env.REACT_APP_API_URL || 'https://rswed-api.slyrix.com/api';

// Fetch all guests
export const fetchAllGuests = async () => {
    try {
        const response = await fetch(`${API_URL}/guests`);

        if (!response.ok) {
            throw new Error(`Failed to fetch guests: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching guests:', error);
        throw error;
    }
};

// Save a guest (add or update)
export const saveGuest = async (code, guestData) => {
    try {
        const response = await fetch(`${API_URL}/guests`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code, guestData }),
        });

        if (!response.ok) {
            throw new Error(`Failed to save guest: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error saving guest:', error);
        throw error;
    }
};

// Delete a guest
export const deleteGuest = async (code) => {
    try {
        const response = await fetch(`${API_URL}/guests/${code}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error(`Failed to delete guest: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error deleting guest:', error);
        throw error;
    }
};

// Validate access code
export const validateAccessCode = async (code) => {
    if (!code) return { valid: false };

    try {
        const formattedCode = code.trim().toUpperCase();
        const response = await fetch(`${API_URL}/validate/${formattedCode}`);

        if (!response.ok) {
            throw new Error(`Failed to validate code: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error validating code:', error);
        return { valid: false, error: error.message };
    }
};

// Generate a guest code
export const generateGuestCode = async (name) => {
    try {
        const response = await fetch(`${API_URL}/generate-code`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name }),
        });

        if (!response.ok) {
            throw new Error(`Failed to generate code: ${response.statusText}`);
        }

        const result = await response.json();
        return result.code;
    } catch (error) {
        console.error('Error generating code:', error);
        throw error;
    }
};
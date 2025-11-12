/**
 * Guest API Service
 * Handles all communication with the backend API for guest management
 * @module guestApi
 */

import { API_TIMEOUT_MS } from '../constants';

const API_URL = process.env.REACT_APP_API_URL || 'https://api.rushel.me/api';

/**
 * Retrieves authentication headers for API requests
 * Includes admin token from localStorage if available
 * @returns {Object} Headers object with Content-Type and optional Authorization
 * @private
 */
const getAuthHeaders = () => {
    const token = localStorage.getItem('adminToken');
    return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
    };
};

/**
 * Wrapper for fetch with automatic timeout handling
 * @param {string} url - The URL to fetch
 * @param {Object} options - Fetch options (method, headers, body, etc.)
 * @param {number} timeout - Timeout in milliseconds (default: API_TIMEOUT_MS)
 * @returns {Promise<Response>} Fetch response
 * @throws {Error} If request times out or network error occurs
 * @private
 */
const fetchWithTimeout = async (url, options = {}, timeout = API_TIMEOUT_MS) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal
        });
        clearTimeout(timeoutId);
        return response;
    } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
            throw new Error('Request timeout - please check your connection and try again');
        }
        throw error;
    }
};

/**
 * Fetches all guests from the backend (admin only)
 * Requires valid admin authentication token in localStorage
 * @returns {Promise<Object>} Guest list object where keys are codes and values are guest data
 * @throws {Error} If request fails or user is not authorized
 * @example
 * const guests = await fetchAllGuests();
 * // Returns: { "CODE1": { name: "John Doe", ceremonies: ["christian"] }, ... }
 */
export const fetchAllGuests = async () => {
    try {
        const response = await fetchWithTimeout(`${API_URL}/guests`, {
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch guests: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        if (process.env.NODE_ENV === 'development') {
            console.error('Error fetching guests:', error);
        }
        throw error;
    }
};

/**
 * Saves a guest (creates new or updates existing) - admin only
 * @param {string} code - Guest invitation code (4-10 uppercase alphanumeric characters)
 * @param {Object} guestData - Guest information
 * @param {string} guestData.name - Guest's full name
 * @param {string[]} guestData.ceremonies - Array of accessible ceremonies ('christian', 'hindu')
 * @returns {Promise<Object>} Server response with saved guest data
 * @throws {Error} If save fails or validation errors occur
 * @example
 * await saveGuest('SMITH123', {
 *   name: 'John Smith',
 *   ceremonies: ['christian', 'hindu']
 * });
 */
export const saveGuest = async (code, guestData) => {
    try {
        const response = await fetchWithTimeout(`${API_URL}/guests`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ code, guestData }),
        });

        if (!response.ok) {
            throw new Error(`Failed to save guest: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        if (process.env.NODE_ENV === 'development') {
            console.error('Error saving guest:', error);
        }
        throw error;
    }
};

/**
 * Deletes a guest from the system - admin only
 * WARNING: This action is permanent and cannot be undone
 * @param {string} code - Guest invitation code to delete
 * @returns {Promise<Object>} Server response confirming deletion
 * @throws {Error} If deletion fails or guest not found
 */
export const deleteGuest = async (code) => {
    try {
        const response = await fetchWithTimeout(`${API_URL}/guests/${code}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            throw new Error(`Failed to delete guest: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        if (process.env.NODE_ENV === 'development') {
            console.error('Error deleting guest:', error);
        }
        throw error;
    }
};

/**
 * Validates a guest invitation code (public endpoint)
 * Checks if the code exists and returns associated guest data
 * @param {string} code - Invitation code to validate
 * @returns {Promise<Object>} Validation result
 * @returns {boolean} returns.valid - Whether the code is valid
 * @returns {Object} [returns.guest] - Guest information (if valid)
 * @returns {string[]} [returns.ceremonies] - Accessible ceremonies (if valid)
 * @example
 * const result = await validateAccessCode('SMITH123');
 * if (result.valid) {
 *   console.log(`Welcome ${result.guest.name}`);
 * }
 */
export const validateAccessCode = async (code) => {
    if (!code) return { valid: false };

    try {
        const formattedCode = code.trim().toUpperCase();
        const response = await fetchWithTimeout(`${API_URL}/validate/${formattedCode}`);

        if (!response.ok) {
            throw new Error(`Failed to validate code: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        if (process.env.NODE_ENV === 'development') {
            console.error('Error validating code:', error);
        }
        return { valid: false, error: error.message };
    }
};

/**
 * Generates a unique guest invitation code based on name - admin only
 * Creates a random 8-character alphanumeric code
 * @param {string} name - Guest name (used as basis for code generation)
 * @returns {Promise<string>} Generated unique code
 * @throws {Error} If code generation fails
 * @example
 * const code = await generateGuestCode('John Smith');
 * // Returns: "A3F8K9L2" (example)
 */
export const generateGuestCode = async (name) => {
    try {
        const response = await fetchWithTimeout(`${API_URL}/generate-code`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ name }),
        });

        if (!response.ok) {
            throw new Error(`Failed to generate code: ${response.statusText}`);
        }

        const result = await response.json();
        return result.code;
    } catch (error) {
        if (process.env.NODE_ENV === 'development') {
            console.error('Error generating code:', error);
        }
        throw error;
    }
};
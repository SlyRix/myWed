/**
 * API Configuration
 * Centralized configuration for all API-related settings
 * @module config/api
 */

/**
 * Main API configuration object
 * @constant
 * @type {Object}
 */
export const API_CONFIG = {
    /**
     * Base URL for the API
     * Uses environment variable REACT_APP_API_URL if set, otherwise defaults to production API
     */
    baseURL: process.env.REACT_APP_API_URL || 'https://api.rushel.me/api',

    /**
     * Request timeout in milliseconds
     * Default: 10 seconds
     */
    timeout: 10000,

    /**
     * Default headers for API requests
     */
    headers: {
        'Content-Type': 'application/json'
    }
};

/**
 * API endpoint paths
 * @constant
 * @type {Object}
 */
export const ENDPOINTS = {
    /** Guests management endpoint (admin only) */
    guests: '/guests',

    /** Guest validation endpoint (public) */
    validate: '/validate',

    /** Generate guest code endpoint (admin only) */
    generateCode: '/generate-code',

    /** Admin login endpoint */
    adminLogin: '/admin/login'
};

/**
 * Build full API URL from endpoint path
 * @param {string} endpoint - Endpoint path (with or without leading slash)
 * @returns {string} Full API URL
 * @example
 * buildApiUrl('/guests') // Returns: 'https://api.rushel.me/api/guests'
 */
export const buildApiUrl = (endpoint) => {
    const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${API_CONFIG.baseURL}${path}`;
};

/**
 * Get authentication headers for API requests
 * Includes admin token from localStorage if available
 * @returns {Object} Headers object with Content-Type and optional Authorization
 */
export const getAuthHeaders = () => {
    const token = localStorage.getItem('adminToken');
    return {
        ...API_CONFIG.headers,
        ...(token && { 'Authorization': `Bearer ${token}` })
    };
};

/**
 * Gifts API Service
 * Handles all communication with the backend API for wedding gift registry
 * @module giftsApi
 */

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
 * @param {number} timeout - Timeout in milliseconds (default: 10000)
 * @returns {Promise<Response>} Fetch response
 * @throws {Error} If request times out or network error occurs
 * @private
 */
const fetchWithTimeout = async (url, options = {}, timeout = 10000) => {
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
 * Fetches all gifts with contribution totals (public endpoint)
 * Returns gift list with calculated contribution data and remaining amounts
 * @returns {Promise<Array>} Array of gift objects with contribution data
 * @throws {Error} If request fails
 * @example
 * const gifts = await fetchGifts();
 * // Returns: [{ id: 1, names: {...}, price: 2000, totalContributed: 500, ... }]
 */
export const fetchGifts = async () => {
    try {
        const response = await fetchWithTimeout(`${API_URL}/gifts`);

        if (!response.ok) {
            throw new Error(`Failed to fetch gifts: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching gifts:', error);
        throw error;
    }
};

/**
 * Creates a new gift (admin only)
 * @param {Object} giftData - Gift information
 * @param {Object} giftData.names - Gift names in all languages
 * @param {string} giftData.names.en - English name
 * @param {string} giftData.names.de - German name
 * @param {string} giftData.names.ta - Tamil name
 * @param {Object} giftData.descriptions - Gift descriptions in all languages
 * @param {string} giftData.descriptions.en - English description
 * @param {string} giftData.descriptions.de - German description
 * @param {string} giftData.descriptions.ta - Tamil description
 * @param {number} giftData.price - Gift price
 * @param {string} giftData.imageUrl - URL to gift image
 * @param {string} giftData.category - Gift category (e.g., 'kitchen', 'home', 'experience')
 * @returns {Promise<Object>} Server response with created gift data
 * @throws {Error} If creation fails or validation errors occur
 * @example
 * await createGift({
 *   names: { en: 'Coffee Machine', de: 'Kaffeemaschine', ta: 'காபி இயந்திரம்' },
 *   descriptions: { en: 'High quality...', de: 'Hochwertige...', ta: '...' },
 *   price: 400,
 *   imageUrl: 'https://...',
 *   category: 'kitchen'
 * });
 */
export const createGift = async (giftData) => {
    try {
        const response = await fetchWithTimeout(`${API_URL}/gifts`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(giftData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Failed to create gift: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error creating gift:', error);
        throw error;
    }
};

/**
 * Updates an existing gift (admin only)
 * @param {number} giftId - ID of gift to update
 * @param {Object} giftData - Updated gift information (same structure as createGift)
 * @returns {Promise<Object>} Server response with updated gift data
 * @throws {Error} If update fails or gift not found
 */
export const updateGift = async (giftId, giftData) => {
    try {
        const response = await fetchWithTimeout(`${API_URL}/gifts/${giftId}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(giftData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Failed to update gift: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error updating gift:', error);
        throw error;
    }
};

/**
 * Deletes a gift from the registry (admin only)
 * WARNING: This action is permanent and also deletes all contributions to this gift
 * @param {number} giftId - ID of gift to delete
 * @returns {Promise<Object>} Server response confirming deletion
 * @throws {Error} If deletion fails or gift not found
 */
export const deleteGift = async (giftId) => {
    try {
        const response = await fetchWithTimeout(`${API_URL}/gifts/${giftId}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Failed to delete gift: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error deleting gift:', error);
        throw error;
    }
};

/**
 * Makes a contribution to a gift (public endpoint with rate limiting)
 * @param {number} giftId - ID of gift to contribute to
 * @param {Object} contributionData - Contribution information
 * @param {string} contributionData.contributorName - Name of contributor (required, max 100 chars)
 * @param {number} contributionData.amount - Contribution amount (required, must be positive)
 * @param {string} [contributionData.message] - Optional message (max 200 chars)
 * @returns {Promise<Object>} Server response with created contribution data
 * @throws {Error} If contribution fails or exceeds remaining amount
 * @example
 * await makeContribution(1, {
 *   contributorName: 'John & Mary Smith',
 *   amount: 250,
 *   message: 'Wishing you a wonderful honeymoon!'
 * });
 */
export const makeContribution = async (giftId, contributionData) => {
    try {
        const response = await fetchWithTimeout(`${API_URL}/gifts/${giftId}/contribute`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(contributionData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Failed to make contribution: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error making contribution:', error);
        throw error;
    }
};

/**
 * Marks a gift as purchased directly (public endpoint with rate limiting)
 * Creates a contribution record for the full remaining amount
 * @param {number} giftId - ID of gift that was purchased
 * @param {Object} purchaseData - Purchase information
 * @param {string} purchaseData.contributorName - Name of purchaser (required, max 100 chars)
 * @param {string} [purchaseData.storeName] - Optional store name (max 200 chars)
 * @returns {Promise<Object>} Server response with created contribution data
 * @throws {Error} If marking purchased fails or gift already fully funded
 * @example
 * await markPurchased(1, {
 *   contributorName: 'John Smith',
 *   storeName: 'Amazon'
 * });
 */
export const markPurchased = async (giftId, purchaseData) => {
    try {
        const response = await fetchWithTimeout(`${API_URL}/gifts/${giftId}/mark-purchased`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(purchaseData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Failed to mark gift as purchased: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error marking gift as purchased:', error);
        throw error;
    }
};

/**
 * Fetches all contributions for a specific gift (admin only)
 * Returns list of contributors, amounts, and messages
 * @param {number} giftId - ID of gift to get contributions for
 * @returns {Promise<Array>} Array of contribution objects
 * @throws {Error} If request fails or user not authorized
 * @example
 * const contributions = await fetchGiftContributions(1);
 * // Returns: [{ id: 1, contributor_name: 'John', amount: 250, message: '...', created_at: ... }]
 */
export const fetchGiftContributions = async (giftId) => {
    try {
        const response = await fetchWithTimeout(`${API_URL}/gifts/${giftId}/contributions`, {
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch contributions: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching contributions:', error);
        throw error;
    }
};

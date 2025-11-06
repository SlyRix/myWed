/**
 * Content API Service
 * Handles all communication with the backend API for page content management (CMS)
 * @module contentApi
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
 * @param {number} timeout - Timeout in milliseconds (default: 15000)
 * @returns {Promise<Response>} Fetch response
 * @throws {Error} If request times out or network error occurs
 * @private
 */
const fetchWithTimeout = async (url, options = {}, timeout = 15000) => {
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
 * Fetches page content for a specific page (public endpoint)
 * @param {string} pageId - Page identifier (e.g., 'home', 'christian-ceremony', 'hindu-ceremony', 'reception', 'our-story')
 * @returns {Promise<Object>} Page content data
 * @returns {string} returns.pageId - Page identifier
 * @returns {Object} returns.content - Page content as JSON object
 * @returns {number} returns.updatedAt - Last update timestamp
 * @throws {Error} If request fails or page not found
 * @example
 * const pageData = await getPageContent('christian-ceremony');
 * // Returns: { pageId: 'christian-ceremony', content: {...}, updatedAt: 1234567890 }
 */
export const getPageContent = async (pageId) => {
    try {
        const response = await fetchWithTimeout(`${API_URL}/content/${pageId}`, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            if (response.status === 404) {
                // Page content not found - return empty structure
                return {
                    pageId,
                    content: {},
                    updatedAt: null
                };
            }
            throw new Error(`Failed to fetch page content: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching page content:', error);
        throw error;
    }
};

/**
 * Updates page content for a specific page (admin only)
 * Requires valid admin authentication token in localStorage
 * @param {string} pageId - Page identifier to update
 * @param {Object} content - New page content as JSON object
 * @returns {Promise<Object>} Server response with update confirmation
 * @returns {boolean} returns.success - Whether update was successful
 * @returns {string} returns.pageId - Updated page identifier
 * @returns {number} returns.updatedAt - Update timestamp
 * @throws {Error} If update fails or user is not authorized
 * @example
 * await updatePageContent('christian-ceremony', {
 *   images: { hero: '/images/new-hero.jpg' },
 *   timeline: [...]
 * });
 */
export const updatePageContent = async (pageId, content) => {
    try {
        const response = await fetchWithTimeout(`${API_URL}/content/${pageId}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify({ content }),
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Authentication required. Please log in again.');
            }
            throw new Error(`Failed to update page content: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error updating page content:', error);
        throw error;
    }
};

/**
 * Fetches content for multiple pages in parallel
 * Useful for preloading content for multiple pages
 * @param {string[]} pageIds - Array of page identifiers to fetch
 * @returns {Promise<Object>} Object with pageId as keys and content as values
 * @example
 * const pages = await getMultiplePageContent(['home', 'christian-ceremony', 'hindu-ceremony']);
 * // Returns: { 'home': {...}, 'christian-ceremony': {...}, 'hindu-ceremony': {...} }
 */
export const getMultiplePageContent = async (pageIds) => {
    try {
        const promises = pageIds.map(pageId => getPageContent(pageId));
        const results = await Promise.all(promises);

        const contentMap = {};
        results.forEach(result => {
            contentMap[result.pageId] = result;
        });

        return contentMap;
    } catch (error) {
        console.error('Error fetching multiple pages:', error);
        throw error;
    }
};

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
 * Fetches page content for a specific page and language (public endpoint)
 * @param {string} pageId - Page identifier (e.g., 'home', 'christian-ceremony', 'hindu-ceremony', 'reception', 'our-story')
 * @param {string} language - Language code ('en', 'de', 'ta'). If not provided, returns all languages.
 * @returns {Promise<Object>} Page content data
 * @returns {string} returns.pageId - Page identifier
 * @returns {Object|Object} returns.content - Page content (if language specified) or returns.languages (all languages)
 * @returns {number} returns.updatedAt - Last update timestamp (if language specified)
 * @throws {Error} If request fails or page not found
 * @example
 * // Get specific language
 * const pageData = await getPageContent('christian-ceremony', 'en');
 * // Returns: { pageId: 'christian-ceremony', language: 'en', content: {...}, updatedAt: 1234567890 }
 *
 * // Get all languages
 * const allData = await getPageContent('christian-ceremony');
 * // Returns: { pageId: 'christian-ceremony', languages: { en: {...}, de: {...}, ta: {...} } }
 */
export const getPageContent = async (pageId, language = null) => {
    try {
        const url = language
            ? `${API_URL}/content/${pageId}/${language}`
            : `${API_URL}/content/${pageId}`;

        const response = await fetchWithTimeout(url, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            if (response.status === 404) {
                // Page content not found - return empty structure
                if (language) {
                    return {
                        pageId,
                        language,
                        content: {},
                        updatedAt: null
                    };
                } else {
                    return {
                        pageId,
                        languages: {}
                    };
                }
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
 * Updates page content for a specific page and language (admin only)
 * Requires valid admin authentication token in localStorage
 * @param {string} pageId - Page identifier to update
 * @param {string} language - Language code ('en', 'de', 'ta')
 * @param {Object} content - New page content as JSON object
 * @returns {Promise<Object>} Server response with update confirmation
 * @returns {boolean} returns.success - Whether update was successful
 * @returns {string} returns.pageId - Updated page identifier
 * @returns {string} returns.language - Updated language
 * @returns {number} returns.updatedAt - Update timestamp
 * @throws {Error} If update fails or user is not authorized
 * @example
 * await updatePageContent('christian-ceremony', 'en', {
 *   intro: 'Welcome to our ceremony',
 *   images: { hero: '/images/new-hero.jpg' },
 *   timeline: [...]
 * });
 */
export const updatePageContent = async (pageId, language, content) => {
    try {
        const response = await fetchWithTimeout(`${API_URL}/content/${pageId}/${language}`, {
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
 * Fetches all language content for a specific page (public endpoint)
 * Returns content for all available languages
 * @param {string} pageId - Page identifier
 * @returns {Promise<Object>} Object with language codes as keys
 * @example
 * const allLanguages = await getAllPageContent('christian-ceremony');
 * // Returns: { pageId: 'christian-ceremony', languages: { en: {...}, de: {...}, ta: {...} } }
 */
export const getAllPageContent = async (pageId) => {
    return await getPageContent(pageId, null);
};

/**
 * Checks which languages have content for a specific page
 * @param {string} pageId - Page identifier
 * @returns {Promise<string[]>} Array of available language codes
 * @example
 * const languages = await getAvailableLanguages('christian-ceremony');
 * // Returns: ['en', 'de', 'ta']
 */
export const getAvailableLanguages = async (pageId) => {
    try {
        const data = await getAllPageContent(pageId);
        return Object.keys(data.languages || {});
    } catch (error) {
        console.error('Error fetching available languages:', error);
        return [];
    }
};

/**
 * Fetches content for multiple pages in parallel
 * Useful for preloading content for multiple pages
 * @param {string[]} pageIds - Array of page identifiers to fetch
 * @param {string} language - Optional language code. If not provided, fetches all languages.
 * @returns {Promise<Object>} Object with pageId as keys and content as values
 * @example
 * const pages = await getMultiplePageContent(['home', 'christian-ceremony', 'hindu-ceremony'], 'en');
 * // Returns: { 'home': {...}, 'christian-ceremony': {...}, 'hindu-ceremony': {...} }
 */
export const getMultiplePageContent = async (pageIds, language = null) => {
    try {
        const promises = pageIds.map(pageId => getPageContent(pageId, language));
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

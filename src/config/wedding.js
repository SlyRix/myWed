/**
 * Wedding Configuration
 * Centralized configuration for wedding-specific details
 * @module config/wedding
 */

/**
 * Wedding date and time
 * Christian Ceremony: July 4, 2026 at 2:00 PM
 * @constant
 * @type {Date}
 */
export const WEDDING_DATE = new Date('July 4, 2026 14:00:00');

/**
 * Alternative representation for countdown (May 9, 2026 is shown in Hero but July 4 is actual date)
 * Using July 4 as primary date based on translation files
 */
export const COUNTDOWN_DATE = WEDDING_DATE;

/**
 * Couple information
 * @constant
 * @type {Object}
 */
export const COUPLE = {
    partner1: {
        name: 'Rushel',
        fullName: 'Rushel',
        religion: 'Christian'
    },
    partner2: {
        name: 'Sivani',
        fullName: 'Sivani',
        religion: 'Hindu'
    }
};

/**
 * Venue configurations for different ceremonies
 * @constant
 * @type {Object}
 */
export const VENUES = {
    christian: {
        name: 'Kirche Altendorf',
        address: {
            line1: 'Dorfpl. 5',
            line2: '8852 Altendorf',
            full: 'Dorfpl. 5, 8852 Altendorf'
        },
        coordinates: {
            lat: 47.1747,
            lng: 8.8642
        },
        date: 'July 4, 2026',
        time: '2:00 PM - 4:00 PM',
        mapsUrl: 'https://maps.google.com/?q=Kirche+Altendorf+Dorfpl.+5+8852+Altendorf'
    },
    hindu: {
        name: 'Shed15 events&more',
        address: {
            line1: 'Zürichstrasse 15-17',
            line2: '8607 Seegräben',
            full: 'Zürichstrasse 15-17, 8607 Seegräben'
        },
        coordinates: {
            lat: 47.3352,
            lng: 8.7822
        },
        date: 'July 5, 2026',
        time: '10:00 AM - 2:00 PM',
        mapsUrl: 'https://maps.google.com/?q=Shed15+events+more+Zürichstrasse+15-17+8607+Seegräben'
    },
    reception: {
        name: 'Sporthalle Unterrohr',
        address: {
            line1: 'Unterrohrstrasse 2',
            line2: '8952 Schlieren',
            full: 'Unterrohrstrasse 2, 8952 Schlieren'
        },
        coordinates: {
            lat: 47.3967,
            lng: 8.4448
        },
        date: 'July 5, 2026',
        time: '6:00 PM - 2:00 AM',
        mapsUrl: 'https://maps.google.com/?q=Sporthalle+Unterrohr+Unterrohrstrasse+2+8952+Schlieren'
    }
};

/**
 * RSVP deadline
 * @constant
 * @type {Date}
 */
export const RSVP_DEADLINE = new Date('June 1, 2026');

/**
 * Dress codes for different ceremonies
 * @constant
 * @type {Object}
 */
export const DRESS_CODES = {
    christian: {
        primary: 'Formal Attire',
        secondary: 'Light colors preferred'
    },
    hindu: {
        primary: 'Traditional Indian Attire',
        secondary: 'Vibrant colors encouraged'
    },
    reception: {
        primary: 'Cocktail Attire',
        secondary: 'Dressy and festive'
    }
};

/**
 * Nearest airport information
 * @constant
 * @type {Object}
 */
export const NEAREST_AIRPORT = {
    name: 'Zurich Airport (ZRH)',
    code: 'ZRH',
    distance: {
        toChristianVenue: {
            km: 35,
            time: '35 minutes'
        },
        toHinduVenue: {
            km: 25,
            time: '25 minutes'
        },
        toReception: {
            km: 15,
            time: '15 minutes'
        }
    }
};

/**
 * Theme colors
 * @constant
 * @type {Object}
 */
export const THEME_COLORS = {
    christian: {
        primary: '#d4b08c',   // Soft cream/golden brown
        accent: '#8b7355'      // Darker brown
    },
    hindu: {
        primary: '#f0b429',    // Gold
        secondary: '#d93f0b'   // Vermillion/deep orange
    },
    shared: {
        love: '#ff69b4',       // Wedding pink
        gold: '#ffd700'        // Gold accent
    }
};

/**
 * Contact information for wedding coordinators
 * @constant
 * @type {Object}
 */
export const CONTACT_INFO = {
    email: 'contact@rushel.me',
    // Add phone numbers if needed
};

/**
 * Helper function to get venue by type
 * @param {string} type - Venue type ('christian', 'hindu', 'reception')
 * @returns {Object} Venue configuration
 */
export const getVenue = (type) => {
    return VENUES[type] || null;
};

/**
 * Helper function to format date for display
 * @param {Date} date - Date to format
 * @param {string} locale - Locale code ('en', 'de', 'ta')
 * @returns {string} Formatted date string
 */
export const formatWeddingDate = (date, locale = 'en') => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(locale, options);
};

/**
 * Check if RSVP deadline has passed
 * @returns {boolean} True if deadline has passed
 */
export const isRSVPDeadlinePassed = () => {
    return new Date() > RSVP_DEADLINE;
};

/**
 * Get days until wedding
 * @returns {number} Number of days until wedding
 */
export const getDaysUntilWedding = () => {
    const now = new Date();
    const timeDiff = WEDDING_DATE.getTime() - now.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
};

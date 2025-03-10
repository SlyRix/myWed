/**
 * Formats a date to display in a human-readable format
 * @param {Date} date - The date to format
 * @param {Object} options - Formatting options
 * @returns {String} Formatted date string
 */
export const formatDate = (date, options = {}) => {
    const defaultOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        ...options
    };

    return new Date(date).toLocaleDateString('en-US', defaultOptions);
};

/**
 * Formats a time to display in a human-readable format
 * @param {Date} date - The date containing the time to format
 * @returns {String} Formatted time string
 */
export const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
};

/**
 * Calculates time remaining until a target date
 * @param {Date|Number} targetDate - Target date to count down to
 * @returns {Object} Object containing days, hours, minutes, seconds remaining
 */
export const getTimeRemaining = (targetDate) => {
    const total = new Date(targetDate).getTime() - new Date().getTime();

    // Handle case where target date is in the past
    if (total <= 0) {
        return {
            total: 0,
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
            isPast: true
        };
    }

    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const days = Math.floor(total / (1000 * 60 * 60 * 24));

    return {
        total,
        days,
        hours,
        minutes,
        seconds,
        isPast: false
    };
};
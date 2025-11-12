// src/utils/emailService.js
// RSVP notification service using n8n webhook

// Get webhook URL from environment variables
const WEBHOOK_URL = process.env.REACT_APP_WEBHOOK_URL;

// Validate that webhook URL is configured
if (!WEBHOOK_URL) {
    if (process.env.NODE_ENV === 'development') {
        console.error('REACT_APP_WEBHOOK_URL environment variable is not set');
    }
}

/**
 * Sends RSVP notification via n8n webhook
 * @param {Object} formData - Form data containing guest RSVP information
 * @param {string} formData.firstName - Guest's first name
 * @param {string} formData.lastName - Guest's last name
 * @param {string} formData.email - Guest's email address
 * @param {string} formData.attending - Whether attending ('yes'/'no')
 * @param {number} formData.christianGuests - Number of guests for Christian ceremony
 * @param {number} formData.hinduGuests - Number of guests for Hindu ceremony
 * @param {boolean} formData.isVegetarian - Vegetarian meal preference
 * @param {string} formData.phone - Guest's phone number (optional)
 * @param {string} formData.message - Additional message from guest (optional)
 * @param {string} formData.source - Source of RSVP (ceremony page or direct)
 * @returns {Promise<{success: boolean, response?: any, error?: any}>} Result object
 */
export const sendRSVPEmail = async (formData) => {
    // Check if webhook URL is configured
    if (!WEBHOOK_URL) {
        return {
            success: false,
            error: new Error('Email service is not configured. Please contact the administrator.')
        };
    }

    try {
        // Format the attendance information for better readability
        let attendanceInfo = '';

        if (formData.attending === 'yes') {
            attendanceInfo = 'Yes';

            // Add ceremony-specific attendance
            const christianAttending = formData.christianGuests > 0;
            const hinduAttending = formData.hinduGuests > 0;

            if (christianAttending) {
                attendanceInfo += `\nChristian Ceremony: ${formData.christianGuests} ${formData.christianGuests > 1 ? 'people' : 'person'}`;
            }

            if (hinduAttending) {
                attendanceInfo += `\nHindu Ceremony: ${formData.hinduGuests} ${formData.hinduGuests > 1 ? 'people' : 'person'}`;
            }

            // Add vegetarian preference
            attendanceInfo += `\nVegetarian: ${formData.isVegetarian ? 'Yes' : 'No'}`;
        } else {
            attendanceInfo = 'No - Unable to attend';
        }

        // Prepare webhook payload
        const webhookPayload = {
            // Basic info
            firstName: formData.firstName || 'No first name provided',
            lastName: formData.lastName || 'No last name provided',
            fullName: `${formData.firstName} ${formData.lastName}`,
            email: formData.email || 'No email provided',
            phone: formData.phone || 'No phone provided',

            // Attendance
            attending: formData.attending,
            attendanceFormatted: attendanceInfo,

            // Ceremony details
            christianGuests: formData.christianGuests || 0,
            hinduGuests: formData.hinduGuests || 0,
            totalGuests: (formData.christianGuests || 0) + (formData.hinduGuests || 0),
            christianAttending: formData.christianGuests > 0,
            hinduAttending: formData.hinduGuests > 0,

            // Dietary preference
            isVegetarian: formData.isVegetarian || false,
            dietary: formData.isVegetarian ? 'Vegetarian' : 'Non-vegetarian',

            // Additional info
            message: formData.message || 'No message',
            source: formData.source || 'direct',

            // Metadata
            submittedAt: new Date().toISOString(),
            timestamp: Date.now()
        };

        // Send to n8n webhook
        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(webhookPayload),
        });

        if (!response.ok) {
            throw new Error(`Webhook returned ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();

        return { success: true, response: result };
    } catch (error) {
        // Only log error type, not sensitive details
        if (process.env.NODE_ENV === 'development') {
            console.error('Failed to send RSVP to webhook:', error.message || 'Unknown error');
        }
        return { success: false, error };
    }
};

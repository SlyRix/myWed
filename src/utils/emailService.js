// src/utils/emailService.js
// RSVP submission service — saves to Cloudflare D1 via Worker API,
// which then triggers n8n for email notifications.

const API_URL = process.env.REACT_APP_API_URL;

/**
 * Submits an RSVP to the Cloudflare Worker API.
 * The Worker saves it to D1 and triggers n8n to send confirmation emails.
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
 * @returns {Promise<{success: boolean, response?: any, error?: any}>}
 */
export const sendRSVPEmail = async (formData) => {
    if (!API_URL) {
        return {
            success: false,
            error: new Error('API URL is not configured.')
        };
    }

    try {
        const payload = {
            firstName: formData.firstName || '',
            lastName: formData.lastName || '',
            fullName: `${formData.firstName} ${formData.lastName}`.trim(),
            email: formData.email || '',
            phone: formData.phone || '',
            attending: formData.attending,
            christianGuests: formData.christianGuests || 0,
            hinduGuests: formData.hinduGuests || 0,
            receptionGuests: formData.receptionGuests || 0,
            totalGuests: (formData.christianGuests || 0) + (formData.hinduGuests || 0) + (formData.receptionGuests || 0),
            isVegetarian: formData.isVegetarian || false,
            message: formData.message || '',
            source: formData.source || 'direct',
            side: formData.side || '',
        };

        const response = await fetch(`${API_URL}/rsvp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error(`RSVP endpoint returned ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        return { success: true, response: result };
    } catch (error) {
        if (process.env.NODE_ENV === 'development') {
            console.error('Failed to submit RSVP:', error.message || 'Unknown error');
        }
        return { success: false, error };
    }
};

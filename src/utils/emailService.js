// src/utils/emailService.js
import emailjs from '@emailjs/browser';

// Get EmailJS configuration from environment variables
const SERVICE_ID = process.env.REACT_APP_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;

// Initialize EmailJS (only log in development mode)
if (process.env.NODE_ENV === 'development') {
    console.log('Initializing EmailJS');
}
emailjs.init(PUBLIC_KEY);

// Function to send RSVP email with comprehensive error handling
export const sendRSVPEmail = async (formData) => {
    if (process.env.NODE_ENV === 'development') {
        console.log('Sending RSVP email');
    }

    try {
        // Format the attendance information for better readability in the email
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

        // Add all form data fields without filtering to ensure nothing is missing
        const templateParams = {
            ...formData,
            // These fields need to match EXACTLY what's in your EmailJS template
            firstName: formData.firstName || 'No first name provided',
            lastName: formData.lastName || 'No last name provided',
            email: formData.email || 'No email provided',
            phone: formData.phone || 'No phone provided',
            attending: attendanceInfo,
            // For compatibility with existing template
            guests: (formData.christianGuests || 0) + (formData.hinduGuests || 0),
            dietary: formData.isVegetarian ? 'Vegetarian' : 'Non-vegetarian',
            message: formData.message || 'No message',
            source: formData.source || 'direct',
            // Ceremony-specific attendance flags for template
            christianAttending: formData.christianGuests > 0 ? 'Yes' : 'No',
            hinduAttending: formData.hinduGuests > 0 ? 'Yes' : 'No'
        };

        // Send the email
        const response = await emailjs.send(
            SERVICE_ID,
            TEMPLATE_ID,
            templateParams
        );

        if (process.env.NODE_ENV === 'development') {
            console.log('Email sent successfully');
        }
        return { success: true, response };
    } catch (error) {
        // Only log error type, not sensitive details
        console.error('Failed to send email:', error.message || 'Unknown error');
        return { success: false, error };
    }
};
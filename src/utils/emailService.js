// src/utils/emailService.js
import emailjs from '@emailjs/browser';

// Replace these with your actual values from EmailJS dashboard
const SERVICE_ID = 'service_zwmh9m3';  // service_xxxxxx
const TEMPLATE_ID = 'template_qq4oalp'; // template_xxxxxx
const PUBLIC_KEY = '-aL2Rd-N2QdzeUs5Q';  // Found in Integration tab

// Initialize EmailJS with verbose logging
console.log('Initializing EmailJS with PUBLIC_KEY:', PUBLIC_KEY);
emailjs.init(PUBLIC_KEY);

// Function to send RSVP email with comprehensive error handling
export const sendRSVPEmail = async (formData) => {
    console.log('⚠️ SEND ATTEMPT: Sending email with data:', formData);

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

        console.log('⚠️ TEMPLATE PARAMS: About to send with parameters:', templateParams);
        console.log('⚠️ SERVICE INFO: Using SERVICE_ID:', SERVICE_ID, 'TEMPLATE_ID:', TEMPLATE_ID);

        // Send the email
        const response = await emailjs.send(
            SERVICE_ID,
            TEMPLATE_ID,
            templateParams
        );

        console.log('✅ SUCCESS: Email sent successfully!', response);
        return { success: true, response };
    } catch (error) {
        console.error('❌ ERROR: Failed to send email:', error);
        console.error('Error details:', {
            name: error.name,
            message: error.message,
            text: error.text,
            status: error.status
        });
        return { success: false, error };
    }
};
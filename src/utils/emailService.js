// src/utils/emailService.js
import emailjs from '@emailjs/browser';

// Replace these with your actual values from EmailJS dashboard
const SERVICE_ID = 'service_hi2xr8f';  // service_xxxxxx
const TEMPLATE_ID = 'template_qq4oalp'; // template_xxxxxx
const PUBLIC_KEY = '-aL2Rd-N2QdzeUs5Q';  // Found in Integration tab

// Initialize EmailJS with verbose logging
console.log('Initializing EmailJS with PUBLIC_KEY:', PUBLIC_KEY);
emailjs.init(PUBLIC_KEY);


// Function to send RSVP email with comprehensive error handling
export const sendRSVPEmail = async (formData) => {
    console.log('⚠️ SEND ATTEMPT: Sending email with data:', formData);

    try {
        // Add all form data fields without filtering to ensure nothing is missing
        const templateParams = {
            ...formData,
            // These fields need to match EXACTLY what's in your EmailJS template
            firstName: formData.firstName || 'No first name provided',
            lastName: formData.lastName || 'No last name provided',
            email: formData.email || 'No email provided',
            phone: formData.phone || 'No phone provided',
            attending: formData.attending || 'No response',
            guests: formData.guests || '0',
            dietary: formData.dietaryRestrictions || 'None specified',
            message: formData.message || 'No message',
            source: formData.source || 'direct',
            // Include all potential variables your template might expect
            christian: 'Not asked', // Provide fallback values
            hindu: 'Not asked'      // Provide fallback values
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
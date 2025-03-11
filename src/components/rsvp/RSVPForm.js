// src/components/rsvp/RSVPForm.js
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { mdiCheck, mdiClose } from '@mdi/js';
import Icon from '@mdi/react';
import { useLocation, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { sendRSVPEmail } from '../../utils/emailService'; // Make sure this import is correct

const RSVPForm = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const ceremonySrc = queryParams.get('ceremony');

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        attending: 'yes',
        guests: 0,
        dietaryRestrictions: '',
        message: '',
        // Track which ceremony they came from
        source: ceremonySrc || 'direct'
    });

    const [submitted, setSubmitted] = useState(false);
    const [showThankYou, setShowThankYou] = useState(false);
    const [errors, setErrors] = useState({});
    const [submitError, setSubmitError] = useState('');

    // Load saved form data from localStorage on component mount
    useEffect(() => {
        const savedFormData = localStorage.getItem('weddingRSVPFormData');
        if (savedFormData) {
            try {
                const parsedData = JSON.parse(savedFormData);
                setFormData(prev => ({
                    ...prev,
                    ...parsedData,
                    // Make sure we keep the ceremony source if it was just passed
                    source: ceremonySrc || parsedData.source || 'direct'
                }));
            } catch (error) {
                console.error('Error parsing saved form data:', error);
                // If there's an error parsing, clear the localStorage item
                localStorage.removeItem('weddingRSVPFormData');
            }
        } else if (ceremonySrc) {
            // If no saved data but we have a ceremony source, update the source
            setFormData(prev => ({
                ...prev,
                source: ceremonySrc
            }));
        }
    }, [ceremonySrc]);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.firstName.trim()) newErrors.firstName = 'Vorname ist erforderlich';
        if (!formData.lastName.trim()) newErrors.lastName = 'Nachname ist erforderlich';

        if (!formData.email.trim()) {
            newErrors.email = 'Email ist erforderlich';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email ist ungültig';
        }

        if (formData.attending === 'yes' && formData.guests < 0) {
            newErrors.guests = 'Anzahl der Gäste kann nicht negativ sein';
        }

        return newErrors;
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newFormData = {
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        };

        // Update state
        setFormData(newFormData);

        // Save to localStorage
        localStorage.setItem('weddingRSVPFormData', JSON.stringify(newFormData));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitError('');
        console.log('Form submission started');

        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            console.log('Form validation failed:', formErrors);
            return;
        }

        setSubmitted(true);
        console.log('Form validated successfully, attempting to send email');

        try {
            // Actually call the email service
            const result = await sendRSVPEmail(formData);

            if (result.success) {
                console.log('Email sent successfully!');
                setShowThankYou(true);
                localStorage.removeItem('weddingRSVPFormData');
            } else {
                console.error('Failed to send email:', result.error);
                setSubmitted(false);
                setSubmitError(`Failed to send your RSVP. Error: ${result.error?.text || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Unexpected error sending email:', error);
            setSubmitted(false);
            setSubmitError(`An unexpected error occurred: ${error.message}`);
        }
    };

    if (showThankYou) {
        return (
            <motion.div
                className="bg-white p-8 rounded-lg shadow-lg text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                    <Icon path={mdiCheck} size={1.5} className="text-green-600" />
                </div>
                <h3 className="text-2xl font-bold mb-2">{t('rsvp.thankYou.title')}</h3>
                <p className="text-gray-700 mb-4">
                    {t('rsvp.thankYou.message')}
                </p>
                <Link
                    to="/"
                    className="px-6 py-2 bg-christian-accent text-white rounded-full hover:shadow-md transition-shadow inline-block"
                >
                    Return to Home
                </Link>
            </motion.div>
        );
    }

    return (
        <motion.div
            className="bg-white p-8 rounded-lg shadow-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <h2 className="text-2xl font-bold mb-6 text-center">{t('rsvp.title')}</h2>

            {submitError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
                    {submitError}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-gray-700 mb-2" htmlFor="firstName">
                            Vorname*
                        </label>
                        <input
                            id="firstName"
                            name="firstName"
                            type="text"
                            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.firstName ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-christian-accent/20'}`}
                            placeholder="Vorname"
                            value={formData.firstName}
                            onChange={handleChange}
                            disabled={submitted}
                        />
                        {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-2" htmlFor="lastName">
                            Nachname*
                        </label>
                        <input
                            id="lastName"
                            name="lastName"
                            type="text"
                            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.lastName ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-christian-accent/20'}`}
                            placeholder="Nachname"
                            value={formData.lastName}
                            onChange={handleChange}
                            disabled={submitted}
                        />
                        {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 mb-2" htmlFor="email">
                        {t('rsvp.form.email')}*
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.email ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-christian-accent/20'}`}
                        placeholder="your.email@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={submitted}
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 mb-2" htmlFor="phone">
                        {t('rsvp.form.phone')}
                    </label>
                    <input
                        id="phone"
                        name="phone"
                        type="tel"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-christian-accent/20"
                        placeholder="(123) 456-7890"
                        value={formData.phone}
                        onChange={handleChange}
                        disabled={submitted}
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">
                        {t('rsvp.form.attending')}*
                    </label>
                    <div className="flex space-x-4">
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                name="attending"
                                value="yes"
                                checked={formData.attending === 'yes'}
                                onChange={handleChange}
                                disabled={submitted}
                                className="form-radio text-christian-accent"
                            />
                            <span className="ml-2">{t('rsvp.form.yes')}</span>
                        </label>
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                name="attending"
                                value="no"
                                checked={formData.attending === 'no'}
                                onChange={handleChange}
                                disabled={submitted}
                                className="form-radio text-christian-accent"
                            />
                            <span className="ml-2">{t('rsvp.form.no')}</span>
                        </label>
                    </div>
                </div>

                {formData.attending === 'yes' && (
                    <>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2" htmlFor="guests">
                                {t('rsvp.form.guests')}
                            </label>
                            <input
                                id="guests"
                                name="guests"
                                type="number"
                                min="0"
                                max="5"
                                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.guests ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-christian-accent/20'}`}
                                value={formData.guests}
                                onChange={handleChange}
                                disabled={submitted}
                            />
                            {errors.guests && <p className="text-red-500 text-sm mt-1">{errors.guests}</p>}
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2" htmlFor="dietaryRestrictions">
                                {t('rsvp.form.dietary')}
                            </label>
                            <textarea
                                id="dietaryRestrictions"
                                name="dietaryRestrictions"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-christian-accent/20"
                                rows="2"
                                placeholder={t('rsvp.form.dietaryPlaceholder')}
                                value={formData.dietaryRestrictions}
                                onChange={handleChange}
                                disabled={submitted}
                            ></textarea>
                        </div>
                    </>
                )}

                <div className="mb-6">
                    <label className="block text-gray-700 mb-2" htmlFor="message">
                        {t('rsvp.form.message')}
                    </label>
                    <textarea
                        id="message"
                        name="message"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-christian-accent/20"
                        rows="3"
                        placeholder={t('rsvp.form.messagePlaceholder')}
                        value={formData.message}
                        onChange={handleChange}
                        disabled={submitted}
                    ></textarea>
                </div>

                <div className="text-center">
                    <button
                        type="submit"
                        disabled={submitted}
                        className={`w-full py-3 px-6 rounded-full font-semibold transition-all duration-300 ${
                            submitted
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-christian-accent to-hindu-secondary text-white hover:shadow-lg'
                        }`}
                    >
                        {submitted ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                {t('rsvp.form.submitting')}
                            </span>
                        ) : (
                            t('rsvp.form.submit')
                        )}
                    </button>
                </div>
            </form>
        </motion.div>
    );
};

export default RSVPForm;
// src/components/rsvp/RSVPForm.js
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { mdiCheck, mdiClose } from '@mdi/js';
import Icon from '@mdi/react';
import { useLocation, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { sendRSVPEmail } from '../../utils/emailService';
import { useGuest } from '../../contexts/GuestContext';

const RSVPForm = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const ceremonySrc = queryParams.get('ceremony');

    // Use GuestContext to get ceremony access
    const { ceremonies: accessibleCeremonies } = useGuest();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        attending: 'yes',
        // Number of guests for each ceremony
        christianGuests: 0,
        hinduGuests: 0,
        // Dietary preference - vegetarian checkbox
        isVegetarian: false,
        message: '',
        // Track which ceremony they came from
        source: ceremonySrc || 'direct'
    });

    const [submitted, setSubmitted] = useState(false);
    const [showThankYou, setShowThankYou] = useState(false);
    const [errors, setErrors] = useState({});
    const [submitError, setSubmitError] = useState('');

    // Set initial guest counts based on ceremony source
    useEffect(() => {
        // If they came from a specific ceremony, set initial count to 1
        if (ceremonySrc === 'christian' && accessibleCeremonies.includes('christian')) {
            setFormData(prev => ({ ...prev, christianGuests: 1 }));
        } else if (ceremonySrc === 'hindu' && accessibleCeremonies.includes('hindu')) {
            setFormData(prev => ({ ...prev, hinduGuests: 1 }));
        }
    }, [ceremonySrc, accessibleCeremonies]);

    // Initialize form with ceremony source if provided
    // Note: Removed localStorage persistence for security - form data should not be cached
    useEffect(() => {
        if (ceremonySrc) {
            setFormData(prev => ({
                ...prev,
                source: ceremonySrc
            }));
        }

        // Clean up any old cached form data from localStorage
        localStorage.removeItem('weddingRSVPFormData');
        localStorage.removeItem('rsvpFormData');
    }, [ceremonySrc]);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else {
            // Improved email validation regex
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                newErrors.email = 'Please enter a valid email address';
            }
        }

        if (formData.attending === 'yes') {
            // Make sure they've entered guests for at least one ceremony they have access to
            const totalGuests = (accessibleCeremonies.includes('christian') ? formData.christianGuests : 0) +
                (accessibleCeremonies.includes('hindu') ? formData.hinduGuests : 0);

            if (totalGuests < 1) {
                newErrors.guests = 'Please enter at least 1 guest for at least one ceremony';
            }

            // Validate guest counts are not negative
            if (formData.christianGuests < 0) {
                newErrors.christianGuests = 'Guest count cannot be negative';
            }

            if (formData.hinduGuests < 0) {
                newErrors.hinduGuests = 'Guest count cannot be negative';
            }
        }

        return newErrors;
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newFormData = {
            ...formData,
            [name]: type === 'checkbox' ? checked :
                (type === 'number' ? parseInt(value) || 0 : value)
        };

        // Update state only (no localStorage caching for security)
        setFormData(newFormData);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitError('');

        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        setSubmitted(true);

        try {
            // Actually call the email service
            const result = await sendRSVPEmail(formData);

            if (result.success) {
                setShowThankYou(true);
                // Clear any cached form data
                localStorage.removeItem('weddingRSVPFormData');
                localStorage.removeItem('rsvpFormData');
                // Clear form state
                setFormData({
                    firstName: '',
                    lastName: '',
                    email: '',
                    phone: '',
                    attending: 'yes',
                    christianGuests: 0,
                    hinduGuests: 0,
                    isVegetarian: false,
                    message: '',
                    source: ceremonySrc || 'direct'
                });
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
                            First Name*
                        </label>
                        <input
                            id="firstName"
                            name="firstName"
                            type="text"
                            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.firstName ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-christian-accent/20'}`}
                            placeholder="First Name"
                            value={formData.firstName}
                            onChange={handleChange}
                            disabled={submitted}
                        />
                        {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-2" htmlFor="lastName">
                            Last Name*
                        </label>
                        <input
                            id="lastName"
                            name="lastName"
                            type="text"
                            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.lastName ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-christian-accent/20'}`}
                            placeholder="Last Name"
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
                        <div className="mb-6">
                            <label className="block text-gray-700 font-medium mb-3">
                                How many people will attend each ceremony?
                            </label>

                            <div className="space-y-4">
                                {accessibleCeremonies.includes('christian') && (
                                    <div className="p-4 border border-gray-200 rounded-lg bg-christian-primary/20">
                                        <div className="mb-2">
                                            <label className="font-medium text-gray-700">
                                                Christian Ceremony - {t('christian.dateTime.date')}
                                            </label>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <input
                                                type="number"
                                                name="christianGuests"
                                                min="0"
                                                max="10"
                                                value={formData.christianGuests}
                                                onChange={handleChange}
                                                disabled={submitted}
                                                className={`w-20 p-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.christianGuests ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-christian-accent/20'}`}
                                            />
                                            <span className="text-sm text-gray-600">people (enter 0 if not attending)</span>
                                        </div>
                                        {errors.christianGuests && <p className="text-red-500 text-sm mt-1">{errors.christianGuests}</p>}
                                    </div>
                                )}

                                {accessibleCeremonies.includes('hindu') && (
                                    <div className="p-4 border border-gray-200 rounded-lg bg-hindu-primary/20">
                                        <div className="mb-2">
                                            <label className="font-medium text-gray-700">
                                                Hindu Ceremony - {t('hindu.dateTime.date')}
                                            </label>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <input
                                                type="number"
                                                name="hinduGuests"
                                                min="0"
                                                max="10"
                                                value={formData.hinduGuests}
                                                onChange={handleChange}
                                                disabled={submitted}
                                                className={`w-20 p-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.hinduGuests ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-christian-accent/20'}`}
                                            />
                                            <span className="text-sm text-gray-600">people (enter 0 if not attending)</span>
                                        </div>
                                        {errors.hinduGuests && <p className="text-red-500 text-sm mt-1">{errors.hinduGuests}</p>}
                                    </div>
                                )}
                            </div>

                            {errors.guests && <p className="text-red-500 text-sm mt-2">{errors.guests}</p>}
                        </div>

                        <div className="mb-6">
                            <div className="flex items-center">
                                <input
                                    id="isVegetarian"
                                    name="isVegetarian"
                                    type="checkbox"
                                    checked={formData.isVegetarian}
                                    onChange={handleChange}
                                    disabled={submitted}
                                    className="h-5 w-5 text-christian-accent border-gray-300 rounded focus:ring-christian-accent"
                                />
                                <label htmlFor="isVegetarian" className="ml-2 block text-gray-700">
                                    Vegetarian meal preference
                                </label>
                            </div>
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
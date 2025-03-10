import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { mdiCheck, mdiClose } from '@mdi/js';
import Icon from '@mdi/react';

const RSVPForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        attending: 'yes',
        guests: 0,
        dietaryRestrictions: '',
        attendingChristian: true,
        attendingHindu: true,
        message: ''
    });

    const [submitted, setSubmitted] = useState(false);
    const [showThankYou, setShowThankYou] = useState(false);
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (formData.attending === 'yes' && formData.guests < 0) {
            newErrors.guests = 'Number of guests cannot be negative';
        }

        return newErrors;
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        setSubmitted(true);

        // Simulate API call
        setTimeout(() => {
            // Here you would normally send the data to your backend
            console.log('Form submitted with data:', formData);
            setShowThankYou(true);
        }, 1500);
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
                <h3 className="text-2xl font-bold mb-2">Thank You!</h3>
                <p className="text-gray-700 mb-4">
                    We've received your RSVP and can't wait to celebrate with you!
                </p>
                <button
                    onClick={() => {
                        setFormData({
                            name: '',
                            email: '',
                            phone: '',
                            attending: 'yes',
                            guests: 0,
                            dietaryRestrictions: '',
                            attendingChristian: true,
                            attendingHindu: true,
                            message: ''
                        });
                        setSubmitted(false);
                        setShowThankYou(false);
                        setErrors({});
                    }}
                    className="px-6 py-2 bg-christian-accent text-white rounded-full hover:shadow-md transition-shadow"
                >
                    Submit Another Response
                </button>
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
            <h2 className="text-2xl font-bold mb-6 text-center">RSVP</h2>

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2" htmlFor="name">
                        Full Name*
                    </label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.name ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-christian-accent/20'}`}
                        placeholder="Your name"
                        value={formData.name}
                        onChange={handleChange}
                        disabled={submitted}
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 mb-2" htmlFor="email">
                        Email Address*
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
                        Phone Number
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
                        Will you be attending?*
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
                            <span className="ml-2">Yes, I'll be there!</span>
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
                            <span className="ml-2">Sorry, I can't make it</span>
                        </label>
                    </div>
                </div>

                {formData.attending === 'yes' && (
                    <>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2" htmlFor="guests">
                                Number of Additional Guests
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
                            <label className="block text-gray-700 mb-2">
                                Which ceremonies will you attend?
                            </label>
                            <div className="flex flex-col space-y-2">
                                <label className="inline-flex items-center">
                                    <input
                                        type="checkbox"
                                        name="attendingChristian"
                                        checked={formData.attendingChristian}
                                        onChange={handleChange}
                                        disabled={submitted}
                                        className="form-checkbox text-christian-accent"
                                    />
                                    <span className="ml-2">Christian Ceremony (July 4)</span>
                                </label>
                                <label className="inline-flex items-center">
                                    <input
                                        type="checkbox"
                                        name="attendingHindu"
                                        checked={formData.attendingHindu}
                                        onChange={handleChange}
                                        disabled={submitted}
                                        className="form-checkbox text-hindu-secondary"
                                    />
                                    <span className="ml-2">Hindu Ceremony (July 5)</span>
                                </label>
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2" htmlFor="dietaryRestrictions">
                                Dietary Restrictions
                            </label>
                            <textarea
                                id="dietaryRestrictions"
                                name="dietaryRestrictions"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-christian-accent/20"
                                rows="2"
                                placeholder="Any food allergies or preferences we should know about?"
                                value={formData.dietaryRestrictions}
                                onChange={handleChange}
                                disabled={submitted}
                            ></textarea>
                        </div>
                    </>
                )}

                <div className="mb-6">
                    <label className="block text-gray-700 mb-2" htmlFor="message">
                        Message to the Couple
                    </label>
                    <textarea
                        id="message"
                        name="message"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-christian-accent/20"
                        rows="3"
                        placeholder="Share your wishes or any message for the couple..."
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
                                Submitting...
                            </span>
                        ) : (
                            'Submit RSVP'
                        )}
                    </button>
                </div>
            </form>
        </motion.div>
    );
};

export default RSVPForm;
// src/components/rsvp/RSVPPage.js
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import RSVPForm from './RSVPForm';
import BubbleBackground from '../common/BubbleBackground';
import { guestList } from '../../data/guestAccess'; // Import the guest list

const RSVPPage = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const ceremony = queryParams.get('ceremony');
    const [accessibleCeremonies, setAccessibleCeremonies] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Check if the user has access to any ceremonies
    useEffect(() => {
        const invitationCode = localStorage.getItem('invitationCode');

        if (invitationCode && guestList[invitationCode]) {
            // Set ceremonies this guest has access to
            setAccessibleCeremonies(guestList[invitationCode].ceremonies);
        } else {
            // Admin access or no access code
            const adminAccess = localStorage.getItem('adminAccess') === 'true';
            if (adminAccess) {
                setAccessibleCeremonies(['christian', 'hindu']);
            } else {
                setAccessibleCeremonies([]);
            }
        }

        setIsLoading(false);
    }, []);

    // If they don't have access to any ceremonies, redirect to home
    useEffect(() => {
        if (!isLoading && accessibleCeremonies.length === 0) {
            navigate('/');
        }

        // If they have access but specified a ceremony they don't have access to, redirect
        if (!isLoading && ceremony && !accessibleCeremonies.includes(ceremony)) {
            navigate('/rsvp');
        }
    }, [isLoading, accessibleCeremonies, ceremony, navigate]);

    // Determine gradient based on ceremony source or use blended gradient if not specified
    const getBgGradient = () => {
        if (ceremony === 'hindu') {
            return 'from-hindu-primary to-hindu-secondary/30';
        } else if (ceremony === 'christian') {
            return 'from-christian-primary to-christian-secondary/30';
        } else {
            // Blended gradient for general RSVP page
            return 'from-christian-primary via-white to-hindu-primary/30';
        }
    };

    // Determine colors for bubbles based on ceremony source or use mixed colors if not specified
    const getBubbleColors = () => {
        if (ceremony === 'hindu') {
            return ['#ffcb05', '#ff5722', '#9c27b0'];  // Hindu colors
        } else if (ceremony === 'christian') {
            return ['#fff', '#d4b08c', '#8c6c55'];    // Christian colors
        } else {
            // Mixed colors for general RSVP page
            return ['#fff', '#d4b08c', '#ffcb05', '#d93f0b'];
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin h-8 w-8 border-4 border-christian-accent rounded-full border-t-transparent"></div>
            </div>
        );
    }

    return (
        <section className={`pt-24 pb-20 bg-gradient-to-br ${getBgGradient()} relative overflow-hidden min-h-screen`}>
            {/* Decorative elements */}
            <BubbleBackground
                count={12}
                colors={getBubbleColors()}
                opacity={{ min: 0.03, max: 0.08 }}
            />

            <div className="container mx-auto max-w-2xl px-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl md:text-4xl font-bold text-center mb-6">
                        {t('rsvp.title')}
                    </h1>
                    {ceremony && (
                        <div className="text-center text-gray-700 mb-6">
                            {ceremony === 'christian'
                                ? t('christian.title')
                                : t('hindu.title')}
                            <span className="mx-2">•</span>
                            {ceremony === 'christian'
                                ? t('christian.dateTime.date')
                                : t('hindu.dateTime.date')}
                        </div>
                    )}
                </motion.div>

                <RSVPForm />
            </div>
        </section>
    );
};

export default RSVPPage;
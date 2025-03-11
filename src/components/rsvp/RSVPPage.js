// src/components/rsvp/RSVPPage.js
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import RSVPForm from './RSVPForm';
import BubbleBackground from '../common/BubbleBackground';

const RSVPPage = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const ceremony = queryParams.get('ceremony');

    // If accessed directly without a ceremony parameter, redirect to home
    useEffect(() => {
        if (!ceremony && location.pathname === '/rsvp') {
            // Could redirect to home or another page instead
            // navigate('/');
        }
    }, [ceremony, location.pathname, navigate]);

    // Determine gradient based on ceremony source
    const bgGradient = ceremony === 'hindu'
        ? 'from-hindu-primary to-hindu-secondary/30'
        : 'from-christian-primary to-christian-secondary/30';

    // Determine colors for bubbles based on ceremony source
    const bubbleColors = ceremony === 'hindu'
        ? ['#ffcb05', '#ff5722', '#9c27b0']  // Hindu colors
        : ['#fff', '#d4b08c', '#8c6c55'];    // Christian colors

    return (
        <section className={`pt-24 pb-20 bg-gradient-to-br ${bgGradient} relative overflow-hidden min-h-screen`}>
            {/* Decorative elements */}
            <BubbleBackground
                count={12}
                colors={bubbleColors}
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
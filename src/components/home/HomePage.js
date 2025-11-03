// src/components/home/HomePage.js
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { mdiCalendarCheck, mdiHeart, mdiArrowRight } from '@mdi/js';
import Icon from '@mdi/react';
import Hero from './Hero';

const HomePage = () => {
    const { t } = useTranslation();

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            {/* Hero Section */}
            <Hero />

            {/* Prominent RSVP Call-to-Action Section */}
            <section className="relative py-20 px-4 bg-gradient-to-br from-christian-primary/10 via-white to-hindu-primary/10 overflow-hidden">
                {/* Decorative background elements */}
                <motion.div
                    className="absolute top-10 left-10 w-32 h-32 rounded-full bg-christian-accent/10"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <motion.div
                    className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-hindu-secondary/10"
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1
                    }}
                />

                <div className="relative z-10 max-w-4xl mx-auto text-center">
                    {/* Decorative icon */}
                    <motion.div
                        className="mb-6 flex justify-center"
                        initial={{ scale: 0, rotate: -180 }}
                        whileInView={{ scale: 1, rotate: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-christian-accent to-hindu-secondary rounded-full blur-lg opacity-50"></div>
                            <div className="relative w-20 h-20 bg-gradient-to-br from-christian-accent to-hindu-secondary rounded-full flex items-center justify-center">
                                <Icon path={mdiCalendarCheck} size={2} className="text-white" />
                            </div>
                        </div>
                    </motion.div>

                    {/* Heading */}
                    <motion.h2
                        className="text-4xl md:text-5xl font-display font-bold mb-4 bg-gradient-to-r from-christian-accent via-wedding-love to-hindu-secondary bg-clip-text text-transparent"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        {t('home.rsvp.title')}
                    </motion.h2>

                    {/* Description */}
                    <motion.p
                        className="text-lg md:text-xl text-gray-700 mb-8 max-w-2xl mx-auto leading-relaxed"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                    >
                        {t('home.rsvp.description')}
                    </motion.p>

                    {/* CTA Button */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                    >
                        <Link
                            to="/rsvp"
                            className="group inline-flex items-center gap-3 px-10 py-5 text-lg font-semibold text-white bg-gradient-to-r from-christian-accent via-wedding-love to-hindu-secondary rounded-full shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                        >
                            <Icon path={mdiHeart} size={1} className="group-hover:animate-pulse" />
                            <span>{t('home.rsvp.button')}</span>
                            <Icon path={mdiArrowRight} size={1} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </motion.div>

                    {/* Additional info */}
                    <motion.p
                        className="mt-6 text-sm text-gray-600"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 }}
                    >
                        {t('home.rsvp.reminder')}
                    </motion.p>
                </div>
            </section>
        </motion.div>
    );
};

export default HomePage;
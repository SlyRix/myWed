// src/components/welcome/WelcomeSplash.js
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { mdiHeart } from '@mdi/js';
import Icon from '@mdi/react';

const WelcomeSplash = ({ onComplete }) => {
    const { t } = useTranslation();
    const [isVisible, setIsVisible] = useState(true);

    // Auto-proceed after a delay
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);

            // Give time for exit animation before calling onComplete
            setTimeout(() => {
                onComplete();
            }, 800);
        }, 3500); // Show splash for 3.5 seconds

        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="fixed inset-0 flex items-center justify-center z-50 bg-gradient-to-br from-christian-accent to-hindu-secondary"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <motion.div
                        className="text-center px-4"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <motion.div
                            className="inline-block mb-6"
                            animate={{
                                scale: [1, 1.2, 1],
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                repeatType: "reverse"
                            }}
                        >
                            <Icon path={mdiHeart} size={4} className="text-white" />
                        </motion.div>

                        <motion.h1
                            className="text-4xl md:text-6xl font-script text-white mb-4"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                        >
                            Welcome to Our Wedding
                        </motion.h1>

                        <motion.div
                            className="text-3xl md:text-5xl font-bold text-white mb-6"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.8, duration: 0.8 }}
                        >
                            Rushel <span className="mx-2">&</span> Sivani
                        </motion.div>

                        <motion.div
                            className="text-xl text-white/90"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 1.2, duration: 0.8 }}
                        >
                            {t('home.date')}
                        </motion.div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default WelcomeSplash;
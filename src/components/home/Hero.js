// src/components/home/Hero.js
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { mdiHeart } from '@mdi/js';
import Icon from '@mdi/react';
import { useTranslation } from 'react-i18next';
import CountdownTimer from '../common/CountdownTimer';
import BubbleBackground from '../common/BubbleBackground';

import { getPageContent } from '../../api/contentApi';
import { COUNTDOWN_DATE } from '../../config/wedding';

// Fallback SVG pattern - only used if external SVG isn't available
const FloralPatternSVG = () => (
    <svg className="absolute inset-0 w-full h-full z-0 opacity-10" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <pattern id="floral-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M20 0c2.21 0 4 1.79 4 4s-1.79 4-4 4-4-1.79-4-4 1.79-4 4-4zm0 32c2.21 0 4 1.79 4 4s-1.79 4-4 4-4-1.79-4-4 1.79-4 4-4zM4 16c2.21 0 4 1.79 4 4s-1.79 4-4 4-4-1.79-4-4 1.79-4 4-4zm32 0c2.21 0 4 1.79 4 4s-1.79 4-4 4-4-1.79-4-4 1.79-4 4-4z" fill="white" fillOpacity="0.2"/>
                <path d="M20 16l4 4-4 4-4-4 4-4zm0-16l4 4-4 4-4-4 4-4zm0 32l4 4-4 4-4-4 4-4z" fill="white" fillOpacity="0.3"/>
            </pattern>
        </defs>
        <rect x="0" y="0" width="100%" height="100%" fill="url(#floral-pattern)" />
    </svg>
);

const ParallaxElements = () => {
    return (
        <>
            {/* Floating decorative elements with parallax effect */}
            <motion.div
                className="absolute left-[10%] top-[20%] w-32 h-32 rounded-full bg-christian-accent opacity-10"
                animate={{
                    y: [0, -30, 0],
                    scale: [1, 1.1, 1],
                    opacity: [0.1, 0.15, 0.1]
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                initial="initial"
                whileInView="animate"
            />

            <motion.div
                className="absolute right-[15%] top-[30%] w-24 h-24 rounded-full bg-hindu-secondary opacity-10"
                animate={{
                    y: [0, 40, 0],
                    scale: [1, 0.9, 1],
                    opacity: [0.1, 0.2, 0.1]
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                }}
                initial="initial"
                whileInView="animate"
            />

            <motion.div
                className="absolute left-[25%] bottom-[25%] w-40 h-40 rounded-full bg-wedding-love opacity-5"
                animate={{
                    y: [0, -20, 0],
                    x: [0, 20, 0],
                    scale: [1, 1.2, 1],
                    opacity: [0.05, 0.1, 0.05]
                }}
                transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2
                }}
                initial="initial"
                whileInView="animate"
            />

            <motion.div
                className="absolute right-[20%] bottom-[20%] w-36 h-36 rounded-full bg-wedding-gold opacity-10"
                animate={{
                    y: [0, 30, 0],
                    x: [0, -30, 0],
                    scale: [1, 0.8, 1],
                    opacity: [0.1, 0.05, 0.1]
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 3
                }}
                initial="initial"
                whileInView="animate"
            />
        </>
    );
};

const Hero = ({ backgroundImage: propBackgroundImage = null, patternImage: propPatternImage = "/images/floral-pattern.svg" }) => {
    const { t } = useTranslation();
    const [cmsContent, setCmsContent] = useState(null);

    // Wedding date from centralized config
    const weddingDate = COUNTDOWN_DATE.getTime();

    // Load CMS content on mount
    useEffect(() => {
        const loadContent = async () => {
            try {
                const data = await getPageContent('home');
                if (data && data.content && data.content.hero) {
                    setCmsContent(data.content.hero);
                }
            } catch (error) {
                if (process.env.NODE_ENV === 'development') {
                    console.error('Failed to load CMS content, using defaults:', error);
                }
            }
        };
        loadContent();
    }, []);

    // Use CMS content if available, otherwise use props
    const backgroundImage = cmsContent?.backgroundImage || propBackgroundImage;
    const patternImage = cmsContent?.patternImage || propPatternImage;

    // Check if pattern image exists by creating an image object
    const [patternExists, setPatternExists] = useState(false);

    useEffect(() => {
        if (patternImage) {
            const img = new Image();
            img.onload = () => setPatternExists(true);
            img.onerror = () => setPatternExists(false);
            img.src = patternImage;
        }
    }, [patternImage]);

    return (
        <section className="relative h-screen w-full flex flex-col items-center justify-center text-white overflow-hidden">
            {/* Background - conditionally show image or gradient */}
            {backgroundImage ? (
                // If background image is provided, show it
                <div className="absolute inset-0 z-0">
                    <img
                        src={backgroundImage}
                        alt="Wedding background"
                        className="w-full h-full object-cover"
                    />
                </div>
            ) : (
                // Otherwise show a gradient background
                <div className="absolute inset-0 bg-christian-accent/85 z-0"></div>
            )}

            {/* Overlay to ensure text readability */}
            <div className="absolute inset-0 bg-black/30 z-5"></div>

            {/* Decorative pattern overlay - use external SVG if it exists, otherwise use inline SVG */}
            {patternExists ? (
                <div
                    className="absolute inset-0 z-10 opacity-10"
                    style={{
                        backgroundImage: `url(${patternImage})`,
                        backgroundSize: '600px 600px'
                    }}
                ></div>
            ) : (
                <FloralPatternSVG />
            )}

            {/* Animated Bubble Background */}
            <BubbleBackground
                count={15}
                colors={['#1a3a5c', '#d4af37', '#e8d48b', '#faf9f6']}
                mouseInteraction={true}
            />

            {/* Parallax floating elements */}
            <ParallaxElements />

            <motion.div
                className="relative z-20 text-center px-4 max-w-3xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
            >
                <h1 className="font-script text-5xl md:text-7xl mb-3 text-white text-shadow-lg">
                    {t('home.title')}
                </h1>
                <p className="text-xl md:text-2xl mb-6 text-white/90 font-display italic tracking-wide">
                    {t('home.date')}
                </p>

                {/* Welcome text moved from about section to hero */}
                <div className="mb-8 text-white max-w-2xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-bold mb-3 text-white text-shadow">{t('home.welcomeTitle')}</h2>
                    <p className="text-white/90 leading-relaxed text-shadow-sm">
                        {t('home.welcomeText')}
                    </p>
                </div>

                <div className="mb-10">
                    <CountdownTimer targetDate={weddingDate} />
                </div>

                {/* Gold ornamental divider */}
                <div className="flex items-center justify-center mb-8">
                    <div className="h-px w-16 bg-wedding-gold/50"></div>
                    <div className="mx-3 w-1.5 h-1.5 rounded-full bg-wedding-love"></div>
                    <div className="h-px w-16 bg-wedding-gold/50"></div>
                </div>

                {/* RSVP Button with gold accent */}
                <Link
                    to="/rsvp"
                    className="group inline-flex items-center gap-3 px-10 py-4 text-lg font-semibold text-white bg-christian-accent rounded-full shadow-lg hover:shadow-[0_8px_30px_rgba(212,175,55,0.3)] transform hover:scale-105 transition-all duration-300 ring-2 ring-wedding-love/30 ring-offset-2 ring-offset-transparent"
                >
                    <Icon path={mdiHeart} size={1} className="text-wedding-gold group-hover:animate-pulse" />
                    <span>{t('home.rsvp.button')}</span>
                </Link>
            </motion.div>

        </section>
    );
};

Hero.propTypes = {
    backgroundImage: PropTypes.string,
    patternImage: PropTypes.string
};

Hero.defaultProps = {
    backgroundImage: null,
    patternImage: '/images/floral-pattern.svg'
};

export default Hero;
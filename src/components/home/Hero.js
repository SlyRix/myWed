// src/components/home/Hero.js
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { mdiChevronDown } from '@mdi/js';
import Icon from '@mdi/react';
import { useTranslation } from 'react-i18next';
import CountdownTimer from '../common/CountdownTimer';
import BubbleBackground from '../common/BubbleBackground';

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

const Hero = ({ backgroundImage = null, patternImage = "/images/floral-pattern.svg" }) => {
    const { t } = useTranslation();

    // Wedding date - July 4, 2026
    const weddingDate = new Date('May 9, 2026 14:00:00').getTime();

    // Check if pattern image exists by creating an image object
    const [patternExists, setPatternExists] = React.useState(false);

    React.useEffect(() => {
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
                <div className="absolute inset-0 bg-gradient-to-br from-christian-accent/90 to-hindu-accent/80 z-0"></div>
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
                colors={['#d4b08c', '#f0b429', '#d93f0b', '#fff']}
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
                <p className="text-xl md:text-2xl mb-8 text-white/90 font-display italic tracking-wide">
                    {t('home.date')}
                </p>

                <div className="mb-10">
                    <CountdownTimer targetDate={weddingDate} />
                </div>

                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Link to="/christian-ceremony" className="btn btn-primary btn-christian">
                        {t('header.christianCeremony')}
                    </Link>
                    <Link to="/hindu-ceremony" className="btn btn-primary btn-hindu">
                        {t('header.hinduCeremony')}
                    </Link>
                </div>
            </motion.div>

            <motion.a
                href="#about-section"
                className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white opacity-80 hover:opacity-100 transition-opacity w-10 h-10 flex items-center justify-center z-20"
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
            >
                <Icon path={mdiChevronDown} size={1.5} />
            </motion.a>
        </section>
    );
};

export default Hero;
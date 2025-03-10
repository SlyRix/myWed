import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { mdiChevronDown } from '@mdi/js';
import Icon from '@mdi/react';
import CountdownTimer from '../common/CountdownTimer';

const Hero = () => {
    // Wedding date - July 4, 2026
    const weddingDate = new Date('July 4, 2026 14:00:00').getTime();

    return (
        <section className="relative h-screen w-full flex flex-col items-center justify-center text-white bg-gradient-to-r from-christian-accent/90 to-hindu-secondary/90">
            {/* Note: Background image removed to avoid the error */}

            <motion.div
                className="relative z-10 text-center px-4 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
            >
                <h1 className="text-4xl md:text-6xl font-bold mb-4 font-primary">

                    Rushel & Sivani<br />are getting married
                </h1>
                <p className="text-xl md:text-2xl mb-8 opacity-90">Summer 2026</p>

                <div className="mb-10">
                    <CountdownTimer targetDate={weddingDate} />
                </div>

                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Link
                        to="/christian-ceremony"
                        className="inline-block py-3 px-6 rounded-full font-semibold bg-christian-accent text-white transition-all duration-300 relative overflow-hidden z-10 hover:shadow-lg"
                    >
                        Christian Ceremony
                        <span className="absolute bottom-0 left-0 w-full h-0 bg-white/20 transition-all duration-300 -z-10 hover:h-full"></span>
                    </Link>
                    <Link
                        to="/hindu-ceremony"
                        className="inline-block py-3 px-6 rounded-full font-semibold bg-hindu-secondary text-white transition-all duration-300 relative overflow-hidden z-10 hover:shadow-lg"
                    >
                        Hindu Ceremony
                        <span className="absolute bottom-0 left-0 w-full h-0 bg-white/20 transition-all duration-300 -z-10 hover:h-full"></span>
                    </Link>
                </div>
            </motion.div>

            <motion.a
                href="#about-section"
                className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white opacity-80 hover:opacity-100 transition-opacity w-10 h-10 flex items-center justify-center"
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
            >
                <Icon path={mdiChevronDown} size={1.5} />
            </motion.a>
        </section>
    );
};

export default Hero;
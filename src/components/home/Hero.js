import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { mdiChevronDown } from '@mdi/js';
import Icon from '@mdi/react';
import CountdownTimer from '../common/CountdownTimer';
import '../../styles/components/hero.css';

const Hero = () => {
    // Wedding date - July 4, 2026
    const weddingDate = new Date('July 4, 2026 14:00:00').getTime();

    return (
        <section className="hero">
            <motion.div
                className="hero-content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
            >
                <h1>Christian & Hindu<br />are getting married</h1>
                <p>Summer 2026</p>

                <CountdownTimer targetDate={weddingDate} />

                <div className="hero-buttons">
                    <Link to="/christian-ceremony" className="btn christian-btn">Christian Ceremony</Link>
                    <Link to="/hindu-ceremony" className="btn hindu-btn">Hindu Ceremony</Link>
                </div>
            </motion.div>

            <motion.a
                href="#about-section"
                className="scroll-down"
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
            >
                <Icon path={mdiChevronDown} size={1.5} />
            </motion.a>
        </section>
    );
};

export default Hero;
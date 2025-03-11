// src/components/home/HomePage.js
import React from 'react';
import { motion } from 'framer-motion';
import Hero from './Hero';

const HomePage = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            {/* Only keep the Hero component and remove everything else */}
            <Hero />
        </motion.div>
    );
};

export default HomePage;
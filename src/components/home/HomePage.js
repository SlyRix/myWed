// src/components/home/HomePage.js
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Hero from './Hero';

const ExploreHint = ({ onClose }) => (
    <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ duration: 0.4 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-white rounded-2xl shadow-2xl border border-gray-100 px-5 py-4 flex items-center gap-4 max-w-sm w-[90vw]"
    >
        <span className="text-2xl">🎉</span>
        <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-800 text-sm leading-tight">You're all set!</p>
            <p className="text-gray-500 text-xs mt-0.5">Explore our ceremony pages, gallery & more.</p>
        </div>
        <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-lg leading-none flex-shrink-0"
            aria-label="Dismiss"
        >
            ✕
        </button>
    </motion.div>
);

const HomePage = () => {
    const [showHint, setShowHint] = useState(false);

    useEffect(() => {
        if (localStorage.getItem('showExploreHint') === 'true') {
            localStorage.removeItem('showExploreHint');
            setShowHint(true);
            setTimeout(() => setShowHint(false), 8000);
        }
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <Hero />
            <AnimatePresence>
                {showHint && <ExploreHint onClose={() => setShowHint(false)} />}
            </AnimatePresence>
        </motion.div>
    );
};

export default HomePage;

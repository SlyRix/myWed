import React from 'react';
import { motion } from 'framer-motion';

const GalleryItem = ({ photo, onClick }) => {
    return (
        <motion.div
            className="relative h-48 overflow-hidden rounded-lg cursor-pointer shadow-md"
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.3 }}
            onClick={onClick}
        >
            <img
                src={photo.src}
                alt={photo.alt}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="text-white text-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </span>
            </div>
        </motion.div>
    );
};

export default GalleryItem;
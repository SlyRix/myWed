// src/components/common/ResponsiveCeremonyImage.js
import React, { useState } from 'react';
import { motion } from 'framer-motion';

/**
 * Responsive image component that automatically adapts to portrait or landscape orientation
 * @param {Object} props
 * @param {string} props.src - Image source URL
 * @param {string} props.alt - Alt text for the image
 * @param {string} props.className - Additional CSS classes
 * @param {number} props.delay - Animation delay in seconds
 */
const ResponsiveCeremonyImage = ({ src, alt, className = '', delay = 0.2 }) => {
    const [imageOrientation, setImageOrientation] = useState('loading');
    const [imageLoaded, setImageLoaded] = useState(false);

    const handleImageLoad = (e) => {
        const img = e.target;
        const aspectRatio = img.naturalWidth / img.naturalHeight;

        // Determine orientation based on aspect ratio
        // Portrait: ratio < 0.9 (roughly less than 9:10)
        // Landscape: ratio > 1.1 (roughly more than 10:9)
        // Square: between 0.9 and 1.1
        if (aspectRatio < 0.9) {
            setImageOrientation('portrait');
        } else if (aspectRatio > 1.1) {
            setImageOrientation('landscape');
        } else {
            setImageOrientation('square');
        }

        setImageLoaded(true);
    };

    // Container classes based on orientation
    const getContainerClasses = () => {
        const baseClasses = 'rounded-lg overflow-hidden shadow-lg relative';

        switch (imageOrientation) {
            case 'portrait':
                // Portrait images: constrain width, allow natural height (with max)
                // Mobile: smaller max-width for better fit
                return `${baseClasses} w-full max-w-[280px] sm:max-w-sm md:max-w-md mx-auto h-auto max-h-[500px] sm:max-h-[550px] md:max-h-[600px]`;
            case 'landscape':
                // Landscape images: full width with responsive height
                // Mobile: shorter height for better viewing
                return `${baseClasses} w-full h-[280px] sm:h-[350px] md:h-[400px] lg:h-[450px]`;
            case 'square':
                // Square images: balanced dimensions across all screens
                return `${baseClasses} w-full h-[280px] sm:h-[350px] md:h-[400px] lg:h-[450px]`;
            default:
                // Loading state: placeholder dimensions
                return `${baseClasses} w-full h-[280px] sm:h-[350px] md:h-[400px]`;
        }
    };

    // Image classes based on orientation
    const getImageClasses = () => {
        const baseClasses = 'transition-transform duration-500 hover:scale-105';

        switch (imageOrientation) {
            case 'portrait':
                // Portrait: contain to show full image without cropping
                return `${baseClasses} w-full h-full object-contain bg-gradient-to-br from-gray-50 to-gray-100`;
            case 'landscape':
                // Landscape: cover to fill the space
                return `${baseClasses} w-full h-full object-cover`;
            case 'square':
                // Square: cover with centered positioning
                return `${baseClasses} w-full h-full object-cover object-center`;
            default:
                // Loading: basic cover
                return `${baseClasses} w-full h-full object-cover`;
        }
    };

    return (
        <motion.div
            className={`${getContainerClasses()} ${className}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{
                opacity: imageLoaded ? 1 : 0.5,
                scale: imageLoaded ? 1 : 0.95
            }}
            transition={{ duration: 0.8, delay }}
        >
            {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                    <div className="animate-pulse text-gray-400 text-sm sm:text-base">Loading...</div>
                </div>
            )}
            <img
                src={src}
                alt={alt}
                className={getImageClasses()}
                onLoad={handleImageLoad}
                loading="lazy"
            />
            {imageOrientation === 'portrait' && imageLoaded && (
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/5 via-transparent to-transparent" />
            )}
        </motion.div>
    );
};

export default ResponsiveCeremonyImage;

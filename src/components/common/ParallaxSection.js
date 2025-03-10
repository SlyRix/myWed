// src/components/common/ParallaxSection.js
import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import useWindowSize from '../../hooks/useWindowSize';

const ParallaxSection = ({
                             children,
                             bgImage = null,
                             speed = 0.2,
                             bgColor = null,
                             bubbles = false,
                             overlay = false,
                             overlayOpacity = 0.3,
                             overlayColor = '#000',
                             className = '',
                             height = 'min-h-screen', // Default to full viewport height
                             withBubbleBackground = false
                         }) => {
    const ref = useRef(null);
    const { scrollY } = useScroll();
    const windowSize = useWindowSize();
    const [elementTop, setElementTop] = useState(0);
    const [elementHeight, setElementHeight] = useState(0);

    useEffect(() => {
        if (!ref.current) return;

        const updatePosition = () => {
            const element = ref.current;
            const { top, height } = element.getBoundingClientRect();
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            setElementTop(top + scrollTop);
            setElementHeight(height);
        };

        updatePosition();
        window.addEventListener('resize', updatePosition);

        return () => window.removeEventListener('resize', updatePosition);
    }, [ref, windowSize]);

    // Calculate parallax effect
    const y = useTransform(
        scrollY,
        [elementTop - windowSize.height, elementTop + elementHeight],
        [speed * 100, -speed * 100]
    );

    return (
        <motion.section
            ref={ref}
            className={`relative overflow-hidden ${height} ${className}`}
            style={{ backgroundColor: bgColor }}
        >
            {/* Parallax Background */}
            {bgImage && (
                <motion.div
                    className="absolute inset-0 w-full h-full"
                    style={{ y, backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                />
            )}

            {/* Optional overlay */}
            {overlay && (
                <div
                    className="absolute inset-0 w-full h-full"
                    style={{ backgroundColor: overlayColor, opacity: overlayOpacity }}
                />
            )}

            {/* Bubble effect if enabled */}
            {bubbles && withBubbleBackground && (
                <div className="absolute inset-0">
                    {/* Import and include BubbleBackground here if needed */}
                </div>
            )}

            {/* Content */}
            <div className="relative z-10 h-full">
                {children}
            </div>
        </motion.section>
    );
};

export default ParallaxSection;
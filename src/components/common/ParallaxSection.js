import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import useWindowSize from '../../hooks/useWindowSize';

const ParallaxSection = ({
                             children,
                             bgImage = null,
                             speed = 0.5, // Increased from 0.2 for more noticeable effect
                             bgColor = null,
                             bubbles = false,
                             overlay = false,
                             overlayOpacity = 0.3,
                             overlayColor = '#000',
                             className = '',
                             height = 'min-h-screen'
                         }) => {
    const ref = useRef(null);
    const windowSize = useWindowSize();
    const [elementTop, setElementTop] = useState(0);
    const [elementHeight, setElementHeight] = useState(0);
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        if (!ref.current) return;

        const updatePosition = () => {
            const element = ref.current;
            const { top, height } = element.getBoundingClientRect();
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            setElementTop(top + scrollTop);
            setElementHeight(height);
            setScrollY(scrollTop);
        };

        updatePosition();
        window.addEventListener('resize', updatePosition);
        window.addEventListener('scroll', updatePosition); // Added scroll event listener

        return () => {
            window.removeEventListener('resize', updatePosition);
            window.removeEventListener('scroll', updatePosition);
        };
    }, [ref, windowSize]);

    // Calculate parallax offset manually instead of using useTransform
    const calculateParallaxY = () => {
        if (!elementHeight) return 0;

        const relativeScroll = scrollY - (elementTop - windowSize.height);
        const percentageScrolled = relativeScroll / (elementHeight + windowSize.height);

        // Limit the range to avoid extreme movements
        const limitedPercentage = Math.max(0, Math.min(1, percentageScrolled));

        // Calculate y position - starts at negative position (moving up) and ends at positive (moving down)
        return -speed * 100 + (limitedPercentage * speed * 200);
    };

    const yOffset = calculateParallaxY();

    return (
        <section
            ref={ref}
            className={`relative overflow-hidden ${height} ${className}`}
            style={{ backgroundColor: bgColor }}
        >
            {/* Parallax Background */}
            {bgImage && (
                <div
                    className="absolute inset-0 w-full h-[120%]" // Made taller to avoid seeing edges during parallax
                    style={{
                        transform: `translateY(${yOffset}px)`,
                        backgroundImage: `url(${bgImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        transition: 'transform 0.1s ease-out' // Smooth the movement slightly
                    }}
                />
            )}

            {/* Optional overlay */}
            {overlay && (
                <div
                    className="absolute inset-0 w-full h-full"
                    style={{ backgroundColor: overlayColor, opacity: overlayOpacity }}
                />
            )}

            {/* Content */}
            <div className="relative z-10 h-full">
                {children}
            </div>
        </section>
    );
};

export default ParallaxSection;
// src/components/common/BubbleBackground.js - Consolidated version
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const BubbleBackground = ({
                              count = 10,
                              colors = ['#d4b08c', '#f0b429', '#d93f0b'],
                              size = { min: 50, max: 200 },
                              duration = { min: 10, max: 25 },
                              opacity = { min: 0.03, max: 0.08 },
                              mouseInteraction = false,
                              mouseStrength = 20 // How much bubbles follow the mouse
                          }) => {
    const [bubbles, setBubbles] = useState([]);
    const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
    const [windowSize, setWindowSize] = useState({
        width: typeof window !== 'undefined' ? window.innerWidth : 0,
        height: typeof window !== 'undefined' ? window.innerHeight : 0,
    });

    // Handle window resize
    useEffect(() => {
        if (mouseInteraction) {
            const handleResize = () => {
                setWindowSize({
                    width: window.innerWidth,
                    height: window.innerHeight,
                });
            };

            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
        }
    }, [mouseInteraction]);

    // Handle mouse movement
    useEffect(() => {
        if (mouseInteraction) {
            const handleMouseMove = (e) => {
                // Calculate mouse position as a percentage of screen size
                const x = e.clientX / windowSize.width;
                const y = e.clientY / windowSize.height;
                setMousePosition({ x, y });
            };

            window.addEventListener('mousemove', handleMouseMove);
            return () => window.removeEventListener('mousemove', handleMouseMove);
        }
    }, [mouseInteraction, windowSize]);

    useEffect(() => {
        // Generate random bubbles on component mount
        const newBubbles = Array.from({ length: count }).map((_, index) => {
            // Generate random properties for each bubble
            const bubbleSize = Math.random() * (size.max - size.min) + size.min;
            const animDuration = Math.random() * (duration.max - duration.min) + duration.min;
            const bubbleOpacity = Math.random() * (opacity.max - opacity.min) + opacity.min;
            const color = colors[Math.floor(Math.random() * colors.length)];

            // Random positions
            const xPos = Math.random() * 100; // % of container width
            const yPos = Math.random() * 100; // % of container height

            // Random movement range
            const xRange = 10 + Math.random() * 15; // move 10-25% of container
            const yRange = 10 + Math.random() * 15; // move 10-25% of container

            // Random delays so they don't all move at once
            const delay = Math.random() * 5;

            // Responsiveness to mouse movement (only used if mouseInteraction is true)
            const mouseResponse = 0.3 + Math.random() * 0.7; // Between 0.3 and 1.0

            return {
                id: index,
                size: bubbleSize,
                opacity: bubbleOpacity,
                color,
                xPos,
                yPos,
                xRange,
                yRange,
                duration: animDuration,
                delay,
                mouseResponse
            };
        });

        setBubbles(newBubbles);
    }, [count, colors, size.max, size.min, duration.max, duration.min, opacity.max, opacity.min]);

    // Calculate mouse offset for bubbles
    const getMouseOffset = (bubble) => {
        if (!mouseInteraction) return { mouseX: 0, mouseY: 0 };

        // Bubbles move towards the mouse position
        const mouseX = (mousePosition.x - 0.5) * mouseStrength * bubble.mouseResponse;
        const mouseY = (mousePosition.y - 0.5) * mouseStrength * bubble.mouseResponse;

        return { mouseX, mouseY };
    };

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {bubbles.map(bubble => {
                const { mouseX, mouseY } = getMouseOffset(bubble);

                return (
                    <motion.div
                        key={bubble.id}
                        className="absolute rounded-full"
                        style={{
                            width: bubble.size,
                            height: bubble.size,
                            backgroundColor: bubble.color,
                            opacity: bubble.opacity,
                            left: `${bubble.xPos}%`,
                            top: `${bubble.yPos}%`,
                        }}
                        animate={mouseInteraction ? {
                            x: [mouseX, bubble.xRange + mouseX, mouseX, -bubble.xRange + mouseX, mouseX],
                            y: [mouseY, -bubble.yRange + mouseY, mouseY, bubble.yRange + mouseY, mouseY],
                            scale: [1, 1.05, 1, 0.95, 1],
                            opacity: [bubble.opacity, bubble.opacity * 1.2, bubble.opacity, bubble.opacity * 0.9, bubble.opacity]
                        } : {
                            x: [0, bubble.xRange, 0, -bubble.xRange, 0],
                            y: [0, -bubble.yRange, 0, bubble.yRange, 0],
                            scale: [1, 1.05, 1, 0.95, 1],
                            opacity: [bubble.opacity, bubble.opacity * 1.2, bubble.opacity, bubble.opacity * 0.9, bubble.opacity]
                        }}
                        transition={{
                            repeat: Infinity,
                            duration: bubble.duration,
                            delay: bubble.delay,
                            ease: "easeInOut"
                        }}
                    />
                );
            })}
        </div>
    );
};

export default BubbleBackground;
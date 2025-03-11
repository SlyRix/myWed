// src/components/common/BubbleBackground.js
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const BubbleBackground = ({
                              count = 10,
                              colors = ['#d4b08c', '#f0b429', '#d93f0b'],
                              size = { min: 50, max: 200 },
                              duration = { min: 10, max: 25 },
                              opacity = { min: 0.03, max: 0.08 }
                          }) => {
    const [bubbles, setBubbles] = useState([]);

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
            const xRange = 10 + Math.random() * 15; // Reduced range to 10-25% (was 20-40%)
            const yRange = 10 + Math.random() * 15; // Reduced range to 10-25% (was 20-40%)

            // Random delays so they don't all move at once
            const delay = Math.random() * 5;

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
                delay
            };
        });

        setBubbles(newBubbles);
    }, [count, colors, size.max, size.min, duration.max, duration.min, opacity.max, opacity.min]);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {bubbles.map(bubble => (
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
                    animate={{
                        x: [0, bubble.xRange, 0, -bubble.xRange, 0],
                        y: [0, -bubble.yRange, 0, bubble.yRange, 0],
                        scale: [1, 1.05, 1, 0.95, 1], // Reduced scale changes (was 1.1, 0.9)
                        opacity: [
                            bubble.opacity,
                            bubble.opacity * 1.2, // Reduced opacity fluctuation (was 1.5)
                            bubble.opacity,
                            bubble.opacity * 0.9, // Reduced opacity fluctuation (was 0.8)
                            bubble.opacity
                        ]
                    }}
                    transition={{
                        repeat: Infinity,
                        duration: bubble.duration,
                        delay: bubble.delay,
                        ease: "easeInOut"
                    }}
                />
            ))}
        </div>
    );
};

export default BubbleBackground;
import React from 'react';
import { motion } from 'framer-motion';

const CeremonyTimeline = ({ events, theme }) => {
    const timelineItem = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    // Determine theme-based styling
    const getThemeColors = () => {
        if (theme === 'christian') {
            return {
                line: 'bg-christian-accent',
                dot: 'border-christian-accent',
                textColor: 'text-christian-accent',
                titleColor: 'text-christian-text'
            };
        } else { // hindu theme
            return {
                line: 'bg-hindu-secondary',
                dot: 'border-hindu-secondary',
                textColor: 'text-hindu-secondary',
                titleColor: 'text-hindu-text'
            };
        }
    };

    const colors = getThemeColors();

    return (
        <div className="relative py-8">
            {/* Center line (visible on md screens and up) */}
            <div className={`absolute h-full w-1 ${colors.line} left-1/2 -translate-x-1/2 hidden md:block`}></div>

            {/* Timeline items */}
            <div className="relative">
                {events.map((event, index) => {
                    // Calculate staggered positions for overlapping effect
                    const topPosition = `${index * 220 - (index > 0 ? index * 50 : 0)}px`;
                    const isLeftSide = index % 2 === 0;

                    return (
                        <motion.div
                            key={index}
                            className="relative mb-8 md:mb-0"
                            variants={timelineItem}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                        >
                            {/* Content box */}
                            <div
                                className={`md:absolute md:w-[45%] p-5 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ${
                                    isLeftSide ? 'md:left-0 md:text-right' : 'md:right-0'
                                }`}
                                style={{
                                    top: topPosition,
                                    zIndex: index % 3 + 1 // Vary z-index to create visual interest
                                }}
                            >
                                <div className={`${colors.textColor} font-bold mb-2`}>{event.time}</div>
                                <h3 className={`text-lg font-bold mb-2 ${colors.titleColor}`}>{event.title}</h3>
                                <p className="text-gray-600">{event.description}</p>
                            </div>

                            {/* Timeline dots - visible only on md screens and up */}
                            <div
                                className={`hidden md:absolute md:block top-6 md:top-[calc(${topPosition}+1.5rem)] w-4 h-4 rounded-full bg-white border-4 ${colors.dot} z-10 left-1/2 -translate-x-1/2`}
                            ></div>

                            {/* Connector lines - visible only on md screens and up */}
                            <div
                                className={`hidden md:absolute md:block md:top-[calc(${topPosition}+1.5rem)] h-1 ${colors.line} w-[calc(25%-0.5rem)] ${
                                    isLeftSide ? 'left-[calc(25%+0.5rem)]' : 'right-[calc(25%+0.5rem)]'
                                }`}
                                style={{ top: `calc(${topPosition} + 1.5rem)` }}
                            ></div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Spacer to ensure all events are visible */}
            <div className="hidden md:block" style={{ height: `${events.length * 180}px` }}></div>
        </div>
    );
};

export default CeremonyTimeline;
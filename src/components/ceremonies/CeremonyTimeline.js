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
            <div className="flex flex-col">
                {events.map((event, index) => (
                    <motion.div
                        key={index}
                        className={`relative mb-8 p-6 ${index % 2 === 0 ? 'md:mr-auto md:text-right' : 'md:ml-auto'} md:w-[45%] w-full ml-0 md:ml-0 ${index % 2 !== 0 ? 'md:pl-0' : ''} pl-0 md:pl-0`}
                        variants={timelineItem}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                        {/* Content box */}
                        <div className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                            <div className={`${colors.textColor} font-bold mb-2`}>{event.time}</div>
                            <h3 className={`text-lg font-bold mb-2 ${colors.titleColor}`}>{event.title}</h3>
                            <p className="text-gray-600">{event.description}</p>
                        </div>

                        {/* Timeline dots - visible only on md screens and up */}
                        <div className={`hidden md:block absolute top-6 w-4 h-4 rounded-full bg-white border-4 ${colors.dot} z-10
                            ${index % 2 === 0 ? 'right-0 -translate-x-14' : 'left-0 translate-x-14'}`}>
                        </div>

                        {/* Connector lines - visible only on md screens and up */}
                        <div className={`hidden md:block absolute top-8 h-1 ${colors.line} w-14
                            ${index % 2 === 0 ? 'right-0 -translate-x-0' : 'left-0 translate-x-0'}`}>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default CeremonyTimeline;
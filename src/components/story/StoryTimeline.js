import React from 'react';
import { motion } from 'framer-motion';

const StoryTimeline = ({ events }) => {
    const timelineItem = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="relative py-8">
            {/* Center line (visible on md screens and up) */}
            <div className="absolute h-full w-1 bg-gradient-to-b from-christian-accent to-hindu-secondary left-1/2 -translate-x-1/2 hidden md:block"></div>

            {/* Timeline items */}
            <div className="relative">
                {events.map((event, index) => {
                    // Calculate positions with generous spacing for variable image heights
                    const topPosition = `${index * 480}px`;
                    const isLeftSide = index % 2 === 0;

                    return (
                        <motion.div
                            key={index}
                            className="relative mb-16 md:mb-0"
                            variants={timelineItem}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                        >
                            {/* Content box */}
                            <div
                                className={`md:absolute md:w-[45%] p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 ${
                                    isLeftSide ? 'md:left-0 md:text-right' : 'md:right-0'
                                }`}
                                style={{
                                    top: topPosition,
                                    zIndex: index % 3 + 1
                                }}
                            >
                                <div className={`text-lg font-bold mb-2 bg-gradient-to-r from-christian-accent to-hindu-secondary bg-clip-text text-transparent`}>
                                    {event.date}
                                </div>
                                <h3 className={`text-xl font-bold mb-3 text-gray-800`}>
                                    {event.title}
                                </h3>

                                {event.image && (
                                    <div className="mb-4 rounded-md overflow-hidden flex items-center justify-center bg-gray-50">
                                        <img
                                            src={event.image}
                                            alt={event.title}
                                            className="w-full h-auto max-h-[400px] object-contain transition-transform duration-500 hover:scale-105"
                                        />
                                    </div>
                                )}

                                <p className="text-gray-600 whitespace-pre-line">
                                    {event.description}
                                </p>
                            </div>

                            {/* Timeline dots - visible only on md screens and up */}
                            <div
                                className={`hidden md:absolute md:block w-5 h-5 rounded-full bg-white border-4 border-christian-accent z-10 left-1/2 -translate-x-1/2`}
                                style={{ top: `calc(${topPosition} + 1.5rem)` }}
                            ></div>

                            {/* Connector lines - visible only on md screens and up */}
                            <div
                                className={`hidden md:absolute md:block h-1 bg-gradient-to-r ${
                                    isLeftSide ? 'from-christian-accent to-transparent' : 'from-transparent to-christian-accent'
                                } w-[calc(27.5%-0.5rem)] ${
                                    isLeftSide ? 'left-[calc(22.5%+0.5rem)]' : 'right-[calc(22.5%+0.5rem)]'
                                }`}
                                style={{ top: `calc(${topPosition} + 1.5rem)` }}
                            ></div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Spacer to ensure all events are visible */}
            <div className="hidden md:block" style={{ height: `${events.length * 480}px` }}></div>
        </div>
    );
};

export default StoryTimeline;
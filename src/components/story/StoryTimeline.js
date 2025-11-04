import React from 'react';
import { motion } from 'framer-motion';

const StoryTimeline = ({ events }) => {
    const timelineItem = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="relative py-8">
            {/* Mobile: Left-aligned vertical line */}
            <div className="absolute h-full w-0.5 bg-gradient-to-b from-christian-accent via-hindu-secondary to-christian-accent left-6 top-0 md:hidden"></div>

            {/* Desktop: Center line */}
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
                            className="relative mb-12 md:mb-0 flex md:block"
                            variants={timelineItem}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                        >
                            {/* Mobile: Timeline dot on the left */}
                            <div className="flex-shrink-0 md:hidden">
                                <motion.div
                                    className="w-12 h-12 rounded-full bg-white border-4 border-christian-accent shadow-lg flex items-center justify-center relative z-10"
                                    initial={{ scale: 0 }}
                                    whileInView={{ scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                                >
                                    <motion.div
                                        className="w-3 h-3 rounded-full bg-gradient-to-br from-christian-accent to-hindu-secondary"
                                        animate={{
                                            scale: [1, 1.2, 1],
                                            opacity: [0.8, 1, 0.8]
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            ease: "easeInOut",
                                            delay: index * 0.3
                                        }}
                                    />
                                </motion.div>
                            </div>

                            {/* Mobile: Connector line from dot to card */}
                            <div className="w-6 h-0.5 bg-gradient-to-r from-christian-accent to-transparent mt-6 md:hidden"></div>

                            {/* Content box */}
                            <div
                                className={`flex-1 md:absolute md:w-[45%] p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 ${
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

                            {/* Desktop: Timeline dots - visible only on md screens and up */}
                            <div
                                className={`hidden md:absolute md:block w-5 h-5 rounded-full bg-white border-4 border-christian-accent z-10 left-1/2 -translate-x-1/2`}
                                style={{ top: `calc(${topPosition} + 1.5rem)` }}
                            ></div>

                            {/* Desktop: Connector lines - visible only on md screens and up */}
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

            {/* Spacer to ensure all events are visible on desktop */}
            <div className="hidden md:block" style={{ height: `${events.length * 480}px` }}></div>
        </div>
    );
};

export default StoryTimeline;
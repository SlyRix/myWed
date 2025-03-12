import React from 'react';
import { motion } from 'framer-motion';

const StoryTimeline = ({ events }) => {
    return (
        <div className="relative">
            {/* Timeline vertical line */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-christian-accent to-hindu-secondary transform -translate-x-1/2"></div>

            <div className="relative">
                {events.map((event, index) => {
                    const isLeft = index % 2 === 0;

                    // Increased overlap with larger negative margin
                    const overlapClass = index > 0 ? 'md:-mt-32' : '';

                    return (
                        <div key={index} className={`mb-16 ${overlapClass} relative`}>
                            <div className={`md:w-5/12 relative ${isLeft ? 'md:mr-auto md:pr-8' : 'md:ml-auto md:pl-8'}`}>
                                <motion.div
                                    className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <div className={`text-lg font-bold text-christian-accent mb-2 ${isLeft ? 'md:text-right' : 'md:text-left'}`}>
                                        {event.date}
                                    </div>
                                    <h3 className={`text-xl font-bold mb-3 ${isLeft ? 'md:text-right' : 'md:text-left'}`}>
                                        {event.title}
                                    </h3>

                                    {event.image && (
                                        <div className="mb-4 rounded-md overflow-hidden">
                                            <img
                                                src={event.image}
                                                alt={event.title}
                                                className="w-full h-48 object-cover transition-transform duration-500 hover:scale-110"
                                            />
                                        </div>
                                    )}

                                    <p className={`text-gray-700 ${isLeft ? 'md:text-right' : 'md:text-left'}`}>
                                        {event.description}
                                    </p>
                                </motion.div>
                            </div>

                            {/* Timeline dots - positioned on the center line */}
                            <div className="hidden md:block absolute left-1/2 top-6 -translate-x-1/2 w-6 h-6 rounded-full bg-white border-4 border-christian-accent z-20">
                                {/* Connector lines to content boxes */}
                                <div
                                    className={`absolute top-1/2 -translate-y-1/2 h-1 bg-christian-accent ${
                                        isLeft ? 'right-full w-[7.8vw]' : 'left-full w-[7.8vw]'
                                    }`}
                                ></div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default StoryTimeline;
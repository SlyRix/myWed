import React from 'react';
import { motion } from 'framer-motion';
import AnimatedSection from '../common/AnimatedSection';

const StoryTimeline = ({ events }) => {
    return (
        <div className="relative">
            {events.map((event, index) => (
                <AnimatedSection
                    key={index}
                    className={`mb-16 md:w-5/12 ${index % 2 === 0 ? 'md:mr-auto' : 'md:ml-auto'} relative`}
                    delay={index * 0.1}
                >
                    <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <div className="text-lg font-bold text-christian-accent mb-2">{event.date}</div>
                        <h3 className="text-xl font-bold mb-3">{event.title}</h3>

                        {event.image && (
                            <div className="mb-4 rounded-md overflow-hidden">
                                <img
                                    src={event.image}
                                    alt={event.title}
                                    className="w-full h-48 object-cover transition-transform duration-500 hover:scale-110"
                                />
                            </div>
                        )}

                        <p className="text-gray-700">{event.description}</p>
                    </div>

                    {/* Timeline nodes - visible only on medium screens and up */}
                    <div className="hidden md:block absolute top-6 w-5 h-5 rounded-full bg-white border-4 border-christian-accent z-10
                        ${index % 2 === 0 ? 'right-0 -translate-x-14' : 'left-0 translate-x-14'}">
                        {index % 2 === 0 ? (
                            <div className="absolute top-1/2 -translate-y-1/2 right-0 w-14 h-1 bg-christian-accent"></div>
                        ) : (
                            <div className="absolute top-1/2 -translate-y-1/2 left-0 w-14 h-1 bg-christian-accent"></div>
                        )}
                    </div>
                </AnimatedSection>
            ))}
        </div>
    );
};

export default StoryTimeline;
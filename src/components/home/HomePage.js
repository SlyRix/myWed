import React from 'react';
import { motion } from 'framer-motion';
import Hero from './Hero';
import AnimatedSection from '../common/AnimatedSection';
import { mdiMapMarker, mdiCalendarRange, mdiHeartMultiple } from '@mdi/js';
import Icon from '@mdi/react';
import { Link } from 'react-router-dom';

const HomePage = () => {
    const events = [
        {
            id: 'christian',
            title: 'Christian Ceremony',
            date: 'July 4, 2026',
            location: 'St. Mary\'s Church',
            description: 'Join us for a beautiful celebration of marriage with traditional Christian customs.',
            icon: mdiHeartMultiple,
            color: 'bg-christian-accent',
            textColor: 'text-christian-accent',
            path: '/christian-ceremony'
        },
        {
            id: 'hindu',
            title: 'Hindu Ceremony',
            date: 'July 5, 2026',
            location: 'Shiva Temple',
            description: 'Experience a vibrant Hindu wedding ceremony full of color and tradition.',
            icon: mdiHeartMultiple,
            color: 'bg-hindu-secondary',
            textColor: 'text-hindu-secondary',
            path: '/hindu-ceremony'
        }
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <Hero />

            <section id="about-section" className="py-20 bg-gray-50">
                <div className="container">
                    <AnimatedSection className="text-center max-w-2xl mx-auto mb-12">
                        <h2 className="text-3xl md:text-4xl mb-6">Welcome to Our Wedding</h2>
                        <p className="text-lg text-gray-600">
                            We are thrilled to celebrate our special day with our beloved family and friends. Our wedding will be a beautiful blend of Christian and Hindu traditions, reflecting our unique journey and shared love.
                        </p>
                    </AnimatedSection>

                    <div className="grid md:grid-cols-2 gap-8 mt-12">
                        {events.map((event, index) => (
                            <AnimatedSection
                                key={event.id}
                                className="bg-white rounded-lg shadow-lg overflow-hidden"
                                delay={index * 0.2}
                            >
                                <div className={`h-2 ${event.color}`}></div>
                                <div className="p-6">
                                    <h3 className={`text-2xl font-bold mb-4 ${event.textColor}`}>{event.title}</h3>

                                    <div className="flex items-center mb-4">
                                        <Icon path={mdiCalendarRange} size={1} className={`mr-2 ${event.textColor}`} />
                                        <span>{event.date}</span>
                                    </div>

                                    <div className="flex items-center mb-4">
                                        <Icon path={mdiMapMarker} size={1} className={`mr-2 ${event.textColor}`} />
                                        <span>{event.location}</span>
                                    </div>

                                    <p className="text-gray-600 mb-6">{event.description}</p>

                                    <Link
                                        to={event.path}
                                        className={`inline-block py-2 px-4 rounded ${event.color} text-white transition-transform duration-300 hover:translate-y-[-2px] hover:shadow-md`}
                                    >
                                        Learn More
                                    </Link>
                                </div>
                            </AnimatedSection>
                        ))}
                    </div>

                    <AnimatedSection className="text-center mt-16 mb-6">
                        <Link to="/our-story" className="btn christian-btn">
                            Read Our Story
                        </Link>
                    </AnimatedSection>
                </div>
            </section>
        </motion.div>
    );
};

export default HomePage;
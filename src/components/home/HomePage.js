// src/components/home/HomePage.js
import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Hero from './Hero';
import AnimatedSection from '../common/AnimatedSection';
import { mdiMapMarker, mdiCalendarRange, mdiHeartMultiple } from '@mdi/js';
import Icon from '@mdi/react';
import { Link } from 'react-router-dom';

const HomePage = () => {
    const { t } = useTranslation();

    // If you have a background image in public/images, use it here
    // Otherwise, set to null to use the gradient
    const heroBackgroundImage = "/images/floral-pattern.svg" ? null : null;
    const heroBackgroundImage2 = "/images/placeholder.jpg";

    const events = [
        {
            id: 'christian',
            title: t('home.christianEvent.title'),
            date: t('home.christianEvent.date'),
            location: t('home.christianEvent.location'),
            description: t('home.christianEvent.description'),
            icon: mdiHeartMultiple,
            color: 'bg-christian-accent',
            textColor: 'text-christian-accent',
            path: '/christian-ceremony'
        },
        {
            id: 'hindu',
            title: t('home.hinduEvent.title'),
            date: t('home.hinduEvent.date'),
            location: t('home.hinduEvent.location'),
            description: t('home.hinduEvent.description'),
            icon: mdiHeartMultiple,
            color: 'bg-hindu-accent',  // Updated to use our new color scheme
            textColor: 'text-hindu-accent',  // Updated to use our new color scheme
            path: '/hindu-ceremony'
        }
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            {/* Pass the background image to the Hero component */}
            <Hero />

            <section id="about-section" className="py-20 bg-wedding-background">
                <div className="container">
                    <AnimatedSection className="text-center max-w-2xl mx-auto mb-12">
                        <h2 className="text-3xl md:text-4xl mb-6 font-display">{t('home.welcomeTitle')}</h2>

                        {/* Decorative divider */}
                        <div className="flex items-center justify-center mb-6">
                            <div className="h-px w-20 bg-wedding-gold/30"></div>
                            <span className="mx-4 text-wedding-gold">♥</span>
                            <div className="h-px w-20 bg-wedding-gold/30"></div>
                        </div>

                        <p className="text-lg text-wedding-gray leading-relaxed">
                            {t('home.welcomeText')}
                        </p>
                    </AnimatedSection>

                    <div className="grid md:grid-cols-2 gap-8 mt-12">
                        {events.map((event, index) => (
                            <AnimatedSection
                                key={event.id}
                                className="elegant-card overflow-hidden"
                                delay={index * 0.2}
                            >
                                <div className={`h-1 w-full ${event.color} -mt-6 mb-6`}></div>
                                <div className="p-6">
                                    <h3 className={`text-2xl font-bold mb-4 font-display ${event.textColor}`}>{event.title}</h3>

                                    <div className="flex items-center mb-4">
                                        <Icon path={mdiCalendarRange} size={1} className={`mr-3 ${event.textColor}`} />
                                        <span className="text-christian-text">{event.date}</span>
                                    </div>

                                    <div className="flex items-center mb-4">
                                        <Icon path={mdiMapMarker} size={1} className={`mr-3 ${event.textColor}`} />
                                        <span className="text-christian-text">{event.location}</span>
                                    </div>

                                    <p className="text-wedding-gray mb-6 leading-relaxed">{event.description}</p>

                                    <Link
                                        to={event.path}
                                        className={index === 0 ? "btn btn-christian" : "btn btn-hindu"}
                                    >
                                        Learn More
                                    </Link>
                                </div>
                            </AnimatedSection>
                        ))}
                    </div>

                    <AnimatedSection className="text-center mt-16 mb-6">
                        <Link to="/our-story" className="btn btn-outline btn-christian-outline">
                            {t('home.readStory')}
                        </Link>
                    </AnimatedSection>
                </div>
            </section>

            {/* Add the Parallax Demo Section */}

        </motion.div>
    );
};

export default HomePage;
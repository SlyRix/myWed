// src/components/ceremonies/Reception.js
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { mdiMapMarker, mdiCalendar, mdiTshirtCrew } from '@mdi/js';
import Icon from '@mdi/react';
import { useTranslation } from 'react-i18next';
import CeremonyTimeline from './CeremonyTimeline';
import MiniMap from '../map/MiniMap';
import AddToCalendarButton from '../common/AddToCalendarButton';
import { Link } from 'react-router-dom';
import ResponsiveCeremonyImage from '../common/ResponsiveCeremonyImage';
import { getPageContent } from '../../api/contentApi';

const Reception = () => {
    const { t } = useTranslation();
    const [cmsContent, setCmsContent] = useState(null);

    // Load CMS content on mount
    useEffect(() => {
        const loadContent = async () => {
            try {
                const data = await getPageContent('reception');
                if (data && data.content) {
                    setCmsContent(data.content);
                }
            } catch (error) {
                console.error('Failed to load CMS content, using defaults:', error);
            }
        };
        loadContent();
    }, []);

    // Timeline events - use CMS content if available, otherwise use translations
    const timelineEvents = cmsContent?.timeline || [
        {
            time: t('reception.schedule.events.arrival.time'),
            title: t('reception.schedule.events.arrival.title'),
            description: t('reception.schedule.events.arrival.description')
        },
        {
            time: t('reception.schedule.events.cocktail.time'),
            title: t('reception.schedule.events.cocktail.title'),
            description: t('reception.schedule.events.cocktail.description')
        },
        {
            time: t('reception.schedule.events.entrance.time'),
            title: t('reception.schedule.events.entrance.title'),
            description: t('reception.schedule.events.entrance.description')
        },
        {
            time: t('reception.schedule.events.dinner.time'),
            title: t('reception.schedule.events.dinner.title'),
            description: t('reception.schedule.events.dinner.description')
        },
        {
            time: t('reception.schedule.events.speeches.time'),
            title: t('reception.schedule.events.speeches.title'),
            description: t('reception.schedule.events.speeches.description')
        },
        {
            time: t('reception.schedule.events.firstDance.time'),
            title: t('reception.schedule.events.firstDance.title'),
            description: t('reception.schedule.events.firstDance.description')
        },
        {
            time: t('reception.schedule.events.cake.time'),
            title: t('reception.schedule.events.cake.title'),
            description: t('reception.schedule.events.cake.description')
        },
        {
            time: t('reception.schedule.events.party.time'),
            title: t('reception.schedule.events.party.title'),
            description: t('reception.schedule.events.party.description')
        }
    ];

    // Hero image from CMS
    const heroImage = cmsContent?.images?.hero || '/images/placeholder.jpg';

    // Animation for content sections
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
    };

    // IntersectionObserver hooks for animations
    const [textRef, textInView] = useInView({ triggerOnce: true, threshold: 0.1 });
    const [detailsRef, detailsInView] = useInView({ triggerOnce: true, threshold: 0.1 });
    const [timelineRef, timelineInView] = useInView({ triggerOnce: true, threshold: 0.1 });

    // Parse reception date for calendar
    const receptionDate = new Date('July 5, 2026 18:00:00');
    const receptionEndDate = new Date('July 6, 2026 02:00:00');
    const receptionLocation = t('reception.location.address1') + ', ' + t('reception.location.address2');

    return (
        <section className="pt-24 pb-16 bg-gradient-to-br from-purple-50 via-pink-50 to-amber-50 relative overflow-hidden">
            {/* Decorative elements for a blend of both themes */}
            <div className="hidden md:block absolute top-24 left-6 w-32 h-32 bg-wedding-love/10 rounded-full blur-lg"></div>
            <div className="hidden md:block absolute bottom-24 right-6 w-32 h-32 bg-amber-500/10 rounded-full blur-lg"></div>

            <div className="container mx-auto px-4 max-w-6xl relative z-10">
                <h2 className="text-3xl md:text-4xl text-center mb-12 relative pb-4 font-bold text-gray-800">
                    {t('reception.title')}
                    <span className="absolute bottom-0 left-1/2 w-20 h-1 -translate-x-1/2 bg-gradient-to-r from-christian-accent via-wedding-love to-hindu-secondary"></span>
                </h2>

                <div className="flex flex-col md:flex-row items-center mb-16 gap-8">
                    <motion.div
                        className="md:w-1/2"
                        ref={textRef}
                        initial="hidden"
                        animate={textInView ? "visible" : "hidden"}
                        variants={fadeIn}
                    >
                        <h3 className="text-2xl md:text-3xl font-bold mb-6 bg-gradient-to-r from-christian-accent via-wedding-love to-hindu-secondary bg-clip-text text-transparent">
                            {t('reception.headline')}
                        </h3>
                        <p className="text-gray-700 mb-4">
                            {t('reception.description')}
                        </p>
                        <p className="text-gray-700 mb-6">
                            {t('reception.description2')}
                        </p>
                        <Link
                            to="/rsvp?ceremony=reception"
                            className="inline-block py-3 px-6 rounded-full font-semibold transition-all duration-300 relative overflow-hidden z-10 bg-gradient-to-r from-christian-accent via-wedding-love to-hindu-secondary text-white hover:shadow-md"
                        >
                            {t('reception.rsvpButton')}
                            <span className="absolute bottom-0 left-0 w-full h-0 bg-white/20 transition-all duration-300 -z-10 group-hover:h-full"></span>
                        </Link>
                    </motion.div>

                    <div className="md:w-1/2">
                        <ResponsiveCeremonyImage
                            src={heroImage}
                            alt={t('reception.title')}
                            delay={0.2}
                        />
                    </div>
                </div>

                <motion.div
                    className="grid md:grid-cols-3 gap-6 mb-16"
                    ref={detailsRef}
                    initial="hidden"
                    animate={detailsInView ? "visible" : "hidden"}
                    variants={{
                        visible: { transition: { staggerChildren: 0.2 } }
                    }}
                >
                    <motion.div
                        className="flex-1 min-w-[250px] mb-8 p-6 bg-white rounded-lg shadow-md text-center transition-all duration-300 hover:translate-y-[-10px] hover:shadow-lg border-t-4 border-wedding-love"
                        variants={fadeIn}
                    >
                        <Icon path={mdiMapMarker} size={2} className="mx-auto text-5xl mb-4 text-wedding-love" />
                        <h3 className="text-xl font-bold mb-3">{t('reception.location.title')}</h3>
                        <p className="mb-1">{t('reception.location.address1')}</p>
                        <p className="text-gray-600 mb-1">{t('reception.location.address2')}</p>

                        {/* Add the mini map component */}
                        <div className="mt-4">
                            <MiniMap
                                address="Sporthalle Unterrohr, Unterrohrstrasse 2, 8952 Schlieren"
                                title={t('reception.location.address1')}
                            />
                        </div>
                    </motion.div>

                    <motion.div
                        className="flex-1 min-w-[250px] mb-8 p-6 bg-white rounded-lg shadow-md text-center transition-all duration-300 hover:translate-y-[-10px] hover:shadow-lg border-t-4 border-wedding-love"
                        variants={fadeIn}
                    >
                        <Icon path={mdiCalendar} size={2} className="mx-auto text-5xl mb-4 text-wedding-love" />
                        <h3 className="text-xl font-bold mb-3">{t('reception.dateTime.title')}</h3>
                        <p className="mb-1">{t('reception.dateTime.date')}</p>
                        <p className="text-gray-600 mb-1">{t('reception.dateTime.time')}</p>

                        {/* Add to calendar button */}
                        <div className="mt-4">
                            <AddToCalendarButton
                                eventTitle="Rushel & Sivani's Wedding Reception"
                                description="Join us for our wedding reception celebration"
                                location={receptionLocation}
                                startDate={receptionDate}
                                endDate={receptionEndDate}
                                theme="reception"
                            />
                        </div>
                    </motion.div>

                    <motion.div
                        className="flex-1 min-w-[250px] mb-8 p-6 bg-white rounded-lg shadow-md text-center transition-all duration-300 hover:translate-y-[-10px] hover:shadow-lg border-t-4 border-wedding-love"
                        variants={fadeIn}
                    >
                        <Icon path={mdiTshirtCrew} size={2} className="mx-auto text-5xl mb-4 text-wedding-love" />
                        <h3 className="text-xl font-bold mb-3">{t('reception.dress.title')}</h3>
                        <p className="mb-1">{t('reception.dress.code1')}</p>
                        <p className="text-gray-600 mb-1">{t('reception.dress.code2')}</p>
                    </motion.div>
                </motion.div>

                <motion.div
                    className="mt-20"
                    ref={timelineRef}
                    initial="hidden"
                    animate={timelineInView ? "visible" : "hidden"}
                    variants={fadeIn}
                >
                    <h2 className="text-2xl font-bold mb-10 text-center text-gray-800">{t('reception.schedule.title')}</h2>
                    {/* Timeline - using christian theme as default for reception */}
                    <CeremonyTimeline
                        events={timelineEvents}
                        theme="christian"
                    />
                </motion.div>
            </div>
        </section>
    );
};

export default Reception;

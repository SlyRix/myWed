// src/components/ceremonies/ChristianCeremony.js
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
import CeremonyAccessCheck from '../common/CeremonyAccessCheck';
import ResponsiveCeremonyImage from '../common/ResponsiveCeremonyImage';
import { getPageContent } from '../../api/contentApi';

const ChristianCeremony = () => {
    const { t, i18n } = useTranslation();
    const [cmsContent, setCmsContent] = useState(null);
    const [isLoadingContent, setIsLoadingContent] = useState(true);

    // Load CMS content on mount and when language changes
    useEffect(() => {
        const loadContent = async () => {
            setIsLoadingContent(true);
            try {
                // Get content for current language with fallback to English
                const data = await getPageContent('christian-ceremony', i18n.language);
                if (data && data.content) {
                    setCmsContent(data.content);
                } else {
                    setCmsContent(null);
                }
            } catch (error) {
                if (process.env.NODE_ENV === 'development') {
                    console.error('Failed to load CMS content, using i18n defaults:', error);
                }
                setCmsContent(null);
            } finally {
                setIsLoadingContent(false);
            }
        };
        loadContent();
    }, [i18n.language]); // Re-load when language changes

    // Timeline events - use CMS content if available, otherwise use translations
    const timelineEvents = cmsContent?.timeline || [
        {
            time: t('christian.schedule.events.arrival.time'),
            title: t('christian.schedule.events.arrival.title'),
            description: t('christian.schedule.events.arrival.description')
        },
        {
            time: t('christian.schedule.events.begins.time'),
            title: t('christian.schedule.events.begins.title'),
            description: t('christian.schedule.events.begins.description')
        },
        {
            time: t('christian.schedule.events.vows.time'),
            title: t('christian.schedule.events.vows.title'),
            description: t('christian.schedule.events.vows.description')
        },
        {
            time: t('christian.schedule.events.pronouncement.time'),
            title: t('christian.schedule.events.pronouncement.title'),
            description: t('christian.schedule.events.pronouncement.description')
        },
        {
            time: t('christian.schedule.events.recessional.time'),
            title: t('christian.schedule.events.recessional.title'),
            description: t('christian.schedule.events.recessional.description')
        },
        {
            time: t('christian.schedule.events.photos.time'),
            title: t('christian.schedule.events.photos.title'),
            description: t('christian.schedule.events.photos.description')
        }
    ];

    // Hero image from CMS
    const heroImage = cmsContent?.images?.hero || `${process.env.PUBLIC_URL}/images/christian-ceremony/christanphoto.jpeg`;

    // Animation for content sections
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
    };

    // IntersectionObserver hooks for animations
    const [textRef, textInView] = useInView({ triggerOnce: true, threshold: 0.1 });
    const [detailsRef, detailsInView] = useInView({ triggerOnce: true, threshold: 0.1 });
    const [timelineRef, timelineInView] = useInView({ triggerOnce: true, threshold: 0.1 });

    // Parse ceremony date for calendar
    const ceremonyDate = new Date('2026-07-04T14:00:00');
    const ceremonyEndDate = new Date('2026-07-04T16:00:00');
    const ceremonyLocation = t('christian.location.address1') + ', ' + t('christian.location.address2');

    return (
        <>
            <CeremonyAccessCheck ceremony="christian" />
            <section className="pt-24 pb-16 bg-gradient-to-br from-white via-white to-christian-accent/5 relative overflow-hidden">
            <div className="container mx-auto px-4 max-w-6xl">
                <h2 className="text-3xl md:text-4xl text-center mb-12 relative pb-4 font-bold text-christian-text">
                    {t('christian.title')}
                    <span className="absolute bottom-0 left-1/2 w-20 h-1 -translate-x-1/2 bg-christian-accent"></span>
                </h2>

                <div className="flex flex-col md:flex-row items-center mb-16 gap-8">
                    <motion.div
                        className="md:w-1/2"
                        ref={textRef}
                        initial="hidden"
                        animate={textInView ? "visible" : "hidden"}
                        variants={fadeIn}
                    >
                        <h3 className="text-2xl md:text-3xl font-bold mb-6 text-christian-accent">
                            {cmsContent?.headline || t('christian.headline')}
                        </h3>
                        <p className="text-gray-700 mb-4">
                            {cmsContent?.description || t('christian.description')}
                        </p>
                        <p className="text-gray-700 mb-6">
                            {cmsContent?.description2 || t('christian.description2')}
                        </p>
                        <Link
                            to="/rsvp?ceremony=christian"
                            className="inline-block py-3 px-6 rounded-full font-semibold transition-all duration-300 relative overflow-hidden z-10 bg-christian-accent text-white hover:shadow-md"
                        >
                            {t('christian.rsvpButton')}
                            <span className="absolute bottom-0 left-0 w-full h-0 bg-white/20 transition-all duration-300 -z-10 group-hover:h-full"></span>
                        </Link>
                    </motion.div>

                    <div className="md:w-1/2">
                        <ResponsiveCeremonyImage
                            src={heroImage}
                            alt={t('christian.title')}
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
                        className="flex-1 min-w-[250px] mb-8 p-6 bg-white rounded-lg shadow-md text-center transition-all duration-300 hover:translate-y-[-10px] hover:shadow-lg border-t-4 border-christian-accent"
                        variants={fadeIn}
                    >
                        <Icon path={mdiMapMarker} size={2} className="mx-auto text-5xl mb-4 text-christian-accent" />
                        <h3 className="text-xl font-bold mb-3">{t('christian.location.title')}</h3>
                        <p className="mb-1">{t('christian.location.address1')}</p>
                        <p className="text-gray-600 mb-1">{t('christian.location.address2')}</p>

                        {/* Add the mini map component */}
                        <div className="mt-4">
                            <MiniMap
                                address="Kirche Altendorf, Dorfpl. 5, 8852 Altendorf"
                                title={t('christian.location.address1')}
                            />
                        </div>
                    </motion.div>

                    <motion.div
                        className="flex-1 min-w-[250px] mb-8 p-6 bg-white rounded-lg shadow-md text-center transition-all duration-300 hover:translate-y-[-10px] hover:shadow-lg border-t-4 border-christian-accent"
                        variants={fadeIn}
                    >
                        <Icon path={mdiCalendar} size={2} className="mx-auto text-5xl mb-4 text-christian-accent" />
                        <h3 className="text-xl font-bold mb-3">{t('christian.dateTime.title')}</h3>
                        <p className="mb-1">{t('christian.dateTime.date')}</p>
                        <p className="text-gray-600 mb-1">{t('christian.dateTime.time')}</p>

                        {/* Add the calendar button component */}
                        <div className="mt-4 flex justify-center">
                            <AddToCalendarButton
                                eventTitle="Rushel & Sivani - Christian Ceremony"
                                description="Join us for our Christian Wedding Ceremony"
                                location={ceremonyLocation}
                                startDate={ceremonyDate}
                                endDate={ceremonyEndDate}
                                theme="christian"
                            />
                        </div>
                    </motion.div>

                    <motion.div
                        className="flex-1 min-w-[250px] mb-8 p-6 bg-white rounded-lg shadow-md text-center transition-all duration-300 hover:translate-y-[-10px] hover:shadow-lg border-t-4 border-christian-accent"
                        variants={fadeIn}
                    >
                        <Icon path={mdiTshirtCrew} size={2} className="mx-auto text-5xl mb-4 text-christian-accent" />
                        <h3 className="text-xl font-bold mb-3">{t('christian.dress.title')}</h3>
                        <p className="mb-1">{t('christian.dress.code1')}</p>
                        <p className="text-gray-600 mb-1">{t('christian.dress.code2')}</p>
                    </motion.div>
                </motion.div>

                <motion.div
                    className="mt-20"
                    ref={timelineRef}
                    initial="hidden"
                    animate={timelineInView ? "visible" : "hidden"}
                    variants={fadeIn}
                >
                    <h2 className="text-2xl font-bold mb-10 text-center text-christian-accent">
                        {cmsContent?.scheduleTitle || t('christian.schedule.title')}
                    </h2>
                    {/* Timeline with Ceremony Schedule */}
                    <CeremonyTimeline
                        events={timelineEvents}
                        theme="christian"
                    />
                </motion.div>
            </div>
        </section>
        </>

    );
};

export default ChristianCeremony;
// src/components/ceremonies/HinduCeremony.js
import React from 'react';
import {motion} from 'framer-motion';
import {useInView} from 'react-intersection-observer';
import {mdiMapMarker, mdiCalendar, mdiTshirtCrew} from '@mdi/js';
import Icon from '@mdi/react';
import {useTranslation} from 'react-i18next';
import CeremonyTimeline from './CeremonyTimeline';
import OpenStreetMap from '../map/OpenStreetMap';
import CalendarLink from '../common/CalendarLink';
import AnimatedSection from '../common/AnimatedSection';
import {Link} from 'react-router-dom';
import CeremonyAccessCheck from '../common/CeremonyAccessCheck';

const HinduCeremony = () => {
    const {t} = useTranslation();

    // Timeline events
    const timelineEvents = [
        {
            time: t('hindu.schedule.events.baraat.time'),
            title: t('hindu.schedule.events.baraat.title'),
            description: t('hindu.schedule.events.baraat.description')
        },
        {
            time: t('hindu.schedule.events.milni.time'),
            title: t('hindu.schedule.events.milni.title'),
            description: t('hindu.schedule.events.milni.description')
        },
        {
            time: t('hindu.schedule.events.ganeshPuja.time'),
            title: t('hindu.schedule.events.ganeshPuja.title'),
            description: t('hindu.schedule.events.ganeshPuja.description')
        },
        {
            time: t('hindu.schedule.events.mandap.time'),
            title: t('hindu.schedule.events.mandap.title'),
            description: t('hindu.schedule.events.mandap.description')
        },
        {
            time: t('hindu.schedule.events.saptapadi.time'),
            title: t('hindu.schedule.events.saptapadi.title'),
            description: t('hindu.schedule.events.saptapadi.description')
        },
        {
            time: t('hindu.schedule.events.mangalsutra.time'),
            title: t('hindu.schedule.events.mangalsutra.title'),
            description: t('hindu.schedule.events.mangalsutra.description')
        },
        {
            time: t('hindu.schedule.events.ashirwad.time'),
            title: t('hindu.schedule.events.ashirwad.title'),
            description: t('hindu.schedule.events.ashirwad.description')
        },
        {
            time: t('hindu.schedule.events.lunch.time'),
            title: t('hindu.schedule.events.lunch.title'),
            description: t('hindu.schedule.events.lunch.description')
        }
    ];

    // Parse ceremony date for calendar
    const ceremonyDate = new Date('July 5, 2026 10:00:00');
    const ceremonyEndDate = new Date('July 5, 2026 14:00:00');
    const ceremonyLocation = t('hindu.location.address1') + ', ' + t('hindu.location.address2');

    return (
        <>
            <CeremonyAccessCheck ceremony="hindu"/>


            <section
                className="pt-24 pb-16 bg-gradient-to-br from-christian-secondary to-white relative overflow-hidden">
                {/* Decorative elements */}
                <div
                    className="hidden md:block absolute top-24 left-6 w-32 h-32 bg-hindu-primary/10 rounded-full blur-lg"></div>
                <div
                    className="hidden md:block absolute bottom-24 right-6 w-32 h-32 bg-hindu-secondary/10 rounded-full blur-lg"></div>
                <div
                    className="hidden md:block absolute top-1/2 left-1/4 w-4 h-24 bg-hindu-secondary/20 rounded-full rotate-45"></div>
                <div
                    className="hidden md:block absolute bottom-1/3 right-1/3 w-4 h-24 bg-hindu-primary/20 rounded-full -rotate-45"></div>

                <div className="container mx-auto max-w-6xl px-4 relative z-10">
                    <AnimatedSection className="text-center mb-16">
                        <h1 className="text-3xl md:text-4xl font-bold mb-6 relative pb-4 text-hindu-secondary">
                            {t('hindu.title')}
                            <span
                                className="absolute bottom-0 left-1/2 w-20 h-1 -translate-x-1/2 bg-hindu-secondary"></span>
                        </h1>
                    </AnimatedSection>

                    <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
                        <AnimatedSection className="order-2 md:order-1">
                            <div
                                className="rounded-lg overflow-hidden shadow-lg transform transition-transform duration-500 hover:scale-[1.02]">
                                <img
                                    src="/images/placeholder.jpg"
                                    alt={t('hindu.title')}
                                    className="w-full h-[350px] object-cover"
                                />
                            </div>
                        </AnimatedSection>

                        <AnimatedSection className="order-1 md:order-2" delay={0.2}>
                            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-hindu-secondary">{t('hindu.headline')}</h2>
                            <p className="text-gray-700 mb-4">
                                {t('hindu.description')}
                            </p>
                            <p className="text-gray-700 mb-6">
                                {t('hindu.description2')}
                            </p>
                            <Link
                                to="/rsvp?ceremony=hindu"
                                className="inline-block py-3 px-6 rounded-full font-semibold bg-hindu-secondary text-white transition-all duration-300 relative overflow-hidden z-10 hover:shadow-md"
                            >
                                {t('hindu.rsvpButton')}
                                <span
                                    className="absolute bottom-0 left-0 w-full h-0 bg-white/20 transition-all duration-300 -z-10 group-hover:h-full"></span>
                            </Link>
                        </AnimatedSection>
                    </div>

                    <AnimatedSection className="grid md:grid-cols-3 gap-6 mb-16" delay={0.3}>
                        <div
                            className="flex-1 min-w-[250px] mb-8 p-6 bg-white rounded-lg shadow-md text-center transition-all duration-300 hover:translate-y-[-10px] hover:shadow-lg border-t-4 border-hindu-secondary">
                            <Icon path={mdiMapMarker} size={2} className="mx-auto mb-4 text-hindu-secondary"/>
                            <h3 className="text-xl font-bold mb-3">{t('hindu.location.title')}</h3>
                            <p className="mb-1">{t('hindu.location.address1')}</p>
                            <p className="text-gray-600 mb-1">{t('hindu.location.address2')}</p>

                            {/* Free OpenStreetMap (no API key required!) */}
                            <div className="mt-4">
                                <OpenStreetMap
                                    address={ceremonyLocation}
                                    title={t('hindu.location.address1')}
                                    lat={47.366978}  // Example coordinates for a different location
                                    lng={7.879901}  // Example coordinates for a different location
                                />
                            </div>
                        </div>

                        <div
                            className="flex-1 min-w-[250px] mb-8 p-6 bg-white rounded-lg shadow-md text-center transition-all duration-300 hover:translate-y-[-10px] hover:shadow-lg border-t-4 border-hindu-secondary">
                            <Icon path={mdiCalendar} size={2} className="mx-auto mb-4 text-hindu-secondary"/>
                            <h3 className="text-xl font-bold mb-3">{t('hindu.dateTime.title')}</h3>
                            <p className="mb-1">{t('hindu.dateTime.date')}</p>
                            <p className="text-gray-600 mb-1">{t('hindu.dateTime.time')}</p>

                            {/* Add the calendar link component */}
                            <div className="mt-4">
                                <CalendarLink
                                    title="Rushel & Sivanis Hindu Wedding Ceremony"
                                    description="Join us for our traditional Hindu Wedding Ceremony"
                                    location={ceremonyLocation}
                                    startDate={ceremonyDate}
                                    endDate={ceremonyEndDate}
                                />
                            </div>
                        </div>

                        <div
                            className="flex-1 min-w-[250px] mb-8 p-6 bg-white rounded-lg shadow-md text-center transition-all duration-300 hover:translate-y-[-10px] hover:shadow-lg border-t-4 border-hindu-secondary">
                            <Icon path={mdiTshirtCrew} size={2} className="mx-auto mb-4 text-hindu-secondary"/>
                            <h3 className="text-xl font-bold mb-3">{t('hindu.dress.title')}</h3>
                            <p className="mb-1">{t('hindu.dress.code1')}</p>
                            <p className="text-gray-600 mb-1">{t('hindu.dress.code2')}</p>
                        </div>
                    </AnimatedSection>

                    <AnimatedSection className="mt-20" delay={0.4}>
                        <h2 className="text-2xl font-bold mb-10 text-center text-hindu-secondary">{t('hindu.schedule.title')}</h2>
                        <CeremonyTimeline events={timelineEvents} theme="hindu"/>
                    </AnimatedSection>

                    <AnimatedSection className="mt-16 text-center" delay={0.5}>
                        <h2 className="text-2xl font-bold mb-6 text-hindu-secondary">{t('hindu.rituals.title')}</h2>
                        <p className="text-gray-700 max-w-3xl mx-auto mb-8">
                            {t('hindu.rituals.description')}
                        </p>

                        <div className="grid md:grid-cols-3 gap-6">
                            {[
                                {
                                    title: t('hindu.rituals.items.mandap.title'),
                                    description: t('hindu.rituals.items.mandap.description')
                                },
                                {
                                    title: t('hindu.rituals.items.kanyadaan.title'),
                                    description: t('hindu.rituals.items.kanyadaan.description')
                                },
                                {
                                    title: t('hindu.rituals.items.mangalPhera.title'),
                                    description: t('hindu.rituals.items.mangalPhera.description')
                                }
                            ].map((ritual, index) => (
                                <div
                                    key={index}
                                    className="bg-white p-6 rounded-lg shadow-md border-t-4 border-hindu-secondary"
                                >
                                    <h3 className="text-xl font-semibold mb-3 text-hindu-secondary">{ritual.title}</h3>
                                    <p className="text-gray-600">{ritual.description}</p>
                                </div>
                            ))}
                        </div>
                    </AnimatedSection>
                </div>
            </section>
        </>
    );
};

export default HinduCeremony;
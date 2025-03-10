// src/components/ceremonies/HinduCeremony.js
import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { mdiMapMarker, mdiCalendar, mdiTshirtCrew } from '@mdi/js';
import Icon from '@mdi/react';
import { useTranslation } from 'react-i18next';
import CeremonyTimeline from './CeremonyTimeline';
import CeremonyDetails from './CeremonyDetails';
import AnimatedSection from '../common/AnimatedSection';

const HinduCeremony = () => {
    const { t } = useTranslation();

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

    // Ceremony details
    const ceremonyDetails = [
        {
            icon: mdiMapMarker,
            title: t('hindu.location.title'),
            content: [t('hindu.location.address1'), t('hindu.location.address2')],
            link: { text: t('hindu.location.mapLink'), url: '#' }
        },
        {
            icon: mdiCalendar,
            title: t('hindu.dateTime.title'),
            content: [t('hindu.dateTime.date'), t('hindu.dateTime.time')]
        },
        {
            icon: mdiTshirtCrew,
            title: t('hindu.dress.title'),
            content: [t('hindu.dress.code1'), t('hindu.dress.code2')]
        }
    ];

    return (
        <section className="pt-24 pb-16 bg-gradient-to-br from-yellow-50 to-amber-50 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="hidden md:block absolute top-24 left-6 w-32 h-32 bg-hindu-primary/10 rounded-full blur-lg"></div>
            <div className="hidden md:block absolute bottom-24 right-6 w-32 h-32 bg-hindu-secondary/10 rounded-full blur-lg"></div>
            <div className="hidden md:block absolute top-1/2 left-1/4 w-4 h-24 bg-hindu-secondary/20 rounded-full rotate-45"></div>
            <div className="hidden md:block absolute bottom-1/3 right-1/3 w-4 h-24 bg-hindu-primary/20 rounded-full -rotate-45"></div>

            <div className="container mx-auto max-w-6xl px-4 relative z-10">
                <AnimatedSection className="text-center mb-16">
                    <h1 className="text-3xl md:text-4xl font-bold mb-6 relative pb-4 text-hindu-secondary">
                        {t('hindu.title')}
                        <span className="absolute bottom-0 left-1/2 w-20 h-1 -translate-x-1/2 bg-hindu-secondary"></span>
                    </h1>
                </AnimatedSection>

                <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
                    <AnimatedSection className="order-2 md:order-1">
                        <div className="rounded-lg overflow-hidden shadow-lg transform transition-transform duration-500 hover:scale-[1.02]">
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
                        <button className="inline-block py-3 px-6 rounded-full font-semibold bg-hindu-secondary text-white transition-all duration-300 relative overflow-hidden z-10 hover:shadow-md">
                            {t('hindu.rsvpButton')}
                            <span className="absolute bottom-0 left-0 w-full h-0 bg-white/20 transition-all duration-300 -z-10 group-hover:h-full"></span>
                        </button>
                    </AnimatedSection>
                </div>

                <AnimatedSection className="mb-16" delay={0.3}>
                    <CeremonyDetails details={ceremonyDetails} theme="hindu" />
                </AnimatedSection>

                <AnimatedSection className="mt-20" delay={0.4}>
                    <h2 className="text-2xl font-bold mb-10 text-center text-hindu-secondary">{t('hindu.schedule.title')}</h2>
                    <CeremonyTimeline events={timelineEvents} theme="hindu" />
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
    );
};

export default HinduCeremony;
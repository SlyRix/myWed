// src/components/gifts/GiftRegistry.js
import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import GiftCard from './GiftCard';
import AnimatedSection from '../common/AnimatedSection';
import { mdiHome, mdiAirplane, mdiStore, mdiCashMultiple } from '@mdi/js';
import Icon from '@mdi/react';

const GiftRegistry = () => {
    const { t } = useTranslation();

    const giftOptions = [
        {
            icon: mdiHome,
            title: t('gifts.options.homeFund.title'),
            description: t('gifts.options.homeFund.description'),
            color: 'bg-christian-accent'
        },
        {
            icon: mdiAirplane,
            title: t('gifts.options.honeymoonFund.title'),
            description: t('gifts.options.honeymoonFund.description'),
            color: 'bg-hindu-secondary'
        },
        {
            icon: mdiStore,
            title: t('gifts.options.registry.title'),
            description: t('gifts.options.registry.description'),
            color: 'bg-blue-500'
        },
        {
            icon: mdiCashMultiple,
            title: t('gifts.options.charity.title'),
            description: t('gifts.options.charity.description'),
            color: 'bg-green-500'
        }
    ];

    return (
        <section className="pt-24 pb-20 bg-gray-50">
            <div className="container mx-auto max-w-6xl px-4">
                <AnimatedSection className="text-center mb-16">
                    <h1 className="text-4xl font-bold mb-6">{t('gifts.title')}</h1>
                    <p className="text-gray-700 max-w-2xl mx-auto">
                        {t('gifts.description')}
                    </p>
                </AnimatedSection>

                <AnimatedSection className="max-w-2xl mx-auto mb-16">
                    <GiftCard />
                </AnimatedSection>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {giftOptions.map((option, index) => (
                        <AnimatedSection
                            key={index}
                            className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:-translate-y-2 hover:shadow-lg"
                            delay={index * 0.1}
                        >
                            <div className={`h-2 ${option.color}`}></div>
                            <div className="p-6 text-center">
                                <Icon path={option.icon} size={2} className="mx-auto mb-4 text-gray-700" />
                                <h3 className="text-xl font-bold mb-2">{option.title}</h3>
                                <p className="text-gray-600 mb-4">{option.description}</p>
                                <button className={`${option.color} text-white py-2 px-4 rounded-full hover:opacity-90 transition-opacity`}>
                                    Select
                                </button>
                            </div>
                        </AnimatedSection>
                    ))}
                </div>

                <AnimatedSection className="mt-16 max-w-3xl mx-auto text-center p-8 bg-white rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold mb-4">{t('gifts.note.title')}</h2>
                    <p className="text-gray-700 mb-4">
                        {t('gifts.note.description1')}
                    </p>
                    <p className="text-gray-700">
                        {t('gifts.note.description2')}
                    </p>
                </AnimatedSection>
            </div>
        </section>
    );
};

export default GiftRegistry;
// src/components/gifts/GiftRegistry.js
import React from 'react';
import { useTranslation } from 'react-i18next';
import AnimatedSection from '../common/AnimatedSection';
import BubbleBackground from "../common/BubbleBackground";
import GiftList from './GiftList';

const GiftRegistry = () => {
    const { t } = useTranslation();

    return (
        <section className="pt-24 pb-20 relative overflow-hidden">
            {/* Animated Bubble Background */}
            {/* Bubble Background */}
            <BubbleBackground
                count={20}
                colors={['#d4b08c', '#f0b429', '#b08968']}
                opacity={{ min: 0.02, max: 0.06 }}
                size={{ min: 80, max: 250 }}
            />

            <div className="container mx-auto max-w-6xl px-4 relative z-10">
                <AnimatedSection className="text-center mb-16">
                    <h1 className="text-4xl font-bold mb-6">{t('gifts.title')}</h1>
                    <p className="text-gray-700 max-w-2xl mx-auto">
                        {t('gifts.description')}
                    </p>
                </AnimatedSection>

                {/* Gift List Component */}
                <GiftList />

                <AnimatedSection className="mt-16 max-w-3xl mx-auto text-center p-8 bg-white rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold mb-4">{t('gifts.note.title')}</h2>
                    <p className="text-gray-700">
                        {t('gifts.note.description')}
                    </p>
                </AnimatedSection>
            </div>
        </section>
    );
};

export default GiftRegistry;
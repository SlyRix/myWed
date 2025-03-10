import React from 'react';
import { motion } from 'framer-motion';
import GiftCard from './GiftCard';
import AnimatedSection from '../common/AnimatedSection';
import { mdiHome, mdiAirplane, mdiStore, mdiCashMultiple } from '@mdi/js';
import Icon from '@mdi/react';

const GiftRegistry = () => {
    const giftOptions = [
        {
            icon: mdiHome,
            title: 'Home Fund',
            description: 'Help us build our dream home',
            color: 'bg-christian-accent'
        },
        {
            icon: mdiAirplane,
            title: 'Honeymoon Fund',
            description: 'Contribute to our adventure',
            color: 'bg-hindu-secondary'
        },
        {
            icon: mdiStore,
            title: 'Registry',
            description: 'View our wish list',
            color: 'bg-blue-500'
        },
        {
            icon: mdiCashMultiple,
            title: 'Charity Donation',
            description: 'Give in our honor',
            color: 'bg-green-500'
        }
    ];

    return (
        <section className="pt-24 pb-20 bg-gray-50">
            <div className="container">
                <AnimatedSection className="text-center mb-16">
                    <h1 className="text-4xl font-bold mb-6">Wedding Gifts</h1>
                    <p className="text-gray-700 max-w-2xl mx-auto">
                        Your presence at our wedding is the greatest gift of all. However, if you wish to honor us with a gift, we have created a registry for your convenience.
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
                    <h2 className="text-2xl font-bold mb-4">A Note About Gifts</h2>
                    <p className="text-gray-700 mb-4">
                        We're truly honored that you will be celebrating our special day with us. Your presence is what matters most, and we're grateful for your love and support.
                    </p>
                    <p className="text-gray-700">
                        If you'd like to give a gift, we hope our registry provides some helpful guidance. We've created options that would be meaningful to us as we start this new chapter together.
                    </p>
                </AnimatedSection>
            </div>
        </section>
    );
};

export default GiftRegistry;
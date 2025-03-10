// src/components/gifts/GiftRegistry.js
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { mdiHome, mdiAirplane, mdiSilverwareFork, mdiBed, mdiCashMultiple, mdiCart, mdiCheck, mdiLink, mdiGift } from '@mdi/js';
import Icon from '@mdi/react';
import { useTranslation } from 'react-i18next';
import AnimatedSection from '../common/AnimatedSection';
import BubbleBackground from '../common/BubbleBackground';

const GiftRegistry = () => {
    const { t } = useTranslation();
    const [activeCategory, setActiveCategory] = useState('all');

    // Gift categories with icons
    const categories = [
        { id: 'all', label: 'All Gifts', icon: mdiGift },
        { id: 'kitchen', label: 'Kitchen', icon: mdiSilverwareFork },
        { id: 'home', label: 'Home', icon: mdiHome },
        { id: 'bedroom', label: 'Bedroom', icon: mdiBed },
        { id: 'honeymoon', label: 'Honeymoon', icon: mdiAirplane },
        { id: 'cash', label: 'Cash Gifts', icon: mdiCashMultiple },
    ];

    // Define gift items
    const giftItems = [
        {
            id: 1,
            name: 'Stand Mixer',
            category: 'kitchen',
            description: 'Professional 5.7L stand mixer in silver',
            price: '€399',
            image: '/images/placeholder.jpg',
            purchased: false,
            link: 'https://www.amazon.com'
        },
        {
            id: 2,
            name: 'Dinner Set',
            category: 'kitchen',
            description: '12-piece porcelain dinner set with elegant gold trim',
            price: '€199',
            image: '/images/placeholder.jpg',
            purchased: true,
            purchasedBy: 'Meier Family',
            link: 'https://www.amazon.com'
        },
        {
            id: 3,
            name: 'Coffee Machine',
            category: 'kitchen',
            description: 'Automatic espresso machine with milk frother',
            price: '€499',
            image: '/images/placeholder.jpg',
            purchased: false,
            link: 'https://www.amazon.com'
        },
        {
            id: 4,
            name: 'Smart TV',
            category: 'home',
            description: '65" 4K Ultra HD Smart TV with voice control',
            price: '€899',
            image: '/images/placeholder.jpg',
            purchased: false,
            link: 'https://www.amazon.com'
        },
        {
            id: 5,
            name: 'Artwork',
            category: 'home',
            description: 'Canvas print set - Abstract modern design',
            price: '€249',
            image: '/images/placeholder.jpg',
            purchased: false,
            link: 'https://www.amazon.com'
        },
        {
            id: 6,
            name: 'Luxury Bedding Set',
            category: 'bedroom',
            description: 'King-size 100% Egyptian cotton 800 thread count',
            price: '€299',
            image: '/images/placeholder.jpg',
            purchased: true,
            purchasedBy: 'Schmidt Family',
            link: 'https://www.amazon.com'
        },
        {
            id: 7,
            name: 'Decorative Pillows',
            category: 'bedroom',
            description: 'Set of 4 decorative throw pillows in matching colors',
            price: '€129',
            image: '/images/placeholder.jpg',
            purchased: false,
            link: 'https://www.amazon.com'
        }
    ];

    // Cash gift options
    const cashGifts = [
        {
            id: 'honeymoon',
            title: 'Honeymoon Fund',
            description: 'Help us create unforgettable memories on our dream honeymoon to Bali',
            icon: mdiAirplane,
            color: 'bg-gradient-to-r from-blue-500 to-indigo-500',
            progress: 65,
            goal: '€3000'
        },
        {
            id: 'homefund',
            title: 'Home Fund',
            description: 'Contribute to our first home together',
            icon: mdiHome,
            color: 'bg-gradient-to-r from-green-500 to-emerald-500',
            progress: 40,
            goal: '€5000'
        },
        {
            id: 'charity',
            title: 'Charity Donation',
            description: 'Donate to Plan International in our name to support children in need',
            icon: mdiGift,
            color: 'bg-gradient-to-r from-christian-accent to-wedding-love',
            progress: 30,
            goal: '€1000'
        }
    ];

    // Filter gift items by category
    const filteredGifts = activeCategory === 'all'
        ? giftItems
        : giftItems.filter(item => item.category === activeCategory);

    // Check if cash category is active
    const showCashGifts = activeCategory === 'all' || activeCategory === 'cash';

    return (
        <section className="pt-24 pb-20 relative overflow-hidden">
            {/* Animated Bubble Background */}
            <BubbleBackground />

            <div className="container mx-auto max-w-6xl px-4 relative z-10">
                <AnimatedSection className="text-center mb-16">
                    <h1 className="text-4xl font-bold mb-6">{t('gifts.title')}</h1>
                    <p className="text-gray-700 max-w-2xl mx-auto">
                        Your presence at our wedding is the greatest gift of all. However, if you wish to honor us with a present, we've created this registry to provide some inspiration.
                    </p>
                </AnimatedSection>

                {/* Amazon Wishlist Banner */}
                <AnimatedSection className="mb-16">
                    <motion.div
                        className="relative overflow-hidden rounded-xl bg-gradient-to-r from-hindu-primary to-christian-primary p-6 shadow-lg"
                        whileHover={{ scale: 1.01 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="flex flex-col md:flex-row items-center justify-between">
                            <div className="mb-6 md:mb-0 md:mr-6">
                                <h2 className="text-2xl font-bold mb-2">View Our Amazon Wishlist</h2>
                                <p className="text-gray-700 max-w-xl">
                                    We've created an Amazon wishlist with items we'd love to receive. When you purchase from this list, it will be automatically marked as bought to avoid duplicates.
                                </p>
                            </div>
                            <a
                                href="https://www.amazon.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-christian-accent to-hindu-secondary text-white rounded-full font-semibold hover:shadow-lg transition-all duration-300"
                            >
                                <Icon path={mdiCart} size={1} className="mr-2" />
                                View Wishlist
                            </a>
                        </div>

                        {/* Animated circles */}
                        <motion.div
                            className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-christian-accent opacity-10"
                            animate={{
                                scale: [1, 1.1, 1],
                                opacity: [0.05, 0.08, 0.05]
                            }}
                            transition={{
                                duration: 6,
                                repeat: Infinity,
                                repeatType: "reverse"
                            }}
                        />
                        <motion.div
                            className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-hindu-secondary opacity-10"
                            animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.05, 0.1, 0.05]
                            }}
                            transition={{
                                duration: 5,
                                repeat: Infinity,
                                repeatType: "reverse",
                                delay: 1
                            }}
                        />
                    </motion.div>
                </AnimatedSection>

                {/* Category Filters */}
                <AnimatedSection className="mb-8">
                    <div className="flex flex-wrap justify-center gap-3">
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                className={`flex items-center px-4 py-2 rounded-full transition-all duration-300 ${
                                    activeCategory === category.id
                                        ? 'bg-gradient-to-r from-christian-accent to-hindu-secondary text-white font-medium shadow-md'
                                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                                }`}
                                onClick={() => setActiveCategory(category.id)}
                            >
                                <Icon path={category.icon} size={0.7} className="mr-2" />
                                <span>{category.label}</span>
                            </button>
                        ))}
                    </div>
                </AnimatedSection>

                {/* Gift Items Grid */}
                {(activeCategory !== 'cash' && filteredGifts.length > 0) && (
                    <AnimatedSection className="mb-16">
                        <h2 className="text-2xl font-bold mb-8 text-center">Registry Items</h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredGifts.map((gift, index) => (
                                <AnimatedSection
                                    key={gift.id}
                                    className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg ${
                                        gift.purchased ? 'opacity-75' : ''
                                    }`}
                                    delay={index * 0.1}
                                >
                                    <div className="relative h-48 overflow-hidden">
                                        <img
                                            src={gift.image}
                                            alt={gift.name}
                                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                                        />
                                        {gift.purchased && (
                                            <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center">
                                                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-2">
                                                    <Icon path={mdiCheck} size={1.2} className="text-green-600" />
                                                </div>
                                                <p className="font-bold text-gray-800">Already Purchased</p>
                                                <p className="text-sm text-gray-600">by {gift.purchasedBy}</p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-5">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-xl font-bold">{gift.name}</h3>
                                            <span className="text-christian-accent font-bold">{gift.price}</span>
                                        </div>
                                        <p className="text-gray-700 mb-4">{gift.description}</p>
                                        {!gift.purchased && (
                                            <a
                                                href={gift.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center text-sm px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                                            >
                                                <Icon path={mdiLink} size={0.7} className="mr-1" />
                                                View on Amazon
                                            </a>
                                        )}
                                    </div>
                                </AnimatedSection>
                            ))}
                        </div>
                    </AnimatedSection>
                )}

                {/* Cash Gift Options */}
                {showCashGifts && (
                    <AnimatedSection className="mb-16">
                        <h2 className="text-2xl font-bold mb-8 text-center">Cash Gift Options</h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            {cashGifts.map((cashGift, index) => (
                                <AnimatedSection
                                    key={cashGift.id}
                                    className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                                    delay={index * 0.1}
                                >
                                    <div className={`h-2 ${cashGift.color}`}></div>
                                    <div className="p-6 relative">
                                        {/* Animated bubbles */}
                                        <motion.div
                                            className="absolute top-1/4 right-0 w-24 h-24 rounded-full bg-gray-200 opacity-10"
                                            animate={{
                                                scale: [1, 1.2, 1],
                                                x: [0, 10, 0],
                                                opacity: [0.05, 0.1, 0.05]
                                            }}
                                            transition={{
                                                duration: 5,
                                                repeat: Infinity,
                                                repeatType: "reverse"
                                            }}
                                        />

                                        <div className="flex items-center mb-4">
                                            <div className={`w-12 h-12 rounded-full ${cashGift.color} flex items-center justify-center text-white`}>
                                                <Icon path={cashGift.icon} size={1} />
                                            </div>
                                            <h3 className="ml-4 text-xl font-bold">{cashGift.title}</h3>
                                        </div>

                                        <p className="text-gray-700 mb-6">{cashGift.description}</p>

                                        <div className="mb-4">
                                            <div className="flex justify-between text-sm mb-1">
                                                <span>Progress: {cashGift.progress}%</span>
                                                <span>Goal: {cashGift.goal}</span>
                                            </div>
                                            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                                <motion.div
                                                    className={`h-full ${cashGift.color}`}
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${cashGift.progress}%` }}
                                                    transition={{ duration: 1, delay: index * 0.2 }}
                                                />
                                            </div>
                                        </div>

                                        <a
                                            href="#"
                                            className={`inline-block py-2 px-6 ${cashGift.color} text-white rounded-full font-semibold hover:shadow-md transition-shadow`}
                                        >
                                            Contribute
                                        </a>
                                    </div>
                                </AnimatedSection>
                            ))}
                        </div>
                    </AnimatedSection>
                )}

                <AnimatedSection className="mt-16 max-w-3xl mx-auto text-center p-8 bg-white rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold mb-4">{t('gifts.note.title')}</h2>
                    <p className="text-gray-700 mb-4">
                        We're truly honored that you will be celebrating our special day with us. Your presence is what matters most, and we're grateful for your love and support.
                    </p>
                    <p className="text-gray-700">
                        If you have any questions about our registry or gift preferences, please don't hesitate to contact us.
                    </p>
                </AnimatedSection>
            </div>
        </section>
    );
};

export default GiftRegistry;
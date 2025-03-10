// src/components/story/OurStory.js
import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import StoryTimeline from './StoryTimeline';
import AnimatedSection from '../common/AnimatedSection';
import BubbleBackground from '../common/BubbleBackground';
import ParallaxSection from '../common/ParallaxSection';

const OurStory = () => {
    const { t } = useTranslation();

    const storyEvents = [
        {
            date: t('story.events.met.date'),
            title: t('story.events.met.title'),
            description: t('story.events.met.description'),
            image: '/images/placeholder.jpg'
        },
        {
            date: t('story.events.firstDate.date'),
            title: t('story.events.firstDate.title'),
            description: t('story.events.firstDate.description'),
            image: '/images/placeholder.jpg'
        },
        {
            date: t('story.events.families.date'),
            title: t('story.events.families.title'),
            description: t('story.events.families.description'),
            image: '/images/placeholder.jpg'
        },
        {
            date: t('story.events.proposal.date'),
            title: t('story.events.proposal.title'),
            description: t('story.events.proposal.description'),
            image: '/images/placeholder.jpg'
        },
        {
            date: t('story.events.engagement.date'),
            title: t('story.events.engagement.title'),
            description: t('story.events.engagement.description'),
            image: '/images/placeholder.jpg'
        },
        {
            date: t('story.events.wedding.date'),
            title: t('story.events.wedding.title'),
            description: t('story.events.wedding.description'),
            image: '/images/placeholder.jpg'
        }
    ];

    return (
        <ParallaxSection
            bgColor="#f9f7f7"
            height="min-h-screen"
            className="pt-24 pb-20 relative"
        >
            {/* Bubble Background */}
            <BubbleBackground
                count={12}
                colors={['#d4b08c', '#f0b429', '#b08968']}
                opacity={{ min: 0.02, max: 0.06 }}
                size={{ min: 80, max: 250 }}
            />

            <div className="container mx-auto max-w-6xl px-4 relative z-10">
                <AnimatedSection className="text-center mb-16">
                    <h1 className="text-4xl font-bold mb-6">{t('story.title')}</h1>
                    <p className="text-gray-700 max-w-2xl mx-auto">
                        {t('story.description')}
                    </p>
                </AnimatedSection>

                <div className="relative">
                    {/* Decorative elements */}
                    <div className="absolute h-full w-1 bg-gradient-to-b from-christian-accent to-hindu-secondary left-1/2 -translate-x-1/2 hidden md:block"></div>

                    {/* Floating animated highlights for the timeline */}
                    <motion.div
                        className="absolute left-1/2 top-1/4 w-20 h-20 rounded-full bg-christian-accent/20 -z-10 hidden md:block"
                        style={{ translateX: '-50%' }}
                        animate={{
                            scale: [1, 1.3, 1],
                            opacity: [0.2, 0.1, 0.2]
                        }}
                        transition={{
                            duration: 5,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />

                    <motion.div
                        className="absolute left-1/2 top-1/2 w-16 h-16 rounded-full bg-hindu-secondary/20 -z-10 hidden md:block"
                        style={{ translateX: '-50%' }}
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.2, 0.15, 0.2]
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 2
                        }}
                    />

                    <motion.div
                        className="absolute left-1/2 top-3/4 w-24 h-24 rounded-full bg-christian-accent/15 -z-10 hidden md:block"
                        style={{ translateX: '-50%' }}
                        animate={{
                            scale: [1, 1.4, 1],
                            opacity: [0.15, 0.05, 0.15]
                        }}
                        transition={{
                            duration: 6,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 1
                        }}
                    />

                    <StoryTimeline events={storyEvents} />
                </div>

                <AnimatedSection className="mt-20 max-w-3xl mx-auto text-center p-8 bg-white rounded-lg shadow-lg relative overflow-hidden">
                    {/* Inner bubble animation for card */}
                    <motion.div
                        className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-christian-accent opacity-5"
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.05, 0.08, 0.05]
                        }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />

                    <motion.div
                        className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-hindu-secondary opacity-5"
                        animate={{
                            scale: [1, 1.3, 1],
                            opacity: [0.05, 0.07, 0.05]
                        }}
                        transition={{
                            duration: 10,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 2
                        }}
                    />

                    <div className="relative z-10">
                        <h2 className="text-2xl font-bold mb-4">{t('story.cultures.title')}</h2>
                        <p className="text-gray-700 mb-4">
                            {t('story.cultures.description1')}
                        </p>
                        <p className="text-gray-700">
                            {t('story.cultures.description2')}
                        </p>
                    </div>
                </AnimatedSection>
            </div>
        </ParallaxSection>
    );
};

export default OurStory;
// src/components/story/OurStory.js
import React from 'react';
import { useTranslation } from 'react-i18next';
import StoryTimeline from './StoryTimeline';
import AnimatedSection from '../common/AnimatedSection';

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
        <section className="pt-24 pb-20 bg-gradient-to-r from-christian-secondary/30 to-hindu-primary/20 overflow-hidden">
            <div className="container mx-auto max-w-6xl px-4">
                <AnimatedSection className="text-center mb-16">
                    <h1 className="text-4xl font-bold mb-6">{t('story.title')}</h1>
                    <p className="text-gray-700 max-w-2xl mx-auto">
                        {t('story.description')}
                    </p>
                </AnimatedSection>

                <div className="relative">
                    {/* Decorative elements */}
                    <div className="absolute h-full w-1 bg-gradient-to-b from-christian-accent to-hindu-secondary left-1/2 -translate-x-1/2 hidden md:block"></div>

                    <StoryTimeline events={storyEvents} />
                </div>

                <AnimatedSection className="mt-20 max-w-3xl mx-auto text-center p-8 bg-white rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold mb-4">{t('story.cultures.title')}</h2>
                    <p className="text-gray-700 mb-4">
                        {t('story.cultures.description1')}
                    </p>
                    <p className="text-gray-700">
                        {t('story.cultures.description2')}
                    </p>
                </AnimatedSection>
            </div>
        </section>
    );
};

export default OurStory;
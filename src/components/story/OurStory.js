import React from 'react';
import StoryTimeline from './StoryTimeline';
import AnimatedSection from '../common/AnimatedSection';

const OurStory = () => {
    const storyEvents = [
        {
            date: 'June 2020',
            title: 'How We Met',
            description: 'We first met at a mutual friend\'s birthday party. What started as a casual conversation over cake turned into hours of talking about our shared interests and dreams.',
            image: '/images/placeholder.jpg'
        },
        {
            date: 'December 2020',
            title: 'First Date',
            description: 'After months of friendship, we finally went on our first official date to a local coffee shop. We talked for hours, completely losing track of time.',
            image: '/images/placeholder.jpg'
        },
        {
            date: 'August 2021',
            title: 'Meeting the Families',
            description: 'We introduced each other to our families. Despite our different cultural backgrounds, both families welcomed us with open arms and open hearts.',
            image: '/images/placeholder.jpg'
        },
        {
            date: 'July 2023',
            title: 'The Proposal',
            description: 'During a sunset hike to our favorite viewpoint, surrounded by nature and the golden glow of the setting sun, the question was asked and answered with tears of joy.',
            image: '/images/placeholder.jpg'
        },
        {
            date: 'January 2024',
            title: 'Engagement Ceremony',
            description: 'We celebrated our engagement with a beautiful ceremony that blended both our traditions, a perfect representation of our future together.',
            image: '/images/placeholder.jpg'
        },
        {
            date: 'Summer 2026',
            title: 'Our Wedding',
            description: 'And now, we\'re excited to celebrate the next chapter of our journey with all our loved ones. We can\'t wait to create more beautiful memories together.',
            image: '/images/placeholder.jpg'
        }
    ];

    return (
        <section className="pt-24 pb-20 bg-gradient-to-r from-christian-secondary/30 to-hindu-primary/20 overflow-hidden">
            <div className="container mx-auto max-w-6xl px-4">
                <AnimatedSection className="text-center mb-16">
                    <h1 className="text-4xl font-bold mb-6">Our Story</h1>
                    <p className="text-gray-700 max-w-2xl mx-auto">
                        Every love story is beautiful, but ours is our favorite. Here's a glimpse into our journey from strangers to soulmates.
                    </p>
                </AnimatedSection>

                <div className="relative">
                    {/* Decorative elements */}
                    <div className="absolute h-full w-1 bg-gradient-to-b from-christian-accent to-hindu-secondary left-1/2 -translate-x-1/2 hidden md:block"></div>

                    <StoryTimeline events={storyEvents} />
                </div>

                <AnimatedSection className="mt-20 max-w-3xl mx-auto text-center p-8 bg-white rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold mb-4">A Union of Cultures</h2>
                    <p className="text-gray-700 mb-4">
                        Our relationship has been a beautiful journey of bridging two different cultures and traditions. We've learned from each other, grown together, and found harmony in our diversity.
                    </p>
                    <p className="text-gray-700">
                        Our wedding will be a celebration of this union, honoring both Christian and Hindu traditions. We invite you to join us in this joyous celebration of love, family, and cultural harmony.
                    </p>
                </AnimatedSection>
            </div>
        </section>
    );
};

export default OurStory;
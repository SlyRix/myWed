import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { mdiMapMarker, mdiCalendar, mdiTshirtCrew } from '@mdi/js';
import Icon from '@mdi/react';
import CeremonyTimeline from './CeremonyTimeline';
import CeremonyDetails from './CeremonyDetails';
import AnimatedSection from '../common/AnimatedSection';

const HinduCeremony = () => {
    // Timeline events
    const timelineEvents = [
        { time: '9:00 AM', title: 'Baraat', description: 'The groom\'s procession arrives at the venue.' },
        { time: '9:30 AM', title: 'Milni', description: 'The greeting ceremony between both families.' },
        { time: '10:00 AM', title: 'Ganesh Puja', description: 'Prayer to Lord Ganesh to remove obstacles.' },
        { time: '10:30 AM', title: 'Mandap Ceremony', description: 'The main wedding rituals begin under the mandap.' },
        { time: '11:30 AM', title: 'Saptapadi', description: 'The couple takes seven steps together, making vows.' },
        { time: '12:30 PM', title: 'Mangalsutra', description: 'The groom ties the sacred necklace around the bride\'s neck.' },
        { time: '1:00 PM', title: 'Ashirwad', description: 'Blessings from elders.' },
        { time: '1:30 PM', title: 'Lunch', description: 'Traditional Indian feast.' }
    ];

    // Ceremony details
    const ceremonyDetails = [
        {
            icon: mdiMapMarker,
            title: 'Location',
            content: ['Shiva Temple', '456 Divine Road, City'],
            link: { text: 'View on Map', url: '#' }
        },
        {
            icon: mdiCalendar,
            title: 'Date & Time',
            content: ['July 5, 2026', '10:00 AM - 2:00 PM']
        },
        {
            icon: mdiTshirtCrew,
            title: 'Dress Code',
            content: ['Traditional Indian Attire', 'Vibrant colors encouraged']
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
                        Hindu Ceremony
                        <span className="absolute bottom-0 left-1/2 w-20 h-1 -translate-x-1/2 bg-hindu-secondary"></span>
                    </h1>
                </AnimatedSection>

                <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
                    <AnimatedSection className="order-2 md:order-1">
                        <div className="rounded-lg overflow-hidden shadow-lg transform transition-transform duration-500 hover:scale-[1.02]">
                            <img
                                src="/images/placeholder.jpg"
                                alt="Hindu Ceremony"
                                className="w-full h-[350px] object-cover"
                            />
                        </div>
                    </AnimatedSection>

                    <AnimatedSection className="order-1 md:order-2" delay={0.2}>
                        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-hindu-secondary">Celebrate Our Hindu Wedding Ceremony</h2>
                        <p className="text-gray-700 mb-4">
                            We warmly invite you to our traditional Hindu wedding ceremony. This vibrant celebration will honor ancient customs and rituals that symbolize the sacred union of two souls.
                        </p>
                        <p className="text-gray-700 mb-6">
                            The ceremony will take place in a beautifully decorated mandap, where we will perform various rituals guided by a Hindu priest. Your presence would make this auspicious occasion even more special.
                        </p>
                        <button className="inline-block py-3 px-6 rounded-full font-semibold bg-hindu-secondary text-white transition-all duration-300 relative overflow-hidden z-10 hover:shadow-md">
                            RSVP Now
                            <span className="absolute bottom-0 left-0 w-full h-0 bg-white/20 transition-all duration-300 -z-10 group-hover:h-full"></span>
                        </button>
                    </AnimatedSection>
                </div>

                <AnimatedSection className="mb-16" delay={0.3}>
                    <CeremonyDetails details={ceremonyDetails} theme="hindu" />
                </AnimatedSection>

                <AnimatedSection className="mt-20" delay={0.4}>
                    <h2 className="text-2xl font-bold mb-10 text-center text-hindu-secondary">Ceremony Schedule</h2>
                    <CeremonyTimeline events={timelineEvents} theme="hindu" />
                </AnimatedSection>

                <AnimatedSection className="mt-16 text-center" delay={0.5}>
                    <h2 className="text-2xl font-bold mb-6 text-hindu-secondary">Important Hindu Wedding Rituals</h2>
                    <p className="text-gray-700 max-w-3xl mx-auto mb-8">
                        Our Hindu wedding ceremony will include several meaningful rituals that symbolize our commitment and the joining of our families.
                    </p>

                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            { title: 'Mandap', description: 'A covered structure where the ceremony takes place' },
                            { title: 'Kanyadaan', description: 'The giving away of the bride by her father' },
                            { title: 'Mangal Phera', description: 'The couple circles the sacred fire four times' }
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
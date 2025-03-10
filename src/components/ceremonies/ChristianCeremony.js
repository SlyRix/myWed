import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { mdiMapMarker, mdiCalendar, mdiTshirtCrew } from '@mdi/js';
import Icon from '@mdi/react';
import CeremonyTimeline from './CeremonyTimeline';

const ChristianCeremony = () => {
    // Timeline events
    const timelineEvents = [
        { time: '1:30 PM', title: 'Guest Arrival', description: 'Please arrive at the church 30 minutes before the ceremony begins.' },
        { time: '2:00 PM', title: 'Ceremony Begins', description: 'The bride walks down the aisle, accompanied by her father.' },
        { time: '2:45 PM', title: 'Exchange of Vows', description: 'The couple exchange their vows and rings.' },
        { time: '3:15 PM', title: 'Pronouncement', description: 'The couple is pronounced husband and wife.' },
        { time: '3:30 PM', title: 'Recessional', description: 'The newlyweds exit the church, followed by the wedding party.' },
        { time: '3:45 PM', title: 'Photos', description: 'Group photos outside the church.' }
    ];

    // Animation for content sections
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
    };

    // IntersectionObserver hooks for animations
    const [textRef, textInView] = useInView({ triggerOnce: true, threshold: 0.1 });
    const [detailsRef, detailsInView] = useInView({ triggerOnce: true, threshold: 0.1 });
    const [timelineRef, timelineInView] = useInView({ triggerOnce: true, threshold: 0.1 });

    return (
        <section className="pt-24 pb-16 bg-gradient-to-br from-christian-secondary to-white relative overflow-hidden">
            <div className="container mx-auto px-4 max-w-6xl">
                <h2 className="text-3xl md:text-4xl text-center mb-12 relative pb-4 font-bold text-christian-text">
                    Christian Ceremony
                    <span className="absolute bottom-0 left-1/2 w-20 h-1 -translate-x-1/2 bg-christian-accent"></span>
                </h2>

                <div className="flex flex-col md:flex-row items-center mb-16 gap-8">
                    <motion.div
                        className="md:w-1/2"
                        ref={textRef}
                        initial="hidden"
                        animate={textInView ? "visible" : "hidden"}
                        variants={fadeIn}
                    >
                        <h3 className="text-2xl md:text-3xl font-bold mb-6 text-christian-accent">Join Us for Our Christian Wedding Ceremony</h3>
                        <p className="text-gray-700 mb-4">
                            We are delighted to invite you to our Christian wedding ceremony. This sacred occasion will be a celebration of our love and commitment to each other, guided by Christian traditions and values.
                        </p>
                        <p className="text-gray-700 mb-6">
                            The ceremony will take place in a beautiful church setting, where we will exchange vows and rings before God and our loved ones. We would be honored to have you witness this special moment in our lives.
                        </p>
                        <button className="inline-block py-3 px-6 rounded-full font-semibold transition-all duration-300 relative overflow-hidden z-10 bg-christian-accent text-white hover:shadow-md">
                            RSVP Now
                            <span className="absolute bottom-0 left-0 w-full h-0 bg-white/20 transition-all duration-300 -z-10 group-hover:h-full"></span>
                        </button>
                    </motion.div>

                    <motion.div
                        className="md:w-1/2 h-[350px] rounded-lg overflow-hidden shadow-lg"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <img
                            src="/images/placeholder.jpg"
                            alt="Christian Ceremony"
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        />
                    </motion.div>
                </div>

                <motion.div
                    className="grid md:grid-cols-3 gap-6 mb-16"
                    ref={detailsRef}
                    initial="hidden"
                    animate={detailsInView ? "visible" : "hidden"}
                    variants={{
                        visible: { transition: { staggerChildren: 0.2 } }
                    }}
                >
                    <motion.div
                        className="flex-1 min-w-[250px] mb-8 p-6 bg-white rounded-lg shadow-md text-center transition-all duration-300 hover:translate-y-[-10px] hover:shadow-lg border-t-4 border-christian-accent"
                        variants={fadeIn}
                    >
                        <Icon path={mdiMapMarker} size={2} className="mx-auto text-5xl mb-4 text-christian-accent" />
                        <h3 className="text-xl font-bold mb-3">Location</h3>
                        <p className="mb-1">St. Mary's Church</p>
                        <p className="text-gray-600 mb-1">123 Wedding Lane, City</p>
                        <a href="#" className="inline-block mt-3 text-sm font-medium text-christian-accent hover:underline">View on Map</a>
                    </motion.div>

                    <motion.div
                        className="flex-1 min-w-[250px] mb-8 p-6 bg-white rounded-lg shadow-md text-center transition-all duration-300 hover:translate-y-[-10px] hover:shadow-lg border-t-4 border-christian-accent"
                        variants={fadeIn}
                    >
                        <Icon path={mdiCalendar} size={2} className="mx-auto text-5xl mb-4 text-christian-accent" />
                        <h3 className="text-xl font-bold mb-3">Date & Time</h3>
                        <p className="mb-1">July 4, 2026</p>
                        <p className="text-gray-600 mb-1">2:00 PM - 4:00 PM</p>
                    </motion.div>

                    <motion.div
                        className="flex-1 min-w-[250px] mb-8 p-6 bg-white rounded-lg shadow-md text-center transition-all duration-300 hover:translate-y-[-10px] hover:shadow-lg border-t-4 border-christian-accent"
                        variants={fadeIn}
                    >
                        <Icon path={mdiTshirtCrew} size={2} className="mx-auto text-5xl mb-4 text-christian-accent" />
                        <h3 className="text-xl font-bold mb-3">Dress Code</h3>
                        <p className="mb-1">Formal Attire</p>
                        <p className="text-gray-600 mb-1">Light colors preferred</p>
                    </motion.div>
                </motion.div>

                <motion.div
                    className="mt-20"
                    ref={timelineRef}
                    initial="hidden"
                    animate={timelineInView ? "visible" : "hidden"}
                    variants={fadeIn}
                >
                    <h2 className="text-2xl font-bold mb-10 text-center text-christian-accent">Ceremony Schedule</h2>
                    <CeremonyTimeline events={timelineEvents} theme="christian" />
                </motion.div>
            </div>
        </section>
    );
};

export default ChristianCeremony;
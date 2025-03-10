import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { mdiMapMarker, mdiCalendar, mdiTshirtCrew } from '@mdi/js';
import Icon from '@mdi/react';
import CeremonyTimeline from './CeremonyTimeline';
import '../../styles/components/ceremony.css';

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
        <section className="ceremony christian-ceremony">
            <div className="container">
                <h2 className="section-title christian-title">Christian Ceremony</h2>

                <div className="ceremony-content">
                    <motion.div
                        className="ceremony-text"
                        ref={textRef}
                        initial="hidden"
                        animate={textInView ? "visible" : "hidden"}
                        variants={fadeIn}
                    >
                        <h3>Join Us for Our Christian Wedding Ceremony</h3>
                        <p>We are delighted to invite you to our Christian wedding ceremony. This sacred occasion will be a celebration of our love and commitment to each other, guided by Christian traditions and values.</p>
                        <p>The ceremony will take place in a beautiful church setting, where we will exchange vows and rings before God and our loved ones. We would be honored to have you witness this special moment in our lives.</p>
                        <button className="btn christian-btn">RSVP Now</button>
                    </motion.div>

                    <motion.div
                        className="ceremony-image"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    />
                </div>

                <motion.div
                    className="ceremony-details"
                    ref={detailsRef}
                    initial="hidden"
                    animate={detailsInView ? "visible" : "hidden"}
                    variants={{
                        visible: { transition: { staggerChildren: 0.2 } }
                    }}
                >
                    <motion.div className="detail-card" variants={fadeIn}>
                        <Icon path={mdiMapMarker} size={2} className="detail-icon" />
                        <h3>Location</h3>
                        <p>St. Mary's Church</p>
                        <p>123 Wedding Lane, City</p>
                        <a href="#">View on Map</a>
                    </motion.div>

                    <motion.div className="detail-card" variants={fadeIn}>
                        <Icon path={mdiCalendar} size={2} className="detail-icon" />
                        <h3>Date & Time</h3>
                        <p>July 4, 2026</p>
                        <p>2:00 PM - 4:00 PM</p>
                    </motion.div>

                    <motion.div className="detail-card" variants={fadeIn}>
                        <Icon path={mdiTshirtCrew} size={2} className="detail-icon" />
                        <h3>Dress Code</h3>
                        <p>Formal Attire</p>
                        <p>Light colors preferred</p>
                    </motion.div>
                </motion.div>

                <motion.div
                    ref={timelineRef}
                    initial="hidden"
                    animate={timelineInView ? "visible" : "hidden"}
                    variants={fadeIn}
                >
                    <CeremonyTimeline events={timelineEvents} theme="christian" />
                </motion.div>
            </div>
        </section>
    );
};

export default ChristianCeremony;
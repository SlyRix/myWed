import React from 'react';
import { motion } from 'framer-motion';
import '../../styles/components/timeline.css';

const CeremonyTimeline = ({ events, theme }) => {
    const timelineItem = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className={`${theme}-timeline timeline`}>
            {events.map((event, index) => (
                <motion.div
                    key={index}
                    className="timeline-item"
                    variants={timelineItem}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                    <div className="timeline-time">{event.time}</div>
                    <h3>{event.title}</h3>
                    <p>{event.description}</p>
                </motion.div>
            ))}
        </div>
    );
};

export default CeremonyTimeline;
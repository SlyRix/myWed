import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const AnimatedSection = ({ children, className, delay = 0, duration = 0.8, y = 20 }) => {
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1
    });

    const variants = {
        hidden: { opacity: 0, y },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration,
                delay
            }
        }
    };

    return (
        <motion.div
            ref={ref}
            className={className}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={variants}
        >
            {children}
        </motion.div>
    );
};

export default AnimatedSection;
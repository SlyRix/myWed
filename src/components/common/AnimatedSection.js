import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const AnimatedSection = memo(({ children, className, delay = 0, duration = 0.8, y = 20 }) => {
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
});

AnimatedSection.displayName = 'AnimatedSection';

AnimatedSection.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    delay: PropTypes.number,
    duration: PropTypes.number,
    y: PropTypes.number
};

AnimatedSection.defaultProps = {
    className: '',
    delay: 0,
    duration: 0.8,
    y: 20
};

export default AnimatedSection;
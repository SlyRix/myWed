// This utility file contains reusable animation variants for framer-motion

// Fade in animation with optional direction
export const fadeIn = (direction = null, delay = 0, duration = 0.8) => {
    let initial = { opacity: 0 };

    if (direction === 'up') {
        initial.y = 40;
    } else if (direction === 'down') {
        initial.y = -40;
    } else if (direction === 'left') {
        initial.x = 40;
    } else if (direction === 'right') {
        initial.x = -40;
    }

    return {
        initial,
        animate: {
            opacity: 1,
            x: 0,
            y: 0,
            transition: {
                duration,
                delay,
                ease: [0.6, 0.05, 0.01, 0.9]
            }
        }
    };
};

// Stagger children animations
export const staggerContainer = (staggerChildren = 0.1, delayChildren = 0) => {
    return {
        animate: {
            transition: {
                staggerChildren,
                delayChildren
            }
        }
    };
};

// Scale animation
export const scaleUp = (delay = 0, duration = 0.8) => {
    return {
        initial: { scale: 0.8, opacity: 0 },
        animate: {
            scale: 1,
            opacity: 1,
            transition: {
                duration,
                delay,
                ease: [0.6, 0.05, 0.01, 0.9]
            }
        }
    };
};

// Hover animation for buttons or interactive elements
export const hoverScale = {
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.98 }
};

// Page transition
export const pageAnimation = {
    initial: { opacity: 0 },
    animate: {
        opacity: 1,
        transition: {
            duration: 0.5,
            when: "beforeChildren",
            staggerChildren: 0.25
        }
    },
    exit: {
        opacity: 0,
        transition: {
            duration: 0.5
        }
    }
};

// Line drawing animation for SVG paths
export const drawPath = (delay = 0, duration = 1.5) => {
    return {
        initial: { pathLength: 0 },
        animate: {
            pathLength: 1,
            transition: {
                duration,
                delay,
                ease: "easeInOut"
            }
        }
    };
};
import React from 'react';
import { motion } from 'framer-motion';
import { mdiHeart } from '@mdi/js';
import Icon from '@mdi/react';

const LoadingSpinner = () => {
    return (
        <div className="flex flex-col items-center">
            <motion.div
                animate={{
                    scale: [1, 1.2, 1, 1.2, 1],
                    rotate: [0, 0, 180, 180, 0],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "loop"
                }}
                className="text-christian-accent"
            >
                <Icon path={mdiHeart} size={3} />
            </motion.div>

            <motion.div
                className="mt-6 flex space-x-3"
                initial="hidden"
                animate="visible"
                variants={{
                    hidden: { opacity: 0 },
                    visible: {
                        opacity: 1,
                        transition: {
                            staggerChildren: 0.3
                        }
                    }
                }}
            >
                {['R', '&', 'S'].map((letter, index) => (
                    <motion.span
                        key={index}
                        className="text-2xl font-bold"
                        variants={{
                            hidden: { y: 20, opacity: 0 },
                            visible: {
                                y: 0,
                                opacity: 1,
                                transition: {
                                    repeat: Infinity,
                                    repeatType: "reverse",
                                    duration: 0.5
                                }
                            }
                        }}
                        style={{ color: index === 0 ? '#d4b08c' : index === 2 ? '#ff5722' : '#2d3748' }}
                    >
                        {letter}
                    </motion.span>
                ))}
            </motion.div>
        </div>
    );
};

export default LoadingSpinner;

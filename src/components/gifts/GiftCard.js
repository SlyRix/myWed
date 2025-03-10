import React from 'react';
import { motion } from 'framer-motion';
import { mdiGift } from '@mdi/js';
import Icon from '@mdi/react';

const GiftCard = () => {
    return (
        <div className="w-full h-60 relative rounded-xl overflow-hidden shadow-lg">
            {/* Gradient background */}
            <div className="absolute inset-0 bg-gradient-to-r from-christian-accent to-hindu-secondary"></div>

            {/* Pattern overlay - removed reference to image */}
            <div className="absolute inset-0 opacity-10 bg-gradient-to-b from-white/20 to-transparent"></div>

            {/* Card content */}
            <div className="relative z-10 text-white h-full flex flex-col justify-between p-6">
                <div className="flex justify-between items-center">
                    <div className="text-xl font-bold">Gift Card</div>
                    <Icon path={mdiGift} size={1.5} />
                </div>

                <div className="text-2xl tracking-wider font-medium">
                    1234 5678 9012 3456
                </div>

                <div className="flex justify-between items-center">
                    <div className="uppercase tracking-wider text-sm">
                        Christian & Hindu
                    </div>
                    <div className="text-sm">
                        VALID THRU 12/28
                    </div>
                </div>
            </div>

            {/* Animated circle decorations */}
            <motion.div
                className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-white opacity-5"
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.05, 0.1, 0.05]
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity
                }}
            />

            <motion.div
                className="absolute bottom-0 right-1/4 w-40 h-40 rounded-full bg-white opacity-5"
                animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.05, 0.08, 0.05]
                }}
                transition={{
                    duration: 5,
                    repeat: Infinity,
                    delay: 1
                }}
            />
        </div>
    );
};

export default GiftCard;
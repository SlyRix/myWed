import React from 'react';
import { motion } from 'framer-motion';
import Icon from '@mdi/react';

const CeremonyDetails = ({ details, theme }) => {
    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                when: "beforeChildren",
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 }
        }
    };

    return (
        <motion.div
            className="grid md:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {details.map((detail, index) => (
                <motion.div
                    key={index}
                    className={`detail-card ${theme === 'christian' ? 'hover:border-christian-accent' : 'hover:border-hindu-secondary'} border-2 border-transparent`}
                    variants={itemVariants}
                >
                    <Icon
                        path={detail.icon}
                        size={2}
                        className={`mx-auto ${theme === 'christian' ? 'text-christian-accent' : 'text-hindu-secondary'}`}
                    />
                    <h3 className="text-xl font-bold mb-3">{detail.title}</h3>
                    {detail.content.map((item, i) => (
                        <p key={i} className={i === 0 ? "mb-1" : "text-gray-600 mb-1"}>{item}</p>
                    ))}
                    {detail.link && (
                        <a
                            href={detail.link.url}
                            className={`inline-block mt-3 text-sm font-medium ${theme === 'christian' ? 'text-christian-accent' : 'text-hindu-secondary'} hover:underline`}
                        >
                            {detail.link.text}
                        </a>
                    )}
                </motion.div>
            ))}
        </motion.div>
    );
};

export default CeremonyDetails;
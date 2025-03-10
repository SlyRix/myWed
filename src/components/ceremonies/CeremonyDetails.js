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

    // Determine theme-based styling
    const borderColor = theme === 'christian' ? 'border-christian-accent' : 'border-hindu-secondary';
    const textColor = theme === 'christian' ? 'text-christian-accent' : 'text-hindu-secondary';

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
                    className={`flex-1 min-w-[250px] mb-8 p-6 bg-white rounded-lg shadow-md text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-lg border-t-4 ${borderColor}`}
                    variants={itemVariants}
                >
                    <Icon
                        path={detail.icon}
                        size={2}
                        className={`mx-auto mb-4 ${textColor}`}
                    />
                    <h3 className="text-xl font-bold mb-3">{detail.title}</h3>
                    {detail.content.map((item, i) => (
                        <p key={i} className={i === 0 ? "mb-1" : "text-gray-600 mb-1"}>{item}</p>
                    ))}
                    {detail.link && (
                        <a
                            href={detail.link.url}
                            className={`inline-block mt-3 text-sm font-medium ${textColor} hover:underline`}
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
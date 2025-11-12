import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import Icon from '@mdi/react';
import CalendarLink from '../common/CalendarLink';

const CeremonyDetails = memo(({ details, theme }) => {
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

    // Parse date string for calendar (assuming details contain properly formatted data)
    const getEventDate = () => {
        // Find the date detail item
        const dateDetail = details.find(item => item.title.includes('Date'));
        if (dateDetail && dateDetail.content && dateDetail.content.length >= 2) {
            const dateString = dateDetail.content[0]; // e.g., "July 4, 2026"
            const timeString = dateDetail.content[1]; // e.g., "2:00 PM - 4:00 PM"

            // Extract and parse date
            const startDate = new Date(dateString);

            // Extract and parse time
            if (timeString) {
                const timeMatch = timeString.match(/(\d+):(\d+)\s*(AM|PM)/i);
                if (timeMatch) {
                    let hours = parseInt(timeMatch[1]);
                    const minutes = parseInt(timeMatch[2]);
                    const period = timeMatch[3].toUpperCase();

                    // Convert to 24-hour format
                    if (period === 'PM' && hours < 12) hours += 12;
                    if (period === 'AM' && hours === 12) hours = 0;

                    startDate.setHours(hours, minutes);
                }
            }

            return startDate;
        }

        // Fallback to a future date if parsing fails
        return new Date('July 4, 2026 14:00:00');
    };

    const getEventLocation = () => {
        // Find the location detail item
        const locationDetail = details.find(item => item.title.includes('Location'));
        if (locationDetail && locationDetail.content && locationDetail.content.length >= 2) {
            return locationDetail.content.join(', ');
        }
        return '';
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

                    {/* Special features based on detail type */}
                    {detail.title.includes('Location') && (
                        <div className="mt-4">
                        </div>
                    )}

                    {detail.title.includes('Date') && (
                        <div className="mt-4">
                            <CalendarLink
                                title={`${theme === 'christian' ? 'Christian' : 'Hindu'} Wedding Ceremony`}
                                description={`${theme === 'christian' ? 'Christian' : 'Hindu'} Wedding Ceremony`}
                                location={getEventLocation()}
                                startDate={getEventDate()}
                            />
                        </div>
                    )}

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
});

CeremonyDetails.displayName = 'CeremonyDetails';

CeremonyDetails.propTypes = {
    details: PropTypes.arrayOf(PropTypes.shape({
        icon: PropTypes.string,
        title: PropTypes.string.isRequired,
        content: PropTypes.oneOfType([
            PropTypes.arrayOf(PropTypes.string),
            PropTypes.string
        ]),
        link: PropTypes.shape({
            url: PropTypes.string.isRequired,
            text: PropTypes.string.isRequired
        })
    })).isRequired,
    theme: PropTypes.oneOf(['christian', 'hindu']).isRequired
};

export default CeremonyDetails;
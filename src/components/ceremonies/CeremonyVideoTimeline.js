import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

/**
 * CeremonyVideoTimeline - A component that displays a video player with an integrated timeline
 * showing ceremony events. Styled consistently with the Our Story timeline pattern.
 *
 * @param {Object} props
 * @param {Array} props.events - Timeline events with time, title, and description
 * @param {string} props.theme - Theme ('christian' or 'hindu') for color scheme
 * @param {string} props.videoUrl - URL to the ceremony video (YouTube/Vimeo embed or direct video)
 * @param {string} props.videoType - Type of video ('youtube', 'vimeo', or 'direct')
 * @param {string} props.ceremonyTitle - Title of the ceremony for accessibility
 */
const CeremonyVideoTimeline = ({ events, theme, videoUrl, videoType = 'youtube', ceremonyTitle }) => {
    const { t } = useTranslation();
    const [isVideoLoaded, setIsVideoLoaded] = useState(false);

    const timelineItem = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    // Determine theme-based styling
    const getThemeColors = () => {
        if (theme === 'christian') {
            return {
                primary: 'christian-accent',
                secondary: 'christian-text',
                gradient: 'from-christian-accent via-christian-accent to-christian-accent',
                dotBorder: 'border-christian-accent',
                dotInner: 'from-christian-accent to-christian-accent'
            };
        } else if (theme === 'reception') {
            return {
                primary: 'wedding-love',
                secondary: 'gray-800',
                gradient: 'from-christian-accent via-wedding-love to-hindu-secondary',
                dotBorder: 'border-wedding-love',
                dotInner: 'from-christian-accent to-hindu-secondary'
            };
        } else {
            return {
                primary: 'hindu-secondary',
                secondary: 'hindu-text',
                gradient: 'from-hindu-primary via-hindu-secondary to-hindu-primary',
                dotBorder: 'border-hindu-secondary',
                dotInner: 'from-hindu-primary to-hindu-secondary'
            };
        }
    };

    const colors = getThemeColors();

    /**
     * Renders the appropriate video player based on type
     */
    const renderVideoPlayer = () => {
        if (!videoUrl) {
            return (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
                    <p className="text-gray-500">{t('common.videoComingSoon', 'Video coming soon')}</p>
                </div>
            );
        }

        if (videoType === 'youtube') {
            return (
                <iframe
                    className="w-full h-full rounded-lg"
                    src={videoUrl}
                    title={ceremonyTitle}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    onLoad={() => setIsVideoLoaded(true)}
                />
            );
        } else if (videoType === 'vimeo') {
            return (
                <iframe
                    className="w-full h-full rounded-lg"
                    src={videoUrl}
                    title={ceremonyTitle}
                    frameBorder="0"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                    onLoad={() => setIsVideoLoaded(true)}
                />
            );
        } else {
            return (
                <video
                    className="w-full h-full rounded-lg object-cover"
                    controls
                    onLoadedData={() => setIsVideoLoaded(true)}
                >
                    <source src={videoUrl} type="video/mp4" />
                    {t('common.videoNotSupported', 'Your browser does not support the video tag.')}
                </video>
            );
        }
    };

    return (
        <div className="relative py-8">
            {/* Video Player Section */}
            <motion.div
                className="mb-16 max-w-4xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
            >
                <div className="relative aspect-video bg-gray-900 rounded-lg shadow-xl overflow-hidden">
                    {!isVideoLoaded && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                            <div className="animate-pulse flex flex-col items-center">
                                <div className={`w-16 h-16 bg-${colors.primary} rounded-full opacity-20 mb-4`}></div>
                                <p className="text-gray-400">{t('common.loadingVideo', 'Loading video...')}</p>
                            </div>
                        </div>
                    )}
                    {renderVideoPlayer()}
                </div>
            </motion.div>

            {/* Timeline Section */}
            <div className="relative py-8">
                {/* Mobile: Left-aligned vertical line */}
                <div className={`absolute h-full w-0.5 bg-gradient-to-b ${colors.gradient} left-6 top-0 md:hidden`}></div>

                {/* Desktop: Center line */}
                <div className={`absolute h-full w-1 bg-gradient-to-b ${colors.gradient} left-1/2 -translate-x-1/2 hidden md:block`}></div>

                {/* Floating animated highlights for the timeline */}
                <motion.div
                    className={`absolute left-1/2 top-1/4 w-20 h-20 rounded-full bg-${colors.primary}/20 -z-10 hidden md:block`}
                    style={{ translateX: '-50%' }}
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.2, 0.1, 0.2]
                    }}
                    transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />

                <motion.div
                    className={`absolute left-1/2 top-2/3 w-16 h-16 rounded-full bg-${colors.primary}/15 -z-10 hidden md:block`}
                    style={{ translateX: '-50%' }}
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.15, 0.05, 0.15]
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 2
                    }}
                />

                {/* Timeline items */}
                <div className="relative">
                    {events.map((event, index) => {
                        // Calculate positions with generous spacing
                        const topPosition = `${index * 280}px`;
                        const isLeftSide = index % 2 === 0;

                        return (
                            <motion.div
                                key={index}
                                className="relative mb-12 md:mb-0 flex md:block"
                                variants={timelineItem}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                            >
                                {/* Mobile: Timeline dot on the left */}
                                <div className="flex-shrink-0 md:hidden">
                                    <motion.div
                                        className={`w-12 h-12 rounded-full bg-white border-4 border-${colors.primary} shadow-lg flex items-center justify-center relative z-10`}
                                        initial={{ scale: 0 }}
                                        whileInView={{ scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                                    >
                                        <motion.div
                                            className={`w-3 h-3 rounded-full bg-gradient-to-br ${colors.dotInner}`}
                                            animate={{
                                                scale: [1, 1.2, 1],
                                                opacity: [0.8, 1, 0.8]
                                            }}
                                            transition={{
                                                duration: 2,
                                                repeat: Infinity,
                                                ease: "easeInOut",
                                                delay: index * 0.3
                                            }}
                                        />
                                    </motion.div>
                                </div>

                                {/* Mobile: Connector line from dot to card */}
                                <div className={`w-6 h-0.5 bg-gradient-to-r from-${colors.primary} to-transparent mt-6 md:hidden`}></div>

                                {/* Content box */}
                                <div
                                    className={`flex-1 md:absolute md:w-[45%] p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 ${
                                        isLeftSide ? 'md:left-0 md:text-right' : 'md:right-0'
                                    }`}
                                    style={{
                                        top: topPosition,
                                        zIndex: index % 3 + 1
                                    }}
                                >
                                    <div className={`text-lg font-bold mb-2 bg-gradient-to-r ${colors.dotInner} bg-clip-text text-transparent`}>
                                        {event.time}
                                    </div>
                                    <h3 className={`text-xl font-bold mb-3 text-gray-800`}>
                                        {event.title}
                                    </h3>
                                    <p className="text-gray-600 whitespace-pre-line">
                                        {event.description}
                                    </p>
                                </div>

                                {/* Desktop: Timeline dots - visible only on md screens and up */}
                                <div
                                    className={`hidden md:absolute md:block w-5 h-5 rounded-full bg-white ${colors.dotBorder} border-4 z-10 left-1/2 -translate-x-1/2`}
                                    style={{ top: `calc(${topPosition} + 1.5rem)` }}
                                ></div>

                                {/* Desktop: Connector lines - visible only on md screens and up */}
                                <div
                                    className={`hidden md:absolute md:block h-1 bg-gradient-to-r ${
                                        isLeftSide
                                            ? `from-${colors.primary} to-transparent`
                                            : `from-transparent to-${colors.primary}`
                                    } w-[calc(27.5%-0.5rem)] ${
                                        isLeftSide ? 'left-[calc(22.5%+0.5rem)]' : 'right-[calc(22.5%+0.5rem)]'
                                    }`}
                                    style={{ top: `calc(${topPosition} + 1.5rem)` }}
                                ></div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Spacer to ensure all events are visible on desktop */}
                <div className="hidden md:block" style={{ height: `${events.length * 280}px` }}></div>
            </div>
        </div>
    );
};

export default CeremonyVideoTimeline;

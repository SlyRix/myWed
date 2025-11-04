import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

/**
 * GiftCard Component
 * Displays a single gift item with progress bar showing contribution status
 * @param {Object} gift - Gift object with all details
 * @param {Function} onClick - Handler when card is clicked
 */
const GiftCard = ({ gift, onClick }) => {
    const { i18n } = useTranslation();
    const currentLanguage = i18n.language;

    const name = gift.names[currentLanguage] || gift.names.en;
    const description = gift.descriptions[currentLanguage] || gift.descriptions.en;
    const progressPercentage = Math.min(gift.percentageFunded, 100);
    const isFullyFunded = gift.remainingAmount <= 0;

    return (
        <motion.div
            className={`bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer transition-transform hover:scale-105 ${
                isFullyFunded ? 'opacity-75' : ''
            }`}
            onClick={() => !isFullyFunded && onClick(gift)}
            whileHover={{ y: -5 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className="relative h-48 overflow-hidden">
                <img
                    src={gift.imageUrl}
                    alt={name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                />
                {isFullyFunded && (
                    <div className="absolute inset-0 bg-green-500 bg-opacity-80 flex items-center justify-center">
                        <span className="text-white text-xl font-bold">
                            {currentLanguage === 'de' ? 'Vollständig finanziert' :
                             currentLanguage === 'ta' ? 'முழுமையாக நிதியளிக்கப்பட்டது' :
                             'Fully Funded'}
                        </span>
                    </div>
                )}
            </div>

            <div className="p-4">
                <h3 className="text-xl font-display text-gray-800 mb-2 truncate" title={name}>
                    {name}
                </h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2" title={description}>
                    {description}
                </p>

                <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">
                            {currentLanguage === 'de' ? 'Ziel' :
                             currentLanguage === 'ta' ? 'இலக்கு' :
                             'Goal'}:
                        </span>
                        <span className="font-semibold text-gray-800">
                            CHF {gift.price.toFixed(2)}
                        </span>
                    </div>
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">
                            {currentLanguage === 'de' ? 'Beigetragen' :
                             currentLanguage === 'ta' ? 'பங்களிக்கப்பட்டது' :
                             'Contributed'}:
                        </span>
                        <span className="font-semibold text-green-600">
                            CHF {gift.totalContributed.toFixed(2)}
                        </span>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-christian-accent to-hindu-secondary rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPercentage}%` }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                        />
                    </div>
                    <p className="text-xs text-gray-500 mt-1 text-right">
                        {progressPercentage}% {currentLanguage === 'de' ? 'finanziert' :
                                              currentLanguage === 'ta' ? 'நிதியளிக்கப்பட்டது' :
                                              'funded'}
                    </p>
                </div>

                {!isFullyFunded && (
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                            {currentLanguage === 'de' ? 'Verbleibend' :
                             currentLanguage === 'ta' ? 'மீதமுள்ளது' :
                             'Remaining'}:
                        </span>
                        <span className="text-lg font-bold text-hindu-secondary">
                            CHF {gift.remainingAmount.toFixed(2)}
                        </span>
                    </div>
                )}

                {gift.contributionCount > 0 && (
                    <p className="text-xs text-gray-500 mt-2">
                        {gift.contributionCount} {gift.contributionCount === 1
                            ? (currentLanguage === 'de' ? 'Beitrag' :
                               currentLanguage === 'ta' ? 'பங்களிப்பு' :
                               'contribution')
                            : (currentLanguage === 'de' ? 'Beiträge' :
                               currentLanguage === 'ta' ? 'பங்களிப்புகள்' :
                               'contributions')}
                    </p>
                )}

                {gift.productUrl && (
                    <a
                        href={gift.productUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full mt-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors text-center border border-gray-300"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {currentLanguage === 'de' ? 'Produkt ansehen' :
                         currentLanguage === 'ta' ? 'தயாரிப்பு பார்க்க' :
                         'View Product'}
                    </a>
                )}

                {!isFullyFunded && (
                    <button
                        className="w-full mt-4 py-2 bg-gradient-to-r from-christian-accent to-hindu-secondary text-white rounded-lg hover:opacity-90 transition-opacity"
                        onClick={(e) => {
                            e.stopPropagation();
                            onClick(gift);
                        }}
                    >
                        {currentLanguage === 'de' ? 'Beitragen' :
                         currentLanguage === 'ta' ? 'பங்களிக்கவும்' :
                         'Contribute'}
                    </button>
                )}
            </div>
        </motion.div>
    );
};

export default GiftCard;
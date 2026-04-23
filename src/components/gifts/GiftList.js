import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { fetchGifts, makeContribution, markPurchased } from '../../api/giftsApi';
import GiftCard from './GiftCard';
import ContributionModal from './ContributionModal';
import TwintModal from './TwintModal';
import AnimatedSection from '../common/AnimatedSection';
import LoadingSpinner from '../common/LoadingSpinner';

const N8N_WEBHOOK_URL = process.env.REACT_APP_N8N_WEBHOOK_URL || null;

/**
 * GiftList Component
 * Displays all gifts in a grid with filtering and contribution functionality
 */
const GiftList = () => {
    const { i18n } = useTranslation();
    const currentLanguage = i18n.language;

    const [gifts, setGifts] = useState([]);
    const [filteredGifts, setFilteredGifts] = useState([]);
    const [activeCategory, setActiveCategory] = useState('all');
    const [selectedGift, setSelectedGift] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [isTwintModalOpen, setIsTwintModalOpen] = useState(false);
    const [twintData, setTwintData] = useState(null);

    const categories = [
        { id: 'all', label: { en: 'All Gifts', de: 'Alle Geschenke', ta: 'அனைத்து பரிசுகள்' } },
        { id: 'experience', label: { en: 'Experiences', de: 'Erlebnisse', ta: 'அனுபவங்கள்' } },
        { id: 'kitchen', label: { en: 'Kitchen', de: 'Küche', ta: 'சமையலறை' } },
        { id: 'home', label: { en: 'Home', de: 'Heim', ta: 'வீடு' } }
    ];

    useEffect(() => {
        loadGifts();
    }, []);

    useEffect(() => {
        if (activeCategory === 'all') {
            setFilteredGifts(gifts);
        } else {
            setFilteredGifts(gifts.filter(gift => gift.category === activeCategory));
        }
    }, [activeCategory, gifts]);

    const loadGifts = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const giftsData = await fetchGifts();
            setGifts(giftsData);
            setFilteredGifts(giftsData);
        } catch (err) {
            console.error('Error loading gifts:', err);
            setError(currentLanguage === 'de'
                ? 'Fehler beim Laden der Geschenke'
                : currentLanguage === 'ta'
                    ? 'பரிசுகளை ஏற்றுவதில் பிழை'
                    : 'Error loading gifts');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGiftClick = (gift) => {
        if (gift.remainingAmount > 0) {
            setSelectedGift(gift);
            setIsModalOpen(true);
        }
    };

    const notifyN8n = (payload) => {
        if (!N8N_WEBHOOK_URL) return;
        fetch(N8N_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        }).catch(() => {});
    };

    const handleContributionSubmit = async (contributionData) => {
        const giftName = selectedGift.names[currentLanguage] || selectedGift.names.en;

        try {
            if (contributionData.contributionType === 'purchased') {
                await markPurchased(selectedGift.id, {
                    contributorName: contributionData.contributorName,
                    storeName: contributionData.storeName
                });

                notifyN8n({
                    type: 'purchased',
                    giftName,
                    contributorName: contributionData.contributorName,
                    storeName: contributionData.storeName || null,
                    giftPrice: selectedGift.price,
                    timestamp: new Date().toISOString(),
                });

                setTwintData({
                    giftName,
                    contributorName: contributionData.contributorName,
                    amount: selectedGift.remainingAmount,
                    contributionType: 'purchased',
                });
            } else {
                await makeContribution(selectedGift.id, {
                    contributorName: contributionData.contributorName,
                    amount: contributionData.amount,
                    message: contributionData.message
                });

                notifyN8n({
                    type: 'contribution',
                    giftName,
                    contributorName: contributionData.contributorName,
                    amount: contributionData.amount,
                    message: contributionData.message || null,
                    timestamp: new Date().toISOString(),
                });

                setTwintData({
                    giftName,
                    contributorName: contributionData.contributorName,
                    amount: contributionData.amount,
                    contributionType: 'partial',
                });
            }

            setIsTwintModalOpen(true);
            await loadGifts();
        } catch (err) {
            throw err;
        }
    };

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-24">
                <LoadingSpinner />
                <p className="text-center text-gray-600 mt-4">
                    {currentLanguage === 'de'
                        ? 'Geschenke werden geladen...'
                        : currentLanguage === 'ta'
                            ? 'பரிசுகள் ஏற்றப்படுகின்றன...'
                            : 'Loading gifts...'}
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-24">
                <div className="max-w-md mx-auto p-6 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                    <p className="font-semibold mb-2">
                        {currentLanguage === 'de'
                            ? 'Fehler'
                            : currentLanguage === 'ta'
                                ? 'பிழை'
                                : 'Error'}
                    </p>
                    <p>{error}</p>
                    <button
                        onClick={loadGifts}
                        className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                        {currentLanguage === 'de'
                            ? 'Erneut versuchen'
                            : currentLanguage === 'ta'
                                ? 'மீண்டும் முயற்சிக்கவும்'
                                : 'Try Again'}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4">
            {successMessage && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="max-w-md mx-auto mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg text-center"
                >
                    {successMessage}
                </motion.div>
            )}

            <AnimatedSection className="mb-8">
                <div className="flex flex-wrap justify-center gap-3">
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            className={`px-6 py-2 rounded-full transition-all duration-300 ${
                                activeCategory === category.id
                                    ? 'bg-christian-accent text-white font-medium shadow-md'
                                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200 shadow-sm'
                            }`}
                            onClick={() => setActiveCategory(category.id)}
                        >
                            {category.label[currentLanguage] || category.label.en}
                        </button>
                    ))}
                </div>
            </AnimatedSection>

            {filteredGifts.length === 0 ? (
                <AnimatedSection className="text-center py-12">
                    <p className="text-gray-600 text-lg">
                        {currentLanguage === 'de'
                            ? 'Keine Geschenke in dieser Kategorie'
                            : currentLanguage === 'ta'
                                ? 'இந்த வகையில் பரிசுகள் இல்லை'
                                : 'No gifts in this category'}
                    </p>
                </AnimatedSection>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredGifts.map((gift, index) => (
                        <AnimatedSection key={gift.id} delay={index * 0.1}>
                            <GiftCard
                                gift={gift}
                                onClick={handleGiftClick}
                            />
                        </AnimatedSection>
                    ))}
                </div>
            )}

            <ContributionModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedGift(null);
                }}
                gift={selectedGift}
                onSubmit={handleContributionSubmit}
            />

            <TwintModal
                isOpen={isTwintModalOpen}
                onClose={() => {
                    setIsTwintModalOpen(false);
                    setTwintData(null);
                }}
                data={twintData}
                language={currentLanguage}
            />
        </div>
    );
};

export default GiftList;

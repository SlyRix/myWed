import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { mdiClose } from '@mdi/js';
import Icon from '@mdi/react';

/**
 * ContributionModal Component
 * Modal for making contributions to a gift
 * @param {boolean} isOpen - Whether modal is open
 * @param {Function} onClose - Handler to close modal
 * @param {Object} gift - Gift object to contribute to
 * @param {Function} onSubmit - Handler when contribution is submitted
 */
const ContributionModal = ({ isOpen, onClose, gift, onSubmit }) => {
    const { i18n } = useTranslation();
    const currentLanguage = i18n.language;

    const [formData, setFormData] = useState({
        contributorName: '',
        amount: '',
        message: '',
        storeName: ''
    });
    const [contributionType, setContributionType] = useState('partial'); // 'partial' or 'purchased'
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const giftName = gift ? (gift.names[currentLanguage] || gift.names.en) : '';

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: null
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.contributorName.trim()) {
            newErrors.contributorName = currentLanguage === 'de'
                ? 'Name ist erforderlich'
                : currentLanguage === 'ta'
                    ? 'பெயர் தேவை'
                    : 'Name is required';
        } else if (formData.contributorName.length > 100) {
            newErrors.contributorName = currentLanguage === 'de'
                ? 'Name zu lang (max. 100 Zeichen)'
                : currentLanguage === 'ta'
                    ? 'பெயர் மிக நீளமானது (அதிகபட்சம் 100)'
                    : 'Name too long (max 100 characters)';
        }

        // Only validate amount if partial contribution
        if (contributionType === 'partial') {
            const amount = parseFloat(formData.amount);
            if (!formData.amount || isNaN(amount) || amount <= 0) {
                newErrors.amount = currentLanguage === 'de'
                    ? 'Gültiger Betrag erforderlich'
                    : currentLanguage === 'ta'
                        ? 'செல்லுபடியாகும் தொகை தேவை'
                        : 'Valid amount required';
            } else if (gift && amount > gift.remainingAmount) {
                newErrors.amount = currentLanguage === 'de'
                    ? `Betrag überschreitet Restbetrag (CHF ${gift.remainingAmount.toFixed(2)})`
                    : currentLanguage === 'ta'
                        ? `தொகை மீதமுள்ள தொகையை மீறுகிறது (₹ ${gift.remainingAmount.toFixed(2)})`
                        : `Amount exceeds remaining balance (CHF ${gift.remainingAmount.toFixed(2)})`;
            }

            if (formData.message && formData.message.length > 200) {
                newErrors.message = currentLanguage === 'de'
                    ? 'Nachricht zu lang (max. 200 Zeichen)'
                    : currentLanguage === 'ta'
                        ? 'செய்தி மிக நீளமானது (அதிகபட்சம் 200)'
                        : 'Message too long (max 200 characters)';
            }
        }

        // Validate store name for purchased items
        if (contributionType === 'purchased' && formData.storeName && formData.storeName.length > 200) {
            newErrors.storeName = currentLanguage === 'de'
                ? 'Geschäftsname zu lang (max. 200 Zeichen)'
                : currentLanguage === 'ta'
                    ? 'கடை பெயர் மிக நீளமானது (அதிகபட்சம் 200)'
                    : 'Store name too long (max 200 characters)';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const submissionData = {
                contributorName: formData.contributorName.trim(),
                contributionType: contributionType
            };

            if (contributionType === 'partial') {
                submissionData.amount = parseFloat(formData.amount);
                submissionData.message = formData.message.trim() || null;
            } else {
                submissionData.storeName = formData.storeName.trim() || null;
            }

            await onSubmit(submissionData);

            setFormData({
                contributorName: '',
                amount: '',
                message: '',
                storeName: ''
            });
            setContributionType('partial');
            setErrors({});
            onClose();
        } catch (error) {
            const errorMessage = error.message || (currentLanguage === 'de'
                ? 'Beitrag fehlgeschlagen'
                : currentLanguage === 'ta'
                    ? 'பங்களிப்பு தோல்வியடைந்தது'
                    : 'Contribution failed');
            setErrors({ submit: errorMessage });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        if (!isSubmitting) {
            setFormData({
                contributorName: '',
                amount: '',
                message: '',
                storeName: ''
            });
            setContributionType('partial');
            setErrors({});
            onClose();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && gift && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 z-[60]"
                        onClick={handleClose}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="fixed inset-0 z-[60] flex items-center justify-center p-2 sm:p-4 md:p-6"
                        style={{ pointerEvents: 'none' }}
                    >
                        <div
                            className="relative w-full max-w-[92vw] sm:max-w-md bg-white rounded-lg shadow-xl max-h-[85vh] overflow-y-auto mt-20"
                            style={{ pointerEvents: 'auto' }}
                        >
                        <div className="sticky top-0 bg-white border-b border-gray-200 p-2.5 sm:p-4 flex justify-between items-center">
                            <h3 className="text-base sm:text-xl font-display text-gray-800">
                                {currentLanguage === 'de'
                                    ? 'Beitrag leisten'
                                    : currentLanguage === 'ta'
                                        ? 'பங்களிப்பு செய்யுங்கள்'
                                        : 'Make a Contribution'}
                            </h3>
                            <button
                                onClick={handleClose}
                                className="text-gray-500 hover:text-gray-700 transition-colors"
                                disabled={isSubmitting}
                                aria-label="Close"
                            >
                                <Icon path={mdiClose} size={1} />
                            </button>
                        </div>

                        <div className="p-3 sm:p-6">
                            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                                <h4 className="font-semibold text-gray-800 mb-1">{giftName}</h4>
                                <p className="text-sm text-gray-600">
                                    {currentLanguage === 'de' ? 'Verbleibend' :
                                     currentLanguage === 'ta' ? 'மீதமுள்ளது' :
                                     'Remaining'}: <span className="font-bold text-hindu-secondary">
                                        CHF {gift.remainingAmount.toFixed(2)}
                                    </span>
                                </p>
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 font-medium mb-2">
                                    {currentLanguage === 'de'
                                        ? 'Wie möchten Sie beitragen?'
                                        : currentLanguage === 'ta'
                                            ? 'எப்படி பங்களிக்க விரும்புகிறீர்கள்?'
                                            : 'How would you like to contribute?'}
                                </label>
                                <div className="flex flex-col sm:flex-row gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setContributionType('partial')}
                                        className={`flex-1 p-2.5 rounded-lg border-2 transition-all ${
                                            contributionType === 'partial'
                                                ? 'border-christian-accent bg-christian-accent bg-opacity-10'
                                                : 'border-gray-300 hover:border-gray-400'
                                        }`}
                                        disabled={isSubmitting}
                                    >
                                        <div className="text-sm font-semibold">
                                            {currentLanguage === 'de'
                                                ? 'Beitrag leisten'
                                                : currentLanguage === 'ta'
                                                    ? 'பங்களிப்பு செய்'
                                                    : 'Make a Contribution'}
                                        </div>
                                        <div className="text-xs text-gray-600 mt-1">
                                            {currentLanguage === 'de'
                                                ? 'Beliebiger Betrag'
                                                : currentLanguage === 'ta'
                                                    ? 'எந்த தொகையும்'
                                                    : 'Any amount'}
                                        </div>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setContributionType('purchased')}
                                        className={`flex-1 p-2.5 rounded-lg border-2 transition-all ${
                                            contributionType === 'purchased'
                                                ? 'border-hindu-secondary bg-hindu-secondary bg-opacity-10'
                                                : 'border-gray-300 hover:border-gray-400'
                                        }`}
                                        disabled={isSubmitting}
                                    >
                                        <div className="text-sm font-semibold">
                                            {currentLanguage === 'de'
                                                ? 'Direkt gekauft'
                                                : currentLanguage === 'ta'
                                                    ? 'நேரடியாக வாங்கினேன்'
                                                    : 'Bought Directly'}
                                        </div>
                                        <div className="text-xs text-gray-600 mt-1">
                                            {currentLanguage === 'de'
                                                ? 'Bereits gekauft'
                                                : currentLanguage === 'ta'
                                                    ? 'ஏற்கனவே வாங்கினேன்'
                                                    : 'Already purchased'}
                                        </div>
                                    </button>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label className="block text-gray-700 font-medium mb-2" htmlFor="contributorName">
                                        {currentLanguage === 'de'
                                            ? 'Ihr Name *'
                                            : currentLanguage === 'ta'
                                                ? 'உங்கள் பெயர் *'
                                                : 'Your Name *'}
                                    </label>
                                    <input
                                        type="text"
                                        id="contributorName"
                                        name="contributorName"
                                        value={formData.contributorName}
                                        onChange={handleInputChange}
                                        className={`w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
                                            errors.contributorName
                                                ? 'border-red-500 focus:ring-red-500'
                                                : 'border-gray-300 focus:ring-christian-accent'
                                        }`}
                                        placeholder={currentLanguage === 'de'
                                            ? 'Max & Maria Müller'
                                            : currentLanguage === 'ta'
                                                ? 'உங்கள் முழு பெயர்'
                                                : 'John & Jane Smith'}
                                        disabled={isSubmitting}
                                        required
                                    />
                                    {errors.contributorName && (
                                        <p className="text-red-500 text-sm mt-1">{errors.contributorName}</p>
                                    )}
                                </div>

                                {contributionType === 'partial' ? (
                                    <>
                                        <div className="mb-4">
                                            <label className="block text-gray-700 font-medium mb-2" htmlFor="amount">
                                                {currentLanguage === 'de'
                                                    ? 'Betrag (CHF) *'
                                                    : currentLanguage === 'ta'
                                                        ? 'தொகை (CHF) *'
                                                        : 'Amount (CHF) *'}
                                            </label>
                                            <input
                                                type="number"
                                                id="amount"
                                                name="amount"
                                                value={formData.amount}
                                                onChange={handleInputChange}
                                                step="0.01"
                                                min="0.01"
                                                max={gift.remainingAmount}
                                                className={`w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
                                                    errors.amount
                                                        ? 'border-red-500 focus:ring-red-500'
                                                        : 'border-gray-300 focus:ring-christian-accent'
                                                }`}
                                                placeholder="100.00"
                                                disabled={isSubmitting}
                                                required
                                            />
                                            {errors.amount && (
                                                <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
                                            )}
                                        </div>

                                        <div className="mb-4">
                                            <label className="block text-gray-700 font-medium mb-2" htmlFor="message">
                                                {currentLanguage === 'de'
                                                    ? 'Nachricht (optional)'
                                                    : currentLanguage === 'ta'
                                                        ? 'செய்தி (விருப்பமானது)'
                                                        : 'Message (optional)'}
                                            </label>
                                            <textarea
                                                id="message"
                                                name="message"
                                                value={formData.message}
                                                onChange={handleInputChange}
                                                rows="2"
                                                maxLength="200"
                                                className={`w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 resize-none ${
                                                    errors.message
                                                        ? 'border-red-500 focus:ring-red-500'
                                                        : 'border-gray-300 focus:ring-christian-accent'
                                                }`}
                                                placeholder={currentLanguage === 'de'
                                                    ? 'Eine persönliche Nachricht...'
                                                    : currentLanguage === 'ta'
                                                        ? 'தனிப்பட்ட செய்தி...'
                                                        : 'A personal message...'}
                                                disabled={isSubmitting}
                                            />
                                            <p className="text-xs text-gray-500 mt-1 text-right">
                                                {formData.message.length}/200
                                            </p>
                                            {errors.message && (
                                                <p className="text-red-500 text-sm mt-1">{errors.message}</p>
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <div className="mb-4">
                                        <label className="block text-gray-700 font-medium mb-2" htmlFor="storeName">
                                            {currentLanguage === 'de'
                                                ? 'Wo haben Sie es gekauft? (optional)'
                                                : currentLanguage === 'ta'
                                                    ? 'எங்கே வாங்கினீர்கள்? (விருப்பமானது)'
                                                    : 'Where did you buy it? (optional)'}
                                        </label>
                                        <input
                                            type="text"
                                            id="storeName"
                                            name="storeName"
                                            value={formData.storeName}
                                            onChange={handleInputChange}
                                            className={`w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
                                                errors.storeName
                                                    ? 'border-red-500 focus:ring-red-500'
                                                    : 'border-gray-300 focus:ring-christian-accent'
                                            }`}
                                            placeholder={currentLanguage === 'de'
                                                ? 'z.B. Amazon, lokales Geschäft...'
                                                : currentLanguage === 'ta'
                                                    ? 'எ.கா. அமேசான், உள்ளூர் கடை...'
                                                    : 'e.g. Amazon, local store...'}
                                            disabled={isSubmitting}
                                        />
                                        {errors.storeName && (
                                            <p className="text-red-500 text-sm mt-1">{errors.storeName}</p>
                                        )}
                                        <p className="text-sm text-gray-600 mt-2">
                                            {currentLanguage === 'de'
                                                ? `Dies wird das Geschenk als vollständig finanziert markieren (CHF ${gift.remainingAmount.toFixed(2)}).`
                                                : currentLanguage === 'ta'
                                                    ? `இது பரிசை முழுமையாக நிதியளிக்கப்பட்டதாக குறிக்கும் (CHF ${gift.remainingAmount.toFixed(2)}).`
                                                    : `This will mark the gift as fully funded (CHF ${gift.remainingAmount.toFixed(2)}).`}
                                        </p>
                                    </div>
                                )}

                                {errors.submit && (
                                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                                        {errors.submit}
                                    </div>
                                )}

                                <div className="flex flex-col-reverse sm:flex-row gap-2">
                                    <button
                                        type="button"
                                        onClick={handleClose}
                                        className="flex-1 px-3 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
                                        disabled={isSubmitting}
                                    >
                                        {currentLanguage === 'de'
                                            ? 'Abbrechen'
                                            : currentLanguage === 'ta'
                                                ? 'ரத்து செய்'
                                                : 'Cancel'}
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-3 py-2.5 bg-gradient-to-r from-christian-accent to-hindu-secondary text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 text-sm sm:text-base"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="inline-block animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                                                {currentLanguage === 'de'
                                                    ? 'Wird gesendet...'
                                                    : currentLanguage === 'ta'
                                                        ? 'அனுப்பப்படுகிறது...'
                                                        : 'Submitting...'}
                                            </>
                                        ) : (
                                            currentLanguage === 'de'
                                                ? 'Beitragen'
                                                : currentLanguage === 'ta'
                                                    ? 'பங்களிக்கவும்'
                                                    : 'Contribute'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ContributionModal;

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { mdiClose, mdiCellphoneCheck, mdiCheckCircle } from '@mdi/js';
import Icon from '@mdi/react';

const TWINT_NUMBER = '0763370751';

/**
 * TwintModal Component
 * Shows after a successful gift contribution, instructing guest to complete payment via Twint
 * @param {boolean} isOpen - Whether modal is open
 * @param {Function} onClose - Handler to close modal
 * @param {Object} data - Contribution data: { giftName, contributorName, amount, contributionType }
 * @param {string} language - Current language code (en/de/ta)
 */
const TwintModal = ({ isOpen, onClose, data, language }) => {
    if (!data) return null;

    const lang = language || 'en';
    const isPurchased = data.contributionType === 'purchased';

    const t = {
        en: {
            title: isPurchased ? 'Gift Registered!' : 'Almost Done!',
            subtitle: isPurchased
                ? 'Thank you for registering your gift purchase.'
                : 'Thank you! Please complete your payment via Twint.',
            twintTitle: 'Pay via Twint',
            numberLabel: 'Twint to this number:',
            messageLabel: 'Message to include:',
            messageSuggestion: `Gift: ${data.giftName}`,
            amountLabel: 'Amount:',
            purchasedNote: 'You\'ve marked this gift as purchased directly. No payment needed — thank you so much!',
            done: 'Done',
            copyHint: 'Tap the number to copy',
        },
        de: {
            title: isPurchased ? 'Geschenk registriert!' : 'Fast geschafft!',
            subtitle: isPurchased
                ? 'Danke, dass Sie Ihren Kauf registriert haben.'
                : 'Danke! Bitte schliessen Sie Ihre Zahlung via Twint ab.',
            twintTitle: 'Jetzt via Twint bezahlen',
            numberLabel: 'Twinten Sie an diese Nummer:',
            messageLabel: 'Nachricht mitsenden:',
            messageSuggestion: `Geschenk: ${data.giftName}`,
            amountLabel: 'Betrag:',
            purchasedNote: 'Sie haben dieses Geschenk als direkt gekauft markiert. Keine Zahlung nötig — herzlichen Dank!',
            done: 'Fertig',
            copyHint: 'Nummer antippen zum Kopieren',
        },
        ta: {
            title: isPurchased ? 'பரிசு பதிவு செய்யப்பட்டது!' : 'கிட்டத்தட்ட முடிந்தது!',
            subtitle: isPurchased
                ? 'உங்கள் வாங்குதலை பதிவு செய்தமைக்கு நன்றி.'
                : 'நன்றி! Twint மூலம் உங்கள் கட்டணத்தை முடிக்கவும்.',
            twintTitle: 'Twint மூலம் செலுத்துங்கள்',
            numberLabel: 'இந்த எண்ணுக்கு Twint செய்யுங்கள்:',
            messageLabel: 'செய்தி சேர்க்கவும்:',
            messageSuggestion: `பரிசு: ${data.giftName}`,
            amountLabel: 'தொகை:',
            purchasedNote: 'இந்த பரிசை நேரடியாக வாங்கியதாக குறிக்கப்பட்டது. கட்டணம் தேவையில்லை — மிக்க நன்றி!',
            done: 'முடிந்தது',
            copyHint: 'நகலெடுக்க எண்ணை தட்டவும்',
        },
    };

    const text = t[lang] || t.en;

    const copyNumber = () => {
        navigator.clipboard?.writeText(TWINT_NUMBER).catch(() => {});
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-60 z-[70]"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.85, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.85, y: 30 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        className="fixed inset-0 z-[70] flex items-center justify-center p-4"
                        style={{ pointerEvents: 'none' }}
                    >
                        <div
                            className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden"
                            style={{ pointerEvents: 'auto' }}
                        >
                            {/* Header */}
                            <div className="bg-gradient-to-r from-[#00B4D8] to-[#0077B6] px-5 py-5 text-white">
                                <button
                                    onClick={onClose}
                                    className="absolute top-3 right-3 text-white/80 hover:text-white transition-colors"
                                    aria-label="Close"
                                >
                                    <Icon path={mdiClose} size={0.9} />
                                </button>
                                <div className="flex items-center gap-3">
                                    <div className="bg-white/20 rounded-full p-2">
                                        <Icon path={mdiCheckCircle} size={1.4} color="white" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold leading-tight">{text.title}</h3>
                                        <p className="text-sm text-white/80 mt-0.5">{text.subtitle}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Body */}
                            <div className="p-5 space-y-4">
                                {isPurchased ? (
                                    <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                                        <p className="text-green-700 text-sm">{text.purchasedNote}</p>
                                    </div>
                                ) : (
                                    <>
                                        {/* Twint logo + instructions */}
                                        <div className="bg-[#00B4D8]/8 border border-[#00B4D8]/30 rounded-xl p-4 space-y-3">
                                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                {text.twintTitle}
                                            </p>

                                            {/* Number */}
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">{text.numberLabel}</p>
                                                <button
                                                    onClick={copyNumber}
                                                    className="w-full bg-white border-2 border-[#00B4D8] rounded-lg px-4 py-2.5 text-2xl font-bold text-[#0077B6] tracking-widest hover:bg-[#00B4D8]/5 transition-colors"
                                                    title={text.copyHint}
                                                >
                                                    {TWINT_NUMBER}
                                                </button>
                                                <p className="text-xs text-gray-400 mt-1 text-center">{text.copyHint}</p>
                                            </div>

                                            {/* Amount */}
                                            {data.amount && (
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm text-gray-600">{text.amountLabel}</span>
                                                    <span className="text-xl font-bold text-gray-800">
                                                        CHF {Number(data.amount).toFixed(2)}
                                                    </span>
                                                </div>
                                            )}

                                            {/* Suggested message */}
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">{text.messageLabel}</p>
                                                <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 font-medium">
                                                    {text.messageSuggestion}
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* Twint logo visual */}
                                {!isPurchased && (
                                    <div className="flex items-center justify-center gap-2 text-gray-400">
                                        <Icon path={mdiCellphoneCheck} size={0.9} />
                                        <span className="text-xs">TWINT</span>
                                    </div>
                                )}

                                <button
                                    onClick={onClose}
                                    className="w-full py-3 bg-christian-accent text-white rounded-xl font-semibold hover:opacity-90 transition-opacity"
                                >
                                    {text.done}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default TwintModal;

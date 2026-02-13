// src/components/common/CodeGate.js
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useGuest } from '../../contexts/GuestContext';
import { validateAccessCode } from '../../api/guestApi';
import LanguageSwitcher from './LanguageSwitcher';

const CodeGate = () => {
    const { t } = useTranslation();
    const { setGuestAccess } = useGuest();
    const [phase, setPhase] = useState(1); // 1 = info, 2 = code entry
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [isChecking, setIsChecking] = useState(false);

    const handleSubmitCode = async (e) => {
        e.preventDefault();
        if (!code.trim() || isChecking) return;

        setIsChecking(true);
        setError('');

        try {
            const validation = await validateAccessCode(code.trim().toUpperCase());

            if (validation.valid) {
                setGuestAccess(
                    code.trim().toUpperCase(),
                    validation.guest?.name || null,
                    validation.ceremonies || []
                );
            } else {
                setError(t('codeGate.invalidCode'));
            }
        } catch (err) {
            setError(t('codeGate.invalidCode'));
            if (process.env.NODE_ENV === 'development') {
                console.error('Code validation error:', err);
            }
        } finally {
            setIsChecking(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center"
             style={{ background: 'linear-gradient(135deg, #1a2332 0%, #0f1724 50%, #1a2332 100%)' }}>

            {/* Language switcher in top-right */}
            <div className="absolute top-6 right-6 z-10">
                <LanguageSwitcher scrolled={false} />
            </div>

            {/* Decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-0 w-64 h-64 opacity-5"
                     style={{
                         background: 'radial-gradient(circle, #c9a959 0%, transparent 70%)',
                         transform: 'translate(-30%, -30%)'
                     }} />
                <div className="absolute bottom-0 right-0 w-96 h-96 opacity-5"
                     style={{
                         background: 'radial-gradient(circle, #c9a959 0%, transparent 70%)',
                         transform: 'translate(30%, 30%)'
                     }} />
            </div>

            <AnimatePresence mode="wait">
                {phase === 1 ? (
                    <motion.div
                        key="phase1"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                        className="relative text-center px-6 max-w-lg mx-auto"
                    >
                        {/* Ornamental top */}
                        <div className="mb-8">
                            <div className="w-16 h-px mx-auto mb-3" style={{ background: 'linear-gradient(90deg, transparent, #c9a959, transparent)' }} />
                            <span className="text-xs tracking-[0.3em] uppercase" style={{ color: '#c9a959' }}>
                                R & S
                            </span>
                            <div className="w-16 h-px mx-auto mt-3" style={{ background: 'linear-gradient(90deg, transparent, #c9a959, transparent)' }} />
                        </div>

                        <h1 className="font-display text-3xl md:text-4xl mb-6" style={{ color: '#e8dcc8' }}>
                            {t('codeGate.title')}
                        </h1>

                        <p className="text-base md:text-lg leading-relaxed mb-10 max-w-md mx-auto" style={{ color: '#a0a8b8' }}>
                            {t('codeGate.message')}
                        </p>

                        <button
                            onClick={() => setPhase(2)}
                            className="px-8 py-3 rounded-full text-sm font-medium tracking-wider uppercase transition-all duration-300 hover:scale-105"
                            style={{
                                background: 'linear-gradient(135deg, #c9a959, #b8963e)',
                                color: '#1a2332',
                                boxShadow: '0 4px 15px rgba(201, 169, 89, 0.3)'
                            }}
                        >
                            {t('codeGate.understood')}
                        </button>

                        {/* Ornamental bottom */}
                        <div className="mt-10">
                            <div className="w-24 h-px mx-auto" style={{ background: 'linear-gradient(90deg, transparent, #c9a959, transparent)' }} />
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="phase2"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                        className="relative text-center px-6 max-w-md mx-auto w-full"
                    >
                        {/* Ornamental top */}
                        <div className="mb-8">
                            <div className="w-16 h-px mx-auto mb-3" style={{ background: 'linear-gradient(90deg, transparent, #c9a959, transparent)' }} />
                            <span className="text-xs tracking-[0.3em] uppercase" style={{ color: '#c9a959' }}>
                                R & S
                            </span>
                            <div className="w-16 h-px mx-auto mt-3" style={{ background: 'linear-gradient(90deg, transparent, #c9a959, transparent)' }} />
                        </div>

                        <h2 className="font-display text-2xl md:text-3xl mb-8" style={{ color: '#e8dcc8' }}>
                            {t('codeGate.enterCode')}
                        </h2>

                        <form onSubmit={handleSubmitCode} className="space-y-4">
                            <input
                                type="text"
                                value={code}
                                onChange={(e) => {
                                    setCode(e.target.value.toUpperCase());
                                    setError('');
                                }}
                                placeholder={t('codeGate.placeholder')}
                                className="w-full px-6 py-3 rounded-full text-center text-lg tracking-widest font-medium outline-none transition-all duration-300 focus:ring-2"
                                style={{
                                    background: 'rgba(255, 255, 255, 0.08)',
                                    border: '1px solid rgba(201, 169, 89, 0.3)',
                                    color: '#e8dcc8',
                                    focusRingColor: '#c9a959'
                                }}
                                autoFocus
                                maxLength={10}
                                aria-label={t('codeGate.enterCode')}
                            />

                            {error && (
                                <motion.p
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-sm"
                                    style={{ color: '#e88080' }}
                                    role="alert"
                                >
                                    {error}
                                </motion.p>
                            )}

                            <button
                                type="submit"
                                disabled={isChecking || !code.trim()}
                                className="w-full px-8 py-3 rounded-full text-sm font-medium tracking-wider uppercase transition-all duration-300 disabled:opacity-50 hover:scale-105 disabled:hover:scale-100"
                                style={{
                                    background: code.trim()
                                        ? 'linear-gradient(135deg, #c9a959, #b8963e)'
                                        : 'rgba(201, 169, 89, 0.2)',
                                    color: code.trim() ? '#1a2332' : '#a0a8b8',
                                    boxShadow: code.trim() ? '0 4px 15px rgba(201, 169, 89, 0.3)' : 'none'
                                }}
                            >
                                {isChecking ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" aria-hidden="true" />
                                        <span className="sr-only">Loading</span>
                                        {t('passwordProtection.checking')}
                                    </span>
                                ) : (
                                    t('codeGate.submit')
                                )}
                            </button>
                        </form>

                        {/* Back link */}
                        <button
                            onClick={() => setPhase(1)}
                            className="mt-6 text-sm transition-colors duration-300 hover:underline"
                            style={{ color: '#a0a8b8' }}
                        >
                            &larr; {t('ceremony.access.backToHome')}
                        </button>

                        {/* Ornamental bottom */}
                        <div className="mt-8">
                            <div className="w-24 h-px mx-auto" style={{ background: 'linear-gradient(90deg, transparent, #c9a959, transparent)' }} />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CodeGate;

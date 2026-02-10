// src/components/welcome/WelcomeSplash.js
import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import {
    SPLASH_PHASE_DELAYS
} from '../../constants';

// ── Constants ──
const SLIDE_OPEN_THRESHOLD = 0.2;
const SLIDE_VELOCITY_THRESHOLD = 300;
const DRAG_DISTANCE = 250;

// ── Helpers ──
const isTouchCapable = () =>
    typeof window !== 'undefined' &&
    ('ontouchstart' in window || navigator.maxTouchPoints > 0);

// ── Slide-up hint with animated chevron ──
const SlideUpHint = ({ text }) => (
    <div className="flex flex-col items-center gap-1">
        <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
            aria-hidden="true"
        >
            <svg
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M18 15l-6-6-6 6" />
            </svg>
        </motion.div>
        <span className="font-body font-medium" style={{ fontSize: 'clamp(0.75rem, 2.5vw, 0.95rem)', letterSpacing: '0.05em' }}>
            {text}
        </span>
    </div>
);

SlideUpHint.propTypes = {
    text: PropTypes.string.isRequired
};

// ══════════════════════════════════════════════════════════════
// ── Main WelcomeSplash component ──
// ══════════════════════════════════════════════════════════════
const WelcomeSplash = ({ onComplete }) => {
    const { t } = useTranslation();
    const [isVisible, setIsVisible] = useState(true);
    const [isExiting, setIsExiting] = useState(false);
    const isTouch = useMemo(isTouchCapable, []);

    // dragProgress: 0 = resting, 1 = fully swiped away
    const dragProgress = useMotionValue(0);

    // Image follows finger: slides up as user swipes
    const imageY = useTransform(dragProgress, [0, 1], ['0%', '-100%']);
    // Slight scale-down as it slides away for depth feel
    const imageScale = useTransform(dragProgress, [0, 0.5, 1], [1, 0.97, 0.92]);
    // Fade out toward the end
    const imageOpacity = useTransform(dragProgress, [0, 0.7, 1], [1, 0.8, 0]);
    // Hint fades out as soon as user starts swiping
    const hintOpacity = useTransform(dragProgress, [0, 0.15], [0.9, 0]);

    // ── Exit: fade out and call onComplete ──
    const handleExit = useCallback(() => {
        if (isExiting) return;
        setIsExiting(true);
        setTimeout(() => {
            setIsVisible(false);
            setTimeout(onComplete, 100);
        }, SPLASH_PHASE_DELAYS.EXIT);
    }, [isExiting, onComplete]);

    // ── Slide-up gesture ──
    const handlePan = useCallback(
        (e, info) => {
            if (isExiting) return;
            const progress = Math.max(0, Math.min(1, -info.offset.y / DRAG_DISTANCE));
            dragProgress.set(progress);
        },
        [isExiting, dragProgress]
    );

    const handlePanEnd = useCallback(
        (e, info) => {
            if (isExiting) return;
            const current = dragProgress.get();
            if (current > SLIDE_OPEN_THRESHOLD || info.velocity.y < -SLIDE_VELOCITY_THRESHOLD) {
                animate(dragProgress, 1, {
                    duration: 0.5,
                    ease: [0.32, 0.72, 0, 1],
                    onComplete: handleExit
                });
            } else {
                animate(dragProgress, 0, { type: 'spring', stiffness: 300, damping: 25 });
            }
        },
        [isExiting, dragProgress, handleExit]
    );

    // ── Tap to open (desktop / accessibility) ──
    const handleTapOpen = useCallback(() => {
        if (isExiting) return;
        animate(dragProgress, 1, {
            duration: 0.9,
            ease: [0.32, 0.72, 0, 1],
            onComplete: handleExit
        });
    }, [isExiting, dragProgress, handleExit]);

    const hintText = isTouch ? t('splash.slideToOpen') : t('splash.tapToOpen');
    const splashImageUrl = `${process.env.PUBLIC_URL}/images/splash.jpg`;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="fixed inset-0 z-50 select-none overflow-hidden bg-black"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isExiting ? 0 : 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Fullscreen splash image that follows swipe */}
                    <motion.div
                        className="absolute inset-0"
                        style={{
                            y: imageY,
                            scale: imageScale,
                            opacity: imageOpacity
                        }}
                    >
                        <img
                            src={splashImageUrl}
                            alt="Wedding invitation"
                            className="w-full h-full object-cover"
                            draggable={false}
                        />

                        {/* Bottom gradient for hint readability */}
                        <div
                            className="absolute bottom-0 left-0 right-0 h-40"
                            style={{
                                background:
                                    'linear-gradient(to top, rgba(0,0,0,0.55), rgba(0,0,0,0.1) 60%, transparent)'
                            }}
                            aria-hidden="true"
                        />

                        {/* Slide-up / tap hint */}
                        <motion.div
                            className="absolute bottom-8 left-0 right-0 text-center text-white"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.9 }}
                            transition={{ delay: 1, duration: 0.8 }}
                            style={{ opacity: hintOpacity }}
                        >
                            <SlideUpHint text={hintText} />
                        </motion.div>
                    </motion.div>

                    {/* Gesture overlay */}
                    {!isExiting && (
                        <motion.div
                            className="absolute inset-0 z-20 cursor-pointer"
                            style={{ touchAction: 'none' }}
                            onPan={handlePan}
                            onPanEnd={handlePanEnd}
                            onTap={handleTapOpen}
                            role="button"
                            tabIndex={0}
                            aria-label={hintText}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    handleTapOpen();
                                }
                            }}
                        />
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

WelcomeSplash.propTypes = {
    onComplete: PropTypes.func.isRequired
};

export default WelcomeSplash;

// src/components/common/CountdownTimer.js
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const CountdownTimer = ({ targetDate }) => {
    const { t } = useTranslation();
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    useEffect(() => {
        const intervalId = setInterval(() => {
            const now = new Date().getTime();
            const distance = targetDate - now;

            if (distance < 0) {
                clearInterval(intervalId);
                return;
            }

            setTimeLeft({
                days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((distance % (1000 * 60)) / 1000)
            });
        }, 1000);

        return () => clearInterval(intervalId);
    }, [targetDate]);

    return (
        <div className="flex justify-center space-x-4">
            <div className="text-center">
                <span className="block text-3xl font-bold bg-white/20 rounded p-2 mb-1 min-w-16">{timeLeft.days}</span>
                <span className="text-sm uppercase tracking-wide">{t('countdown.days')}</span>
            </div>
            <div className="text-center">
                <span className="block text-3xl font-bold bg-white/20 rounded p-2 mb-1 min-w-16">{timeLeft.hours}</span>
                <span className="text-sm uppercase tracking-wide">{t('countdown.hours')}</span>
            </div>
            <div className="text-center">
                <span className="block text-3xl font-bold bg-white/20 rounded p-2 mb-1 min-w-16">{timeLeft.minutes}</span>
                <span className="text-sm uppercase tracking-wide">{t('countdown.minutes')}</span>
            </div>
            <div className="text-center">
                <span className="block text-3xl font-bold bg-white/20 rounded p-2 mb-1 min-w-16">{timeLeft.seconds}</span>
                <span className="text-sm uppercase tracking-wide">{t('countdown.seconds')}</span>
            </div>
        </div>
    );
};

export default CountdownTimer;
// src/components/common/CountdownTimer.js
import React, { useState, useEffect, memo } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

const CountdownTimer = memo(({ targetDate }) => {
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
            {[
                { value: timeLeft.days, label: t('countdown.days') },
                { value: timeLeft.hours, label: t('countdown.hours') },
                { value: timeLeft.minutes, label: t('countdown.minutes') },
                { value: timeLeft.seconds, label: t('countdown.seconds') }
            ].map((item, i) => (
                <div key={i} className="text-center">
          <span className="block text-3xl font-bold bg-black/30 backdrop-blur-sm rounded-lg p-3 min-w-16 border border-white/20">
            {item.value}
          </span>
                    <span className="text-sm uppercase tracking-wider mt-1 block font-medium">
            {item.label}
          </span>
                </div>
            ))}
        </div>
    );
});

CountdownTimer.displayName = 'CountdownTimer';

CountdownTimer.propTypes = {
    targetDate: PropTypes.number.isRequired
};

export default CountdownTimer;
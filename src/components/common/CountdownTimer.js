import React, { useState, useEffect } from 'react';

const CountdownTimer = ({ targetDate }) => {
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
                <span className="block text-3xl font-bold bg-white/20 rounded p-2 mb-1">{timeLeft.days}</span>
                <span className="text-sm uppercase tracking-wide">Days</span>
            </div>
            <div className="text-center">
                <span className="block text-3xl font-bold bg-white/20 rounded p-2 mb-1">{timeLeft.hours}</span>
                <span className="text-sm uppercase tracking-wide">Hours</span>
            </div>
            <div className="text-center">
                <span className="block text-3xl font-bold bg-white/20 rounded p-2 mb-1">{timeLeft.minutes}</span>
                <span className="text-sm uppercase tracking-wide">Minutes</span>
            </div>
            <div className="text-center">
                <span className="block text-3xl font-bold bg-white/20 rounded p-2 mb-1">{timeLeft.seconds}</span>
                <span className="text-sm uppercase tracking-wide">Seconds</span>
            </div>
        </div>
    );
};

export default CountdownTimer;
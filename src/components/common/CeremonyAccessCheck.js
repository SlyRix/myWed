// src/components/common/CeremonyAccessCheck.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { guestList } from '../../data/guestAccess';

const CeremonyAccessCheck = ({ ceremony }) => {
    const [invitationCode, setInvitationCode] = useState('');
    const [error, setError] = useState('');
    const [checking, setChecking] = useState(false);
    const [hasAccess, setHasAccess] = useState(false);
    const navigate = useNavigate();

    // Check if user has access to this specific ceremony
    useEffect(() => {
        // Get saved invitation code (if any)
        const savedCode = localStorage.getItem('invitationCode');

        if (savedCode) {
            // Check if this saved code grants access to this ceremony
            const guest = guestList[savedCode];
            if (guest && guest.ceremonies.includes(ceremony)) {
                setHasAccess(true);
            }
        }
    }, [ceremony]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setChecking(true);
        setError('');

        // Check if code exists and has access to this ceremony
        const code = invitationCode.trim().toUpperCase();
        const guest = guestList[code];

        setTimeout(() => {
            if (guest && guest.ceremonies.includes(ceremony)) {
                // Save invitation code
                localStorage.setItem('invitationCode', code);
                setHasAccess(true);
            } else {
                setError(guest
                    ? `Sorry, your invitation doesn't include access to the ${ceremony} ceremony.`
                    : 'Invalid invitation code. Please check and try again.'
                );
            }
            setChecking(false);
        }, 800);
    };

    // If user has access, don't show the access check
    if (hasAccess) {
        return null;
    }

    return (
        <motion.div
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <h2 className="text-2xl font-bold mb-4">Access Required</h2>
                <p className="mb-4">
                    This {ceremony} ceremony page is only accessible to invited guests.
                    Please enter your invitation code to continue.
                </p>

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        className="w-full p-3 border-2 border-gray-200 rounded-lg mb-4"
                        placeholder="Your invitation code (e.g., SMITH123)"
                        value={invitationCode}
                        onChange={(e) => setInvitationCode(e.target.value)}
                        required
                    />

                    <div className="flex space-x-4">
                        <button
                            type="submit"
                            disabled={checking}
                            className="px-4 py-2 bg-christian-accent text-white rounded-lg disabled:opacity-70"
                        >
                            {checking ? 'Checking...' : 'Submit'}
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate('/')}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg"
                        >
                            Back to Home
                        </button>
                    </div>

                    {error && <p className="mt-4 text-red-500">{error}</p>}
                </form>
            </div>
        </motion.div>
    );
};

export default CeremonyAccessCheck;
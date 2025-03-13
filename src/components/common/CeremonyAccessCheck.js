// src/components/common/CeremonyAccessCheck.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { validateAccessCode } from '../../api/guestApi';

const CeremonyAccessCheck = ({ ceremony }) => {
    const [invitationCode, setInvitationCode] = useState('');
    const [error, setError] = useState('');
    const [checking, setChecking] = useState(false);
    const [hasAccess, setHasAccess] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    // Check if user has access to this specific ceremony
    useEffect(() => {
        const checkAccess = async () => {
            setIsLoading(true);
            // Get saved invitation code (if any)
            const savedCode = localStorage.getItem('invitationCode');

            if (savedCode) {
                try {
                    // Check if this saved code grants access to this ceremony
                    const validation = await validateAccessCode(savedCode);

                    if (validation.valid && validation.ceremonies.includes(ceremony)) {
                        setHasAccess(true);
                    }
                } catch (error) {
                    console.error('Error validating access:', error);
                }
            }
            setIsLoading(false);
        };

        checkAccess();
    }, [ceremony]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setChecking(true);
        setError('');

        try {
            // Check if code exists and has access to this ceremony
            const validation = await validateAccessCode(invitationCode);

            if (validation.valid) {
                if (validation.ceremonies.includes(ceremony)) {
                    // Save invitation code
                    localStorage.setItem('invitationCode', invitationCode.trim().toUpperCase());
                    setHasAccess(true);
                } else {
                    setError(`Sorry, your invitation doesn't include access to the ${ceremony} ceremony.`);
                }
            } else {
                setError('Invalid invitation code. Please check and try again.');
            }
        } catch (error) {
            console.error('Error validating code:', error);
            setError('An error occurred. Please try again.');
        } finally {
            setChecking(false);
        }
    };

    // If still loading or user has access, don't show the access check
    if (isLoading) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 text-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-christian-accent mx-auto mb-4"></div>
                    <p>Checking access...</p>
                </div>
            </div>
        );
    }

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
                            {checking ? (
                                <span className="flex items-center">
                                    <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                                    Checking...
                                </span>
                            ) : 'Submit'}
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
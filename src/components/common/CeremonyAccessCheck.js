// src/components/common/CeremonyAccessCheck.js
import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useGuest } from '../../contexts/GuestContext';

const CeremonyAccessCheck = ({ ceremony }) => {
    const { hasAccessTo, isLoading } = useGuest();
    const navigate = useNavigate();

    // GuestContext already validated the code on app load — no extra API call needed
    if (isLoading) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 text-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-christian-accent mx-auto mb-4"></div>
                    <p>Einen Moment...</p>
                </div>
            </div>
        );
    }

    if (hasAccessTo(ceremony)) {
        return null;
    }

    // No access — redirect home
    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full text-center">
                <h2 className="text-2xl font-bold mb-4">Kein Zugang</h2>
                <p className="mb-6 text-gray-600">
                    Deine Einladung berechtigt dich leider nicht zu dieser Zeremonie.
                </p>
                <button
                    onClick={() => navigate('/')}
                    className="px-6 py-2 bg-christian-accent text-white rounded-lg"
                >
                    Zurück zur Startseite
                </button>
            </div>
        </div>
    );
};

CeremonyAccessCheck.propTypes = {
    ceremony: PropTypes.oneOf(['christian', 'hindu', 'reception']).isRequired
};

export default CeremonyAccessCheck;
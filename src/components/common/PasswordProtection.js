// src/components/common/PasswordProtection.js
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { mdiHeart } from '@mdi/js';
import Icon from '@mdi/react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

const PasswordProtection = ({ onAuthenticate }) => {
    const { t } = useTranslation();
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        // Simulate a bit of loading time
        setTimeout(() => {
            const isValid = onAuthenticate(password);
            if (!isValid) {
                setError(t('passwordProtection.error'));
                setPassword('');
            }
            setIsLoading(false);
        }, 800);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center min-h-screen bg-gradient-to-r from-christian-accent/20 to-hindu-secondary/20 bg-white p-4">
            {/* Language switcher at the top */}
            <div className="absolute top-4 right-4">
                <LanguageSwitcher />
            </div>

            <motion.div
                className="w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <div className="p-8">
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 rounded-full bg-christian-accent/10 flex items-center justify-center">
                            <Icon path={mdiHeart} size={2} className="text-christian-accent" />
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold text-center mb-2 text-gray-800">{t('passwordProtection.title')}</h2>
                    <p className="text-center text-gray-600 mb-8">
                        {t('passwordProtection.subtitle')}
                    </p>

                    <form onSubmit={handleSubmit}>
                        <input
                            type="password"
                            className="w-full p-3 border-2 border-gray-200 rounded-full text-base mb-5 transition-all duration-300 outline-none focus:border-christian-accent"
                            placeholder={t('passwordProtection.placeholder')}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-christian-accent to-hindu-secondary text-white py-3 rounded-full font-semibold transition-all duration-300 hover:shadow-lg disabled:opacity-70"
                            disabled={isLoading}
                        >
                            {isLoading ? t('passwordProtection.checking') : t('passwordProtection.submit')}
                        </button>

                        {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

PasswordProtection.propTypes = {
    onAuthenticate: PropTypes.func.isRequired
};

export default PasswordProtection;
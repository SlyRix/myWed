import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { mdiHeart } from '@mdi/js';
import Icon from '@mdi/react';
import '../../styles/components/passwordProtection.css';

const PasswordProtection = ({ onAuthenticate }) => {
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
                setError('Incorrect password. Please try again.');
                setPassword('');
            }
            setIsLoading(false);
        }, 800);
    };

    return (
        <div className="password-screen">
            <motion.div
                className="password-container"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <div className="password-logo">
                    <Icon path={mdiHeart} size={2} color="#d4b08c" />
                </div>
                <h2>Our Wedding</h2>
                <p>Please enter the password to view our wedding website</p>
                <form className="password-form" onSubmit={handleSubmit}>
                    <input
                        type="password"
                        className="password-input"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button
                        type="submit"
                        className="password-button"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Checking...' : 'Submit'}
                    </button>
                    {error && <p className="password-error">{error}</p>}
                </form>
            </motion.div>
        </div>
    );
};

export default PasswordProtection;
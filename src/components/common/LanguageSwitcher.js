// src/components/common/LanguageSwitcher.js
import React from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { mdiWeb, mdiChevronDown, mdiCheck } from '@mdi/js';
import Icon from '@mdi/react';

const LanguageSwitcher = ({ scrolled }) => {
    const { i18n } = useTranslation();
    const [isOpen, setIsOpen] = React.useState(false);
    const location = useLocation();
    const isHomePage = location.pathname === '/';
    const dropdownRef = React.useRef(null);

    const languages = [
        { code: 'en', name: 'English', flag: '🇺🇸' },
        { code: 'ta', name: 'தமிழ்', flag: "🇱🇰" },
        { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    ];

    // Fix: Check if current language starts with any of our supported language codes
    // This handles cases like "de-DE" -> "de"
    const getCurrentLanguage = () => {
        const currentLang = i18n.language || '';
        // First try exact match
        const exactMatch = languages.find(lang => lang.code === currentLang);
        if (exactMatch) return exactMatch;

        // If no exact match, try to match the base language code
        const baseMatch = languages.find(lang =>
            currentLang.toLowerCase().startsWith(lang.code.toLowerCase())
        );
        return baseMatch || languages[0]; // Default to first language if no match
    };

    const currentLanguage = getCurrentLanguage();

    const handleChangeLanguage = (code) => {
        i18n.changeLanguage(code);
        setIsOpen(false);
    };

    // Add click outside handler
    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        // Add event listener if dropdown is open
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        // Clean up event listener
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    // Determine button styling based on scrolled state and homepage
    const getButtonStyles = () => {
        if (scrolled) {
            return 'bg-white border-gray-200 text-christian-text hover:border-wedding-love';
        } else if (isHomePage) {
            return 'bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30';
        } else {
            return 'bg-white/20 backdrop-blur-sm border-christian-accent/30 text-christian-accent hover:bg-white/30';
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center space-x-2 py-1.5 px-3 rounded-full border transition-all duration-300 ${getButtonStyles()}`}
                aria-expanded={isOpen}
                aria-haspopup="true"
            >
                <Icon path={mdiWeb} size={0.8} />
                <span>{currentLanguage.flag}</span>
                <span className="hidden md:inline">{currentLanguage.name}</span>
                <Icon path={mdiChevronDown} size={0.6} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.ul
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                        tabIndex="-1"
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="language-menu"
                    >
                        {languages.map((language) => (
                            <li key={language.code} role="none">
                                <button
                                    onClick={() => handleChangeLanguage(language.code)}
                                    className={`flex items-center justify-between w-full px-4 py-2 text-sm text-left hover:bg-gray-100 transition-colors ${
                                        currentLanguage.code === language.code ? 'bg-gray-50 text-christian-accent' : 'text-gray-700'
                                    }`}
                                    role="menuitem"
                                >
                                    <div className="flex items-center space-x-2">
                                        <span>{language.flag}</span>
                                        <span>{language.name}</span>
                                    </div>

                                    {currentLanguage.code === language.code && (
                                        <Icon path={mdiCheck} size={0.7} className="text-christian-accent" />
                                    )}
                                </button>
                            </li>
                        ))}
                    </motion.ul>
                )}
            </AnimatePresence>
        </div>
    );
};

export default LanguageSwitcher;
// src/components/common/LanguageSwitcher.js
import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { mdiWeb, mdiChevronDown, mdiCheck } from '@mdi/js';
import Icon from '@mdi/react';

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();
    const [isOpen, setIsOpen] = React.useState(false);

    const languages = [
        { code: 'en', name: 'English', flag: '🇺🇸' },
        { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
        { code: 'de', name: 'Deutsch', flag: '🇩🇪' },

    ];

    const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

    const handleChangeLanguage = (code) => {
        i18n.changeLanguage(code);
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 py-2 px-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
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
                                    className={`flex items-center justify-between w-full px-4 py-2 text-sm text-left hover:bg-gray-100 transition-colors ${language.code === i18n.language ? 'bg-gray-50 text-christian-accent' : 'text-gray-700'}`}
                                    role="menuitem"
                                >
                                    <div className="flex items-center space-x-2">
                                        <span>{language.flag}</span>
                                        <span>{language.name}</span>
                                    </div>

                                    {language.code === i18n.language && (
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
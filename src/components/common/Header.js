// src/components/common/Header.js
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { mdiHeart, mdiMenu, mdiClose } from '@mdi/js';
import Icon from '@mdi/react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

const Header = () => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // Close mobile menu when route changes
    useEffect(() => {
        setIsOpen(false);
    }, [location]);

    const navLinks = [
        { path: '/', label: t('header.home') },
        { path: '/christian-ceremony', label: t('header.christianCeremony') },
        { path: '/hindu-ceremony', label: t('header.hinduCeremony') },
        { path: '/our-story', label: t('header.ourStory') },
        { path: '/gifts', label: t('header.gifts') },
        { path: '/gallery', label: t('header.gallery') }
    ];

    return (
        <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
            scrolled
                ? 'bg-white/95 backdrop-blur-sm shadow-md'
                : 'bg-transparent'
        }`}>
            <div className="container mx-auto max-w-6xl px-4">
                <nav className="flex justify-between items-center py-4">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-wedding-love/10 flex items-center justify-center">
                                <Icon path={mdiHeart} size={0.9} className="text-wedding-love" />
                            </div>
                            <span className="ml-2 text-lg font-display font-bold tracking-wide">
                {scrolled ? 'R & S Wedding' : (
                    <span className="text-white text-shadow">R & S Wedding</span>
                )}
              </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center">
                        <ul className="flex space-x-8 mr-4">
                            {navLinks.map((link) => (
                                <li key={link.path}>
                                    <Link
                                        to={link.path}
                                        className={`relative font-body tracking-wide transition-colors duration-300 ${
                                            location.pathname === link.path
                                                ? 'text-wedding-love font-medium'
                                                : scrolled
                                                    ? 'text-christian-text hover:text-wedding-love'
                                                    : 'text-white text-shadow hover:text-wedding-love'
                                        }`}
                                    >
                                        {link.label}
                                        {location.pathname === link.path && (
                                            <motion.span
                                                className="absolute -bottom-1 left-0 w-full h-0.5 bg-wedding-love"
                                                layoutId="underline"
                                            />
                                        )}
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        <LanguageSwitcher scrolled={scrolled} />
                    </div>

                    {/* Mobile Navigation */}
                    {isOpen && (
                        <motion.div
                            className="fixed inset-0 bg-white z-40 flex items-center justify-center md:hidden"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <ul className="flex flex-col items-center space-y-6">
                                {navLinks.map((link) => (
                                    <li key={link.path}>
                                        <Link
                                            to={link.path}
                                            className={`text-xl font-semibold hover:text-christian-accent transition-colors duration-300 ${location.pathname === link.path ? 'text-christian-accent' : 'text-gray-800'}`}
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;
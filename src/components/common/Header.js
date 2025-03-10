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
        <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md' : 'bg-transparent'}`}>
            <div className="container mx-auto max-w-6xl px-4">
                <nav className="flex justify-between items-center py-4">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center">
                            <Icon path={mdiHeart} size={1.2} className="text-christian-accent mr-2" />
                            <span className="text-xl font-bold">R&S Wedding</span>
                        </Link>
                    </div>

                    {/* Language Switcher - Mobile */}
                    <div className="md:hidden order-2 z-50 ml-2">
                        <LanguageSwitcher />
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden z-50 p-2 order-3"
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label="Toggle menu"
                    >
                        <Icon path={isOpen ? mdiClose : mdiMenu} size={1} className={scrolled || isOpen ? 'text-gray-800' : 'text-white'} />
                    </button>

                    {/* Desktop Navigation with Language Switcher */}
                    <div className="hidden md:flex items-center">
                        <ul className="flex space-x-8 mr-4">
                            {navLinks.map((link) => (
                                <li key={link.path}>
                                    <Link
                                        to={link.path}
                                        className={`relative font-semibold transition-colors duration-300 ${
                                            location.pathname === link.path
                                                ? 'text-christian-accent'
                                                : scrolled ? 'text-gray-800 hover:text-christian-accent' : 'text-white hover:text-christian-accent'
                                        }`}
                                    >
                                        {link.label}
                                        {location.pathname === link.path && (
                                            <motion.span
                                                className="absolute -bottom-1 left-0 w-full h-0.5 bg-christian-accent"
                                                layoutId="underline"
                                            />
                                        )}
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        <LanguageSwitcher />
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
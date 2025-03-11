// src/components/common/Header.js
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { mdiHeart, mdiMenu, mdiClose } from '@mdi/js';
import Icon from '@mdi/react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import { guestList } from '../../data/guestAccess'; // Import the guest list

const Header = () => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [accessibleCeremonies, setAccessibleCeremonies] = useState([]); // Store accessible ceremonies
    const location = useLocation();
    const isHomePage = location.pathname === '/';

    // Check localStorage for invitation code and determine accessible ceremonies
    useEffect(() => {
        const invitationCode = localStorage.getItem('invitationCode');

        if (invitationCode && guestList[invitationCode]) {
            // Set ceremonies this guest has access to
            setAccessibleCeremonies(guestList[invitationCode].ceremonies);
        } else {
            // Admin access or no access code - show all ceremonies
            const adminAccess = localStorage.getItem('adminAccess') === 'true';
            if (adminAccess) {
                setAccessibleCeremonies(['christian', 'hindu']);
            } else {
                setAccessibleCeremonies([]);
            }
        }
    }, [location]); // Re-check when location changes

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
        { path: '/christian-ceremony', label: t('header.christianCeremony'), ceremonyType: 'christian' },
        { path: '/hindu-ceremony', label: t('header.hinduCeremony'), ceremonyType: 'hindu' },
        { path: '/our-story', label: t('header.ourStory') },
        { path: '/accommodations', label: t('header.accommodations') },
        { path: '/gifts', label: t('header.gifts') },
        { path: '/gallery', label: t('header.gallery') }
    ];

    // Filter links based on ceremony access
    const filteredNavLinks = navLinks.filter(link => {
        // If link has ceremonyType property, check if user has access
        if (link.ceremonyType) {
            return accessibleCeremonies.includes(link.ceremonyType);
        }
        // Always show non-ceremony links
        return true;
    });

    return (
        <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
            scrolled
                ? 'bg-white/95 backdrop-blur-sm shadow-md'
                : 'bg-transparent'
        }`}>
            <div className="container mx-auto max-w-7xl px-4">
                <nav className="flex justify-between items-center py-4">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-wedding-love/10 flex items-center justify-center">
                                <Icon path={mdiHeart} size={0.9} className="text-wedding-love" />
                            </div>
                            <span className="ml-2 text-lg font-display font-bold tracking-wide">
                                {scrolled ? 'R & S Wedding' : (
                                    <span className={isHomePage ? "text-white text-shadow" : "text-christian-accent"}>R & S Wedding</span>
                                )}
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation - NOW FILTERED */}
                    <div className="hidden md:flex items-center">
                        <ul className="flex space-x-4 mr-4">
                            {filteredNavLinks.map((link) => (
                                <li key={link.path}>
                                    <Link
                                        to={link.path}
                                        className={`relative font-body tracking-wide text-sm transition-colors duration-300 ${
                                            location.pathname === link.path
                                                ? 'text-wedding-love font-medium'
                                                : scrolled
                                                    ? 'text-christian-text hover:text-wedding-love'
                                                    : isHomePage
                                                        ? 'text-white text-shadow hover:text-wedding-love'
                                                        : 'text-christian-accent font-medium hover:text-wedding-love'
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

                    {/* Mobile Navigation Button */}
                    <button
                        className="md:hidden z-50 text-2xl focus:outline-none"
                        aria-label="Toggle menu"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        <Icon
                            path={isOpen ? mdiClose : mdiMenu}
                            size={1.2}
                            className={scrolled ? "text-wedding-gray" : isHomePage ? "text-white" : "text-christian-accent"}
                        />
                    </button>

                    {/* Mobile Navigation - ALSO FILTERED */}
                    {isOpen && (
                        <motion.div
                            className="fixed inset-0 bg-white z-40 flex items-center justify-center md:hidden"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <ul className="flex flex-col items-center space-y-6">
                                {filteredNavLinks.map((link) => (
                                    <li key={link.path}>
                                        <Link
                                            to={link.path}
                                            className={`text-xl font-semibold hover:text-christian-accent transition-colors duration-300 ${location.pathname === link.path ? 'text-christian-accent' : 'text-gray-800'}`}
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}

                                {/* Add Language Switcher in mobile menu */}
                                <li className="mt-6">
                                    <LanguageSwitcher scrolled={true} />
                                </li>
                            </ul>
                        </motion.div>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;
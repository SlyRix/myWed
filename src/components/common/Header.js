// src/components/common/Header.js
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { mdiHeart, mdiMenu, mdiClose } from '@mdi/js';
import Icon from '@mdi/react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import { guestList } from '../../data/guestAccess';

const Header = () => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [accessibleCeremonies, setAccessibleCeremonies] = useState([]);
    const location = useLocation();
    const isHomePage = location.pathname === '/';

    useEffect(() => {
        const invitationCode = localStorage.getItem('invitationCode');
        if (invitationCode && guestList[invitationCode]) {
            setAccessibleCeremonies(guestList[invitationCode].ceremonies);
        } else {
            const adminAccess = localStorage.getItem('adminAccess') === 'true';
            setAccessibleCeremonies(adminAccess ? ['christian', 'hindu'] : []);
        }
    }, [location]);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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
        { path: '/gallery', label: t('header.gallery') },
        { path: '/rsvp', label: t('header.rsvp'), requiresAccess: true } // Added RSVP link with access requirement
    ];

    const filteredNavLinks = navLinks.filter(link => {
        // If link has ceremonyType property, check if user has access
        if (link.ceremonyType) {
            return accessibleCeremonies.includes(link.ceremonyType);
        }

        // For RSVP link, only show if user has access to at least one ceremony
        if (link.requiresAccess) {
            return accessibleCeremonies.length > 0;
        }

        // Always show other links
        return true;
    });

    return (
        <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
            scrolled ? 'bg-white/95 backdrop-blur-sm shadow-md' : 'bg-transparent'
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

                    <div className="hidden md:flex items-center">
                        <ul className="flex space-x-4 mr-4">
                            {filteredNavLinks.map((link) => (
                                <li key={link.path}>
                                    <Link to={link.path} className={`relative font-body tracking-wide text-sm transition-colors duration-300 ${
                                        location.pathname === link.path
                                            ? 'text-wedding-love font-medium'
                                            : scrolled
                                                ? 'text-christian-text hover:text-wedding-love'
                                                : isHomePage
                                                    ? 'text-white text-shadow hover:text-wedding-love'
                                                    : 'text-christian-accent font-medium hover:text-wedding-love'
                                    }`}>
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        <LanguageSwitcher scrolled={scrolled} />
                    </div>

                    <button className="md:hidden z-50 text-2xl focus:outline-none" onClick={() => setIsOpen(!isOpen)}>
                        <Icon path={isOpen ? mdiClose : mdiMenu} size={1.2} className={scrolled ? "text-wedding-gray" : isHomePage ? "text-white" : "text-christian-accent"} />
                    </button>

                    {isOpen && (
                        <motion.div
                            className={`fixed top-0 left-0 w-full h-full ${
                                scrolled ? 'bg-white/95 backdrop-blur-sm' : 'bg-white'
                            } z-[60] flex items-center justify-center md:hidden`}
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <ul className="flex flex-col items-center space-y-6">
                                {filteredNavLinks.map((link) => (
                                    <li key={link.path}>
                                        <Link to={link.path} className={`text-xl font-semibold hover:text-christian-accent transition-colors duration-300 ${
                                            location.pathname === link.path ? 'text-christian-accent' : 'text-gray-800'
                                        }`}>
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
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
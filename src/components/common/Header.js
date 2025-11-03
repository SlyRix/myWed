// src/components/common/Header.js
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { mdiHeart, mdiMenu, mdiClose } from '@mdi/js';
import Icon from '@mdi/react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import { guestList } from '../../data/guestAccess';

const Header = () => {
    const { t } = useTranslation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [accessibleCeremonies, setAccessibleCeremonies] = useState([]);
    const location = useLocation();
    const isHomePage = location.pathname === '/';

    // Load accessible ceremonies
    useEffect(() => {
        const invitationCode = localStorage.getItem('invitationCode');
        const adminAccess = localStorage.getItem('adminAccess') === 'true';

        if (invitationCode && guestList[invitationCode]) {
            setAccessibleCeremonies(guestList[invitationCode].ceremonies);
        } else if (adminAccess) {
            setAccessibleCeremonies(['christian', 'hindu']);
        } else {
            setAccessibleCeremonies([]);
        }
    }, []);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close menu on route change
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location.pathname]);

    // Handle body scroll locking
    useEffect(() => {
        if (mobileMenuOpen) {
            // Lock scrolling when menu is open
            document.body.classList.add('overflow-hidden');
            document.body.classList.add('fixed');
            document.body.classList.add('inset-x-0');
        } else {
            // Restore scrolling when menu is closed
            document.body.classList.remove('overflow-hidden');
            document.body.classList.remove('fixed');
            document.body.classList.remove('inset-x-0');
        }

        // Cleanup on unmount
        return () => {
            document.body.classList.remove('overflow-hidden');
            document.body.classList.remove('fixed');
            document.body.classList.remove('inset-x-0');
        };
    }, [mobileMenuOpen]);

    // Navigation links configuration
    const navLinks = [
        { path: '/', label: t('header.home') },
        { path: '/christian-ceremony', label: t('header.christianCeremony'), ceremonyType: 'christian' },
        { path: '/hindu-ceremony', label: t('header.hinduCeremony'), ceremonyType: 'hindu' },
        { path: '/our-story', label: t('header.ourStory') },
        { path: '/accommodations', label: t('header.accommodations') },
        { path: '/gifts', label: t('header.gifts') },
        { path: '/gallery', label: t('header.gallery') },
        { path: '/rsvp', label: t('header.rsvp'), requiresAccess: true }
    ];

    // Filter links based on access
    const filteredNavLinks = navLinks.filter(link => {
        if (link.ceremonyType) {
            return accessibleCeremonies.includes(link.ceremonyType);
        }
        if (link.requiresAccess) {
            return accessibleCeremonies.length > 0;
        }
        return true;
    });

    // Toggle mobile menu
    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    return (
        <>
            {/* Fixed header */}
            <header className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${
                scrolled ? 'bg-white/95 backdrop-blur-sm shadow-md' : 'bg-transparent'
            }`}>
                <div className="container mx-auto max-w-7xl px-4">
                    <div className="flex justify-between items-center py-4">
                        {/* Logo */}
                        <Link to="/" className="flex items-center z-50 relative">
                            <div className="w-10 h-10 rounded-full bg-wedding-love/10 flex items-center justify-center">
                                <Icon path={mdiHeart} size={0.9} className="text-wedding-love" />
                            </div>
                            <span className="ml-2 text-lg font-display font-bold tracking-wide">
                {scrolled ? 'R & S Wedding' : (
                    <span className={isHomePage ? "text-white text-shadow" : "text-christian-accent"}>R & S Wedding</span>
                )}
              </span>
                        </Link>

                        {/* Desktop Navigation */}
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
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                            <LanguageSwitcher scrolled={scrolled} />
                        </div>

                        {/* Mobile Menu Toggle Button */}
                        <button
                            className="md:hidden z-50 relative"
                            onClick={toggleMobileMenu}
                            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                        >
                            <Icon
                                path={mobileMenuOpen ? mdiClose : mdiMenu}
                                size={1.2}
                                className={mobileMenuOpen
                                    ? "text-gray-800"
                                    : (scrolled ? "text-wedding-gray" : isHomePage ? "text-white" : "text-christian-accent")}
                            />
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Menu (separate from header) */}
            {mobileMenuOpen && (
                <div className="md:hidden fixed inset-0 z-40 bg-white flex flex-col">
                    {/* Transparent spacer to prevent content from being under the header */}
                    <div className="h-16"></div>

                    {/* Mobile menu content */}
                    <div className="flex-1 flex flex-col items-center justify-center overflow-y-auto py-8">
                        <ul className="flex flex-col items-center space-y-6">
                            {filteredNavLinks.map((link) => (
                                <li key={link.path}>
                                    <Link
                                        to={link.path}
                                        className={`text-xl font-semibold transition-colors duration-300 ${
                                            location.pathname === link.path ? 'text-christian-accent' : 'text-gray-800 hover:text-christian-accent'
                                        }`}
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        {/* Language switcher in mobile menu */}
                        <div className="mt-8">
                            <LanguageSwitcher scrolled={true} />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Header;
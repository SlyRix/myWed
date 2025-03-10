import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { mdiHeart, mdiMenu, mdiClose } from '@mdi/js';
import Icon from '@mdi/react';

const Header = () => {
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
        { path: '/', label: 'Home' },
        { path: '/christian-ceremony', label: 'Christian Ceremony' },
        { path: '/hindu-ceremony', label: 'Hindu Ceremony' },
        { path: '/our-story', label: 'Our Story' },
        { path: '/gifts', label: 'Gifts' },
        { path: '/gallery', label: 'Gallery' }
    ];

    return (
        <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md' : 'bg-transparent'}`}>
            <div className="container">
                <nav className="flex justify-between items-center py-4">
                    <div className="logo">
                        <Link to="/" className="flex items-center">
                            <Icon path={mdiHeart} size={1.2} className="text-christian-accent mr-2" />
                            <span className="text-xl font-bold">Our Wedding</span>
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden flex flex-col justify-between w-6 h-5 z-50"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        <Icon path={isOpen ? mdiClose : mdiMenu} size={1} />
                    </button>

                    {/* Desktop Navigation */}
                    <ul className="hidden md:flex space-x-8">
                        {navLinks.map((link) => (
                            <li key={link.path}>
                                <Link
                                    to={link.path}
                                    className={`relative font-semibold hover:text-christian-accent transition-colors duration-300 ${location.pathname === link.path ? 'text-christian-accent' : ''}`}
                                >
                                    {link.label}
                                    {location.pathname === link.path && (
                                        <motion.span
                                            className="absolute bottom-[-4px] left-0 w-full h-0.5 bg-christian-accent"
                                            layoutId="underline"
                                        />
                                    )}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    {/* Mobile Navigation */}
                    <motion.div
                        className={`fixed inset-0 bg-white z-40 flex items-center justify-center md:hidden ${isOpen ? 'block' : 'hidden'}`}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: isOpen ? 1 : 0, y: isOpen ? 0 : -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <ul className="flex flex-col items-center space-y-6">
                            {navLinks.map((link) => (
                                <li key={link.path}>
                                    <Link
                                        to={link.path}
                                        className={`text-xl font-semibold hover:text-christian-accent transition-colors duration-300 ${location.pathname === link.path ? 'text-christian-accent' : ''}`}
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                </nav>
            </div>
        </header>
    );
};

export default Header;
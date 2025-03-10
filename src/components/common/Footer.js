import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { mdiHeart, mdiFacebook, mdiInstagram, mdiTwitter } from '@mdi/js';
import Icon from '@mdi/react';

const Footer = () => {
    const footerLinks = [
        { path: '/', label: 'Home' },
        { path: '/christian-ceremony', label: 'Christian Ceremony' },
        { path: '/hindu-ceremony', label: 'Hindu Ceremony' },
        { path: '/our-story', label: 'Our Story' },
        { path: '/gifts', label: 'Gifts' },
        { path: '/gallery', label: 'Gallery' }
    ];

    const socialLinks = [
        { icon: mdiFacebook, url: '#', label: 'Facebook' },
        { icon: mdiInstagram, url: '#', label: 'Instagram' },
        { icon: mdiTwitter, url: '#', label: 'Twitter' }
    ];

    return (
        <footer className="bg-gray-800 text-white py-12">
            <div className="container">
                <div className="max-w-2xl mx-auto text-center">
                    <div className="mb-8">
                        <Icon path={mdiHeart} size={2} />
                    </div>

                    <ul className="flex flex-wrap justify-center mb-8 gap-4 md:gap-8">
                        {footerLinks.map((link) => (
                            <li key={link.path}>
                                <Link
                                    to={link.path}
                                    className="text-sm hover:text-christian-accent transition-colors duration-300"
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    <ul className="flex justify-center mb-8 space-x-4">
                        {socialLinks.map((link, index) => (
                            <li key={index}>
                                <a
                                    href={link.url}
                                    className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-christian-accent transition-colors duration-300"
                                    aria-label={link.label}
                                >
                                    <Icon path={link.icon} size={0.8} />
                                </a>
                            </li>
                        ))}
                    </ul>

                    <p className="text-sm text-white/60">© 2026 Christian & Hindu Wedding. All Rights Reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
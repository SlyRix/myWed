// src/components/common/Footer.js
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { mdiHeart, mdiFacebook, mdiInstagram, mdiTwitter } from '@mdi/js';
import Icon from '@mdi/react';
import { useTranslation } from 'react-i18next';
import { useGuest } from '../../contexts/GuestContext';

const Footer = () => {
    const { t } = useTranslation();
    const { ceremonies: accessibleCeremonies } = useGuest();

    const footerLinks = [
        { path: '/', label: t('header.home') },
        { path: '/christian-ceremony', label: t('header.christianCeremony'), ceremonyType: 'christian' },
        { path: '/hindu-ceremony', label: t('header.hinduCeremony'), ceremonyType: 'hindu' },
        { path: '/our-story', label: t('header.ourStory') },
        { path: '/accommodations', label: t('header.accommodations') },
        { path: '/gifts', label: t('header.gifts') },
        { path: '/gallery', label: t('header.gallery') }
    ];

    // Filter links based on ceremony access
    const filteredFooterLinks = footerLinks.filter(link => {
        if (link.ceremonyType) {
            return accessibleCeremonies.includes(link.ceremonyType);
        }
        return true;
    });

    const socialLinks = [
        { icon: mdiFacebook, url: '#', label: 'Facebook' },
        { icon: mdiInstagram, url: '#', label: 'Instagram' },
        { icon: mdiTwitter, url: '#', label: 'Twitter' }
    ];

    return (
        <footer className="bg-gray-800 text-white py-12">
            <div className="container mx-auto max-w-6xl px-4">
                <div className="max-w-2xl mx-auto text-center">
                    <div className="mb-8 flex justify-center">
                        <Icon path={mdiHeart} size={2} className="text-christian-accent" />
                    </div>

                    <ul className="flex flex-wrap justify-center mb-8 gap-4 md:gap-8">
                        {filteredFooterLinks.map((link) => (
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

                    <p className="text-sm text-white/60">{t('footer.copyright')}</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
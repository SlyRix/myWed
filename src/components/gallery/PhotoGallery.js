// src/components/gallery/PhotoGallery.js
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import PhotoUpload from './PhotoUpload';
import GalleryItem from './GalleryItem';

const PhotoGallery = () => {
    const { t } = useTranslation();
    const [photos, setPhotos] = useState([]);
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const modalRef = useRef(null);

    // In a real app, you'd fetch photos from storage
    useEffect(() => {
        // Wedding-themed preview photos
        const weddingPhotos = [
            { id: 0, src: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&h=400&fit=crop&q=80', alt: 'Wedding Couple' },
            { id: 1, src: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600&h=400&fit=crop&q=80', alt: 'Wedding Flowers' },
            { id: 2, src: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=600&h=400&fit=crop&q=80', alt: 'Wedding Rings' },
            { id: 3, src: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600&h=400&fit=crop&q=80', alt: 'Wedding Venue' },
            { id: 4, src: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=600&h=400&fit=crop&q=80', alt: 'Wedding Cake' },
            { id: 5, src: 'https://images.unsplash.com/photo-1460978812857-470ed1c77af0?w=600&h=400&fit=crop&q=80', alt: 'Wedding Details' }
        ];
        const placeholderPhotos = weddingPhotos;

        setPhotos(placeholderPhotos);
    }, []);

    const handlePhotoUpload = (newPhotos) => {
        // Add new photos to the gallery
        setPhotos(prevPhotos => [...newPhotos, ...prevPhotos]);
    };

    // Focus management and keyboard navigation for modal
    useEffect(() => {
        if (selectedPhoto && modalRef.current) {
            // Focus the close button when modal opens
            const closeButton = modalRef.current.querySelector('button[aria-label="Close photo viewer"]');
            closeButton?.focus();

            // Handle keyboard navigation
            const handleKeyDown = (e) => {
                if (e.key === 'Escape') {
                    setSelectedPhoto(null);
                }
            };

            document.addEventListener('keydown', handleKeyDown);
            return () => document.removeEventListener('keydown', handleKeyDown);
        }
    }, [selectedPhoto]);

    return (
        <section className="pt-24 pb-20 bg-gray-50">
            <div className="container mx-auto max-w-6xl px-4">
                <h2 className="text-3xl md:text-4xl text-center mb-8 font-bold">{t('gallery.title')}</h2>

                <div className="max-w-3xl mx-auto text-center mb-10">
                    <p className="text-gray-700 mb-8">
                        {t('gallery.description')}
                    </p>

                    <PhotoUpload onPhotoUpload={handlePhotoUpload} uploadButtonText={t('gallery.uploadButton')} />
                </div>

                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    {photos.map((photo) => (
                        <GalleryItem
                            key={photo.id}
                            photo={photo}
                            onClick={() => setSelectedPhoto(photo)}
                        />
                    ))}
                </motion.div>

                <AnimatePresence>
                    {selectedPhoto && (
                        <motion.div
                            className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            onClick={() => setSelectedPhoto(null)}
                        >
                            <div
                                ref={modalRef}
                                role="dialog"
                                aria-modal="true"
                                aria-label="Photo viewer"
                                className="relative max-w-4xl w-full bg-white rounded-lg overflow-hidden shadow-2xl"
                                onClick={e => e.stopPropagation()}
                            >
                                <img
                                    src={selectedPhoto.src}
                                    alt={selectedPhoto.alt}
                                    className="w-full h-auto max-h-[80vh] object-contain"
                                />
                                <button
                                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black bg-opacity-50 text-white flex items-center justify-center hover:bg-opacity-70 transition-colors"
                                    onClick={() => setSelectedPhoto(null)}
                                    aria-label="Close photo viewer"
                                    title="Close"
                                >
                                    ×
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
};

export default PhotoGallery;
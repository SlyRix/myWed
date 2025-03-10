// src/components/gallery/PhotoGallery.js
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import PhotoUpload from './PhotoUpload';
import GalleryItem from './GalleryItem';

const PhotoGallery = () => {
    const { t } = useTranslation();
    const [photos, setPhotos] = useState([]);
    const [selectedPhoto, setSelectedPhoto] = useState(null);

    // In a real app, you'd fetch photos from storage
    useEffect(() => {
        // Example placeholder photos
        const placeholderPhotos = Array(6).fill().map((_, i) => ({
            id: i,
            src: '/images/placeholder.jpg',
            alt: `Gallery Image ${i + 1}`
        }));

        setPhotos(placeholderPhotos);
    }, []);

    const handlePhotoUpload = (newPhotos) => {
        // Add new photos to the gallery
        setPhotos(prevPhotos => [...newPhotos, ...prevPhotos]);
    };

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
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PhotoUpload from './PhotoUpload';
import GalleryItem from './GalleryItem';
import '../../styles/components/gallery.css';

const PhotoGallery = () => {
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
        <section className="photo-gallery">
            <div className="container">
                <h2 className="section-title">Photo Gallery</h2>

                <div className="gallery-intro">
                    <p>Share in our joy by viewing photos from our special day. After the wedding, this section will be filled with cherished moments from both ceremonies. We also invite you to share your own photos here.</p>
                </div>

                <PhotoUpload onPhotoUpload={handlePhotoUpload} />

                <motion.div
                    className="gallery-grid"
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

                {selectedPhoto && (
                    <motion.div
                        className="photo-lightbox"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        onClick={() => setSelectedPhoto(null)}
                    >
                        <div className="lightbox-content" onClick={e => e.stopPropagation()}>
                            <img src={selectedPhoto.src} alt={selectedPhoto.alt} />
                            <button className="close-lightbox" onClick={() => setSelectedPhoto(null)}>×</button>
                        </div>
                    </motion.div>
                )}
            </div>
        </section>
    );
};

export default PhotoGallery;
import { useEffect } from 'react';

const GALLERY_URL = 'https://gallery.rushelwedsivani.com?gallery=RUSHIVANI2025';

const PhotoGallery = () => {
    useEffect(() => {
        window.location.replace(GALLERY_URL);
    }, []);

    return null;
};

export default PhotoGallery;

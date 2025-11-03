import { useEffect, useState } from 'react';

export const useProgressiveImg = (lowQualitySrc, highQualitySrc) => {
    const [src, setSrc] = useState(lowQualitySrc || highQualitySrc);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Start with low quality image
        setSrc(lowQualitySrc);
        setIsLoaded(false);

        // Then load high quality image
        const img = new Image();
        img.src = highQualitySrc;

        img.onload = () => {
            setSrc(highQualitySrc);
            setIsLoaded(true);
        };

        return () => {
            img.onload = null;
        };
    }, [lowQualitySrc, highQualitySrc]);

    // Return src and a flag indicating if the high quality image has loaded
    return { src, isLoaded };
};
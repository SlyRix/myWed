import React, { useState, useEffect, useRef } from 'react';

const MiniMap = ({ address, title }) => {
    const [isVisible, setIsVisible] = useState(false);
    const containerRef = useRef(null);

    // Only load the iframe when the map scrolls into view
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    const embedUrl = `https://www.google.com/maps/embed/v1/place?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(address)}`;

    return (
        <div ref={containerRef} className="w-full overflow-hidden rounded-lg shadow-md bg-white hover:shadow-lg transition-shadow duration-300">
            <div className="relative h-40 bg-gray-200 overflow-hidden">
                {isVisible ? (
                    <iframe
                        title={`Map of ${title}`}
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        loading="lazy"
                        src={embedUrl}
                        allowFullScreen
                    ></iframe>
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 text-sm">
                        <span>Karte wird geladen...</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MiniMap;
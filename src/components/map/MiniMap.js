import React from 'react';

const MiniMap = ({ address, title }) => {
    // Create an embeddable Google Maps URL using the address string
    // Google Maps Embed API supports direct address queries
    const embedUrl = `https://www.google.com/maps/embed/v1/place?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(address)}`;

    return (
        <div className="w-full overflow-hidden rounded-lg shadow-md bg-white hover:shadow-lg transition-shadow duration-300">
            {/* Map iframe */}
            <div className="relative h-40 bg-gray-200 overflow-hidden">
                <iframe
                    title={`Map of ${title}`}
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    src={embedUrl}
                    allowFullScreen
                ></iframe>
            </div>
        </div>
    );
};

export default MiniMap;
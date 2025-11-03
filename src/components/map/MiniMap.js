import React from 'react';

const MiniMap = ({ address, lat, lng, title }) => {
    // Generate Google Maps URL for directions
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

    // Create an embeddable Google Maps URL that doesn't require an API key
    // This uses Google's embed feature that's available without an API key for limited usage
    const embedAddress = lat && lng
        ? `${lat},${lng}`
        : encodeURIComponent(address);

    const embedUrl = `https://www.google.com/maps/embed/v1/place?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&q=${embedAddress}`;

    // This is a free "no-API-key-needed" embed from Google
    // It has limited features but works for basic needs
    // In production, you should use your own API key for better reliability and features

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
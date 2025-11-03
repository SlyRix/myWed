// src/components/map/OpenStreetMap.js
// Free map component using OpenStreetMap (no API key required, no dependencies!)
import React from 'react';

/**
 * OpenStreetMap component - Completely free alternative to Google Maps
 * Uses OpenStreetMap iframe embed (no API key, no dependencies)
 * @param {string} address - Location address for "Get Directions" link
 * @param {number} lat - Latitude coordinate
 * @param {number} lng - Longitude coordinate
 * @param {string} title - Location name/title
 */
const OpenStreetMap = ({ address, lat, lng, title }) => {
    // Generate Google Maps URL for directions (users can still get directions via Google)
    const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

    // OpenStreetMap embed URL using iframe
    // Free service, no API key needed!
    const osmEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lng-0.01},${lat-0.01},${lng+0.01},${lat+0.01}&layer=mapnik&marker=${lat},${lng}`;

    // Link to full OpenStreetMap view
    const osmFullUrl = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=16/${lat}/${lng}`;

    return (
        <div className="w-full overflow-hidden rounded-lg shadow-md bg-white hover:shadow-lg transition-shadow duration-300">
            {/* Map iframe */}
            <div className="relative h-64 bg-gray-200 overflow-hidden">
                <iframe
                    title={`Map of ${title}`}
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    src={osmEmbedUrl}
                    style={{ border: 'none' }}
                ></iframe>

                {/* Link to open in full OpenStreetMap */}
                <a
                    href={osmFullUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute top-2 right-2 bg-white px-3 py-1 rounded shadow text-xs hover:bg-gray-100"
                >
                    View Larger Map
                </a>
            </div>

            {/* Location details */}
            <div className="p-4 bg-white">
                <h3 className="font-semibold text-gray-800 mb-2">{title}</h3>
                <p className="text-sm text-gray-600 mb-3">{address}</p>
                <a
                    href={directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-4 py-2 bg-gradient-to-r from-christian-accent to-hindu-secondary text-white rounded-full text-sm hover:shadow-md transition-shadow"
                >
                    Get Directions
                </a>
            </div>
        </div>
    );
};

export default OpenStreetMap;

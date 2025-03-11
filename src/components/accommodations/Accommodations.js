// src/components/accommodations/Accommodations.js
// Created for wedding guests coming from foreign countries who need accommodations
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { mdiMapMarker, mdiBed, mdiCurrencyEur, mdiStar, mdiWifi, mdiFridge, mdiParking, mdiCar } from '@mdi/js';
import Icon from '@mdi/react';
import { useTranslation } from 'react-i18next';
import AnimatedSection from '../common/AnimatedSection';
import MiniMap from '../map/MiniMap';

const Accommodations = () => {
    const { t } = useTranslation();
    const [venueFilter, setVenueFilter] = useState('all'); // 'all', 'christian', 'hindu'
    const [priceFilter, setPriceFilter] = useState('all'); // 'all', 'budget', 'mid', 'luxury'

    // Define accommodations data
    const accommodations = [
        {
            id: 1,
            name: 'Hotel Schwanen Lachen',
            description: 'This elegant hotel is just a short walk from the Christian ceremony venue, offering beautiful lake views and comfortable rooms.',
            address: 'Seestrasse 8, 8853 Lachen',
            priceRange: 'mid', // budget, mid, luxury
            priceIndicator: '$$',
            stars: 4,
            amenities: ['wifi', 'parking', 'breakfast'],
            imageUrl: '/images/placeholder.jpg',
            bookingUrl: 'https://www.hotel-schwanen.ch',
            nearChristian: true,
            nearHindu: false,
            distanceChristian: '400m (5 min walk)',
            distanceHindu: '38km (40 min drive)',
            coordinates: {
                lat: 47.194237,
                lng: 8.852632
            }
        },
        {
            id: 2,
            name: 'Gasthof Rössli',
            description: 'A family-run guesthouse with cozy rooms and authentic Swiss ambiance, convenient to the Christian ceremony.',
            address: 'Seestrasse 38, 8853 Lachen',
            priceRange: 'budget',
            priceIndicator: '$',
            stars: 3,
            amenities: ['wifi', 'parking', 'breakfast'],
            imageUrl: '/images/placeholder.jpg',
            bookingUrl: 'https://www.gasthof-roessli.ch',
            nearChristian: true,
            nearHindu: false,
            distanceChristian: '600m (8 min walk)',
            distanceHindu: '38km (40 min drive)',
            coordinates: {
                lat: 47.195612,
                lng: 8.853744
            }
        },
        {
            id: 3,
            name: 'Sorell Hotel Merian',
            description: 'Located in Olten, offering easy access to the Hindu ceremony venue with comfortable accommodations.',
            address: 'Bahnhofquai 3, 4600 Olten',
            priceRange: 'mid',
            priceIndicator: '$$',
            stars: 3,
            amenities: ['wifi', 'parking', 'breakfast', 'restaurant'],
            imageUrl: '/images/placeholder.jpg',
            bookingUrl: 'https://www.sorellhotels.com/en/merian',
            nearChristian: false,
            nearHindu: true,
            distanceChristian: '90km (1 hour drive)',
            distanceHindu: '5km (10 min drive)',
            coordinates: {
                lat: 47.349759,
                lng: 7.903748
            }
        },
        {
            id: 4,
            name: 'Hotel Arte Olten',
            description: 'Modern hotel with contemporary design close to the Hindu venue, offering comfort and convenience.',
            address: 'Riggenbachstrasse 10, 4600 Olten',
            priceRange: 'luxury',
            priceIndicator: '$$$',
            stars: 4,
            amenities: ['wifi', 'parking', 'breakfast', 'restaurant', 'spa'],
            imageUrl: '/images/placeholder.jpg',
            bookingUrl: 'https://www.hotelarte.ch',
            nearChristian: false,
            nearHindu: true,
            distanceChristian: '90km (1 hour drive)',
            distanceHindu: '4km (8 min drive)',
            coordinates: {
                lat: 47.347112,
                lng: 7.907845
            }
        },
        {
            id: 5,
            name: 'Holiday Inn Zürich',
            description: 'Located in Zürich, this hotel offers a convenient midpoint between both ceremony venues with excellent transportation options.',
            address: 'Flughofstrasse 75, 8152 Glattbrugg, Zürich',
            priceRange: 'mid',
            priceIndicator: '$$',
            stars: 4,
            amenities: ['wifi', 'parking', 'breakfast', 'restaurant', 'shuttle'],
            imageUrl: '/images/placeholder.jpg',
            bookingUrl: 'https://www.ihg.com/holidayinn/hotels/us/en/zurich/zrhga/hoteldetail',
            nearChristian: true,
            nearHindu: true,
            distanceChristian: '40km (30 min drive)',
            distanceHindu: '60km (45 min drive)',
            coordinates: {
                lat: 47.434471,
                lng: 8.560483
            }
        },
        {
            id: 6,
            name: 'Airbnb Options',
            description: 'For guests who prefer a homelier stay or are traveling with family, we recommend checking Airbnb options in Lachen or Trimbach areas.',
            address: 'Various locations',
            priceRange: 'all', // covers all price ranges
            priceIndicator: '$-$$$',
            stars: null,
            amenities: ['variable'],
            imageUrl: '/images/placeholder.jpg',
            bookingUrl: 'https://www.airbnb.com',
            nearChristian: true,
            nearHindu: true,
            distanceChristian: 'Varies',
            distanceHindu: 'Varies',
            coordinates: null
        }
    ];

    // Filter accommodations based on venue proximity and price range
    const filteredAccommodations = accommodations.filter(accommodation => {
        // Venue filter
        if (venueFilter !== 'all') {
            if (venueFilter === 'christian' && !accommodation.nearChristian) return false;
            if (venueFilter === 'hindu' && !accommodation.nearHindu) return false;
        }

        // Price filter
        if (priceFilter !== 'all' && accommodation.priceRange !== priceFilter && accommodation.priceRange !== 'all') {
            return false;
        }

        return true;
    });

    // Render amenity icons
    const renderAmenityIcons = (amenities) => {
        if (amenities.includes('variable')) {
            return <span className="text-gray-600 text-sm italic">Varies by property</span>;
        }

        const amenityIcons = {
            wifi: { icon: mdiWifi, label: 'Wi-Fi' },
            parking: { icon: mdiParking, label: 'Parking' },
            breakfast: { icon: mdiFridge, label: 'Breakfast' },
            restaurant: { icon: mdiFridge, label: 'Restaurant' },
            spa: { icon: mdiWifi, label: 'Spa' },
            shuttle: { icon: mdiCar, label: 'Shuttle' }
        };

        return (
            <div className="flex flex-wrap gap-3 mt-2">
                {amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center text-gray-600" title={amenityIcons[amenity]?.label || amenity}>
                        <Icon path={amenityIcons[amenity]?.icon || mdiStar} size={0.7} className="mr-1" />
                        <span className="text-xs">{amenityIcons[amenity]?.label || amenity}</span>
                    </div>
                ))}
            </div>
        );
    };

    // Render price indicator
    const renderPriceIndicator = (priceIndicator) => {
        return (
            <div className="text-gray-600 font-medium">
                {priceIndicator}
            </div>
        );
    };

    // Render star rating
    const renderStarRating = (stars) => {
        if (!stars) return null;

        return (
            <div className="flex items-center">
                {[...Array(stars)].map((_, i) => (
                    <Icon key={i} path={mdiStar} size={0.7} className="text-yellow-500" />
                ))}
            </div>
        );
    };

    return (
        <section className="pt-24 pb-20 bg-gradient-to-br from-christian-secondary/30 to-hindu-primary/20 overflow-hidden">
            <div className="container mx-auto max-w-6xl px-4">
                <AnimatedSection className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-6">Accommodations</h1>
                    <p className="text-gray-700 max-w-2xl mx-auto">
                        We've compiled a list of recommended accommodations for our out-of-town guests. These options offer various price points and proximities to our ceremony venues.
                    </p>
                </AnimatedSection>

                <AnimatedSection className="mb-12">
                    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-bold mb-4 text-center">Travel Information</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-xl font-semibold mb-2 text-christian-accent">Christian Ceremony Location</h3>
                                <p className="mb-2"><strong>Venue:</strong> Kath. Pfarramt Heilig Kreuz</p>
                                <p className="mb-2"><strong>Address:</strong> Kirchpl. 10, 8853 Lachen</p>
                                <p className="mb-1"><strong>Nearest Airport:</strong> Zürich Airport (ZRH)</p>
                                <p className="text-sm text-gray-600 mb-3">Approximately 50 km (40 minutes by car)</p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold mb-2 text-hindu-secondary">Hindu Ceremony Location</h3>
                                <p className="mb-2"><strong>Venue:</strong> Sri Manonmani Ampal Tempel</p>
                                <p className="mb-2"><strong>Address:</strong> Miesernweg 13, 4632 Trimbach</p>
                                <p className="mb-1"><strong>Nearest Airport:</strong> Zürich Airport (ZRH)</p>
                                <p className="text-sm text-gray-600 mb-3">Approximately 70 km (1 hour by car)</p>
                            </div>
                        </div>

                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                            <h3 className="text-lg font-semibold mb-2">Transportation Tips</h3>
                            <ul className="list-disc list-inside text-gray-700 space-y-1">
                                <li>We recommend renting a car as the venues are in different locations.</li>
                                <li>Swiss public transportation is excellent but may require multiple connections.</li>
                                <li>Taxis and ride-sharing services are available but can be expensive for longer distances.</li>
                                <li>We will arrange shuttle service between key hotels and venues on ceremony days.</li>
                            </ul>
                        </div>
                    </div>
                </AnimatedSection>

                <AnimatedSection className="mb-8">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-2xl font-bold mb-6 text-center">Find the Perfect Stay</h2>

                        <div className="flex flex-col md:flex-row justify-center gap-4 mb-8">
                            <div className="flex flex-col">
                                <label className="mb-2 font-medium">Filter by Venue Proximity</label>
                                <div className="inline-flex rounded-md shadow-sm">
                                    <button
                                        onClick={() => setVenueFilter('all')}
                                        className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                                            venueFilter === 'all'
                                                ? 'bg-gray-800 text-white'
                                                : 'bg-white text-gray-700 hover:bg-gray-50'
                                        }`}
                                    >
                                        All Locations
                                    </button>
                                    <button
                                        onClick={() => setVenueFilter('christian')}
                                        className={`px-4 py-2 text-sm font-medium ${
                                            venueFilter === 'christian'
                                                ? 'bg-christian-accent text-white'
                                                : 'bg-white text-gray-700 hover:bg-gray-50'
                                        }`}
                                    >
                                        Near Christian Ceremony
                                    </button>
                                    <button
                                        onClick={() => setVenueFilter('hindu')}
                                        className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                                            venueFilter === 'hindu'
                                                ? 'bg-hindu-secondary text-white'
                                                : 'bg-white text-gray-700 hover:bg-gray-50'
                                        }`}
                                    >
                                        Near Hindu Ceremony
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-col mt-4 md:mt-0">
                                <label className="mb-2 font-medium">Filter by Price Range</label>
                                <div className="inline-flex rounded-md shadow-sm">
                                    <button
                                        onClick={() => setPriceFilter('all')}
                                        className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                                            priceFilter === 'all'
                                                ? 'bg-gray-800 text-white'
                                                : 'bg-white text-gray-700 hover:bg-gray-50'
                                        }`}
                                    >
                                        All Prices
                                    </button>
                                    <button
                                        onClick={() => setPriceFilter('budget')}
                                        className={`px-4 py-2 text-sm font-medium ${
                                            priceFilter === 'budget'
                                                ? 'bg-gray-800 text-white'
                                                : 'bg-white text-gray-700 hover:bg-gray-50'
                                        }`}
                                    >
                                        Budget ($)
                                    </button>
                                    <button
                                        onClick={() => setPriceFilter('mid')}
                                        className={`px-4 py-2 text-sm font-medium ${
                                            priceFilter === 'mid'
                                                ? 'bg-gray-800 text-white'
                                                : 'bg-white text-gray-700 hover:bg-gray-50'
                                        }`}
                                    >
                                        Mid-Range ($$)
                                    </button>
                                    <button
                                        onClick={() => setPriceFilter('luxury')}
                                        className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                                            priceFilter === 'luxury'
                                                ? 'bg-gray-800 text-white'
                                                : 'bg-white text-gray-700 hover:bg-gray-50'
                                        }`}
                                    >
                                        Luxury ($$$)
                                    </button>
                                </div>
                            </div>
                        </div>

                        {filteredAccommodations.length === 0 ? (
                            <div className="text-center text-gray-500 py-8">
                                <p>No accommodations match your current filters. Please adjust your criteria.</p>
                            </div>
                        ) : (
                            <div className="grid md:grid-cols-2 gap-6">
                                {filteredAccommodations.map((accommodation, index) => (
                                    <AnimatedSection
                                        key={accommodation.id}
                                        className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                                        delay={index * 0.1}
                                    >
                                        <div className="h-48 overflow-hidden">
                                            <img
                                                src={accommodation.imageUrl}
                                                alt={accommodation.name}
                                                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                                            />
                                        </div>
                                        <div className="p-5">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="text-xl font-bold">{accommodation.name}</h3>
                                                <div className="flex items-center space-x-2">
                                                    {renderPriceIndicator(accommodation.priceIndicator)}
                                                    {renderStarRating(accommodation.stars)}
                                                </div>
                                            </div>

                                            <p className="text-gray-700 mb-4">{accommodation.description}</p>

                                            <div className="flex items-start mb-3">
                                                <Icon path={mdiMapMarker} size={0.8} className="mt-1 mr-2 text-gray-600" />
                                                <div>
                                                    <p className="text-gray-700">{accommodation.address}</p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-2 mb-4">
                                                <div className={`flex items-center ${accommodation.nearChristian ? 'text-christian-accent' : 'text-gray-500'}`}>
                                                    <Icon path={mdiBed} size={0.8} className="mr-2" />
                                                    <div>
                                                        <p className="text-sm font-medium">Christian Venue</p>
                                                        <p className="text-xs">{accommodation.distanceChristian}</p>
                                                    </div>
                                                </div>

                                                <div className={`flex items-center ${accommodation.nearHindu ? 'text-hindu-secondary' : 'text-gray-500'}`}>
                                                    <Icon path={mdiBed} size={0.8} className="mr-2" />
                                                    <div>
                                                        <p className="text-sm font-medium">Hindu Venue</p>
                                                        <p className="text-xs">{accommodation.distanceHindu}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mb-4">
                                                <p className="font-medium mb-1">Amenities</p>
                                                {renderAmenityIcons(accommodation.amenities)}
                                            </div>

                                            {accommodation.coordinates && (
                                                <div className="mb-4 h-40">
                                                    <MiniMap
                                                        lat={accommodation.coordinates.lat}
                                                        lng={accommodation.coordinates.lng}
                                                        title={accommodation.name}
                                                        address={accommodation.address}
                                                    />
                                                </div>
                                            )}

                                            <div className="mt-4">
                                                <a
                                                    href={accommodation.bookingUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-block py-2 px-6 bg-gradient-to-r from-christian-accent to-hindu-secondary text-white rounded-full font-semibold hover:shadow-md transition-shadow"
                                                >
                                                    Book Now
                                                </a>
                                            </div>
                                        </div>
                                    </AnimatedSection>
                                ))}
                            </div>
                        )}
                    </div>
                </AnimatedSection>

                <AnimatedSection className="text-center">
                    <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
                        <h2 className="text-xl font-bold mb-4">Need Additional Help?</h2>
                        <p className="text-gray-700 mb-4">
                            If you need more information about accommodations or have specific requirements, please don't hesitate to contact us.
                        </p>
                        <p className="text-gray-700 mb-4">
                            We're happy to help you find the perfect place to stay during our wedding celebrations.
                        </p>
                        <a
                            href="mailto:slyrajah@gmail.com"
                            className="inline-block py-2 px-6 bg-gray-800 text-white rounded-full font-semibold hover:bg-gray-700 transition-colors"
                        >
                            Email Us for Assistance
                        </a>
                    </div>
                </AnimatedSection>
            </div>
        </section>
    );
};

export default Accommodations;
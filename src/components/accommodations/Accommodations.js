// src/components/accommodations/Accommodations.js
// Created for wedding guests coming from foreign countries who need accommodations
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { mdiMapMarker, mdiBed, mdiCurrencyEur, mdiStar, mdiWifi, mdiFridge, mdiParking, mdiCar, mdiSnowflake, mdiClockOutline, mdiSpa, mdiWeightLifter , mdiFoodForkDrink } from '@mdi/js';
import Icon from '@mdi/react';
import { useTranslation } from 'react-i18next';
import AnimatedSection from '../common/AnimatedSection';
import MiniMap from '../map/MiniMap';

const Accommodations = () => {
    const { t } = useTranslation();
    const [venueFilter, setVenueFilter] = useState('all'); // 'all', 'christian', 'hindu'
    const [priceFilter, setPriceFilter] = useState('all'); // 'all', 'budget', 'mid', 'luxury'

    // Define accommodations data from hotels_hochzeit.csv
    const accommodations = [
        // Budget Category (Günstig)
        {
            id: 1,
            name: 'Hotel Tivoli',
            description: 'Newly renovated mid-range hotel in Schlieren, ideal for business and leisure travelers with personal service and 60 rooms.',
            address: 'Zürcherstrasse 26, 8952 Schlieren',
            priceRange: 'budget',
            priceIndicator: '$',
            stars: 3,
            amenities: ['wifi', 'parking', 'breakfast', 'bar', '24h reception'],
            imageUrl: 'https://www.hotel-tivoli.ch/bilder/hauptbilder/hotel/aussenansicht-hotel-tivoli-schlieren-05.jpg',
            bookingUrl: 'https://www.booking.com/Share-OTyZKj',
            nearChristian: false,
            nearHindu: false,
            distanceChristian: '40 km',
            distanceHindu: '45 km',
            distanceReception: '1 km',
            distanceCoupleHome: '45 km',
            coordinates: { lat: 47.3969, lng: 8.4486 }
        },
        {
            id: 2,
            name: 'ibis Zürich City-West',
            description: 'Contemporary budget hotel near Technopark, about 10 minutes from Schlieren by car. Air-conditioned rooms and 24h bar.',
            address: 'Schiffbaustrasse 11, 8005 Zürich',
            priceRange: 'budget',
            priceIndicator: '$',
            stars: 3,
            amenities: ['wifi', 'parking', 'breakfast', 'restaurant', 'bar', 'ac', '24h reception'],
            imageUrl: 'https://media-cdn.holidaycheck.com/w_768,h_432,c_fill,q_auto,f_auto/ugc/images/1ae92050-9346-4b39-bf35-7f540d43e63d',
            bookingUrl: 'https://www.booking.com/Share-OTyZKj',
            nearChristian: false,
            nearHindu: false,
            distanceChristian: '40 km',
            distanceHindu: '45 km',
            distanceReception: '18 km',
            distanceCoupleHome: '32 km',
            coordinates: { lat: 47.3871, lng: 8.5285 }
        },
        {
            id: 3,
            name: 'easyHotel Zürich',
            description: 'Centrally located budget hotel with simple comfortable rooms. Many restaurants are within walking distance.',
            address: 'Leonhardstrasse 2, 8001 Zürich',
            priceRange: 'budget',
            priceIndicator: '$',
            stars: 2,
            amenities: ['wifi', '24h reception'],
            imageUrl: 'https://lh3.googleusercontent.com/proxy/6UnQV1DwXQSE2OhEYVVtH2Zj-imUxWj6zV626kpSLLAhIm-sqBW_LGQptyFX8ljWIndD06s8TfjyZJGMePhPXHq_aU0LReTsDg4xiaBS8e9Q4sEWzFQuYXUij6jNCjZWVLq-Xva7VqXN_DPM1OG61Nr-iRsTig=w253-h165-k-no',
            bookingUrl: 'https://www.booking.com/Share-5a35eag',
            nearChristian: false,
            nearHindu: false,
            distanceChristian: '40 km',
            distanceHindu: '45 km',
            distanceReception: '19 km',
            distanceCoupleHome: '32 km',
            coordinates: { lat: 47.3769, lng: 8.5417 }
        },
        {
            id: 4,
            name: 'Youth Hostel Rapperswil-Jona',
            description: 'Modern youth hostel with single and shared rooms, garden and terrace. About 5 minutes from Altendorf by car.',
            address: 'Seegubel 5, 8640 Rapperswil',
            priceRange: 'budget',
            priceIndicator: '$',
            stars: 2,
            amenities: ['wifi', 'parking', 'breakfast', 'restaurant', '24h reception'],
            imageUrl: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1d/d9/88/fd/jugendherberge-rapperswil.jpg',
            bookingUrl: 'https://www.booking.com/Share-vvUOPy',
            nearChristian: true,
            nearHindu: false,
            distanceChristian: '8 km',
            distanceHindu: '18 km',
            distanceReception: '45 km',
            distanceCoupleHome: '1 km',
            coordinates: { lat: 47.2269, lng: 8.8184 }
        },
        {
            id: 5,
            name: 'Hotel Neufeld',
            description: 'Hotel located in Zurich-Wiedikon with terrace restaurant and great breakfast buffet. About 10 minutes to the city center by tram.',
            address: 'Friesenbergstrasse 15, 8055 Zürich',
            priceRange: 'budget',
            priceIndicator: '$',
            stars: 3,
            amenities: ['wifi', 'parking', 'breakfast', 'restaurant', '24h reception'],
            imageUrl: 'https://lh3.googleusercontent.com/p/AF1QipM585VQl9_TloSBHFTFh_jEUkgJl_4ihm-xAaxD=w574-h384-n-k-rw-no-v1',
            bookingUrl: 'https://www.booking.com/Share-ws71BIx',
            nearChristian: false,
            nearHindu: false,
            distanceChristian: '40 km',
            distanceHindu: '45 km',
            distanceReception: '19 km',
            distanceCoupleHome: '32 km',
            coordinates: { lat: 47.3688, lng: 8.5075 }
        },
        {
            id: 6,
            name: 'ibis Zürich-Adliswil',
            description: 'Modern budget hotel with a grill restaurant and easy highway access, around 20 minutes from Schlieren by car.',
            address: 'Soodstrasse 55b, 8134 Adliswil',
            priceRange: 'budget',
            priceIndicator: '$',
            stars: 3,
            amenities: ['wifi', 'parking', 'breakfast', 'restaurant', '24h reception'],
            imageUrl: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/749303605.jpg?k=a19c01b59038f1959b3aa52162e01f1c83ea5aed69c2a94553c4ee37c76bf96c&o=',
            bookingUrl: 'https://www.booking.com/Share-eEf6EK',
            nearChristian: false,
            nearHindu: false,
            distanceChristian: '38 km',
            distanceHindu: '45 km',
            distanceReception: '16 km',
            distanceCoupleHome: '30 km',
            coordinates: { lat: 47.3113, lng: 8.5246 }
        },
        {
            id: 7,
            name: 'Hotel Kronenhof',
            description: 'Boutique-style hotel with a 60s retro charm, located north of central Zurich.',
            address: 'Wehntalerstrasse 551, 8046 Zürich',
            priceRange: 'budget',
            priceIndicator: '$',
            stars: 3,
            amenities: ['wifi', 'parking', 'breakfast', '24h reception'],
            imageUrl: 'https://lh3.googleusercontent.com/p/AF1QipMHaPnitlbaWpplv7ZVWMCnKUvvPi4rZ5Ln4j-9=w574-h384-n-k-rw-no-v1',
            bookingUrl: 'https://www.booking.com/Share-EbmvziI',
            nearChristian: false,
            nearHindu: false,
            distanceChristian: '42 km',
            distanceHindu: '48 km',
            distanceReception: '22 km',
            distanceCoupleHome: '33 km',
            coordinates: { lat: 47.4244, lng: 8.4979 }
        },
        {
            id: 8,
            name: 'Hotel Olympia',
            description: 'Simple budget hotel about 3 km from Zurich main station, offering city views and 24h reception.',
            address: 'Badenerstrasse 324, 8004 Zürich',
            priceRange: 'budget',
            priceIndicator: '$',
            stars: 2,
            amenities: ['wifi', '24h reception'],
            imageUrl: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/124788465.jpg?k=5091b29b4a819b736daa01766f21eae3ac1049d738d89c4e58f914fd24dc272b&o=',
            bookingUrl: 'https://www.booking.com/Share-OxD4mgh',
            nearChristian: false,
            nearHindu: false,
            distanceChristian: '40 km',
            distanceHindu: '45 km',
            distanceReception: '20 km',
            distanceCoupleHome: '32 km',
            coordinates: { lat: 47.3787, lng: 8.5123 }
        },

        // Mid-range Category (Mittel)
        {
            id: 9,
            name: 'Hotel Restaurant Schiff',
            description: 'Located on Lake Zurich with 30 uniquely styled rooms and a renowned fish restaurant.',
            address: 'Seedammstrasse 23, 8808 Pfäffikon',
            priceRange: 'mid',
            priceIndicator: '$$',
            stars: 3,
            amenities: ['wifi', 'parking', 'breakfast', 'restaurant', 'bar', '24h reception'],
            imageUrl: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/421995679.jpg?k=182fd843ee2a957603027ff02349c2a0febe45bdaa44fd823d3d130be06f15e2&o=',
            bookingUrl: 'https://www.booking.com/Share-VjXudi',
            nearChristian: true,
            nearHindu: true,
            distanceChristian: '4 km',    // Pfäffikon → Altendorf ~4 km
            distanceHindu: '10 km',       // Pfäffikon ↔ Seegräben ~10 km
            distanceReception: '32 km',   // Pfäffikon ↔ Schlieren ~30–35 km
            distanceCoupleHome: '4 km',   // Pfäffikon ↔ Rapperswil ~4 km
            coordinates: { lat: 47.2011, lng: 8.7797 }
        },
        {
            id: 10,
            name: 'Sorell Hotel Speer',
            description: 'In the historic center of Rapperswil, about 5 minutes from Altendorf. Wellness area with sauna and spa.',
            address: 'Untere Bahnhofstrasse 5, 8640 Rapperswil',
            priceRange: 'mid',
            priceIndicator: '$$',
            stars: 4,
            amenities: ['wifi', 'parking', 'breakfast', 'restaurant', 'sauna', '24h reception'],
            imageUrl: 'https://www.sorellhotels.com/sites/default/files/styles/hero_3xl/public/2025-04/sorell-hotel-speer-junior-suite-bett.jpg.webp?h=532400a7&itok=BLvcq-LZ',
            bookingUrl: 'https://www.booking.com/Share-vJZpn9a',
            nearChristian: true,
            nearHindu: false,
            distanceChristian: '8 km',    // Rapperswil → Altendorf ~8 km
            distanceHindu: '18 km',       // Rapperswil → Seegräben ~17–18 km
            distanceReception: '45 km',   // Rapperswil ↔ Schlieren ~45 km
            distanceCoupleHome: '0.5 km', // centrally in Rapperswil
            coordinates: { lat: 47.2269, lng: 8.8184 }
        },
        {
            id: 12,
            name: 'Moxy Rapperswil',
            description: 'Modern lifestyle hotel with 24/7 bar and fitness area, stylish and central location.',
            address: 'Neue Jonastrasse 66, 8640 Rapperswil',
            priceRange: 'mid',
            priceIndicator: '$$',
            stars: 3,
            amenities: ['wifi', 'parking', 'breakfast', 'bar', 'fitness', '24h reception'],
            imageUrl: 'https://de.dayuse.ch/_next/image?url=https%3A%2F%2Fstatic.dayuse.com%2Fhotels%2F15952%2Ff48b0c55678e1c6fb370a5cece7d2265-moxy-rapperswil.jpg&w=3840&q=75',
            bookingUrl: 'https://www.booking.com/Share-4WsQLrX',
            nearChristian: true,
            nearHindu: false,
            distanceChristian: '8 km',
            distanceHindu: '18 km',
            distanceReception: '45 km',
            distanceCoupleHome: '0.5 km',
            coordinates: { lat: 47.2269, lng: 8.8184 }
        },
        {
            id: 13,
            name: 'Hotel Marina Lachen',
            description: 'Directly on Lake Zurich with two restaurants and a bar lounge. Elegant rooms and beautiful lake views.',
            address: 'Seedammstrasse 1, 8853 Lachen',
            priceRange: 'mid',
            priceIndicator: '$$',
            stars: 4,
            amenities: ['wifi', 'parking', 'breakfast', 'restaurant', 'bar', 'ac', '24h reception'],
            imageUrl: 'https://www.marinalachen.ch/assets/Images/SliderHead/Hotel_MarinaLachen_SunsetJuniorSuite3__FocusFillWzM3NSwyMjAsInkiLDE1XQ.jpg',
            bookingUrl: 'https://www.booking.com/Share-UvCkVB',
            nearChristian: true,
            nearHindu: false,
            distanceChristian: '12 km',   // Rapperswil → Lachen approx 12 km
            distanceHindu: '22 km',       // Lachen → Seegräben approx
            distanceReception: '45 km',
            distanceCoupleHome: '8 km',
            coordinates: { lat: 47.1947, lng: 8.8530 }
        },
        {
            id: 14,
            name: 'Hotel & Restaurant Jakob',
            description: 'In the car-free old town of Rapperswil, just a short walk from the train station and lake promenade.',
            address: 'Knie-Platz 1, 8640 Rapperswil',
            priceRange: 'mid',
            priceIndicator: '$$',
            stars: 3,
            amenities: ['wifi', 'breakfast', 'restaurant', '24h reception'],
            imageUrl: 'https://lh3.googleusercontent.com/gps-cs-s/AHVAwerIZIdz9z4C2hsMk7Aat-T-yINe21hv49HVcdYw8PeFACmzFXuOWEmf3LCM4T6SvgtnH8n3Tv1sZAIOsM4S4-ICJDFwVi8GxixjGM-wA8ukaSY_DWHwqvKTE5OUquUMrecEc2T3=w253-h142-k-no',
            bookingUrl: 'https://tbooking.toubiz.de/TDS00020013213409509/tbooking/?globalReset=1&lang=de',
            nearChristian: true,
            nearHindu: false,
            distanceChristian: '8 km',
            distanceHindu: '18 km',
            distanceReception: '45 km',
            distanceCoupleHome: '0.5 km',
            coordinates: { lat: 47.2269, lng: 8.8184 }
        },
        {
            id: 15,
            name: 'Hotel Drei Könige',
            description: 'Traditional hotel located near Einsiedeln Monastery, offering Swiss hospitality.',
            address: 'Hauptstrasse 64, 8840 Einsiedeln',
            priceRange: 'mid',
            priceIndicator: '$$',
            stars: 3,
            amenities: ['wifi', 'parking', 'breakfast', 'restaurant', '24h reception'],
            imageUrl: 'https://lh3.googleusercontent.com/p/AF1QipOhJQWXFPocbf-G_hfD-JJA4Wkbbgbp0Kbvrg4x=w574-h384-n-k-rw-no-v1',
            bookingUrl: 'https://www.booking.com/Share-8X4Nr8',
            nearChristian: false,
            nearHindu: false,
            distanceChristian: '25 km',   // Einsiedeln → Altendorf approx
            distanceHindu: '35 km',       // Einsiedeln → Seegräben approx
            distanceReception: '55 km',
            distanceCoupleHome: '22 km',
            coordinates: { lat: 47.1281, lng: 8.7466 }
        },
        {
            id: 16,
            name: 'Hotel Seedamm Plaza',
            description: '4-star hotel on Lake Zurich with multiple restaurants, fitness center, sauna, bar and excellent views.',
            address: 'Seedammstrasse 3, 8808 Pfäffikon',
            priceRange: 'mid',
            priceIndicator: '$$',
            stars: 4,
            amenities: ['wifi', 'parking', 'breakfast', 'restaurant', 'bar', 'fitness', 'sauna', 'ac', '24h reception'],
            imageUrl: 'https://lh3.googleusercontent.com/p/AF1QipOn8yvmoN_vh5w8BGQ2Z-VE25yLYA_ssHTFdWW6=w253-h189-k-no',
            bookingUrl: 'https://www.booking.com/Share-ZPd0NS',
            nearChristian: true,
            nearHindu: true,
            distanceChristian: '4 km',
            distanceHindu: '10 km',
            distanceReception: '32 km',
            distanceCoupleHome: '4 km',
            coordinates: { lat: 47.2011, lng: 8.7797 }
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
            return <span className="text-gray-600 text-sm italic">{t('accommodations.hotelCard.varies')}</span>;
        }

        const amenityIcons = {
            wifi: { icon: mdiWifi, label: 'Wi-Fi' },
            parking: { icon: mdiParking, label: 'Parking' },
            breakfast: { icon: mdiFridge, label: 'Breakfast' },
            restaurant: { icon: mdiFoodForkDrink, label: 'Restaurant' },
            bar: { icon: mdiFoodForkDrink, label: 'Bar' },
            spa: { icon: mdiSpa, label: 'Spa' },
            sauna: { icon: mdiSpa, label: 'Sauna' },
            fitness: { icon: mdiWeightLifter, label: 'Fitness' },
            ac: { icon: mdiSnowflake, label: 'AC' },
            '24h': { icon: mdiClockOutline, label: '24h Reception' },
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
        <section className="pt-24 pb-20 bg-gradient-to-br from-white via-white to-christian-accent/5 overflow-hidden">
            <div className="container mx-auto max-w-6xl px-4">
                <AnimatedSection className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-6">{t('accommodations.title')}</h1>
                    <p className="text-gray-700 max-w-2xl mx-auto">
                    {t('accommodations.description')}
                    </p>
                </AnimatedSection>

                <AnimatedSection className="mb-12">
                    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-bold mb-4 text-center">{t('accommodations.travelInfo.title')}</h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            <div>
                                <h3 className="text-xl font-semibold mb-2 text-christian-accent">{t('accommodations.travelInfo.christianVenue')}</h3>
                                <p className="mb-2"><strong>{t('accommodations.travelInfo.venue')}:</strong> {t('christian.location.address1')}</p>
                                <p className="mb-2"><strong>{t('accommodations.travelInfo.address')}:</strong> {t('christian.location.address2')}</p>
                                <p className="mb-1"><strong>{t('accommodations.travelInfo.nearestAirport')}:</strong> Zürich Airport (ZRH)</p>
                                <p className="text-sm text-gray-600 mb-3">{t('accommodations.travelInfo.distance', { distance: '50', time: '40 min' })}</p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold mb-2 text-hindu-secondary">{t('accommodations.travelInfo.hinduVenue')}</h3>
                                <p className="mb-2"><strong>{t('accommodations.travelInfo.venue')}:</strong> {t('hindu.location.address1')}</p>
                                <p className="mb-2"><strong>{t('accommodations.travelInfo.address')}:</strong> {t('hindu.location.address2')}</p>
                                <p className="mb-1"><strong>{t('accommodations.travelInfo.nearestAirport')}:</strong> Zürich Airport (ZRH)</p>
                                <p className="text-sm text-gray-600 mb-3">{t('accommodations.travelInfo.distance', { distance: '30', time: '25 min' })}</p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold mb-2 text-purple-700">{t('accommodations.travelInfo.receptionVenue')}</h3>
                                <p className="mb-2"><strong>{t('accommodations.travelInfo.venue')}:</strong> {t('reception.location.address1')}</p>
                                <p className="mb-2"><strong>{t('accommodations.travelInfo.address')}:</strong> {t('reception.location.address2')}</p>
                                <p className="mb-1"><strong>{t('accommodations.travelInfo.nearestAirport')}:</strong> Zürich Airport (ZRH)</p>
                                <p className="text-sm text-gray-600 mb-3">{t('accommodations.travelInfo.distance', { distance: '15', time: '15 min' })}</p>
                            </div>
                        </div>

                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                            <h3 className="text-lg font-semibold mb-2">{t('accommodations.transportationTips.title')}</h3>
                            <ul className="list-disc list-inside text-gray-700 space-y-1">
                                <li>{t('accommodations.transportationTips.tips.0')}</li>
                                <li>{t('accommodations.transportationTips.tips.1')}</li>
                                <li>{t('accommodations.transportationTips.tips.2')}</li>
                                <li>{t('accommodations.transportationTips.tips.3')}</li>
                            </ul>
                        </div>
                    </div>
                </AnimatedSection>

                <AnimatedSection className="mb-8">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-2xl font-bold mb-6 text-center">{t('accommodations.filter.title')}</h2>

                        <div className="flex flex-col md:flex-row justify-center gap-4 mb-8">
                            <div className="flex flex-col">
                                <label className="mb-2 font-medium">{t('accommodations.filter.venueProximity')}</label>
                                <div className="inline-flex rounded-md shadow-sm">
                                    <button
                                        onClick={() => setVenueFilter('all')}
                                        className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                                            venueFilter === 'all'
                                                ? 'bg-gray-800 text-white'
                                                : 'bg-white text-gray-700 hover:bg-gray-50'
                                        }`}
                                    >
                                        {t('accommodations.filter.allLocations')}
                                    </button>
                                    <button
                                        onClick={() => setVenueFilter('christian')}
                                        className={`px-4 py-2 text-sm font-medium ${
                                            venueFilter === 'christian'
                                                ? 'bg-christian-accent text-white'
                                                : 'bg-white text-gray-700 hover:bg-gray-50'
                                        }`}
                                    >
                                        {t('accommodations.filter.nearChristian')}
                                    </button>
                                    <button
                                        onClick={() => setVenueFilter('hindu')}
                                        className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                                            venueFilter === 'hindu'
                                                ? 'bg-hindu-secondary text-white'
                                                : 'bg-white text-gray-700 hover:bg-gray-50'
                                        }`}
                                    >
                                        {t('accommodations.filter.nearHindu')}
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-col mt-4 md:mt-0">
                                <label className="mb-2 font-medium">{t('accommodations.filter.priceRange')}</label>
                                <div className="inline-flex rounded-md shadow-sm">
                                    <button
                                        onClick={() => setPriceFilter('all')}
                                        className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                                            priceFilter === 'all'
                                                ? 'bg-gray-800 text-white'
                                                : 'bg-white text-gray-700 hover:bg-gray-50'
                                        }`}
                                    >
                                        {t('accommodations.filter.allPrices')}
                                    </button>
                                    <button
                                        onClick={() => setPriceFilter('budget')}
                                        className={`px-4 py-2 text-sm font-medium ${
                                            priceFilter === 'budget'
                                                ? 'bg-gray-800 text-white'
                                                : 'bg-white text-gray-700 hover:bg-gray-50'
                                        }`}
                                    >
                                        {t('accommodations.filter.budget')}
                                    </button>
                                    <button
                                        onClick={() => setPriceFilter('mid')}
                                        className={`px-4 py-2 text-sm font-medium ${
                                            priceFilter === 'mid'
                                                ? 'bg-gray-800 text-white'
                                                : 'bg-white text-gray-700 hover:bg-gray-50'
                                        }`}
                                    >
                                        {t('accommodations.filter.midRange')}
                                    </button>
                                    <button
                                        onClick={() => setPriceFilter('luxury')}
                                        className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                                            priceFilter === 'luxury'
                                                ? 'bg-gray-800 text-white'
                                                : 'bg-white text-gray-700 hover:bg-gray-50'
                                        }`}
                                    >
                                        {t('accommodations.filter.luxury')}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {filteredAccommodations.length === 0 ? (
                            <div className="text-center text-gray-500 py-8">
                                <p>{t('accommodations.noResults')}</p>
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

                                            <div className="space-y-2 mb-4">
                                                <div className={`flex items-center ${accommodation.nearChristian ? 'text-christian-accent' : 'text-gray-500'}`}>
                                                    <Icon path={mdiBed} size={0.8} className="mr-2 flex-shrink-0" />
                                                    <div>
                                                        <p className="text-sm font-medium">{t('accommodations.hotelCard.christianVenue')}</p>
                                                        <p className="text-xs">{accommodation.distanceChristian}</p>
                                                    </div>
                                                </div>

                                                <div className={`flex items-center ${accommodation.nearHindu ? 'text-hindu-secondary' : 'text-gray-500'}`}>
                                                    <Icon path={mdiBed} size={0.8} className="mr-2 flex-shrink-0" />
                                                    <div>
                                                        <p className="text-sm font-medium">{t('accommodations.hotelCard.hinduVenue')}</p>
                                                        <p className="text-xs">{accommodation.distanceHindu}</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center text-purple-700">
                                                    <Icon path={mdiBed} size={0.8} className="mr-2 flex-shrink-0" />
                                                    <div>
                                                        <p className="text-sm font-medium">{t('accommodations.hotelCard.receptionVenue')}</p>
                                                        <p className="text-xs">{accommodation.distanceReception}</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center text-pink-700">
                                                    <Icon path={mdiMapMarker} size={0.8} className="mr-2 flex-shrink-0" />
                                                    <div>
                                                        <p className="text-sm font-medium">{t('accommodations.hotelCard.coupleHome')}</p>
                                                        <p className="text-xs">{accommodation.distanceCoupleHome}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mb-4">
                                                <p className="font-medium mb-1">{t('accommodations.hotelCard.amenities')}</p>
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
                                                    className="inline-block py-2 px-6 bg-christian-accent text-white rounded-full font-semibold hover:shadow-md transition-shadow"
                                                >
                                                    {t('accommodations.hotelCard.bookNow')}
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
                        <h2 className="text-xl font-bold mb-4">{t('accommodations.help.title')}</h2>
                        <p className="text-gray-700 mb-4">
                            {t('accommodations.help.description')}
                        </p>
                        <p className="text-gray-700 mb-4">
                            {t('accommodations.help.description2')}
                        </p>
                        <a
                            href="mailto:slyrajah@gmail.com"
                            className="inline-block py-2 px-6 bg-gray-800 text-white rounded-full font-semibold hover:bg-gray-700 transition-colors"
                        >
                            {t('accommodations.help.contactButton')}
                        </a>
                    </div>
                </AnimatedSection>
            </div>
        </section>
    );
};

export default Accommodations;
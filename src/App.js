import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import PasswordProtection from './components/common/PasswordProtection';
import LoadingSpinner from './components/common/LoadingSpinner'; // You'll need to create this component
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import './styles/global.css';

// Lazy load components to reduce initial bundle size
const HomePage = lazy(() => import('./components/home/HomePage'));
const ChristianCeremony = lazy(() => import('./components/ceremonies/ChristianCeremony'));
const HinduCeremony = lazy(() => import('./components/ceremonies/HinduCeremony'));
const OurStory = lazy(() => import('./components/story/OurStory'));
const GiftRegistry = lazy(() => import('./components/gifts/GiftRegistry'));
const PhotoGallery = lazy(() => import('./components/gallery/PhotoGallery'));
const RSVPPage = lazy(() => import('./components/rsvp/RSVPForm'));
const GuestbookPage = lazy(() => import('./components/guestbook/Guestbook'));
const AccommodationsPage = lazy(() => import('./components/accommodations/Accommodations')); // New import

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Check if user is already authenticated (e.g., from localStorage)
    useEffect(() => {
        const authStatus = localStorage.getItem('weddingAuth');
        if (authStatus === 'true') {
            setIsAuthenticated(true);
        }
    }, []);

    const handleAuthentication = (password) => {
        // In a real app, you'd verify against a secure source
        if (password === 'wedding2026') {
            setIsAuthenticated(true);
            localStorage.setItem('weddingAuth', 'true');
            return true;
        }
        return false;
    };

    // Loading fallback component with wedding-themed design
    const PageLoader = () => (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-christian-accent/10 to-hindu-secondary/10">
            <LoadingSpinner />
            <p className="mt-4 text-gray-600 animate-pulse">Loading our love story...</p>
        </div>
    );

    return (
        <AuthProvider value={{ isAuthenticated, setIsAuthenticated }}>
            <ThemeProvider>
                <Router>
                    {!isAuthenticated ? (
                        <PasswordProtection onAuthenticate={handleAuthentication} />
                    ) : (
                        <>
                            <Header />
                            <main>
                                <Suspense fallback={<PageLoader />}>
                                    <Routes>
                                        <Route path="/" element={<HomePage />} />
                                        <Route path="/christian-ceremony" element={<ChristianCeremony />} />
                                        <Route path="/hindu-ceremony" element={<HinduCeremony />} />
                                        <Route path="/our-story" element={<OurStory />} />
                                        <Route path="/gifts" element={<GiftRegistry />} />
                                        <Route path="/gallery" element={<PhotoGallery />} />
                                        <Route path="/rsvp" element={<RSVPPage />} />
                                        <Route path="/guestbook" element={<GuestbookPage />} />
                                        <Route path="/accommodations" element={<AccommodationsPage />} /> {/* New route */}
                                        <Route path="*" element={<Navigate to="/" replace />} />
                                    </Routes>
                                </Suspense>
                            </main>
                            <Footer />
                        </>
                    )}
                </Router>
            </ThemeProvider>
        </AuthProvider>
    );
}

export default App;
// src/App.js
import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import PasswordProtection from './components/common/PasswordProtection';
import LoadingSpinner from './components/common/LoadingSpinner';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import './styles/global.css';
import emailjs from '@emailjs/browser';
import { guestList } from './data/guestAccess'; // Import the guest list

// Lazy load components to reduce initial bundle size
const HomePage = lazy(() => import('./components/home/HomePage'));
const ChristianCeremony = lazy(() => import('./components/ceremonies/ChristianCeremony'));
const HinduCeremony = lazy(() => import('./components/ceremonies/HinduCeremony'));
const OurStory = lazy(() => import('./components/story/OurStory'));
const GiftRegistry = lazy(() => import('./components/gifts/GiftRegistry'));
const PhotoGallery = lazy(() => import('./components/gallery/PhotoGallery'));
const RSVPPage = lazy(() => import('./components/rsvp/RSVPPage'));
const GuestbookPage = lazy(() => import('./components/guestbook/Guestbook'));
const AccommodationsPage = lazy(() => import('./components/accommodations/Accommodations'));

// Admin components
const AdminLogin = lazy(() => import('./components/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./components/admin/AdminDashboard'));
const AdminRoute = lazy(() => import('./components/admin/AdminRoute'));

// Conditional Footer component that only shows on non-homepage routes
const ConditionalFooter = () => {
    const location = useLocation();
    // Don't show footer on homepage
    if (location.pathname === '/') {
        return null;
    }
    return <Footer />;
};

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Check if user is already authenticated and process invitation codes
    useEffect(() => {
        // Check for authentication status
        const authStatus = localStorage.getItem('weddingAuth');

        // Process invitation code from URL, if present
        const url = new URL(window.location.href);
        const code = url.searchParams.get('code');

        if (code) {
            // Normalize and validate the code
            const formattedCode = code.trim().toUpperCase();

            if (guestList[formattedCode]) {
                // Valid code found in URL, save it
                localStorage.setItem('invitationCode', formattedCode);
                console.log(`Access granted for: ${guestList[formattedCode].name}, ceremonies: ${guestList[formattedCode].ceremonies.join(', ')}`);

                // Clean URL (remove query parameters)
                window.history.replaceState({}, document.title, window.location.pathname);
            }
        }

        // Set authentication state
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
                                        <Route path="/accommodations" element={<AccommodationsPage />} />

                                        {/* Admin routes */}
                                        <Route path="/admin" element={<AdminLogin />} />
                                        <Route
                                            path="/admin/dashboard"
                                            element={
                                                <AdminRoute>
                                                    <AdminDashboard />
                                                </AdminRoute>
                                            }
                                        />

                                        <Route path="*" element={<Navigate to="/" replace />} />
                                    </Routes>
                                </Suspense>
                            </main>
                            {/* Use the conditional footer instead of always showing it */}
                            <ConditionalFooter />
                        </>
                    )}
                </Router>
            </ThemeProvider>
        </AuthProvider>
    );
}

export default App;
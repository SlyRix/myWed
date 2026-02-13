// src/App.js (updated for API integration)
import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import LoadingSpinner from './components/common/LoadingSpinner';
import ErrorBoundary from './components/common/ErrorBoundary';
import CodeGate from './components/common/CodeGate';
import { ThemeProvider } from './contexts/ThemeContext';
import { GuestProvider, useGuest } from './contexts/GuestContext';
import WelcomeSplash from './components/welcome/WelcomeSplash';
import './styles/global.css';
import { validateAccessCode } from './api/guestApi';

// Lazy load components to reduce initial bundle size
const HomePage = lazy(() => import('./components/home/HomePage'));
const ChristianCeremony = lazy(() => import('./components/ceremonies/ChristianCeremony'));
const HinduCeremony = lazy(() => import('./components/ceremonies/HinduCeremony'));
const Reception = lazy(() => import('./components/ceremonies/Reception'));
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

// Loading fallback component with wedding-themed design
const PageLoader = () => (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <LoadingSpinner />
        <p className="mt-4 text-gray-600 animate-pulse">Loading our love story...</p>
    </div>
);

// Inner app content that uses GuestContext and Router
const AppContent = ({ showSplash, onSplashComplete }) => {
    const location = useLocation();
    const { isLoading, isValidated } = useGuest();
    const isAdminRoute = location.pathname.startsWith('/admin');

    // Show splash screen first
    if (showSplash) {
        return <WelcomeSplash onComplete={onSplashComplete} />;
    }

    // Show loading while GuestContext validates
    if (isLoading) {
        return <PageLoader />;
    }

    // Admin routes are always accessible (no gate)
    if (isAdminRoute) {
        return (
            <Suspense fallback={<PageLoader />}>
                <Routes>
                    <Route path="/admin" element={<AdminLogin />} />
                    <Route
                        path="/admin/dashboard"
                        element={
                            <AdminRoute>
                                <AdminDashboard />
                            </AdminRoute>
                        }
                    />
                    <Route path="*" element={<Navigate to="/admin" replace />} />
                </Routes>
            </Suspense>
        );
    }

    // Not validated → show CodeGate
    if (!isValidated) {
        return <CodeGate />;
    }

    // Validated → show full app
    return (
        <>
            <Header />
            <main>
                <Suspense fallback={<PageLoader />}>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/christian-ceremony" element={<ChristianCeremony />} />
                        <Route path="/hindu-ceremony" element={<HinduCeremony />} />
                        <Route path="/reception" element={<Reception />} />
                        <Route path="/our-story" element={<OurStory />} />
                        <Route path="/gifts" element={<GiftRegistry />} />
                        <Route path="/gallery" element={<PhotoGallery />} />
                        <Route path="/rsvp" element={<RSVPPage />} />
                        <Route path="/guestbook" element={<GuestbookPage />} />
                        <Route path="/accommodations" element={<AccommodationsPage />} />

                        {/* Admin routes (also accessible when validated) */}
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
            <ConditionalFooter />
        </>
    );
};

function App() {
    const [showSplash, setShowSplash] = useState(true);
    const [isCheckingCode, setIsCheckingCode] = useState(false);

    // Check if user has seen the splash screen before and process any invitation code
    useEffect(() => {
        const hasSeenSplash = localStorage.getItem('hasSeenSplash');
        if (hasSeenSplash) {
            setShowSplash(false);
        }

        // Process invitation code from URL, if present
        const processCode = async () => {
            const url = new URL(window.location.href);
            const code = url.searchParams.get('code');

            if (code) {
                setIsCheckingCode(true);
                try {
                    // Validate the code against our API
                    const validation = await validateAccessCode(code);

                    if (validation.valid) {
                        // Valid code found in URL, save it
                        localStorage.setItem('invitationCode', code.trim().toUpperCase());
                        // Token validated and stored successfully
                    }
                } catch (error) {
                    if (process.env.NODE_ENV === 'development') {
                        console.error('Error validating invitation code:', error);
                    }
                } finally {
                    // Clean URL (remove query parameters)
                    window.history.replaceState({}, document.title, window.location.pathname);
                    setIsCheckingCode(false);
                }
            }
        };

        processCode();
    }, []);

    // Handle completion of splash screen
    const handleSplashComplete = () => {
        setShowSplash(false);
        localStorage.setItem('hasSeenSplash', 'true');
    };

    // If checking invitation code, show a loading indicator
    if (isCheckingCode) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-christian-accent mx-auto mb-4" aria-hidden="true"></div>
                    <span className="sr-only">Loading</span>
                    <p className="text-gray-700">Validating your invitation code...</p>
                </div>
            </div>
        );
    }

    return (
        <ErrorBoundary>
            <ThemeProvider>
                <GuestProvider>
                    <Router>
                        <AppContent
                            showSplash={showSplash}
                            onSplashComplete={handleSplashComplete}
                        />
                    </Router>
                </GuestProvider>
            </ThemeProvider>
        </ErrorBoundary>
    );
}

export default App;

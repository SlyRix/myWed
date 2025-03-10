import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import PasswordProtection from './components/common/PasswordProtection';
import HomePage from './components/home/HomePage';
import ChristianCeremony from './components/ceremonies/ChristianCeremony';
import HinduCeremony from './components/ceremonies/HinduCeremony';
import OurStory from './components/story/OurStory';
import GiftRegistry from './components/gifts/GiftRegistry';
import PhotoGallery from './components/gallery/PhotoGallery';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import './styles/global.css';

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
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/christian-ceremony" element={<ChristianCeremony />} />
                      <Route path="/hindu-ceremony" element={<HinduCeremony />} />
                      <Route path="/our-story" element={<OurStory />} />
                      <Route path="/gifts" element={<GiftRegistry />} />
                      <Route path="/gallery" element={<PhotoGallery />} />
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
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

import { useState, useEffect } from 'react';
import GalleryView from './components/GalleryView';
import UploadView from './components/UploadView';
import AdminPanel from './components/AdminPanel';
import InstallPrompt from './components/InstallPrompt';

function NoAccess({ onUnlock }) {
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);

  const tryCode = e => {
    e.preventDefault();
    const code = input.trim().toUpperCase();
    if (code === 'RUSHIVANI2025') {
      localStorage.setItem('galleryCode', code);
      onUnlock(code);
    } else {
      setError(true);
      setTimeout(() => setError(false), 1500);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-6 text-center">
      <div className="text-7xl mb-5">📷</div>
      <h1 className="font-display text-4xl text-brown mb-1">Wedding Gallery</h1>
      <p className="font-body text-brown/50 mb-8 text-sm">Rushel & Sivani · 2025</p>

      <form onSubmit={tryCode} className="w-full max-w-xs space-y-3">
        <input
          type="text"
          value={input}
          onChange={e => { setInput(e.target.value); setError(false); }}
          placeholder="Enter gallery code"
          autoCapitalize="characters"
          className={`w-full text-center tracking-widest text-lg border-2 rounded-2xl px-4 py-3 font-body bg-white focus:outline-none transition-colors ${
            error ? 'border-red-400 animate-shake' : 'border-gold/30 focus:border-gold'
          }`}
        />
        {error && <p className="text-red-400 text-sm font-body">Wrong code — try again</p>}
        <button
          type="submit"
          className="w-full bg-gold text-white font-body font-medium py-3 rounded-2xl"
        >
          Open Gallery
        </button>
        <p className="text-brown/30 text-xs font-body pt-2">
          Code is on your invitation or the QR card at the venue
        </p>
      </form>
    </div>
  );
}

const TABS = [
  { id: 'gallery', label: 'Gallery', icon: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  )},
  { id: 'upload', label: 'Upload', icon: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )},
  { id: 'admin', label: 'Admin', icon: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  )},
];

export default function App() {
  const [galleryCode, setGalleryCode] = useState(null);
  const [tab, setTab] = useState('gallery');
  const [newPhoto, setNewPhoto] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlCode = params.get('gallery');
    const stored = localStorage.getItem('galleryCode');
    const code = urlCode || stored;
    if (code) {
      localStorage.setItem('galleryCode', code);
      setGalleryCode(code);
      // Clean code from URL without reload
      if (urlCode) {
        const url = new URL(window.location.href);
        url.searchParams.delete('gallery');
        window.history.replaceState({}, '', url);
      }
    }
  }, []);

  if (!galleryCode) return <NoAccess onUnlock={setGalleryCode} />;

  const handleUploaded = photo => {
    setNewPhoto(photo);
    setTab('gallery');
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Header */}
      <header className="bg-cream/95 backdrop-blur-sm border-b border-gold/10 px-4 py-3 flex-shrink-0">
        <h1 className="font-display text-xl text-brown text-center tracking-wide">Rushel & Sivani</h1>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto">
        {tab === 'gallery' && <GalleryView newPhoto={newPhoto} />}
        {tab === 'upload' && <UploadView onUploaded={handleUploaded} />}
        {tab === 'admin' && <AdminPanel />}
      </main>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-sm border-t border-gold/10 flex safe-bottom z-30">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 flex flex-col items-center gap-1 py-2.5 transition-colors ${
              tab === t.id ? 'text-gold' : 'text-brown/40 hover:text-brown/70'
            }`}
            aria-label={t.label}
          >
            {t.icon}
            <span className="font-body text-xs">{t.label}</span>
          </button>
        ))}
      </nav>

      <InstallPrompt />
    </div>
  );
}

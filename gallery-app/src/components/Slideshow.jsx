import { useState, useEffect, useCallback } from 'react';

export default function Slideshow({ photos, onClose }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => setIndex(i => (i + 1) % photos.length), [photos.length]);

  useEffect(() => {
    if (paused) return;
    const t = setTimeout(next, 4000);
    return () => clearTimeout(t);
  }, [index, paused, next]);

  useEffect(() => {
    document.documentElement.requestFullscreen?.().catch(() => {});
    return () => { if (document.fullscreenElement) document.exitFullscreen?.(); };
  }, []);

  const photo = photos[index];
  if (!photo) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black flex items-center justify-center"
      onClick={() => setPaused(p => !p)}
    >
      {photo.media_type === 'video' ? (
        <video key={photo.id} src={photo.url} className="max-h-full max-w-full object-contain" autoPlay muted loop playsInline />
      ) : (
        <img key={photo.id} src={photo.url} alt="" className="max-h-full max-w-full object-contain animate-fade" draggable={false} />
      )}

      {/* Overlay info */}
      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-8 pointer-events-none">
        <p className="text-white font-display text-2xl">{photo.uploader_name}</p>
        {photo.caption && <p className="text-white/70 font-body mt-1">{photo.caption}</p>}
        <div className="flex items-center gap-2 mt-2">
          <span className="text-red-400">❤️</span>
          <span className="text-white/70 text-sm">{photo.likes}</span>
        </div>
      </div>

      {/* Progress bar */}
      {!paused && (
        <div className="absolute top-0 inset-x-0 h-1 bg-white/20">
          <div
            key={index}
            className="h-full bg-gold"
            style={{ animation: 'slideProgress 4s linear forwards' }}
          />
        </div>
      )}

      {/* Controls */}
      <div className="absolute top-4 right-4 flex gap-3" onClick={e => e.stopPropagation()}>
        <button
          onClick={() => setPaused(p => !p)}
          className="bg-white/10 hover:bg-white/20 text-white rounded-full p-3"
          aria-label={paused ? 'Resume' : 'Pause'}
        >
          {paused ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5.75 3a.75.75 0 00-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V3.75A.75.75 0 007.25 3h-1.5zM12.75 3a.75.75 0 00-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V3.75a.75.75 0 00-.75-.75h-1.5z" />
            </svg>
          )}
        </button>
        <button
          onClick={onClose}
          className="bg-white/10 hover:bg-white/20 text-white rounded-full p-3"
          aria-label="Close slideshow"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {paused && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-black/40 rounded-full p-6">
            <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
            </svg>
          </div>
        </div>
      )}

      <style>{`@keyframes slideProgress { from { width: 0% } to { width: 100% } } @keyframes fade { from { opacity: 0 } to { opacity: 1 } } .animate-fade { animation: fade 0.5s ease }`}</style>
    </div>
  );
}

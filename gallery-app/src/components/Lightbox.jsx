import { useEffect, useRef, useState } from 'react';

export default function Lightbox({ photos, startIndex, onClose, onSlideshow }) {
  const [index, setIndex] = useState(startIndex);
  const touchStartX = useRef(null);
  const photo = photos[index];

  useEffect(() => {
    const onKey = e => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setIndex(i => Math.min(i + 1, photos.length - 1));
      if (e.key === 'ArrowLeft') setIndex(i => Math.max(i - 1, 0));
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [onClose, photos.length]);

  const onTouchStart = e => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd = e => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (delta < -60) setIndex(i => Math.min(i + 1, photos.length - 1));
    if (delta > 60) setIndex(i => Math.max(i - 1, 0));
    touchStartX.current = null;
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black flex flex-col"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 flex-shrink-0">
        <div>
          <p className="text-white font-body text-sm">{photo.uploader_name}</p>
          {photo.caption && <p className="text-white/60 text-xs">{photo.caption}</p>}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-white/50 text-sm">{index + 1} / {photos.length}</span>
          {onSlideshow && (
            <button
              onClick={onSlideshow}
              className="text-white/70 hover:text-white p-2"
              aria-label="Start slideshow"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          )}
          <button onClick={onClose} className="text-white/70 hover:text-white p-2" aria-label="Close">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Media */}
      <div className="flex-1 flex items-center justify-center relative min-h-0 px-2">
        {index > 0 && (
          <button
            onClick={() => setIndex(i => i - 1)}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 rounded-full p-2"
            aria-label="Previous"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {photo.media_type === 'video' ? (
          <video
            key={photo.id}
            src={photo.url}
            className="max-h-full max-w-full rounded object-contain"
            controls
            autoPlay
            playsInline
          />
        ) : (
          <img
            key={photo.id}
            src={photo.url}
            alt={photo.caption || photo.uploader_name}
            className="max-h-full max-w-full object-contain select-none"
            draggable={false}
          />
        )}

        {index < photos.length - 1 && (
          <button
            onClick={() => setIndex(i => i + 1)}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 rounded-full p-2"
            aria-label="Next"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>

      {/* Tags */}
      {(photo.ai_tags?.length > 0 || photo.ceremony_tag) && (
        <div className="flex gap-2 px-4 py-3 flex-shrink-0 flex-wrap">
          {photo.ceremony_tag && (
            <span className="bg-gold/30 text-gold-light text-xs px-2 py-0.5 rounded-full capitalize">
              {photo.ceremony_tag}
            </span>
          )}
          {photo.ai_tags?.map(t => (
            <span key={t} className="bg-white/10 text-white/60 text-xs px-2 py-0.5 rounded-full">
              {t}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

import { useState, useEffect, useRef, useCallback } from 'react';
import Masonry from 'react-masonry-css';
import { fetchPhotos, fetchTags } from '../api';
import PhotoCard from './PhotoCard';
import Lightbox from './Lightbox';
import Slideshow from './Slideshow';

const BREAKPOINTS = { default: 3, 1024: 3, 768: 2, 480: 2 };
const CEREMONY_FILTERS = [
  { value: '', label: 'All' },
  { value: 'christian', label: '⛪ Christian' },
  { value: 'hindu', label: '🪔 Hindu' },
  { value: 'reception', label: '🥂 Reception' },
  { value: 'other', label: '📸 Other' },
];

export default function GalleryView({ newPhoto }) {
  const [photos, setPhotos] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [sort, setSort] = useState('likes');
  const [ceremony, setCeremony] = useState('');
  const [activeTag, setActiveTag] = useState('');
  const [aiTags, setAiTags] = useState([]);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [showSlideshow, setShowSlideshow] = useState(false);
  const loaderRef = useRef(null);
  const offset = useRef(0);
  const exhausted = useRef(false);

  const load = useCallback(async (reset = false) => {
    if (reset) { offset.current = 0; exhausted.current = false; }
    if (exhausted.current) return;

    reset ? setLoading(true) : setLoadingMore(true);
    try {
      const data = await fetchPhotos({ sort, ceremony, tag: activeTag, limit: 30, offset: offset.current });
      setTotal(data.total);
      setPhotos(prev => reset ? data.photos : [...prev, ...data.photos]);
      offset.current += data.photos.length;
      if (data.photos.length < 30) exhausted.current = true;
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [sort, ceremony, activeTag]);

  useEffect(() => { load(true); }, [load]);

  // Add newly uploaded photo to top
  useEffect(() => {
    if (newPhoto && newPhoto.is_public) {
      setPhotos(prev => [newPhoto, ...prev]);
      setTotal(t => t + 1);
    }
  }, [newPhoto]);

  // Fetch AI tags
  useEffect(() => {
    fetchTags().then(setAiTags).catch(() => {});
  }, []);

  // Infinite scroll
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !loadingMore && !loading) load(false);
    }, { threshold: 0.1 });
    if (loaderRef.current) obs.observe(loaderRef.current);
    return () => obs.disconnect();
  }, [load, loading, loadingMore]);

  const handleLikeUpdate = (id, newLikes) => {
    setPhotos(prev => {
      const updated = prev.map(p => p.id === id ? { ...p, likes: newLikes } : p);
      return sort === 'likes' ? [...updated].sort((a, b) => b.is_featured - a.is_featured || b.likes - a.likes || b.created_at - a.created_at) : updated;
    });
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="w-10 h-10 border-4 border-gold/30 border-t-gold rounded-full animate-spin" />
      <p className="font-body text-brown/50 text-sm">Loading gallery…</p>
    </div>
  );

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-cream/95 backdrop-blur-sm border-b border-gold/10 px-4 py-3 space-y-3">
        {/* Sort + slideshow */}
        <div className="flex items-center justify-between">
          <div className="flex bg-cream-dark rounded-xl overflow-hidden">
            {[['likes', '❤️ Top'], ['newest', '🕐 New']].map(([v, l]) => (
              <button
                key={v}
                onClick={() => setSort(v)}
                className={`px-4 py-1.5 text-sm font-body font-medium transition-colors ${sort === v ? 'bg-gold text-white' : 'text-brown/60 hover:text-brown'}`}
              >
                {l}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-brown/40 font-body text-xs">{total} photos</span>
            {photos.length > 0 && (
              <button
                onClick={() => setShowSlideshow(true)}
                className="bg-gold/10 hover:bg-gold/20 text-gold-dark rounded-xl px-3 py-1.5 text-sm font-body font-medium"
              >
                ▶ Slideshow
              </button>
            )}
          </div>
        </div>

        {/* Ceremony filter */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-0.5">
          {CEREMONY_FILTERS.map(f => (
            <button
              key={f.value}
              onClick={() => setCeremony(f.value)}
              className={`flex-shrink-0 px-3 py-1 rounded-full text-sm font-body transition-colors ${
                ceremony === f.value ? 'bg-gold text-white' : 'bg-white text-brown/60 border border-gold/20'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* AI tag filter */}
        {aiTags.length > 0 && (
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-0.5">
            <button
              onClick={() => setActiveTag('')}
              className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-body transition-colors ${!activeTag ? 'bg-brown text-white' : 'bg-white text-brown/50 border border-brown/10'}`}
            >
              All
            </button>
            {aiTags.map(({ tag, count }) => (
              <button
                key={tag}
                onClick={() => setActiveTag(t => t === tag ? '' : tag)}
                className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-body transition-colors capitalize ${
                  activeTag === tag ? 'bg-brown text-white' : 'bg-white text-brown/50 border border-brown/10'
                }`}
              >
                {tag} <span className="opacity-60">({count})</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {photos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <span className="text-6xl">📷</span>
          <p className="font-display text-2xl text-brown/40">No photos yet</p>
          <p className="font-body text-brown/30 text-sm">Be the first to share a moment!</p>
        </div>
      ) : (
        <div className="px-2 pt-4">
          <Masonry breakpointCols={BREAKPOINTS} className="flex gap-2" columnClassName="flex flex-col gap-2">
            {photos.map((photo, i) => (
              <PhotoCard
                key={photo.id}
                photo={photo}
                index={i}
                onClick={() => setLightboxIndex(i)}
                onLikeUpdate={handleLikeUpdate}
              />
            ))}
          </Masonry>

          <div ref={loaderRef} className="h-16 flex items-center justify-center">
            {loadingMore && <div className="w-6 h-6 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />}
            {exhausted.current && photos.length > 0 && (
              <p className="font-body text-brown/30 text-sm">All {total} photos loaded</p>
            )}
          </div>
        </div>
      )}

      {lightboxIndex !== null && (
        <Lightbox
          photos={photos}
          startIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onSlideshow={() => { setLightboxIndex(null); setShowSlideshow(true); }}
        />
      )}

      {showSlideshow && (
        <Slideshow photos={photos.filter(p => p.media_type === 'image')} onClose={() => setShowSlideshow(false)} />
      )}
    </div>
  );
}

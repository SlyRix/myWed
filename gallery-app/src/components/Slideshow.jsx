import { useState, useEffect, useCallback, useRef } from 'react';
import { likePhoto, fetchComments, postComment } from '../api';
import { useDeviceId } from '../hooks/useDeviceId';

const TIMER_MS = 6000;

export default function Slideshow({ photos, onClose }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [liked, setLiked] = useState({});
  const [likeCounts, setLikeCounts] = useState({});
  const [heartAnim, setHeartAnim] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentCount, setCommentCount] = useState({});
  const [commentText, setCommentText] = useState('');
  const [authorName, setAuthorName] = useState(() => localStorage.getItem('uploaderName') || '');
  const [submitting, setSubmitting] = useState(false);
  const deviceId = useDeviceId();
  const touchStartY = useRef(0);
  const touchStartX = useRef(0);
  const lastTap = useRef(0);
  const tapTimeout = useRef(null);

  const photo = photos[index];

  const next = useCallback(() => {
    setIndex(i => (i + 1) % photos.length);
    setShowComments(false);
  }, [photos.length]);

  const prev = useCallback(() => {
    setIndex(i => (i - 1 + photos.length) % photos.length);
    setShowComments(false);
  }, [photos.length]);

  // Auto-advance
  useEffect(() => {
    if (paused || showComments) return;
    const t = setTimeout(next, TIMER_MS);
    return () => clearTimeout(t);
  }, [index, paused, showComments, next]);

  // Fullscreen
  useEffect(() => {
    document.documentElement.requestFullscreen?.().catch(() => {});
    return () => { if (document.fullscreenElement) document.exitFullscreen?.(); };
  }, []);

  // Init like counts
  useEffect(() => {
    setLikeCounts(prev => {
      const updated = { ...prev };
      photos.forEach(p => { if (!(p.id in updated)) updated[p.id] = p.likes; });
      return updated;
    });
  }, [photos]);

  // Load comments when sheet opens
  useEffect(() => {
    if (showComments && photo) {
      fetchComments(photo.id).then(data => {
        setComments(data);
        setCommentCount(prev => ({ ...prev, [photo.id]: data.length }));
      }).catch(() => {});
    }
  }, [showComments, photo]);

  const triggerHeart = () => {
    setHeartAnim(false);
    requestAnimationFrame(() => setHeartAnim(true));
    setTimeout(() => setHeartAnim(false), 900);
  };

  const handleLike = useCallback(async () => {
    if (!photo) return;
    const willLike = !liked[photo.id];
    setLiked(prev => ({ ...prev, [photo.id]: willLike }));
    setLikeCounts(prev => ({ ...prev, [photo.id]: (prev[photo.id] ?? photo.likes) + (willLike ? 1 : -1) }));
    try {
      const result = await likePhoto(photo.id, deviceId);
      setLikeCounts(prev => ({ ...prev, [photo.id]: result.likes }));
      setLiked(prev => ({ ...prev, [photo.id]: result.liked }));
    } catch {}
  }, [photo, liked, deviceId]);

  const handleTap = e => {
    if (e.target.closest('[data-no-tap]')) return;
    const now = Date.now();
    if (now - lastTap.current < 280) {
      clearTimeout(tapTimeout.current);
      triggerHeart();
      if (!liked[photo?.id]) handleLike();
    } else {
      tapTimeout.current = setTimeout(() => setPaused(p => !p), 280);
    }
    lastTap.current = now;
  };

  const onTouchStart = e => {
    touchStartY.current = e.touches[0].clientY;
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = e => {
    if (showComments) return;
    const dy = touchStartY.current - e.changedTouches[0].clientY;
    const dx = Math.abs(touchStartX.current - e.changedTouches[0].clientX);
    if (Math.abs(dy) > 55 && Math.abs(dy) > dx * 1.5) {
      dy > 0 ? next() : prev();
    }
  };

  const handleSubmitComment = async e => {
    e.preventDefault();
    if (!commentText.trim() || !authorName.trim()) return;
    setSubmitting(true);
    localStorage.setItem('uploaderName', authorName.trim());
    try {
      const comment = await postComment(photo.id, { device_id: deviceId, author_name: authorName.trim(), text: commentText.trim() });
      setComments(prev => [comment, ...prev]);
      setCommentCount(prev => ({ ...prev, [photo.id]: (prev[photo.id] ?? 0) + 1 }));
      setCommentText('');
    } catch {} finally {
      setSubmitting(false);
    }
  };

  if (!photo) return null;

  const currentLikes = likeCounts[photo.id] ?? photo.likes;
  const isLiked = !!liked[photo.id];
  const currentCommentCount = commentCount[photo.id] ?? 0;
  const nameStored = !!localStorage.getItem('uploaderName');

  return (
    <div
      className="fixed inset-0 z-50 bg-black select-none overflow-hidden"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onClick={handleTap}
    >
      {/* Media — full cover like TikTok */}
      <div className="absolute inset-0">
        {photo.media_type === 'video' ? (
          <video
            key={photo.id}
            src={photo.url}
            className="w-full h-full object-cover"
            autoPlay muted loop playsInline
          />
        ) : (
          <img
            key={photo.id}
            src={photo.url}
            alt=""
            className="w-full h-full object-cover"
            style={{ animation: 'tikFade 0.35s ease' }}
            draggable={false}
          />
        )}
      </div>

      {/* Gradients */}
      <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/70 to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-black/85 to-transparent pointer-events-none" />

      {/* Progress bar */}
      <div className="absolute top-0 inset-x-0 h-0.5 bg-white/20 z-10 pointer-events-none">
        {!paused && !showComments && (
          <div
            key={`prog-${index}`}
            className="h-full bg-white/80"
            style={{ animation: `tikProgress ${TIMER_MS}ms linear forwards` }}
          />
        )}
      </div>

      {/* Top bar */}
      <div className="absolute top-0 inset-x-0 px-4 pt-5 pb-2 flex items-center justify-between z-20" data-no-tap>
        <div className="flex items-center gap-1.5">
          {photos.map((_, i) => (
            <div
              key={i}
              onClick={e => { e.stopPropagation(); setIndex(i); setShowComments(false); }}
              className={`rounded-full cursor-pointer transition-all duration-200 ${
                i === index ? 'w-5 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/35 hover:bg-white/60'
              }`}
            />
          ))}
          <span className="text-white/50 text-xs font-body ml-1">{index + 1}/{photos.length}</span>
        </div>
        <button
          onClick={onClose}
          className="bg-black/30 backdrop-blur-sm text-white rounded-full p-2"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Bottom-left info */}
      <div className="absolute bottom-6 left-4 right-20 z-20 pointer-events-none">
        <p className="text-white font-display text-xl leading-tight drop-shadow-lg">{photo.uploader_name}</p>
        {photo.caption && (
          <p className="text-white/85 font-body text-sm mt-1.5 line-clamp-2 leading-snug drop-shadow">{photo.caption}</p>
        )}
        {photo.ceremony_tag && (
          <span className="inline-block mt-2 bg-white/15 backdrop-blur-sm text-white/90 text-xs font-body px-2.5 py-0.5 rounded-full capitalize border border-white/20">
            {photo.ceremony_tag === 'christian' ? '⛪' : photo.ceremony_tag === 'hindu' ? '🪔' : photo.ceremony_tag === 'reception' ? '🥂' : '📸'} {photo.ceremony_tag}
          </span>
        )}
      </div>

      {/* Right action bar */}
      <div className="absolute right-3 bottom-6 flex flex-col items-center gap-5 z-20" data-no-tap>
        {/* Like */}
        <button onClick={handleLike} className="flex flex-col items-center gap-1" aria-label="Like">
          <div className={`w-12 h-12 rounded-full bg-black/35 backdrop-blur-sm flex items-center justify-center transition-transform active:scale-90 ${isLiked ? 'scale-110' : ''}`}>
            <svg
              className={`w-6 h-6 transition-all duration-200 ${isLiked ? 'scale-110' : ''}`}
              viewBox="0 0 24 24"
              stroke={isLiked ? 'none' : 'white'}
              strokeWidth={1.8}
              fill={isLiked ? '#ef4444' : 'rgba(255,255,255,0.15)'}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
          </div>
          <span className="text-white/90 text-xs font-body drop-shadow font-medium">{currentLikes}</span>
        </button>

        {/* Comments */}
        <button onClick={() => setShowComments(true)} className="flex flex-col items-center gap-1" aria-label="Comments">
          <div className="w-12 h-12 rounded-full bg-black/35 backdrop-blur-sm flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
            </svg>
          </div>
          <span className="text-white/90 text-xs font-body drop-shadow font-medium">{currentCommentCount || ''}</span>
        </button>

        {/* Pause/Play */}
        <button onClick={() => setPaused(p => !p)} className="flex flex-col items-center gap-1" aria-label={paused ? 'Play' : 'Pause'}>
          <div className="w-12 h-12 rounded-full bg-black/35 backdrop-blur-sm flex items-center justify-center">
            {paused ? (
              <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5.75 3a.75.75 0 00-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V3.75A.75.75 0 007.25 3h-1.5zM12.75 3a.75.75 0 00-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V3.75a.75.75 0 00-.75-.75h-1.5z" />
              </svg>
            )}
          </div>
        </button>
      </div>

      {/* Swipe hint arrows (subtle, fade out after first swipe could be added) */}
      {photos.length > 1 && !showComments && (
        <>
          {index > 0 && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 pointer-events-none z-10" style={{ top: '18%' }}>
              <svg className="w-6 h-6 text-white/25 animate-bounce-up" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </div>
          )}
          {index < photos.length - 1 && (
            <div className="absolute pointer-events-none z-10" style={{ bottom: '22%', left: '50%', transform: 'translateX(-50%)' }}>
              <svg className="w-6 h-6 text-white/25 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          )}
        </>
      )}

      {/* Pause indicator flash */}
      {paused && !showComments && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <div className="bg-black/40 backdrop-blur-sm rounded-full p-5 animate-fadeInOut">
            <svg className="w-10 h-10 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
            </svg>
          </div>
        </div>
      )}

      {/* Double-tap heart */}
      {heartAnim && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
          <div className="text-9xl" style={{ animation: 'heartPop 0.9s ease forwards' }}>❤️</div>
        </div>
      )}

      {/* Comment sheet backdrop */}
      {showComments && (
        <div
          className="absolute inset-0 z-30 bg-black/50"
          data-no-tap
          onClick={() => setShowComments(false)}
        />
      )}

      {/* Comment sheet */}
      {showComments && (
        <div
          className="absolute inset-x-0 bottom-0 z-40 bg-white rounded-t-3xl flex flex-col"
          style={{ maxHeight: '72vh', animation: 'sheetUp 0.28s cubic-bezier(0.32,0.72,0,1)' }}
          data-no-tap
          onClick={e => e.stopPropagation()}
        >
          {/* Drag handle */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 bg-gray-200 rounded-full" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-5 py-2 border-b border-gray-100">
            <h3 className="font-display text-brown text-lg">Comments</h3>
            <button onClick={() => setShowComments(false)} className="text-brown/40 p-1 hover:text-brown/70">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
            {comments.length === 0 ? (
              <p className="text-center text-brown/35 font-body text-sm py-8">No comments yet — be the first!</p>
            ) : comments.map(c => (
              <div key={c.id} className="flex gap-3 items-start">
                <div className="w-9 h-9 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0 font-display text-gold">
                  {(c.author_name || 'G')[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-body text-xs text-brown/50 mb-0.5">{c.author_name}</p>
                  <p className="font-body text-sm text-brown leading-snug break-words">{c.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <form onSubmit={handleSubmitComment} className="px-4 pb-safe pt-3 border-t border-gray-100 space-y-2">
            {!nameStored && (
              <input
                type="text"
                value={authorName}
                onChange={e => setAuthorName(e.target.value)}
                placeholder="Your name"
                maxLength={60}
                className="w-full border-2 border-gold/25 rounded-2xl px-4 py-2.5 font-body text-sm text-brown focus:outline-none focus:border-gold/50 bg-white"
              />
            )}
            <div className="flex gap-2 items-center">
              <input
                type="text"
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                placeholder="Add a comment…"
                maxLength={500}
                className="flex-1 border-2 border-gold/25 rounded-2xl px-4 py-2.5 font-body text-sm text-brown focus:outline-none focus:border-gold/50 bg-white"
              />
              <button
                type="submit"
                disabled={submitting || !commentText.trim() || !authorName.trim()}
                className="bg-gold text-white rounded-2xl px-4 py-2.5 font-body text-sm font-medium disabled:opacity-40 flex-shrink-0 transition-opacity"
              >
                {submitting ? '…' : 'Post'}
              </button>
            </div>
          </form>
        </div>
      )}

      <style>{`
        @keyframes tikProgress { from { width: 0% } to { width: 100% } }
        @keyframes tikFade { from { opacity: 0; transform: scale(1.03) } to { opacity: 1; transform: scale(1) } }
        @keyframes heartPop {
          0%   { transform: scale(0.3); opacity: 0 }
          25%  { transform: scale(1.4); opacity: 1 }
          60%  { transform: scale(1);   opacity: 1 }
          100% { transform: scale(1.1); opacity: 0 }
        }
        @keyframes sheetUp {
          from { transform: translateY(100%) }
          to   { transform: translateY(0) }
        }
        @keyframes fadeInOut {
          0%   { opacity: 0; transform: scale(0.8) }
          20%  { opacity: 1; transform: scale(1) }
          70%  { opacity: 1 }
          100% { opacity: 0 }
        }
        .animate-fadeInOut { animation: fadeInOut 1.2s ease forwards; }
        .animate-bounce-up {
          animation: bounceUp 1s infinite;
        }
        @keyframes bounceUp {
          0%, 100% { transform: translateY(0) }
          50%       { transform: translateY(-4px) }
        }
        .pb-safe { padding-bottom: max(0.75rem, env(safe-area-inset-bottom)); }
      `}</style>
    </div>
  );
}

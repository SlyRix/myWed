import { useState } from 'react';
import { likePhoto } from '../api';
import { useDeviceId } from '../hooks/useDeviceId';

const MEDALS = ['🥇', '🥈', '🥉'];

export default function PhotoCard({ photo, index, onClick, onLikeUpdate }) {
  const deviceId = useDeviceId();
  const [likes, setLikes] = useState(photo.likes);
  const [liked, setLiked] = useState(() => {
    const stored = JSON.parse(localStorage.getItem('likedPhotos') || '{}');
    return !!stored[photo.id];
  });
  const [liking, setLiking] = useState(false);

  const handleLike = async e => {
    e.stopPropagation();
    if (liking) return;
    setLiking(true);
    const next = !liked;
    const nextCount = next ? likes + 1 : likes - 1;
    setLiked(next);
    setLikes(nextCount);
    const stored = JSON.parse(localStorage.getItem('likedPhotos') || '{}');
    if (next) stored[photo.id] = true; else delete stored[photo.id];
    localStorage.setItem('likedPhotos', JSON.stringify(stored));
    try {
      const res = await likePhoto(photo.id, deviceId);
      setLikes(res.likes);
      onLikeUpdate?.(photo.id, res.likes);
    } catch {
      setLiked(!next);
      setLikes(likes);
    } finally {
      setLiking(false);
    }
  };

  const medal = index < 3 ? MEDALS[index] : null;

  return (
    <div
      className="relative group rounded-xl overflow-hidden bg-cream-dark cursor-pointer shadow-sm hover:shadow-md transition-shadow"
      onClick={() => onClick(photo)}
    >
      {photo.media_type === 'video' ? (
        <video
          src={photo.url}
          className="w-full object-cover"
          preload="metadata"
          muted
          playsInline
        />
      ) : (
        <img
          src={photo.url}
          alt={photo.caption || `Photo by ${photo.uploader_name}`}
          className="w-full object-cover"
          loading="lazy"
        />
      )}

      {photo.media_type === 'video' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-black/40 rounded-full p-3">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
            </svg>
          </div>
        </div>
      )}

      {medal && (
        <div className="absolute top-2 left-2 text-xl leading-none drop-shadow-md">
          {medal}
        </div>
      )}

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-3 translate-y-1 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200">
        <p className="text-white text-xs font-body truncate">{photo.uploader_name}</p>
        {photo.caption && <p className="text-white/80 text-xs truncate mt-0.5">{photo.caption}</p>}
      </div>

      <button
        onClick={handleLike}
        className="absolute top-2 right-2 flex items-center gap-1 bg-black/40 backdrop-blur-sm rounded-full px-2 py-1 transition-transform active:scale-90"
        aria-label={liked ? 'Unlike' : 'Like'}
      >
        <span className={`text-base transition-transform ${liked ? 'scale-110' : 'scale-100'}`}>
          {liked ? '❤️' : '🤍'}
        </span>
        <span className="text-white text-xs font-medium">{likes}</span>
      </button>
    </div>
  );
}

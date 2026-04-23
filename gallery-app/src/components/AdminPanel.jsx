import { useState, useEffect } from 'react';
import { fetchAdminPhotos, fetchAdminStats, patchPhoto, deletePhoto, getDownloadUrl } from '../api';

export default function AdminPanel({ onTokenChange }) {
  const [token, setToken] = useState(() => localStorage.getItem('galleryAdminToken') || '');
  const [input, setInput] = useState('');
  const [authed, setAuthed] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const login = async e => {
    e.preventDefault();
    setError('');
    try {
      const data = await fetchAdminStats(input);
      localStorage.setItem('galleryAdminToken', input);
      setToken(input);
      setAuthed(true);
      setStats(data);
      onTokenChange?.(input);
    } catch {
      setError('Wrong admin token.');
    }
  };

  const loadPhotos = async (t = token) => {
    setLoading(true);
    try {
      const [photosData, statsData] = await Promise.all([fetchAdminPhotos(t), fetchAdminStats(t)]);
      setPhotos(photosData.photos);
      setStats(statsData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAdminStats(token).then(data => { setStats(data); setAuthed(true); loadPhotos(token); }).catch(() => {});
    }
  }, []); // eslint-disable-line

  const toggle = async (id, field, current) => {
    await patchPhoto(id, token, { [field]: !current });
    setPhotos(prev => prev.map(p => p.id === id ? { ...p, [field]: !current } : p));
  };

  const remove = async id => {
    if (!window.confirm('Delete this photo permanently?')) return;
    await deletePhoto(id, token);
    setPhotos(prev => prev.filter(p => p.id !== id));
    setStats(s => ({ ...s, total: s.total - 1 }));
  };

  const logout = () => {
    localStorage.removeItem('galleryAdminToken');
    setToken('');
    setAuthed(false);
    setPhotos([]);
    setStats(null);
    onTokenChange?.('');
  };

  if (!authed) return (
    <div className="min-h-full flex items-center justify-center bg-cream px-4 pb-24">
      <form onSubmit={login} className="w-full max-w-sm space-y-4">
        <div className="text-center mb-6">
          <span className="text-5xl">🛡️</span>
          <h2 className="font-display text-2xl text-brown mt-3">Admin Access</h2>
          <p className="font-body text-brown/50 text-sm mt-1">Enter your admin token to moderate photos</p>
        </div>
        <input
          type="password"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Admin token"
          className="w-full border border-gold/20 bg-white rounded-xl px-4 py-3 font-body text-brown focus:outline-none focus:border-gold"
        />
        {error && <p className="text-red-500 text-sm font-body">{error}</p>}
        <button type="submit" className="w-full bg-gold text-white font-body font-medium py-3 rounded-xl">
          Login
        </button>
      </form>
    </div>
  );

  return (
    <div className="min-h-full bg-cream pb-24">
      {/* Stats bar */}
      {stats && (
        <div className="bg-brown text-white px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display text-xl">Admin Panel</h2>
            <button onClick={logout} className="text-white/50 hover:text-white text-sm font-body">Logout</button>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              ['Total', stats.total, '📷'],
              ['Public', stats.public, '🌍'],
              ['Likes', stats.totalLikes, '❤️']
            ].map(([label, val, icon]) => (
              <div key={label} className="bg-white/10 rounded-xl p-3 text-center">
                <div className="text-xl">{icon}</div>
                <div className="font-body font-bold text-xl">{val}</div>
                <div className="font-body text-white/60 text-xs">{label}</div>
              </div>
            ))}
          </div>
          <div className="flex gap-3 mt-3">
            <button
              onClick={() => loadPhotos()}
              className="flex-1 bg-white/10 hover:bg-white/20 text-white font-body text-sm py-2 rounded-xl transition-colors"
            >
              Refresh
            </button>
            <a
              href={`${getDownloadUrl()}?token=${token}`}
              className="flex-1 bg-gold hover:bg-gold-dark text-white font-body text-sm py-2 rounded-xl transition-colors text-center"
              download
            >
              ⬇ Download ZIP
            </a>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-gold/30 border-t-gold rounded-full animate-spin" />
        </div>
      ) : (
        <div className="p-3 grid grid-cols-2 gap-3">
          {photos.map(photo => (
            <div key={photo.id} className="bg-white rounded-2xl overflow-hidden shadow-sm">
              {photo.media_type === 'video' ? (
                <video src={photo.url} className="w-full h-36 object-cover" muted playsInline />
              ) : (
                <img src={photo.url} alt="" className="w-full h-36 object-cover" />
              )}
              <div className="p-2.5">
                <p className="font-body text-brown text-xs font-medium truncate">{photo.uploader_name}</p>
                <p className="font-body text-brown/50 text-xs truncate">{photo.caption || '—'}</p>
                <div className="flex items-center gap-1 mt-1 text-xs font-body text-brown/40">
                  <span>❤️ {photo.likes}</span>
                  {photo.ceremony_tag && <span>· {photo.ceremony_tag}</span>}
                </div>
                <div className="flex gap-1.5 mt-2">
                  <button
                    onClick={() => toggle(photo.id, 'is_public', photo.is_public)}
                    className={`flex-1 text-xs py-1 rounded-lg font-body transition-colors ${photo.is_public ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}
                  >
                    {photo.is_public ? '🌍 Public' : '🔒 Private'}
                  </button>
                  <button
                    onClick={() => toggle(photo.id, 'is_featured', photo.is_featured)}
                    className={`text-xs px-2 py-1 rounded-lg font-body transition-colors ${photo.is_featured ? 'bg-gold/20 text-gold-dark' : 'bg-gray-100 text-gray-400'}`}
                    aria-label="Feature"
                  >
                    ⭐
                  </button>
                  <button
                    onClick={() => remove(photo.id)}
                    className="text-xs px-2 py-1 rounded-lg bg-red-50 text-red-500 font-body"
                    aria-label="Delete"
                  >
                    🗑
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

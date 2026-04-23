import { useState, useRef } from 'react';
import { uploadPhoto } from '../api';
import { useOfflineQueue } from '../hooks/useOfflineQueue';

const CEREMONY_TAGS = [
  { value: 'christian', label: 'Christian', emoji: '⛪' },
  { value: 'hindu', label: 'Hindu', emoji: '🪔' },
  { value: 'reception', label: 'Reception', emoji: '🥂' },
  { value: 'other', label: 'Other', emoji: '📸' },
];

export default function UploadView({ onUploaded }) {
  const [name, setName] = useState(() => localStorage.getItem('galleryName') || '');
  const [caption, setCaption] = useState('');
  const [ceremonyTag, setCeremonyTag] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [done, setDone] = useState(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const { isOnline, pending, addToQueue } = useOfflineQueue(onUploaded);

  const handleFiles = files => {
    const arr = Array.from(files);
    if (!arr.length) return;
    setSelectedFiles(arr);
    setDone(null);
    setError('');
    const urls = arr.map(f => URL.createObjectURL(f));
    setPreviews(prev => { prev.forEach(u => URL.revokeObjectURL(u)); return urls; });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!selectedFiles.length) { setError('Please select at least one photo or video.'); return; }
    if (!name.trim()) { setError('Please enter your name.'); return; }

    localStorage.setItem('galleryName', name.trim());
    setUploading(true);
    setError('');
    setProgress(0);

    for (const file of selectedFiles) {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('uploader_name', name.trim());
      fd.append('caption', caption.trim());
      fd.append('ceremony_tag', ceremonyTag);
      fd.append('is_public', isPublic ? '1' : '0');

      if (!isOnline) {
        await addToQueue({ uploader_name: name.trim(), caption: caption.trim(), ceremony_tag: ceremonyTag, is_public: isPublic ? '1' : '0' }, file);
        continue;
      }

      try {
        const result = await uploadPhoto(fd, p => setProgress(p));
        onUploaded?.(result);
        setDone(result);
      } catch (err) {
        setError('Upload failed. Saving for when you\'re back online.');
        await addToQueue({ uploader_name: name.trim(), caption: caption.trim(), ceremony_tag: ceremonyTag, is_public: isPublic ? '1' : '0' }, file);
      }
    }

    setUploading(false);
    setSelectedFiles([]);
    setPreviews(prev => { prev.forEach(u => URL.revokeObjectURL(u)); return []; });
    setCaption('');
    setProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  return (
    <div className="min-h-full bg-cream pb-24 px-4 pt-6">
      <h1 className="font-display text-3xl text-brown text-center mb-1">Share a Moment</h1>
      <p className="text-center text-brown/60 font-body text-sm mb-6">Upload your photos & videos from the celebration</p>

      {!isOnline && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 flex items-center gap-2">
          <span className="text-amber-500">📴</span>
          <p className="text-amber-700 text-sm font-body">You're offline — uploads will be saved and sent automatically when you reconnect.</p>
        </div>
      )}

      {pending > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-4 flex items-center gap-2">
          <span className="text-blue-500">⏳</span>
          <p className="text-blue-700 text-sm font-body">{pending} upload{pending > 1 ? 's' : ''} queued for when you're online.</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5 max-w-lg mx-auto">
        {/* File pick buttons */}
        <div className="grid grid-cols-2 gap-3">
          <input ref={cameraInputRef} type="file" accept="image/*,video/*" capture="environment" className="hidden" onChange={e => handleFiles(e.target.files)} />
          <button
            type="button"
            onClick={() => cameraInputRef.current?.click()}
            className="flex flex-col items-center gap-2 bg-white border-2 border-gold/30 hover:border-gold rounded-2xl py-6 transition-colors"
          >
            <span className="text-4xl">📷</span>
            <span className="text-brown font-body text-sm font-medium">Take Photo</span>
          </button>

          <input ref={fileInputRef} type="file" accept="image/*,video/*" multiple className="hidden" onChange={e => handleFiles(e.target.files)} />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center gap-2 bg-white border-2 border-gold/30 hover:border-gold rounded-2xl py-6 transition-colors"
          >
            <span className="text-4xl">🖼️</span>
            <span className="text-brown font-body text-sm font-medium">Choose from Gallery</span>
          </button>
        </div>

        {/* Previews */}
        {previews.length > 0 && (
          <div className="grid grid-cols-3 gap-2 rounded-xl overflow-hidden">
            {previews.map((src, i) => (
              selectedFiles[i]?.type.startsWith('video') ? (
                <video key={i} src={src} className="w-full h-24 object-cover rounded-lg" muted playsInline />
              ) : (
                <img key={i} src={src} alt="" className="w-full h-24 object-cover rounded-lg" />
              )
            ))}
          </div>
        )}

        {/* Name */}
        <div>
          <label className="block text-brown/70 font-body text-sm mb-1.5">Your Name *</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. Thomas"
            maxLength={80}
            className="w-full border border-gold/20 bg-white rounded-xl px-4 py-3 font-body text-brown placeholder-brown/30 focus:outline-none focus:border-gold"
          />
        </div>

        {/* Ceremony tag */}
        <div>
          <label className="block text-brown/70 font-body text-sm mb-1.5">Ceremony</label>
          <div className="grid grid-cols-4 gap-2">
            {CEREMONY_TAGS.map(t => (
              <button
                key={t.value}
                type="button"
                onClick={() => setCeremonyTag(prev => prev === t.value ? '' : t.value)}
                className={`flex flex-col items-center gap-1 py-2 rounded-xl border-2 transition-colors text-xs font-body ${
                  ceremonyTag === t.value
                    ? 'border-gold bg-gold/10 text-gold-dark'
                    : 'border-gold/20 bg-white text-brown/70'
                }`}
              >
                <span className="text-lg">{t.emoji}</span>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Caption */}
        <div>
          <label className="block text-brown/70 font-body text-sm mb-1.5">Caption <span className="text-brown/40">(optional)</span></label>
          <textarea
            value={caption}
            onChange={e => setCaption(e.target.value)}
            placeholder="What's happening in this photo?"
            maxLength={300}
            rows={2}
            className="w-full border border-gold/20 bg-white rounded-xl px-4 py-3 font-body text-brown placeholder-brown/30 focus:outline-none focus:border-gold resize-none"
          />
        </div>

        {/* Public toggle */}
        <div className="flex items-center justify-between bg-white rounded-xl px-4 py-3 border border-gold/20">
          <div>
            <p className="font-body text-brown font-medium text-sm">{isPublic ? '🌍 Visible to everyone' : '🔒 Only you can see this'}</p>
            <p className="font-body text-brown/50 text-xs">{isPublic ? 'Shown in the shared gallery' : 'Private — kept for the couple'}</p>
          </div>
          <button
            type="button"
            onClick={() => setIsPublic(p => !p)}
            className={`relative w-12 h-6 rounded-full transition-colors ${isPublic ? 'bg-gold' : 'bg-gray-200'}`}
            aria-label="Toggle public"
          >
            <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${isPublic ? 'translate-x-6' : 'translate-x-0.5'}`} />
          </button>
        </div>

        {error && <p className="text-red-500 text-sm font-body">{error}</p>}

        {uploading && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-body text-brown/60">
              <span>Uploading…</span><span>{progress}%</span>
            </div>
            <div className="h-2 bg-cream-dark rounded-full overflow-hidden">
              <div className="h-full bg-gold rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        {done && !uploading && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
            <p className="text-green-700 font-body font-medium">Uploaded! 🎉</p>
            {done.ai_tags?.length > 0 && (
              <p className="text-green-600 text-sm mt-1">AI tagged as: {done.ai_tags.join(', ')}</p>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={uploading || selectedFiles.length === 0}
          className="w-full bg-gold hover:bg-gold-dark disabled:opacity-40 text-white font-body font-medium py-4 rounded-2xl transition-colors text-lg"
        >
          {uploading ? 'Uploading…' : !isOnline ? 'Save for Later' : `Share ${selectedFiles.length > 1 ? `${selectedFiles.length} Files` : 'Photo'}`}
        </button>
      </form>
    </div>
  );
}

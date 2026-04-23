# Findings: Wedding Gallery PWA

## Existing Gallery Code
- `src/components/gallery/PhotoGallery.js` — Basic grid with Unsplash placeholder photos, fake upload
- `src/components/gallery/PhotoUpload.js` — Simulated upload (no real backend, just ObjectURL)
- `src/components/gallery/GalleryItem.js` — Single photo card component
- Current gallery: NO real storage backend. Entirely local/placeholder.

## Cloudflare Setup (from CLAUDE.md)
- D1 database: `wedding-db` (ID: 71f98b31-6ee3-47cf-84e0-33be1a805975)
- Worker: deployed at `api.rushel.me`
- Pages: `wedding-website` project
- R2: not yet used — needs bucket creation (`wedding-photos`)

## Worker Limits (Cloudflare)
- Worker request body: max 100MB (but presigned R2 URL upload bypasses this)
- R2 free tier: 10GB storage, 1M Class A ops/month — ample for a wedding
- D1 free: 5GB storage, 25M reads/day — fine for metadata

## Key Files to Modify
- `workers/api/schema.sql` — add `photos` table
- `workers/api/src/index.js` — add photo API endpoints
- `workers/api/wrangler.toml` — add R2 binding
- `src/App.js` — add /gallery route (already exists?)
- `src/components/gallery/` — replace placeholder components

## PWA Requirements
- `public/manifest.json` — needs name, icons, theme_color
- Service worker (`public/sw.js`) — offline upload queue
- HTTPS — already on Cloudflare (OK)
- Icons — need 192x192 and 512x512 app icons

## Upload Architecture (Presigned R2)
```
Guest → POST /api/photos/upload-url → Worker returns { url, key }
Guest → PUT {url} directly to R2 with file
Guest → POST /api/photos/metadata { key, name, isPublic, caption, tag }
Worker → INSERT into D1 photos table
```

## D1 Photos Table Schema
```sql
CREATE TABLE IF NOT EXISTS photos (
  id TEXT PRIMARY KEY,           -- UUID
  r2_key TEXT NOT NULL,          -- R2 object key
  uploader_name TEXT NOT NULL,   -- Guest name
  caption TEXT DEFAULT '',
  tag TEXT DEFAULT '',           -- 'christian'|'hindu'|'reception'|''
  is_public INTEGER DEFAULT 1,   -- 1=public, 0=private
  likes INTEGER DEFAULT 0,
  media_type TEXT DEFAULT 'image', -- 'image'|'video'
  file_size INTEGER DEFAULT 0,
  width INTEGER DEFAULT 0,
  height INTEGER DEFAULT 0,
  created_at INTEGER NOT NULL    -- Unix ms timestamp
);
```

## Mobile Camera API
- `<input type="file" accept="image/*,video/*" capture="environment">` opens camera on mobile
- Works on iOS Safari and Android Chrome without permissions dialog
- getUserMedia() alternative for live viewfinder (more complex)

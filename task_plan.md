# Task Plan: Wedding Gallery PWA

## Goal
Build a standalone PWA for wedding guests to upload photos/videos. QR code with ?gallery=CODE grants open access. Standalone at gallery.rushelwedsivani.com. Files stored on home server 4TB disk. Same design language as wedding website. Robust for 20–50 uploaders at a 400-person wedding.

---

## Architecture (final)

| Layer | What | Where |
|---|---|---|
| Frontend PWA | React 18 + Vite + Tailwind | CF Pages → gallery.rushelwedsivani.com |
| API + file storage | Node.js + Express + SQLite | Home server port 4000 via Docker |
| Public API access | Cloudflare Tunnel | gallery-api.rushelwedsivani.com → port 4000 |
| File storage | Disk | /mnt/media/gallery-storage/ on 4TB disk |
| AI tagging | GPT-4o-mini Vision | Server-side async, needs OPENAI_API_KEY |

---

## Phase Status

### Phase 1 — Planning ✅
### Phase 2 — Backend (gallery-server/) ✅
- Express + SQLite + multer + archiver + openai
- All routes: upload, photos, likes, tags, admin CRUD, ZIP download
- Docker deployed to home server (~/Projects/wedding-gallery/)
- Running: `docker compose up -d`, health check confirmed

### Phase 3 — Cloudflare Tunnel ✅
- User manually configured: gallery-api.rushelwedsivani.com → port 4000
- Live: https://gallery-api.rushelwedsivani.com/api/health returns {"ok":true}

### Phase 4 — PWA Shell ✅
- vite-plugin-pwa handles manifest + service worker + workbox caching
- InstallPrompt.jsx — "Add to Home Screen" banner

### Phase 5 — Upload UI ✅
- Camera capture + file picker (images + videos)
- Ceremony tag selector (Christian/Hindu/Reception/Other)
- Caption, public/private toggle
- Real XHR upload progress
- Offline queue via IndexedDB (useOfflineQueue.js)
- Name persisted in localStorage

### Phase 6 — Gallery UI ✅
- Masonry grid (react-masonry-css), infinite scroll (IntersectionObserver)
- Sort: Most Liked (default) / Newest
- Ceremony filter tabs + AI tag filter pills
- Like/heart per device (localStorage dedup)
- 🥇🥈🥉 medals on top 3
- Lightbox with touch swipe
- Video player inline
- Slideshow mode (fullscreen API)

### Phase 7 — Admin Panel ✅
- Token login, stats (total/public/likes)
- Grid view: toggle public/private, feature/unfeature, delete
- ZIP download (fixed: accepts ?token= for direct link)

### Phase 8 — QR Code + Integration ❌ NOT DONE
- [ ] QR code generator/print page in React
- [ ] Link from main wedding site gallery section to gallery PWA
- [ ] Custom domain: gallery.rushelwedsivani.com → CF Pages project (manual CF dashboard step)
- [ ] Mobile test on iOS Safari + Android Chrome

---

## Open Issues

| Issue | Severity | Status |
|---|---|---|
| PWA icons missing (pwa-192.png, pwa-512.png) | Medium | ❌ Not created |
| gallery.rushelwedsivani.com custom domain | High | ❌ Manual CF dashboard step needed |
| OPENAI_API_KEY not set → AI tagging disabled | Low | ❌ User to add key to .env on server |
| QR code page not built | Medium | ❌ Phase 8 |
| Main site link to gallery | Low | ❌ Phase 8 |

---

## Decisions Log
| Decision | Choice | Reason |
|---|---|---|
| Storage | Home server 4TB | No cost, no limits |
| Process manager | Docker (switched from PM2) | Easier start/stop/update |
| Public API domain | gallery-api.rushelwedsivani.com | Clean separation from frontend domain |
| Frontend domain | gallery.rushelwedsivani.com | CF Pages, fast CDN |
| AI tagging | GPT-4o-mini Vision | Best quality, <$1 total |
| Access control | ?gallery=CODE | Low friction, QR-embeddable |
| Admin ZIP auth | Bearer header + ?token= query param | Needed for direct download links |

---

## Errors Encountered
| Error | Attempt | Resolution |
|---|---|---|
| PM2 systemd inactive | 1 | Switched to Docker (restart: unless-stopped) |
| CF Pages token auth failed on deploy | 1 | Used Kahoot project token instead |
| CF Pages custom domain already claimed | 1 | Needs manual dashboard step |
| Admin ZIP 401 (token in URL not header) | 1 | Fixed auth.js to accept ?token= for GET requests |

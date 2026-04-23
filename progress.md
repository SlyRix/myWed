# Progress Log: Wedding Gallery PWA

## Session 1 — 2026-04-22 — Planning
- Architecture decided: home server 4TB + Docker + CF Tunnel + CF Pages
- Feature set locked in (see task_plan.md)

## Session 2 — 2026-04-23 — Build + Deploy

### Phase 2 ✅ — Backend built and deployed
- `gallery-server/` directory with all source files
- Deployed via pscp to ~/Projects/wedding-gallery/ on home server
- Switched from PM2 to Docker: `docker compose up -d --build`
- Container `wedding-gallery` running port 4000, restart: unless-stopped
- Storage: /mnt/media/gallery-storage/ on 4TB disk (/dev/sda1)
- DB: /mnt/media/gallery-storage/gallery.db (SQLite WAL mode)

### Phase 3 ✅ — CF Tunnel
- User manually set up: gallery-api.rushelwedsivani.com → home server port 4000
- Verified live: curl https://gallery-api.rushelwedsivani.com/api/health → {"ok":true}

### Phase 4–7 ✅ — PWA Frontend built and deployed
- `gallery-app/` directory: Vite + React 18 + Tailwind + vite-plugin-pwa
- All components: GalleryView, UploadView, Lightbox, Slideshow, AdminPanel, InstallPrompt, PhotoCard
- Built: `npm run build` → dist/ (180KB JS, 20KB CSS, sw.js + workbox)
- Deployed: CF Pages project `wedding-gallery-photos`
- Live at: https://wedding-gallery-photos.pages.dev

### Bug fixed: Admin ZIP download (auth.js)
- Problem: AdminPanel passed token as ?token= URL param; server only checked Authorization header
- Fix: auth.js requireAdminToken now also accepts ?token= for GET requests
- Rebuilt Docker container, re-verified health check

## Session 3 — 2026-04-23 — Plan Review

### Gaps identified
1. ❌ PWA icons missing: pwa-192.png + pwa-512.png not in gallery-app/public/
2. ❌ gallery.rushelwedsivani.com not yet pointing to CF Pages (manual dashboard step)
3. ❌ Phase 8 QR code page not built
4. ❌ Main site link not added
5. ❌ OPENAI_API_KEY not set (AI tagging disabled)

### Next actions
- Add PWA icons to gallery-app/public/
- Build QR code print page
- User to: add gallery.rushelwedsivani.com custom domain in CF dashboard
- User to: add OPENAI_API_KEY to .env on home server and rebuild container

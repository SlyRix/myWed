# Gallery Server — Home Server Setup

## 1. Copy files to home server

```bash
# From your Windows machine:
scp -r gallery-server/ rushel@192.168.1.206:~/wedding-gallery/
```

## 2. Install dependencies

```bash
ssh rushel@192.168.1.206
cd ~/wedding-gallery
npm install
```

## 3. Create storage directory on 4TB disk

```bash
# Find your 4TB disk mount point (e.g. /mnt/data)
lsblk

# Create storage folder
sudo mkdir -p /mnt/data/gallery-storage/photos
sudo mkdir -p /mnt/data/gallery-storage/videos
sudo chown -R rushel:rushel /mnt/data/gallery-storage
```

## 4. Configure environment

```bash
cp .env.example .env
nano .env
```

Fill in:
- `GALLERY_CODE` — the code you'll put in the QR URL (e.g. `RUSHIVANI2025`)
- `ADMIN_TOKEN` — a strong secret for the moderation panel
- `STORAGE_PATH` — absolute path to your 4TB folder (e.g. `/mnt/data/gallery-storage`)
- `BASE_URL` — `https://gallery.rushelwedsivani.com`
- `OPENAI_API_KEY` — your OpenAI key (or leave empty to disable AI tagging)

## 5. Initialize database

```bash
node -e "require('./src/db').getDb(); console.log('DB initialized')"
```

## 6. Install PM2 and start server

```bash
npm install -g pm2
pm2 start ecosystem.config.js
pm2 save
pm2 startup  # Follow the printed command to auto-start on reboot
```

## 7. Set up Cloudflare Tunnel

```bash
# Install cloudflared
curl -L --output cloudflared.deb https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared.deb

# Authenticate with Cloudflare
cloudflared tunnel login

# Create tunnel
cloudflared tunnel create wedding-gallery

# Create config file
mkdir -p ~/.cloudflared
cat > ~/.cloudflared/config.yml << EOF
tunnel: wedding-gallery
credentials-file: /home/rushel/.cloudflared/<YOUR-TUNNEL-ID>.json

ingress:
  - hostname: gallery.rushelwedsivani.com
    service: http://localhost:4000
  - service: http_status:404
EOF

# Route domain to tunnel (run once)
cloudflared tunnel route dns wedding-gallery gallery.rushelwedsivani.com

# Install as systemd service (auto-start)
sudo cloudflared service install
sudo systemctl start cloudflared
sudo systemctl enable cloudflared
```

## 8. Test it

```bash
# Local test
curl http://localhost:4000/api/health

# Public test (after tunnel is running)
curl https://gallery.rushelwedsivani.com/api/health
```

Expected response: `{"ok":true,"ts":1234567890}`

## API Reference

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/health` | None | Health check |
| GET | `/api/photos` | Gallery code | Public gallery (paginated) |
| GET | `/api/photos/tags` | Gallery code | AI tag counts |
| POST | `/api/photos/:id/like` | Gallery code | Like/unlike |
| POST | `/api/upload` | Gallery code | Upload file |
| GET | `/api/admin/photos` | Admin token | All photos |
| GET | `/api/admin/stats` | Admin token | Upload stats |
| PATCH | `/api/admin/photos/:id` | Admin token | Toggle public/featured |
| DELETE | `/api/admin/photos/:id` | Admin token | Delete photo |
| GET | `/api/admin/zip` | Admin token | Download all as ZIP |

### Query params for GET /api/photos
- `sort=likes` (default) or `sort=newest`
- `ceremony=christian|hindu|reception|other`
- `tag=dancing|couple|...` (AI tag filter)
- `limit=30&offset=0` (pagination)

### Gallery code header
Send `x-gallery-code: YOUR_CODE` on all guest requests.

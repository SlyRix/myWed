# RSVP Dashboard

Private admin dashboard for viewing and managing wedding RSVPs.

## Overview

- **File**: `rsvp-dashboard/index.html` — single-file standalone app (no build step)
- **Deployed to**: Cloudflare Pages project `rsvp-dashboard`
- **URL**: https://rsvp-dashboard-36i.pages.dev (+ custom domain rsvp.rushelwedsivani.com when configured)
- **Design**: Dark luxury navy (#070b18) + gold (#c4923a), Playfair Display + JetBrains Mono fonts

## Deployment

```bash
# From project root — read token from .env first
export CLOUDFLARE_API_TOKEN=<from .env>
npx wrangler pages deploy rsvp-dashboard --project-name=rsvp-dashboard --branch=main --commit-dirty=true
```

## Authentication

- Login uses `POST https://api.rushel.me/api/admin/login` with the admin password
- Token is stored in `sessionStorage` (cleared on tab close)
- Same auth system as the main admin dashboard

## Data Source

Fetches from `GET https://api.rushel.me/api/rsvp` (admin-protected endpoint on the Cloudflare Worker).

Response shape:
```json
{
  "success": true,
  "stats": {
    "total": 42,
    "attending": 35,
    "notAttending": 7,
    "christianGuests": 20,
    "hinduGuests": 30,
    "receptionGuests": 35,
    "totalGuests": 65,
    "vegetarian": 12
  },
  "rsvps": [
    {
      "id": 1,
      "submitted_at": 1710000000000,
      "first_name": "Max",
      "last_name": "Mustermann",
      "full_name": "Max Mustermann",
      "email": "max@example.com",
      "phone": "",
      "attending": "yes",
      "christian_guests": 2,
      "hindu_guests": 2,
      "reception_guests": 2,
      "total_guests": 6,
      "is_vegetarian": 0,
      "message": "",
      "source": "direct"
    }
  ]
}
```

## Database Schema (relevant table)

```sql
CREATE TABLE rsvp (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    submitted_at INTEGER NOT NULL,       -- Unix timestamp ms
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT DEFAULT '',
    attending TEXT NOT NULL,             -- 'yes' or 'no'
    christian_guests INTEGER DEFAULT 0,
    hindu_guests INTEGER DEFAULT 0,
    reception_guests INTEGER DEFAULT 0,
    total_guests INTEGER DEFAULT 0,
    is_vegetarian INTEGER DEFAULT 0,     -- 0 or 1
    message TEXT DEFAULT '',
    source TEXT DEFAULT 'direct'
);
```

## Features

- Stat cards: Total RSVPs, Attending, Not attending, Total guests, Christian ceremony, Hindu ceremony, Reception, Vegetarian
- Bar charts for attendance and ceremony breakdown
- Recent RSVPs panel (last 5)
- Full guest table with search, filter by attending/ceremony/diet, sortable columns
- CSV export
- Auto-refresh every 5 minutes

## CORS

The Worker at `api.rushel.me` allows these origins:
- `https://rsvp-dashboard-36i.pages.dev`
- `https://rsvp.rushelwedsivani.com`

If the Pages URL changes (new deployment), add the new origin to `getAllowedOrigins()` in `workers/api/src/index.js` and redeploy the Worker.

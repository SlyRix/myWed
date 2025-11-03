# Cloudflare Workers - Backend API

This directory contains the Cloudflare Worker that serves as the backend API for the wedding website.

## Structure

```
workers/
└── api/
    ├── src/
    │   └── index.js          # Main Worker code
    ├── schema.sql            # D1 database schema
    ├── wrangler.toml         # Wrangler configuration
    └── package.json          # Worker dependencies
```

## Quick Start

### 1. Install Dependencies

```bash
cd workers/api
npm install
```

### 2. Login to Cloudflare

```bash
wrangler login
```

### 3. Create D1 Database

```bash
wrangler d1 create wedding-db
# Copy the database_id from output and update wrangler.toml
```

### 4. Initialize Database

```bash
wrangler d1 execute wedding-db --file=./schema.sql
```

### 5. Set Admin Password

```bash
# Generate password hash
node -e "const crypto = require('crypto'); console.log(crypto.createHash('sha256').update('your_password').digest('hex'));"

# Set as secret
wrangler secret put ADMIN_PASSWORD_HASH
```

### 6. Deploy Worker

```bash
# Development
wrangler deploy

# Production
wrangler deploy --env production
```

## API Endpoints

### Public Endpoints

- `GET /api/validate/:code` - Validate guest access code

### Protected Endpoints (require admin authentication)

- `POST /api/admin/login` - Admin login (returns session token)
- `GET /api/guests` - Get all guests
- `POST /api/guests` - Add/update guest
- `DELETE /api/guests/:code` - Delete guest
- `POST /api/generate-code` - Generate unique guest code

## Development

### Local Development

```bash
# Run worker locally with D1
wrangler dev

# Test API
curl http://localhost:8787/api/validate/TEST
```

### View Logs

```bash
# Real-time logs
wrangler tail wedding-api --env production
```

### Database Operations

```bash
# Query database
wrangler d1 execute wedding-db --command="SELECT * FROM guests"

# Export database
wrangler d1 export wedding-db --output=backup.sql

# Import database
wrangler d1 execute wedding-db --file=backup.sql
```

## Configuration

### Environment Variables (wrangler.toml)

- `FRONTEND_URL` - Frontend domain for CORS (e.g., `https://rushel.me`)

### Secrets

- `ADMIN_PASSWORD_HASH` - SHA-256 hash of admin password

## Security Features

- Rate limiting (100 requests per 15 minutes)
- Login rate limiting (5 attempts per 15 minutes)
- Session tokens with 24-hour expiration
- CORS configured for specific domain
- Input validation on all endpoints
- Parameterized SQL queries (SQL injection prevention)
- Security headers (CSP, X-Frame-Options, etc.)

## Database Schema

### Tables

- **guests** - Guest access codes and permissions
  - `code` (TEXT, PRIMARY KEY)
  - `name` (TEXT)
  - `ceremonies` (TEXT, JSON array)

- **sessions** - Admin authentication sessions
  - `token` (TEXT, PRIMARY KEY)
  - `expires_at` (INTEGER, Unix timestamp)

- **rate_limits** - Request rate limiting
  - `identifier` (TEXT, PRIMARY KEY)
  - `attempts` (INTEGER)
  - `window_start` (INTEGER, Unix timestamp)

## Troubleshooting

### Database ID not found

Update `database_id` in `wrangler.toml` with the ID from `wrangler d1 create`.

### CORS errors

Check `corsHeaders` in `src/index.js` and ensure `Access-Control-Allow-Origin` matches your frontend domain.

### Authentication errors

Verify admin password hash is set:
```bash
wrangler secret list
```

If missing:
```bash
wrangler secret put ADMIN_PASSWORD_HASH
```

## More Information

See [DEPLOYMENT.md](../../DEPLOYMENT.md) in the project root for complete deployment instructions.

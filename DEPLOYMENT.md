# Wedding Website - Cloudflare Deployment Guide

Complete step-by-step guide to deploy your wedding website to Cloudflare with the domain **rushel.me**.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Architecture Overview](#architecture-overview)
3. [Initial Setup](#initial-setup)
4. [Backend Deployment (Cloudflare Workers)](#backend-deployment)
5. [Frontend Deployment (Cloudflare Pages)](#frontend-deployment)
6. [Domain Configuration](#domain-configuration)
7. [Environment Variables](#environment-variables)
8. [Testing](#testing)
9. [GitHub Actions (Optional)](#github-actions-optional)
10. [Troubleshooting](#troubleshooting)
11. [Maintenance](#maintenance)

---

## Prerequisites

Before you begin, ensure you have:

- [ ] A Cloudflare account (free tier is sufficient)
- [ ] Domain **rushel.me** added to Cloudflare
- [ ] Node.js 18+ installed
- [ ] npm or yarn installed
- [ ] Git installed
- [ ] Wrangler CLI installed globally: `npm install -g wrangler`

### Required API Keys

- [ ] Google Maps API key (for map features)
- [ ] EmailJS credentials (for contact forms)
- [ ] Admin password for the dashboard

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        rushel.me                            │
│                   (Cloudflare Pages)                        │
│                   React Frontend                            │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ API Calls
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                     api.rushel.me                           │
│                  (Cloudflare Worker)                        │
│                   Backend API                               │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ Database Queries
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                   Cloudflare D1                             │
│                  SQLite Database                            │
│              (guests, sessions, rate_limits)                │
└─────────────────────────────────────────────────────────────┘
```

---

## Initial Setup

### 1. Clone and Install Dependencies

```bash
# Navigate to project directory
cd /path/to/mywed

# Install frontend dependencies
npm install

# Install worker dependencies
cd workers/api
npm install
cd ../..
```

### 2. Login to Cloudflare via Wrangler

```bash
wrangler login
```

This will open your browser to authenticate with Cloudflare.

### 3. Verify Authentication

```bash
wrangler whoami
```

You should see your Cloudflare account details.

---

## Backend Deployment

### Step 1: Create D1 Database

```bash
cd workers/api

# Create production database
wrangler d1 create wedding-db

# Save the database ID output, it looks like:
# database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

### Step 2: Update wrangler.toml

Edit `workers/api/wrangler.toml` and replace `REPLACE_WITH_YOUR_D1_DATABASE_ID` with your actual database ID:

```toml
[[d1_databases]]
binding = "DB"
database_name = "wedding-db"
database_id = "your-actual-database-id-here"
```

Do the same for the production environment section:

```toml
[[env.production.d1_databases]]
binding = "DB"
database_name = "wedding-db"
database_id = "your-actual-database-id-here"
```

### Step 3: Initialize Database Schema

```bash
# Execute the schema to create tables and insert default data
wrangler d1 execute wedding-db --file=./schema.sql
```

### Step 4: Set Admin Password

Generate a password hash and set it as a secret:

```bash
# Generate password hash (replace 'your_secure_password' with your actual password)
node -e "const crypto = require('crypto'); console.log(crypto.createHash('sha256').update('your_secure_password').digest('hex'));"

# Copy the hash output, then set it as a secret
wrangler secret put ADMIN_PASSWORD_HASH

# Paste the hash when prompted
```

### Step 5: Deploy the Worker

```bash
# Deploy to production
wrangler deploy --env production

# You should see output like:
# Uploaded wedding-api (X.XX sec)
# Published wedding-api (X.XX sec)
#   https://wedding-api.your-account.workers.dev
```

### Step 6: Test the Worker

```bash
# Test the API endpoint
curl https://wedding-api.your-account.workers.dev/api/validate/TEST

# Should return: {"valid":true,"guest":{"name":"Test User","ceremonies":["hindu"]},"ceremonies":["hindu"]}
```

---

## Frontend Deployment

### Step 1: Configure Environment Variables

Create `.env.production.local` (this file is gitignored):

```bash
# .env.production.local
REACT_APP_API_URL=https://api.rushel.me/api
REACT_APP_GOOGLE_MAPS_API_KEY=your_actual_google_maps_key
REACT_APP_EMAILJS_SERVICE_ID=your_actual_emailjs_service_id
REACT_APP_EMAILJS_TEMPLATE_ID=your_actual_emailjs_template_id
REACT_APP_EMAILJS_PUBLIC_KEY=your_actual_emailjs_public_key
NODE_ENV=production
```

### Step 2: Build the Application

```bash
# Return to project root
cd ../..

# Build the React app
npm run build

# Or use the build script
chmod +x build.sh
./build.sh
```

### Step 3: Create Cloudflare Pages Project

#### Option A: Via Cloudflare Dashboard (Recommended)

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **Workers & Pages** > **Pages**
3. Click **Create application** > **Connect to Git**
4. Select your repository
5. Configure build settings:
   - **Build command**: `npm run build`
   - **Build output directory**: `build`
   - **Root directory**: `/`
6. Add environment variables (same as `.env.production.local`)
7. Click **Save and Deploy**

#### Option B: Via Wrangler CLI

```bash
# Create a new Pages project
wrangler pages project create wedding-website

# Deploy the build directory
wrangler pages deploy build --project-name=wedding-website
```

---

## Domain Configuration

### Step 1: Configure Worker Custom Domain

1. Go to **Cloudflare Dashboard** > **Workers & Pages**
2. Click on your **wedding-api** worker
3. Go to **Settings** > **Triggers** > **Custom Domains**
4. Click **Add Custom Domain**
5. Enter: `api.rushel.me`
6. Click **Add Custom Domain**

Cloudflare will automatically create the DNS record and provision SSL certificate.

### Step 2: Configure Pages Custom Domain

1. Go to **Cloudflare Dashboard** > **Workers & Pages**
2. Click on your **wedding-website** Pages project
3. Go to **Custom domains**
4. Click **Set up a custom domain**
5. Enter: `rushel.me`
6. Click **Activate domain**

Also add the `www` subdomain:
7. Click **Set up a custom domain** again
8. Enter: `www.rushel.me`
9. Click **Activate domain**

### Step 3: Verify DNS Records

Go to **DNS** > **Records** in Cloudflare and verify these records exist:

```
Type    Name    Content
CNAME   api     wedding-api.your-account.workers.dev (proxied)
CNAME   @       wedding-website.pages.dev (proxied)
CNAME   www     wedding-website.pages.dev (proxied)
```

### Step 4: Update Worker CORS Configuration

After domain is configured, the Worker's CORS headers in `workers/api/src/index.js` should already be set to:

```javascript
const corsHeaders = {
    'Access-Control-Allow-Origin': 'https://rushel.me',
    // ...
};
```

If you need to add `www` subdomain:

```javascript
const corsHeaders = {
    'Access-Control-Allow-Origin': request.headers.get('Origin') || 'https://rushel.me',
    // ...
};
```

Then redeploy:

```bash
cd workers/api
wrangler deploy --env production
```

---

## Environment Variables

### Frontend (.env.production.local)

| Variable | Description | Where to Get It |
|----------|-------------|-----------------|
| `REACT_APP_API_URL` | Worker API URL | `https://api.rushel.me/api` |
| `REACT_APP_GOOGLE_MAPS_API_KEY` | Google Maps key | [Google Cloud Console](https://console.cloud.google.com/google/maps-apis) |
| `REACT_APP_EMAILJS_SERVICE_ID` | EmailJS service ID | [EmailJS Dashboard](https://dashboard.emailjs.com/) |
| `REACT_APP_EMAILJS_TEMPLATE_ID` | EmailJS template ID | [EmailJS Dashboard](https://dashboard.emailjs.com/) |
| `REACT_APP_EMAILJS_PUBLIC_KEY` | EmailJS public key | [EmailJS Dashboard](https://dashboard.emailjs.com/) |

### Backend (Wrangler Secrets)

| Secret | Description | How to Set |
|--------|-------------|------------|
| `ADMIN_PASSWORD_HASH` | SHA-256 hash of admin password | `wrangler secret put ADMIN_PASSWORD_HASH` |

---

## Testing

### Test Backend API

```bash
# Test public endpoint (validate access code)
curl https://api.rushel.me/api/validate/TEST

# Expected: {"valid":true,"guest":{...},"ceremonies":[...]}

# Test admin login
curl -X POST https://api.rushel.me/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"password":"your_admin_password"}'

# Expected: {"success":true,"token":"..."}
```

### Test Frontend

1. Open https://rushel.me in your browser
2. Verify the welcome splash loads
3. Test access code entry with `TEST`
4. Verify ceremony pages are accessible
5. Test admin dashboard at `/admin`
6. Try adding/editing/deleting guests

---

## GitHub Actions (Optional)

For automatic deployments on git push, set up these GitHub secrets:

### Required Secrets

Go to **GitHub** > **Your Repository** > **Settings** > **Secrets and variables** > **Actions**

Add these secrets:

| Secret Name | Description | Where to Get It |
|-------------|-------------|-----------------|
| `CLOUDFLARE_API_TOKEN` | Cloudflare API token | [Cloudflare Dashboard](https://dash.cloudflare.com/profile/api-tokens) - Use "Edit Cloudflare Workers" template |
| `CLOUDFLARE_ACCOUNT_ID` | Your Cloudflare Account ID | Dashboard > Workers & Pages > Overview (right sidebar) |
| `GOOGLE_MAPS_API_KEY` | Google Maps API key | Google Cloud Console |
| `EMAILJS_SERVICE_ID` | EmailJS service ID | EmailJS Dashboard |
| `EMAILJS_TEMPLATE_ID` | EmailJS template ID | EmailJS Dashboard |
| `EMAILJS_PUBLIC_KEY` | EmailJS public key | EmailJS Dashboard |

### Create Cloudflare API Token

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/profile/api-tokens)
2. Click **Create Token**
3. Use **Edit Cloudflare Workers** template
4. Add **Cloudflare Pages** permissions:
   - Account > Cloudflare Pages > Edit
5. Click **Continue to summary** > **Create Token**
6. Copy the token and add it as `CLOUDFLARE_API_TOKEN` in GitHub secrets

### Enable GitHub Actions

The workflow file is already created at `.github/workflows/deploy.yml`. It will:

1. Deploy the Worker backend on every push to `master`/`main`
2. Build and deploy the frontend to Pages
3. Show deployment summary

Push to trigger:

```bash
git add .
git commit -m "Configure Cloudflare deployment"
git push origin master
```

---

## Troubleshooting

### Issue: "Database not found"

**Solution**: Ensure the database ID in `wrangler.toml` matches the one created with `wrangler d1 create wedding-db`.

### Issue: "Authentication required" when accessing API

**Solution**:
1. Verify the admin password hash is set: `wrangler secret list`
2. If not present, set it: `wrangler secret put ADMIN_PASSWORD_HASH`

### Issue: CORS errors in browser console

**Solution**:
1. Check the `corsHeaders` in `workers/api/src/index.js`
2. Ensure `Access-Control-Allow-Origin` matches your frontend domain
3. Redeploy the worker: `wrangler deploy --env production`

### Issue: "Too many login attempts"

**Solution**: Rate limiting is active. Wait 15 minutes or clear rate limits from D1:

```bash
wrangler d1 execute wedding-db --command="DELETE FROM rate_limits WHERE identifier LIKE 'login:%'"
```

### Issue: Build fails with "NODE_OPTIONS" error

**Solution**: This is Windows-specific. On Linux/Mac, update `package.json`:

```json
"scripts": {
  "start": "react-scripts start",
  "build": "react-scripts build",
  "test": "react-scripts test",
  "eject": "react-scripts eject"
}
```

### Issue: Pages deployment shows blank page

**Solution**:
1. Check browser console for errors
2. Verify environment variables are set in Cloudflare Pages dashboard
3. Ensure `PUBLIC_URL` is correct in `.env.production`
4. Rebuild and redeploy

### Issue: Worker returns 500 errors

**Solution**:
1. Check Worker logs: `wrangler tail wedding-api --env production`
2. Look for error messages
3. Common causes:
   - Database ID mismatch
   - Missing secrets
   - Syntax errors in Worker code

---

## Maintenance

### Update Guest List

```bash
# Access admin dashboard
open https://rushel.me/admin

# Or use API directly
curl -X POST https://api.rushel.me/api/guests \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "JOHN",
    "guestData": {
      "name": "John Doe",
      "ceremonies": ["christian", "hindu"]
    }
  }'
```

### View Database Contents

```bash
# List all guests
wrangler d1 execute wedding-db --command="SELECT * FROM guests"

# List all sessions
wrangler d1 execute wedding-db --command="SELECT token, datetime(expires_at/1000, 'unixepoch') as expires FROM sessions"
```

### Clean Up Expired Sessions

```bash
wrangler d1 execute wedding-db --command="DELETE FROM sessions WHERE expires_at < (strftime('%s', 'now') * 1000)"
```

### Monitor Worker Performance

```bash
# View real-time logs
wrangler tail wedding-api --env production

# View analytics in dashboard
# Go to Workers & Pages > wedding-api > Analytics
```

### Backup Database

```bash
# Export all data
wrangler d1 export wedding-db --output=backup.sql

# Import data
wrangler d1 execute wedding-db --file=backup.sql
```

### Update Worker Code

```bash
cd workers/api

# Make your changes to src/index.js

# Deploy
wrangler deploy --env production
```

### Update Frontend

```bash
# Make your changes to React components

# Build
npm run build

# Deploy via Wrangler
wrangler pages deploy build --project-name=wedding-website

# Or push to GitHub to trigger automatic deployment
git add .
git commit -m "Update frontend"
git push origin master
```

---

## Cost Estimation

With Cloudflare's free tier:

- **Workers**: 100,000 requests/day (free)
- **D1**: 5 GB storage, 5 million reads/day (free)
- **Pages**: Unlimited requests, 500 builds/month (free)

**Expected costs**: **$0/month** for typical wedding website traffic

---

## Security Checklist

- [x] HTTPS enabled (automatic with Cloudflare)
- [x] CORS configured for specific domain
- [x] Rate limiting on login attempts
- [x] Session tokens expire after 24 hours
- [x] Admin password hashed with SHA-256
- [x] Input validation on all endpoints
- [x] SQL injection prevention (parameterized queries)
- [x] Security headers (CSP, X-Frame-Options, etc.)

---

## Support

For issues or questions:

1. Check the [Troubleshooting](#troubleshooting) section
2. Review Cloudflare documentation:
   - [Workers](https://developers.cloudflare.com/workers/)
   - [D1](https://developers.cloudflare.com/d1/)
   - [Pages](https://developers.cloudflare.com/pages/)
3. Check Worker logs: `wrangler tail wedding-api --env production`

---

## Quick Reference

### Useful Commands

```bash
# Deploy Worker
cd workers/api && wrangler deploy --env production

# Deploy Frontend (via Wrangler)
wrangler pages deploy build --project-name=wedding-website

# View Worker logs
wrangler tail wedding-api --env production

# Query database
wrangler d1 execute wedding-db --command="SELECT * FROM guests"

# Set a secret
wrangler secret put SECRET_NAME

# List secrets
wrangler secret list
```

### Important URLs

- **Frontend**: https://rushel.me
- **API**: https://api.rushel.me/api
- **Admin Dashboard**: https://rushel.me/admin
- **Cloudflare Dashboard**: https://dash.cloudflare.com
- **Worker Metrics**: https://dash.cloudflare.com > Workers & Pages > wedding-api

---

**Congratulations!** Your wedding website is now deployed and ready to use. 🎉

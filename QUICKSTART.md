yes# Quick Start Guide - Cloudflare Deployment

Get your wedding website deployed to **rushel.me** in under 30 minutes!

## Prerequisites Checklist

- [ ] Cloudflare account (free tier OK)
- [ ] Domain **rushel.me** added to Cloudflare
- [ ] Node.js 18+ installed
- [ ] Git installed

## Step 1: Install Wrangler CLI (2 minutes)

```bash
npm install -g wrangler
wrangler login
```

This opens your browser to authenticate with Cloudflare.

## Step 2: Deploy Backend Worker (10 minutes)

```bash
cd workers/api

# Install dependencies
npm install

# Create D1 database
wrangler d1 create wedding-db

# Copy the database_id from output, then edit wrangler.toml
# Replace REPLACE_WITH_YOUR_D1_DATABASE_ID with your actual database_id

# Initialize database with tables and default guests
wrangler d1 execute wedding-db --file=./schema.sql

# Generate and set admin password
node -e "const crypto = require('crypto'); console.log(crypto.createHash('sha256').update('YourPassword123!').digest('hex'));"
# Copy the hash output

wrangler secret put ADMIN_PASSWORD_HASH
# Paste the hash when prompted

# Deploy to production
wrangler deploy --env production

cd ../..
```

## Step 3: Configure Custom Domain for Worker (5 minutes)

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **Workers & Pages**
3. Click **wedding-api** worker
4. Go to **Settings** > **Triggers** > **Custom Domains**
5. Click **Add Custom Domain**
6. Enter: `api.rushel.me`
7. Click **Add Custom Domain**

Wait 1-2 minutes for DNS to propagate.

## Step 4: Test Backend API (1 minute)

```bash
curl https://api.rushel.me/api/validate/TEST
```

Should return:
```json
{"valid":true,"guest":{"name":"Test User","ceremonies":["hindu"]},"ceremonies":["hindu"]}
```

## Step 5: Deploy Frontend to Pages (10 minutes)

### Option A: Via Cloudflare Dashboard (Recommended)

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **Workers & Pages** > **Pages**
3. Click **Create application** > **Connect to Git**
4. Select your GitHub repository
5. Configure:
   - **Build command**: `npm run build`
   - **Build output directory**: `build`
6. Add environment variables:
   ```
   REACT_APP_API_URL=https://api.rushel.me/api
   REACT_APP_GOOGLE_MAPS_API_KEY=your_key
   REACT_APP_EMAILJS_SERVICE_ID=your_id
   REACT_APP_EMAILJS_TEMPLATE_ID=your_template_id
   REACT_APP_EMAILJS_PUBLIC_KEY=your_key
   NODE_ENV=production
   ```
7. Click **Save and Deploy**

### Option B: Manual Upload

```bash
# Install dependencies
npm install

# Build the app
npm run build

# Deploy to Pages
wrangler pages project create wedding-website
wrangler pages deploy build --project-name=wedding-website
```

## Step 6: Configure Custom Domain for Pages (2 minutes)

1. In **Workers & Pages**, click **wedding-website**
2. Go to **Custom domains**
3. Click **Set up a custom domain**
4. Enter: `rushel.me` and activate
5. Repeat for `www.rushel.me`

Wait 1-2 minutes for DNS to propagate.

## Step 7: Test Your Website (5 minutes)

1. Open https://rushel.me
2. Enter access code: `TEST`
3. Verify Hindu ceremony page loads
4. Visit admin dashboard: https://rushel.me/admin
5. Login with your admin password
6. Try managing guests

## Done!

Your wedding website is now live at **https://rushel.me** with API at **https://api.rushel.me**!

## What's Next?

### Update Environment Variables

Create `.env.production.local` with your actual API keys:

```bash
REACT_APP_API_URL=https://api.rushel.me/api
REACT_APP_GOOGLE_MAPS_API_KEY=your_actual_google_maps_key
REACT_APP_EMAILJS_SERVICE_ID=your_actual_emailjs_service_id
REACT_APP_EMAILJS_TEMPLATE_ID=your_actual_emailjs_template_id
REACT_APP_EMAILJS_PUBLIC_KEY=your_actual_emailjs_public_key
NODE_ENV=production
```

Then rebuild and redeploy:
```bash
npm run build
wrangler pages deploy build --project-name=wedding-website
```

### Enable GitHub Actions (Optional)

1. Go to GitHub repository **Settings** > **Secrets and variables** > **Actions**
2. Add secrets:
   - `CLOUDFLARE_API_TOKEN` - [Create here](https://dash.cloudflare.com/profile/api-tokens)
   - `CLOUDFLARE_ACCOUNT_ID` - Found in Workers & Pages overview
   - `GOOGLE_MAPS_API_KEY`
   - `EMAILJS_SERVICE_ID`
   - `EMAILJS_TEMPLATE_ID`
   - `EMAILJS_PUBLIC_KEY`

Now every push to `master` will auto-deploy!

### Manage Guests

Use the admin dashboard at https://rushel.me/admin to:
- Add new guests
- Generate access codes
- Assign ceremony permissions
- Delete guests

### Monitor Performance

```bash
# View real-time logs
wrangler tail wedding-api --env production

# View analytics in dashboard
# Go to Workers & Pages > wedding-api > Analytics
```

## Troubleshooting

### API returns 404 or 500
- Check Worker deployment status
- Verify database ID in `wrangler.toml`
- Check logs: `wrangler tail wedding-api --env production`

### CORS errors in browser
- Verify custom domain is configured: `api.rushel.me`
- Check Worker CORS headers match your domain
- Redeploy worker if needed

### Build fails
- Check Node.js version: `node -v` (should be 18+)
- Clear cache: `rm -rf node_modules package-lock.json && npm install`
- Check for build errors in output

### Can't login to admin
- Verify password hash is set: `wrangler secret list`
- Try resetting: `wrangler secret put ADMIN_PASSWORD_HASH`
- Check browser console for errors

## Need More Help?

See the complete [DEPLOYMENT.md](DEPLOYMENT.md) guide for:
- Detailed troubleshooting
- Database maintenance
- Security best practices
- Cost estimation
- Advanced configuration

## Useful Commands

```bash
# Deploy everything quickly
./deploy.sh

# Build frontend only
./build.sh

# View Worker logs
wrangler tail wedding-api --env production

# Query database
wrangler d1 execute wedding-db --command="SELECT * FROM guests"

# Backup database
wrangler d1 export wedding-db --output=backup.sql
```

---

**Congratulations!** You're all set! 🎉

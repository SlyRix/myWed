# Command Reference - Cloudflare Deployment

Quick reference of all commands needed to deploy your wedding website.

---

## Initial Setup Commands

### 1. Install Wrangler CLI
```bash
npm install -g wrangler
```

### 2. Login to Cloudflare
```bash
wrangler login
```

### 3. Verify Authentication
```bash
wrangler whoami
```

---

## Backend Deployment Commands

### Navigate to Worker Directory
```bash
cd workers/api
```

### Install Dependencies
```bash
npm install
```

### Create D1 Database
```bash
wrangler d1 create wedding-db
```

**Important**: Copy the `database_id` from the output and update it in `workers/api/wrangler.toml`:
- Replace `REPLACE_WITH_YOUR_D1_DATABASE_ID` on line 15
- Replace `REPLACE_WITH_YOUR_D1_DATABASE_ID` on line 33

### Initialize Database with Schema
```bash
wrangler d1 execute wedding-db --file=./schema.sql
```

### Verify Database Contents
```bash
wrangler d1 execute wedding-db --command="SELECT * FROM guests"
```

### Generate Admin Password Hash
```bash
# Replace 'YourSecurePassword123' with your actual password
node -e "const crypto = require('crypto'); console.log(crypto.createHash('sha256').update('YourSecurePassword123').digest('hex'));"
```

**Copy the hash output**, then:

### Set Admin Password Secret
```bash
wrangler secret put ADMIN_PASSWORD_HASH
# Paste the hash when prompted
```

### Deploy Worker to Production
```bash
wrangler deploy --env production
```

### Test Worker Deployment
```bash
# Test the worker URL (use your actual worker URL from deployment output)
curl https://wedding-api.your-account.workers.dev/api/validate/TEST

# Should return: {"valid":true,"guest":{"name":"Test User",...}}
```

### Return to Project Root
```bash
cd ../..
```

---

## Configure Worker Custom Domain (Cloudflare Dashboard)

**Steps**:
1. Go to https://dash.cloudflare.com
2. Navigate to **Workers & Pages**
3. Click on **wedding-api**
4. Go to **Settings** → **Triggers** → **Custom Domains**
5. Click **Add Custom Domain**
6. Enter: `api.rushel.me`
7. Click **Add Custom Domain**
8. Wait 1-2 minutes for DNS propagation

**Verify**:
```bash
curl https://api.rushel.me/api/validate/TEST
```

---

## Frontend Deployment Commands

### Create Production Environment File
```bash
# Create .env.production.local with your actual values
cat > .env.production.local << 'EOF'
REACT_APP_API_URL=https://api.rushel.me/api
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
REACT_APP_EMAILJS_SERVICE_ID=your_emailjs_service_id
REACT_APP_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
REACT_APP_EMAILJS_PUBLIC_KEY=your_emailjs_public_key
NODE_ENV=production
EOF
```

**Or manually edit the file and replace the placeholders.**

### Install Frontend Dependencies
```bash
npm install
```

### Build React Application
```bash
npm run build
```

**Or use the build script:**
```bash
./build.sh
```

### Create Cloudflare Pages Project
```bash
wrangler pages project create wedding-website
```

### Deploy to Cloudflare Pages
```bash
wrangler pages deploy build --project-name=wedding-website
```

---

## Configure Pages Custom Domain (Cloudflare Dashboard)

**Steps**:
1. Go to https://dash.cloudflare.com
2. Navigate to **Workers & Pages**
3. Click on **wedding-website**
4. Go to **Custom domains**
5. Click **Set up a custom domain**
6. Enter: `rushel.me`
7. Click **Activate domain**
8. Repeat for `www.rushel.me`
9. Wait 1-2 minutes for DNS propagation

**Verify**:
```bash
curl -I https://rushel.me
# Should return 200 OK
```

---

## Quick Deploy (After Initial Setup)

### Deploy Everything
```bash
./deploy.sh
# Choose option 3 (Both Backend and Frontend)
```

### Deploy Backend Only
```bash
cd workers/api
wrangler deploy --env production
cd ../..
```

### Deploy Frontend Only
```bash
npm run build
wrangler pages deploy build --project-name=wedding-website
```

---

## Database Commands

### List All Guests
```bash
wrangler d1 execute wedding-db --command="SELECT * FROM guests"
```

### Add a Guest Manually (via SQL)
```bash
wrangler d1 execute wedding-db --command="INSERT INTO guests (code, name, ceremonies) VALUES ('JOHN', 'John Doe', '[\"christian\",\"hindu\"]')"
```

### Update a Guest
```bash
wrangler d1 execute wedding-db --command="UPDATE guests SET name='Jane Doe' WHERE code='JOHN'"
```

### Delete a Guest
```bash
wrangler d1 execute wedding-db --command="DELETE FROM guests WHERE code='JOHN'"
```

### List All Active Sessions
```bash
wrangler d1 execute wedding-db --command="SELECT token, datetime(expires_at/1000, 'unixepoch') as expires FROM sessions"
```

### Clean Up Expired Sessions
```bash
wrangler d1 execute wedding-db --command="DELETE FROM sessions WHERE expires_at < (strftime('%s', 'now') * 1000)"
```

### Clear Rate Limits
```bash
wrangler d1 execute wedding-db --command="DELETE FROM rate_limits"
```

### Backup Database
```bash
wrangler d1 export wedding-db --output=backup-$(date +%Y%m%d).sql
```

### Restore Database
```bash
wrangler d1 execute wedding-db --file=backup-20250101.sql
```

---

## API Testing Commands

### Test Public Endpoint (Validate Code)
```bash
curl https://api.rushel.me/api/validate/TEST
```

### Test Admin Login
```bash
curl -X POST https://api.rushel.me/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"password":"YourAdminPassword"}'
```

**Save the token from the response**, then:

### Test Get All Guests (Protected)
```bash
TOKEN="paste_your_token_here"

curl https://api.rushel.me/api/guests \
  -H "Authorization: Bearer $TOKEN"
```

### Test Add Guest (Protected)
```bash
TOKEN="paste_your_token_here"

curl -X POST https://api.rushel.me/api/guests \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "JANE",
    "guestData": {
      "name": "Jane Smith",
      "ceremonies": ["christian"]
    }
  }'
```

### Test Delete Guest (Protected)
```bash
TOKEN="paste_your_token_here"

curl -X DELETE https://api.rushel.me/api/guests/JANE \
  -H "Authorization: Bearer $TOKEN"
```

### Test Generate Code (Protected)
```bash
TOKEN="paste_your_token_here"

curl -X POST https://api.rushel.me/api/generate-code \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Bob Johnson"}'
```

---

## Monitoring Commands

### View Worker Logs (Real-time)
```bash
wrangler tail wedding-api --env production
```

### View Worker Logs with Filter
```bash
wrangler tail wedding-api --env production --format=pretty
```

### List All Secrets
```bash
wrangler secret list
```

### Delete a Secret
```bash
wrangler secret delete ADMIN_PASSWORD_HASH
```

---

## GitHub Actions Commands

### Trigger Manual Deployment
```bash
# Via GitHub UI:
# 1. Go to your repository
# 2. Click "Actions" tab
# 3. Select "Deploy to Cloudflare" workflow
# 4. Click "Run workflow"

# Or via git push:
git add .
git commit -m "Deploy changes"
git push origin master
```

---

## Troubleshooting Commands

### Check Wrangler Version
```bash
wrangler --version
```

### Update Wrangler
```bash
npm update -g wrangler
```

### Check Node Version
```bash
node -v
# Should be 18 or higher
```

### Clear npm Cache
```bash
npm cache clean --force
```

### Reinstall Dependencies
```bash
rm -rf node_modules package-lock.json
npm install
```

### Check DNS Records
```bash
# For api.rushel.me
nslookup api.rushel.me

# For rushel.me
nslookup rushel.me
```

### Test HTTPS Redirect
```bash
curl -I http://rushel.me
# Should show 301/302 redirect to https://rushel.me
```

### Check Worker Status
```bash
curl -I https://api.rushel.me/api/validate/TEST
```

### Validate Build Output
```bash
ls -lh build/
ls -lh build/static/js/
ls -lh build/static/css/
```

---

## Development Commands

### Run Worker Locally
```bash
cd workers/api
wrangler dev
# Test at http://localhost:8787
```

### Run Frontend Locally
```bash
npm start
# Opens at http://localhost:3000
```

### Test Build Locally
```bash
npm run build
npx serve -s build
# Opens at http://localhost:3000
```

---

## Useful One-Liners

### Get Admin Token and Test API
```bash
TOKEN=$(curl -s -X POST https://api.rushel.me/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"password":"YourPassword"}' | grep -o '"token":"[^"]*' | cut -d'"' -f4) && \
echo "Token: $TOKEN" && \
curl https://api.rushel.me/api/guests -H "Authorization: Bearer $TOKEN"
```

### Count Total Guests
```bash
wrangler d1 execute wedding-db --command="SELECT COUNT(*) as total FROM guests"
```

### List Guests with Christian Ceremony Access
```bash
wrangler d1 execute wedding-db --command="SELECT code, name FROM guests WHERE ceremonies LIKE '%christian%'"
```

### Check Database Size
```bash
wrangler d1 execute wedding-db --command="SELECT page_count * page_size as size FROM pragma_page_count(), pragma_page_size()"
```

### Complete Fresh Deploy
```bash
cd workers/api && \
wrangler deploy --env production && \
cd ../.. && \
npm run build && \
wrangler pages deploy build --project-name=wedding-website && \
echo "Deployment complete!"
```

---

## Emergency Commands

### Rollback Worker Deployment
```bash
cd workers/api
wrangler rollback
```

### Disable Worker
```bash
# Go to Cloudflare Dashboard > Workers & Pages > wedding-api > Settings
# Toggle "Enabled" to OFF
```

### Delete All Sessions (Force Logout All)
```bash
wrangler d1 execute wedding-db --command="DELETE FROM sessions"
```

### Reset Database to Default State
```bash
wrangler d1 execute wedding-db --command="DELETE FROM guests; DELETE FROM sessions; DELETE FROM rate_limits;"
wrangler d1 execute wedding-db --file=./schema.sql
```

---

## Daily Operations

### Morning Check
```bash
# Check for errors
wrangler tail wedding-api --env production | grep -i error

# Check guest count
wrangler d1 execute wedding-db --command="SELECT COUNT(*) FROM guests"
```

### Add New Guest via Admin Dashboard
1. Open https://rushel.me/admin
2. Login with admin password
3. Click "Generate Code"
4. Enter guest name
5. Select ceremonies
6. Click "Save"
7. Share code with guest

### Quick Health Check
```bash
echo "Testing API..." && \
curl -s https://api.rushel.me/api/validate/TEST && \
echo "" && \
echo "Testing Frontend..." && \
curl -I https://rushel.me 2>&1 | grep "200 OK" && \
echo "All systems operational!"
```

---

## Cheat Sheet Summary

| Task | Command |
|------|---------|
| Deploy worker | `cd workers/api && wrangler deploy --env production` |
| Deploy frontend | `npm run build && wrangler pages deploy build --project-name=wedding-website` |
| View logs | `wrangler tail wedding-api --env production` |
| List guests | `wrangler d1 execute wedding-db --command="SELECT * FROM guests"` |
| Backup DB | `wrangler d1 export wedding-db --output=backup.sql` |
| Test API | `curl https://api.rushel.me/api/validate/TEST` |
| Quick deploy | `./deploy.sh` |

---

**Tip**: Bookmark this file for quick reference during deployment and maintenance!

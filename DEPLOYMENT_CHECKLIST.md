# Deployment Checklist - rushel.me

Use this checklist to ensure a smooth deployment process.

---

## Pre-Deployment Checklist

### Prerequisites
- [ ] Cloudflare account created
- [ ] Domain **rushel.me** added to Cloudflare
- [ ] Domain nameservers pointing to Cloudflare
- [ ] Node.js 18+ installed (`node -v`)
- [ ] npm installed (`npm -v`)
- [ ] Git installed (`git --version`)
- [ ] Wrangler CLI installed (`npm install -g wrangler`)

### API Keys & Credentials
- [ ] Google Maps API key obtained
- [ ] EmailJS account created
- [ ] EmailJS service ID, template ID, and public key obtained
- [ ] Admin password chosen (strong, secure)

---

## Backend Deployment Checklist

### 1. Wrangler Setup
- [ ] Logged in: `wrangler login`
- [ ] Verified: `wrangler whoami`
- [ ] Account ID noted from dashboard

### 2. D1 Database
- [ ] D1 database created: `cd workers/api && wrangler d1 create wedding-db`
- [ ] Database ID copied from output
- [ ] Database ID added to `workers/api/wrangler.toml` (both main and production sections)
- [ ] Schema executed: `wrangler d1 execute wedding-db --file=./schema.sql`
- [ ] Default guests inserted (verify with: `wrangler d1 execute wedding-db --command="SELECT * FROM guests"`)

### 3. Worker Configuration
- [ ] Admin password hash generated:
  ```bash
  node -e "const crypto = require('crypto'); console.log(crypto.createHash('sha256').update('YOUR_PASSWORD').digest('hex'));"
  ```
- [ ] Password hash set as secret: `wrangler secret put ADMIN_PASSWORD_HASH`
- [ ] `workers/api/wrangler.toml` reviewed and correct:
  - [ ] Database ID is correct
  - [ ] `FRONTEND_URL` is set to `https://rushel.me`
  - [ ] Production routes configured for `api.rushel.me`

### 4. Worker Deployment
- [ ] Dependencies installed: `npm install` (in `workers/api/`)
- [ ] Worker deployed: `wrangler deploy --env production`
- [ ] Deployment URL noted (e.g., `wedding-api.your-account.workers.dev`)
- [ ] Test endpoint works:
  ```bash
  curl https://wedding-api.your-account.workers.dev/api/validate/TEST
  ```

### 5. Worker Custom Domain
- [ ] Cloudflare Dashboard → Workers & Pages → wedding-api opened
- [ ] Settings → Triggers → Custom Domains → Add Custom Domain
- [ ] Domain `api.rushel.me` added
- [ ] DNS record created automatically (verify in DNS section)
- [ ] SSL certificate provisioned (shows green checkmark)
- [ ] Test custom domain works:
  ```bash
  curl https://api.rushel.me/api/validate/TEST
  ```

### 6. Worker Testing
- [ ] Public endpoint works: `curl https://api.rushel.me/api/validate/TEST`
- [ ] Returns valid JSON with guest data
- [ ] Login endpoint works:
  ```bash
  curl -X POST https://api.rushel.me/api/admin/login \
    -H "Content-Type: application/json" \
    -d '{"password":"your_password"}'
  ```
- [ ] Returns session token
- [ ] Protected endpoints require authentication (test without token → 401)
- [ ] Rate limiting works (test 6+ rapid login attempts → 429)

---

## Frontend Deployment Checklist

### 1. Environment Configuration
- [ ] `.env.production.local` created with actual values:
  ```
  REACT_APP_API_URL=https://api.rushel.me/api
  REACT_APP_GOOGLE_MAPS_API_KEY=your_actual_key
  REACT_APP_EMAILJS_SERVICE_ID=your_actual_id
  REACT_APP_EMAILJS_TEMPLATE_ID=your_actual_template_id
  REACT_APP_EMAILJS_PUBLIC_KEY=your_actual_key
  NODE_ENV=production
  ```
- [ ] File is gitignored (verify: `git status` should not show it)

### 2. Build Process
- [ ] Dependencies installed: `npm install` (in project root)
- [ ] Build succeeds: `npm run build` or `./build.sh`
- [ ] `build/` directory created
- [ ] Build contains `index.html` and static assets
- [ ] No errors in build output

### 3. Pages Deployment

#### Option A: Via Cloudflare Dashboard (Recommended)
- [ ] Dashboard → Workers & Pages → Pages → Create application
- [ ] Connect to Git selected
- [ ] GitHub repository connected
- [ ] Build configuration set:
  - [ ] Build command: `npm run build`
  - [ ] Build output directory: `build`
  - [ ] Root directory: `/`
- [ ] Environment variables added (all REACT_APP_* variables)
- [ ] Save and Deploy clicked
- [ ] First deployment successful
- [ ] Deployment URL noted (e.g., `wedding-website.pages.dev`)

#### Option B: Via Wrangler CLI
- [ ] Pages project created: `wrangler pages project create wedding-website`
- [ ] Build deployed: `wrangler pages deploy build --project-name=wedding-website`
- [ ] Deployment successful
- [ ] Deployment URL noted

### 4. Pages Custom Domain
- [ ] Dashboard → Workers & Pages → wedding-website → Custom domains
- [ ] Custom domain added: `rushel.me`
- [ ] Domain activated (shows green checkmark)
- [ ] WWW subdomain added: `www.rushel.me`
- [ ] WWW subdomain activated
- [ ] DNS records verified in DNS section:
  - [ ] CNAME for `rushel.me` (or A/AAAA records)
  - [ ] CNAME for `www.rushel.me`
  - [ ] Both proxied through Cloudflare (orange cloud)

### 5. Frontend Testing
- [ ] Site loads: Open https://rushel.me
- [ ] Welcome splash displays correctly
- [ ] Access code entry works
- [ ] Enter test code `TEST` → Hindu ceremony access granted
- [ ] Navigation works (all links functional)
- [ ] Images load correctly
- [ ] No console errors (open browser DevTools)
- [ ] HTTPS is active (green padlock in browser)
- [ ] Mobile responsive (test on phone or DevTools mobile view)

---

## Admin Dashboard Testing

- [ ] Admin page loads: https://rushel.me/admin
- [ ] Login form displays
- [ ] Login with admin password works
- [ ] Dashboard displays after login
- [ ] Guest list loads and displays
- [ ] Can add a new guest:
  - [ ] Generate code button works
  - [ ] Name input accepts text
  - [ ] Ceremony checkboxes work
  - [ ] Save button adds guest
  - [ ] New guest appears in list
- [ ] Can edit existing guest:
  - [ ] Edit button opens form
  - [ ] Can modify name and ceremonies
  - [ ] Save updates the guest
- [ ] Can delete guest:
  - [ ] Delete button shows confirmation
  - [ ] Confirm removes guest from list
- [ ] QR code generation works:
  - [ ] Select a guest
  - [ ] Generate QR code button works
  - [ ] QR code displays correctly
  - [ ] QR code scans to correct URL with access code

---

## GitHub Actions Setup (Optional)

### 1. Repository Configuration
- [ ] GitHub repository exists
- [ ] Code pushed to GitHub
- [ ] Settings → Secrets and variables → Actions opened

### 2. Required Secrets
- [ ] `CLOUDFLARE_API_TOKEN` added:
  - [ ] Token created at https://dash.cloudflare.com/profile/api-tokens
  - [ ] "Edit Cloudflare Workers" template used
  - [ ] Cloudflare Pages permissions added
  - [ ] Token copied and added to GitHub secrets
- [ ] `CLOUDFLARE_ACCOUNT_ID` added (from Workers & Pages overview)
- [ ] `GOOGLE_MAPS_API_KEY` added
- [ ] `EMAILJS_SERVICE_ID` added
- [ ] `EMAILJS_TEMPLATE_ID` added
- [ ] `EMAILJS_PUBLIC_KEY` added

### 3. Workflow Testing
- [ ] `.github/workflows/deploy.yml` exists
- [ ] Push code to master: `git push origin master`
- [ ] GitHub Actions tab shows workflow running
- [ ] Backend deployment step succeeds
- [ ] Frontend deployment step succeeds
- [ ] No errors in workflow logs
- [ ] Changes are live on rushel.me

---

## Post-Deployment Checklist

### Security & Performance
- [ ] HTTPS works on all pages
- [ ] HTTP redirects to HTTPS
- [ ] WWW redirects to non-WWW (or vice versa, as configured)
- [ ] Security headers present (check with browser DevTools → Network)
- [ ] CORS is properly configured (no CORS errors in console)
- [ ] Rate limiting works (test rapid requests)
- [ ] Session expires after 24 hours (test by waiting or checking database)

### Functionality Testing
- [ ] All access codes work (test with SIVA, RUSH, TEST)
- [ ] Access codes are case-insensitive (test with "test", "Test", "TEST")
- [ ] Christian ceremony page accessible to Christian guests
- [ ] Hindu ceremony page accessible to Hindu guests
- [ ] Both ceremonies accessible to guests with both permissions
- [ ] Invalid codes show error message
- [ ] Gallery works (if implemented)
- [ ] RSVP form works (if implemented)
- [ ] Contact form works with EmailJS
- [ ] Map loads with Google Maps API

### Admin Testing
- [ ] Admin login requires correct password
- [ ] Wrong password shows error
- [ ] Session persists across page reloads
- [ ] Logout works (if implemented)
- [ ] All CRUD operations work:
  - [ ] Create guest
  - [ ] Read guest list
  - [ ] Update guest
  - [ ] Delete guest
- [ ] Generated codes are unique
- [ ] Can manage 50+ guests without issues

### Monitoring Setup
- [ ] Cloudflare Analytics reviewed:
  - [ ] Dashboard → Workers & Pages → wedding-api → Analytics
  - [ ] Dashboard → Workers & Pages → wedding-website → Analytics
- [ ] Worker logs accessible: `wrangler tail wedding-api --env production`
- [ ] No errors in production logs

### Documentation
- [ ] Admin credentials stored securely (password manager)
- [ ] Cloudflare account credentials saved
- [ ] Database ID saved for reference
- [ ] GitHub repository URL noted
- [ ] Deployment URLs documented:
  - [ ] Frontend: https://rushel.me
  - [ ] API: https://api.rushel.me
  - [ ] Admin: https://rushel.me/admin

### Backup & Recovery
- [ ] Database backed up:
  ```bash
  wrangler d1 export wedding-db --output=backup-initial.sql
  ```
- [ ] Backup stored securely
- [ ] Recovery process tested (restore from backup to dev database)

---

## Final Verification

### Quick Test Script
Run these commands to verify everything:

```bash
# Test API health
curl https://api.rushel.me/api/validate/TEST

# Test login endpoint
curl -X POST https://api.rushel.me/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"password":"your_password"}'

# Check frontend loads
curl -I https://rushel.me

# Check HTTPS redirect
curl -I http://rushel.me
```

### Browser Test
1. Open https://rushel.me in incognito/private window
2. Clear cache and cookies
3. Test full user flow:
   - [ ] Enter access code
   - [ ] View ceremony details
   - [ ] Navigate all pages
   - [ ] Submit forms (if applicable)
4. Test admin flow:
   - [ ] Login as admin
   - [ ] Add test guest
   - [ ] Delete test guest
   - [ ] Logout

### Performance Check
- [ ] Lighthouse score > 90 (run in Chrome DevTools)
- [ ] Time to First Byte (TTFB) < 500ms
- [ ] First Contentful Paint (FCP) < 1.5s
- [ ] No JavaScript errors in production
- [ ] Mobile performance acceptable

---

## Issues & Troubleshooting

### Common Issues Encountered
- [ ] None (perfect deployment! 🎉)
- [ ] Issue: ________________
  - Solution: ________________
- [ ] Issue: ________________
  - Solution: ________________

### Support Resources Used
- [ ] DEPLOYMENT.md - Section: ________________
- [ ] QUICKSTART.md
- [ ] Cloudflare Docs - https://developers.cloudflare.com
- [ ] GitHub Issues
- [ ] Other: ________________

---

## Sign-Off

### Deployment Complete
- [ ] All backend checklist items completed
- [ ] All frontend checklist items completed
- [ ] All testing completed successfully
- [ ] Documentation updated
- [ ] Stakeholders notified

**Deployed By**: ________________
**Date**: ________________
**Version**: ________________
**Status**: 🚀 LIVE

---

## Maintenance Schedule

### Daily
- [ ] Check Cloudflare Analytics for errors
- [ ] Monitor Worker logs: `wrangler tail wedding-api --env production`

### Weekly
- [ ] Review guest list and access codes
- [ ] Check for suspicious login attempts (rate_limits table)
- [ ] Verify backups are current

### Monthly
- [ ] Backup database: `wrangler d1 export wedding-db --output=backup-YYYYMMDD.sql`
- [ ] Review and clean up expired sessions
- [ ] Update dependencies: `npm update`
- [ ] Check for Wrangler updates: `npm update -g wrangler`

### As Needed
- [ ] Add/remove guests via admin dashboard
- [ ] Update wedding details in content
- [ ] Deploy updates: `./deploy.sh`

---

**Next Steps After Deployment**:
1. Share the website URL with guests
2. Print QR codes for invitations
3. Test with real guest access codes
4. Monitor analytics and logs
5. Gather feedback and iterate

**Congratulations on your deployment!** 🎊

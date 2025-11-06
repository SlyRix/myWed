# Wedding Website CMS Deployment Guide

## Overview
This guide covers the complete deployment of the Content Management System (CMS) for your wedding website. The CMS allows non-technical users to edit page content including text, images, and timeline events without touching code.

## Features
- ✅ Edit ceremony pages (Christian, Hindu, Reception)
- ✅ Manage story timeline with dates, titles, descriptions, and images
- ✅ Update hero images for all pages
- ✅ Add/remove/reorder timeline events and rituals
- ✅ Edit text content for all sections
- ✅ Admin-only access with authentication
- ✅ Real-time preview of content changes

## Prerequisites
- Access to Cloudflare account with D1 database
- Wrangler CLI installed and authenticated
- Node.js installed (for building frontend)

---

## Step 1: Update Database Schema

Navigate to the workers/api directory:

```bash
cd workers/api
```

Apply the new schema (adds `page_content` table):

```bash
wrangler d1 execute wedding-db --file=./schema.sql
```

**Expected output:**
```
🌀 Executing on wedding-db (...)
🚣 Executed 6 commands in 0.XX seconds
```

Verify the table was created:

```bash
wrangler d1 execute wedding-db --command="SELECT name FROM sqlite_master WHERE type='table' AND name='page_content'"
```

---

## Step 2: Seed Initial Content

Load the default content for all pages:

```bash
wrangler d1 execute wedding-db --file=./content-seed.sql
```

**Expected output:**
```
🌀 Executing on wedding-db (...)
🚣 Executed 5 commands in 0.XX seconds
```

Verify content was seeded:

```bash
wrangler d1 execute wedding-db --command="SELECT page_id FROM page_content"
```

**Expected rows:**
- home
- christian-ceremony
- hindu-ceremony
- reception
- our-story

---

## Step 3: Deploy API (Backend)

From the workers/api directory:

```bash
# Test first (optional)
wrangler deploy --dry-run

# Deploy to production
wrangler deploy
```

**Expected output:**
```
Total Upload: XX.XX KiB / gzip: XX.XX KiB
Uploaded wedding-api (X.XX sec)
Published wedding-api (X.XX sec)
  https://api.rushel.me
```

Test the API endpoint:

```bash
curl https://api.rushel.me/api/content/christian-ceremony
```

You should get a JSON response with ceremony content.

---

## Step 4: Build and Deploy Frontend

Navigate back to project root:

```bash
cd ../..
```

Set Node options (for WSL/Linux):

```bash
export NODE_OPTIONS=--openssl-legacy-provider
```

Build the frontend:

```bash
npm run build
```

**Expected output:**
```
Creating an optimized production build...
Compiled successfully.

File sizes after gzip:
  ...
```

Deploy to Cloudflare Pages:

```bash
wrangler pages deploy build --project-name=wedding-website
```

**Or use the automated script:**

```bash
./build.sh
./deploy.sh
# Select "frontend" or "both"
```

---

## Step 5: Test the CMS

### 5.1 Test Frontend Locally (Optional)

```bash
export NODE_OPTIONS=--openssl-legacy-provider
npm start
```

Navigate to `http://localhost:3000`

### 5.2 Access Admin Dashboard

1. Go to `https://rushel.me/admin` (or `http://localhost:3000/admin`)
2. Login with your admin password
3. You should see 4 tabs: **Guest List**, **Gifts**, **Content**, **QR Codes**

### 5.3 Test Content Editor

1. Click the **"Content"** tab
2. Select a page from the dropdown (e.g., "Christian Ceremony")
3. You should see:
   - Hero Image field with image preview
   - Timeline Events section with:
     - Add Event button
     - Existing events with edit/delete/reorder buttons
   - Save Changes button at the top

### 5.4 Edit Content

**Test editing a timeline event:**

1. Find an existing event (e.g., "Guest Arrival")
2. Change the time from "13:30" to "14:00"
3. Change the title to "Guests Arrive"
4. Click **"Save Changes"**
5. Wait for success message: "Content saved successfully!"

### 5.5 Verify Changes on Live Site

1. Navigate to the Christian Ceremony page
2. Check the timeline - you should see your updated event
3. Refresh the page to confirm changes persist

---

## How to Use the CMS (For Your Fiancée)

### Accessing the Editor

1. Go to `https://rushel.me/admin`
2. Enter admin password
3. Click the "Content" tab

### Editing Pages

**Select a Page:**
- Use the dropdown menu to choose which page to edit:
  - Christian Ceremony
  - Hindu Ceremony
  - Reception
  - Our Story
  - Home Page

### Editing Hero Images

1. Find the "Hero Image" field
2. Enter the image path (e.g., `/images/new-hero.jpg`)
3. Upload your image to `public/images/` folder first
4. The preview will show below the input field

### Managing Timeline Events

**Add a New Event:**
1. Click the "Add Event" button
2. Fill in Time, Title, and Description
3. Click "Save Changes"

**Edit an Event:**
1. Change any field (time, title, description)
2. Click "Save Changes"

**Reorder Events:**
1. Use ⬆️ and ⬇️ buttons to move events up or down
2. Click "Save Changes"

**Delete an Event:**
1. Click the 🗑️ (trash) icon
2. Click "Save Changes"

### Managing Story Timeline

For the "Our Story" page:

1. Select "Our Story" from dropdown
2. Each milestone has:
   - Date (e.g., "January 2020")
   - Title (e.g., "First Met Online")
   - Description
   - Image path
3. Add/edit/delete/reorder milestones same as timeline events

### Hindu Ceremony Rituals

For Hindu Ceremony, there's an extra section called "Ritual Cards":

1. Select "Hindu Ceremony" from dropdown
2. Scroll down to "Ritual Cards" section
3. Each ritual has Title and Description
4. Add/edit/delete rituals as needed

---

## Troubleshooting

### Database Not Updating

**Check if table exists:**
```bash
cd workers/api
wrangler d1 execute wedding-db --command="SELECT * FROM page_content"
```

**If empty, re-run seed:**
```bash
wrangler d1 execute wedding-db --file=./content-seed.sql
```

### API Not Responding

**Check deployment status:**
```bash
cd workers/api
wrangler deployments list
```

**Check logs:**
```bash
wrangler tail
```

**Test endpoint:**
```bash
curl https://api.rushel.me/api/content/home
```

### Frontend Not Showing Changes

**Clear browser cache:**
- Hard refresh: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)

**Check API URL:**
- Verify `.env.production` has: `REACT_APP_API_URL=https://api.rushel.me/api`

**Rebuild and redeploy:**
```bash
export NODE_OPTIONS=--openssl-legacy-provider
npm run build
wrangler pages deploy build --project-name=wedding-website
```

### Login Issues

**Verify admin password hash is set:**
```bash
cd workers/api
wrangler secret list
```

Should show `ADMIN_PASSWORD_HASH`.

**If missing, set it:**
```bash
# Generate hash
node -e "const crypto = require('crypto'); console.log(crypto.createHash('sha256').update('your_password').digest('hex'));"

# Set secret
wrangler secret put ADMIN_PASSWORD_HASH
# Paste the hash when prompted
```

### Images Not Loading

**Verify image path:**
- Images should be in `public/images/` folder
- Use paths like `/images/your-image.jpg` (with leading slash)
- File names are case-sensitive

**Upload images:**
```bash
# Copy images to public folder
cp /path/to/your/image.jpg public/images/
```

**Rebuild and redeploy after adding new images:**
```bash
npm run build
wrangler pages deploy build --project-name=wedding-website
```

---

## Advanced Features

### Image Upload (Future Enhancement)

Currently, images are uploaded manually to the `public/images/` folder and referenced by path. To add direct image upload:

1. Set up Cloudflare Images or R2 bucket
2. Add upload component to admin dashboard
3. Update API to handle file uploads
4. Modify editor to show upload button

### Multilingual Content

To add multilingual CMS support:

1. Extend database schema to support multiple languages per page
2. Add language selector to editor
3. Update API to store/retrieve language-specific content

### Version History

To track content changes over time:

1. Add `page_content_history` table
2. Store snapshots on each save
3. Add "View History" and "Restore Version" features

---

## Database Maintenance

### Backup Content

**Export all content:**
```bash
cd workers/api
wrangler d1 export wedding-db --output=backup.sql
```

### Clean Up Old Sessions

```bash
wrangler d1 execute wedding-db --command="DELETE FROM sessions WHERE expires_at < cast(strftime('%s', 'now') as integer) * 1000"
```

### View Current Content

```bash
wrangler d1 execute wedding-db --command="SELECT page_id, substr(content, 1, 100) as preview, datetime(updated_at/1000, 'unixepoch') as updated FROM page_content"
```

---

## Security Considerations

1. **Admin access only** - Content editing requires admin authentication
2. **Input validation** - All fields are validated on backend
3. **SQL injection protection** - All queries use parameterized statements
4. **XSS prevention** - Content is sanitized before display
5. **Rate limiting** - API requests are rate-limited (100 per 15 min)

---

## Quick Reference

### File Locations

- **API Code**: `/workers/api/src/index.js`
- **Database Schema**: `/workers/api/schema.sql`
- **Seed Data**: `/workers/api/content-seed.sql`
- **Frontend API Client**: `/src/api/contentApi.js`
- **Page Editor Component**: `/src/components/admin/PageContentEditor.js`
- **Admin Dashboard**: `/src/components/admin/AdminDashboard.js`

### Modified Page Components

- `/src/components/ceremonies/ChristianCeremony.js`
- `/src/components/ceremonies/HinduCeremony.js`
- `/src/components/ceremonies/Reception.js`
- `/src/components/story/OurStory.js`
- `/src/components/home/Hero.js`

### Useful Commands

```bash
# Deploy everything
./deploy.sh

# Check API logs
cd workers/api && wrangler tail

# Rebuild frontend
export NODE_OPTIONS=--openssl-legacy-provider && npm run build

# Query database
cd workers/api && wrangler d1 execute wedding-db --command="YOUR SQL HERE"
```

---

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review error messages in browser console (F12)
3. Check API logs with `wrangler tail`
4. Refer to CLAUDE.md for project architecture details

---

**CMS is now ready for use! Your fiancée can start editing content through the admin dashboard.** 🎉

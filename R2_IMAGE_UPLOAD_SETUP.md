# Cloudflare R2 Image Upload Setup Guide

## Overview

Your wedding website now has **automatic image uploads** using Cloudflare R2 storage! Upload images directly from the admin panel and they're available instantly - no rebuild or redeploy needed.

## What Was Implemented

### Backend (Cloudflare Worker)
- ✅ New endpoint: `POST /api/upload-image` (admin only)
- ✅ Validates file type (JPEG, PNG, GIF, WebP)
- ✅ Validates file size (max 5MB)
- ✅ Uploads to R2 bucket
- ✅ Returns public URL

### Frontend (React)
- ✅ Updated ImageUploader component
- ✅ Shows upload progress
- ✅ Displays errors
- ✅ Automatic preview
- ✅ Uses admin authentication

### Configuration
- ✅ Updated `workers/api/wrangler.toml` with R2 bindings

## Setup Instructions

### Step 1: Create R2 Bucket

1. **Login to Cloudflare Dashboard**
   - Go to https://dash.cloudflare.com
   - Navigate to **R2** in the sidebar

2. **Create Bucket**
   ```bash
   # Via CLI (recommended)
   wrangler r2 bucket create wedding-images

   # Or via dashboard:
   # Click "Create bucket" → Name it "wedding-images" → Create
   ```

3. **Verify bucket was created:**
   ```bash
   wrangler r2 bucket list
   # Should show: wedding-images
   ```

### Step 2: Configure Public Access

To serve images publicly, you need to set up a custom domain for your R2 bucket:

#### Option A: Using Cloudflare Domain (Recommended)

1. **Add R2.dev subdomain:**
   - In Cloudflare dashboard → R2 → Your bucket (`wedding-images`)
   - Click "Settings" tab
   - Under "Public Access" → Click "Connect Domain"
   - Choose "R2.dev subdomain" (free)
   - It will give you: `https://pub-xxxxx.r2.dev`

2. **Update Worker code with your R2 URL:**
   ```bash
   # In workers/api/src/index.js line 1224, replace:
   const publicUrl = `https://images.rushel.me/${filename}`;

   # With your actual R2 URL:
   const publicUrl = `https://pub-xxxxx.r2.dev/${filename}`;
   ```

#### Option B: Using Custom Domain (images.rushel.me)

1. **Connect custom domain:**
   - In R2 bucket settings → "Connect Domain"
   - Choose "Custom Domain"
   - Enter: `images.rushel.me`
   - Click "Continue"

2. **Add DNS record:**
   - Cloudflare will provide instructions
   - Usually: Add CNAME record pointing to your R2 bucket
   - Wait for DNS propagation (usually instant on Cloudflare)

3. **Worker code is already set up for this!**
   - The code already uses `https://images.rushel.me/${filename}`
   - No changes needed if you use this domain

### Step 3: Deploy Updated Worker

```bash
cd workers/api

# Deploy to production
wrangler deploy --env production

# Test the deployment
wrangler tail --env production
```

### Step 4: Verify Setup

1. **Check R2 binding:**
   ```bash
   cd workers/api
   wrangler dev
   # Should start without errors
   ```

2. **Test upload endpoint (after deploy):**
   ```bash
   # Get admin token first (login to admin panel and check localStorage)

   # Test upload
   curl -X POST https://api.rushel.me/api/upload-image \
     -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
     -F "image=@/path/to/test-image.jpg"

   # Should return:
   # {"success":true,"url":"https://images.rushel.me/...","filename":"..."}
   ```

3. **Test via Admin Panel:**
   - Login to https://rushel.me/admin
   - Go to "Edit Content" → Any page
   - Click image uploader
   - Click "Upload New Image"
   - Select a photo
   - Should upload and show success message!

## How It Works

### Upload Flow

```
1. User clicks "Upload New Image" in admin panel
         ↓
2. ImageUploader component validates file (size, type)
         ↓
3. Shows preview + sends file to API endpoint
         ↓
4. Worker receives file, validates, uploads to R2
         ↓
5. R2 stores file with unique filename (timestamp-originalname.jpg)
         ↓
6. Worker returns public URL (https://images.rushel.me/...)
         ↓
7. URL is saved to database (in page content)
         ↓
8. Image is immediately available on website!
```

### File Handling

**Filename generation:**
```javascript
// Example: user uploads "wedding-photo.jpg" at 2025-01-07 14:30:00
// Becomes: "1735826400000-wedding-photo.jpg"
```

**Why timestamp prefix?**
- Ensures unique filenames
- Prevents overwrites
- Easy to sort by upload date

**Security:**
- Admin authentication required
- File type validation (only images)
- File size limit (5MB)
- Filename sanitization (removes special characters)

## Troubleshooting

### Issue: "Failed to upload image"

**Check 1: R2 bucket exists**
```bash
wrangler r2 bucket list
# Should show: wedding-images
```

**Check 2: Worker has access to R2**
```bash
# Check wrangler.toml has:
[[r2_buckets]]
binding = "IMAGES"
bucket_name = "wedding-images"
```

**Check 3: Worker is deployed**
```bash
cd workers/api
wrangler deploy --env production
```

### Issue: "Image uploaded but not visible on website"

**Check 1: Public access is configured**
- Go to R2 dashboard → wedding-images → Settings
- Check "Public Access" is enabled

**Check 2: URL is correct**
- Check the returned URL in network tab
- Visit the URL directly in browser
- Should show the image

**Check 3: CORS is configured**
- Worker already has CORS headers
- R2 bucket should allow public reads

### Issue: Upload works locally but not in production

**Check 1: Production R2 binding**
```bash
# Verify wrangler.toml has production R2 config:
[[env.production.r2_buckets]]
binding = "IMAGES"
bucket_name = "wedding-images"
```

**Check 2: Frontend API URL**
```bash
# Check .env.production has correct API URL:
REACT_APP_API_URL=https://api.rushel.me/api
```

## Cost Information

### Cloudflare R2 Pricing (as of 2025)

**Free tier includes:**
- 10 GB storage per month
- 1 million Class A operations per month (writes/lists)
- 10 million Class B operations per month (reads)

**For a wedding website:**
- ~200 images × 2MB each = 400MB storage ✅ (well within free tier)
- ~1000 uploads = 1000 Class A operations ✅
- ~10,000 views × 200 images = 2M Class B operations ✅

**Result:** Completely free! 🎉

**No egress fees:** Unlike AWS S3, Cloudflare R2 has **zero egress charges**

## Maintenance

### View uploaded images

```bash
# List all images in bucket
wrangler r2 object list wedding-images

# Download a specific image
wrangler r2 object get wedding-images/1735826400000-wedding-photo.jpg --file=./downloaded.jpg

# Delete an image
wrangler r2 object delete wedding-images/1735826400000-wedding-photo.jpg
```

### Backup images

```bash
# Download all images
wrangler r2 object list wedding-images --json | \
  jq -r '.[].key' | \
  while read key; do
    wrangler r2 object get wedding-images/"$key" --file=./backup/"$key"
  done
```

### Clean up old images

You can create a script to delete unused images:
```javascript
// Future enhancement: Track which images are used in database
// Delete images that aren't referenced anywhere
```

## Security Best Practices

1. **Admin-only uploads**: ✅ Already implemented (requires admin token)
2. **File validation**: ✅ Type and size checks
3. **Filename sanitization**: ✅ Removes dangerous characters
4. **Rate limiting**: Consider adding upload rate limits (future enhancement)

## Future Enhancements

Optional improvements you could add:

1. **Image optimization:**
   - Resize images on upload (e.g., max 1920px width)
   - Convert to WebP for better compression
   - Generate thumbnails

2. **Better file management:**
   - Admin panel to browse/delete uploaded images
   - See upload history
   - Search by filename

3. **Advanced features:**
   - Drag-and-drop upload
   - Multiple file upload
   - Progress bar (instead of spinner)
   - Image cropping/editing

## Summary

Your wedding website now has a **complete cloud storage solution** for images!

**What works now:**
- ✅ Upload images from admin panel
- ✅ Images stored in Cloudflare R2
- ✅ Available instantly (no rebuild)
- ✅ Completely free (within limits)
- ✅ Fast CDN delivery via Cloudflare

**What you need to do:**
1. Create R2 bucket: `wrangler r2 bucket create wedding-images`
2. Configure public access (R2.dev subdomain or custom domain)
3. Update Worker with correct public URL (if using R2.dev)
4. Deploy: `wrangler deploy --env production`
5. Test upload in admin panel

**After setup:**
- Just click "Upload New Image" in admin panel
- Select your photo
- Done! Image is live immediately 🎉

---

For questions or issues, check the troubleshooting section or refer to:
- Cloudflare R2 docs: https://developers.cloudflare.com/r2/
- Wrangler CLI docs: https://developers.cloudflare.com/workers/wrangler/

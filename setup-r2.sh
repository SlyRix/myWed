#!/bin/bash
# R2 Image Upload Setup Script
# This script helps you set up Cloudflare R2 for automatic image uploads

echo "🚀 Setting up Cloudflare R2 for image uploads..."
echo ""

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo "❌ Error: wrangler CLI not found"
    echo "Please install it first: npm install -g wrangler"
    exit 1
fi

echo "✅ Wrangler CLI found"
echo ""

# Check authentication
echo "Checking Cloudflare authentication..."
if ! wrangler whoami &> /dev/null; then
    echo "⚠️  Not logged in to Cloudflare"
    echo "Running: wrangler login"
    wrangler login
fi

echo "✅ Authenticated with Cloudflare"
echo ""

# Create R2 bucket
echo "Creating R2 bucket: wedding-images"
if wrangler r2 bucket create wedding-images 2>/dev/null; then
    echo "✅ Bucket created successfully!"
else
    echo "⚠️  Bucket may already exist (this is okay)"
fi
echo ""

# List buckets to verify
echo "📋 Your R2 buckets:"
wrangler r2 bucket list
echo ""

# Deploy worker
echo "Deploying Worker with R2 bindings..."
cd workers/api
if wrangler deploy --env production; then
    echo "✅ Worker deployed successfully!"
else
    echo "❌ Worker deployment failed"
    echo "Please check the error above"
    exit 1
fi
echo ""

# Show next steps
echo "🎉 Setup complete!"
echo ""
echo "📝 Next steps:"
echo ""
echo "1. Configure public access for your R2 bucket:"
echo "   • Go to: https://dash.cloudflare.com → R2 → wedding-images"
echo "   • Click 'Settings' → 'Public Access'"
echo "   • Choose 'Connect Domain' → 'R2.dev subdomain' (free)"
echo "   • Copy the URL (e.g., https://pub-xxxxx.r2.dev)"
echo ""
echo "2. Update Worker code with your R2 URL:"
echo "   • Edit: workers/api/src/index.js line ~1224"
echo "   • Replace: https://images.rushel.me/..."
echo "   • With your R2 URL: https://pub-xxxxx.r2.dev/..."
echo ""
echo "3. Redeploy Worker:"
echo "   • cd workers/api"
echo "   • wrangler deploy --env production"
echo ""
echo "4. Test upload:"
echo "   • Login to: https://rushel.me/admin"
echo "   • Edit any page content"
echo "   • Click 'Upload New Image'"
echo "   • Select a photo and upload!"
echo ""
echo "💡 For detailed instructions, see: R2_IMAGE_UPLOAD_SETUP.md"
echo ""
echo "✅ Your wedding website now supports automatic image uploads!"

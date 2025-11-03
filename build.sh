#!/bin/bash
# Build script for Cloudflare Pages deployment
# This script prepares the React app for production

set -e  # Exit on error

echo "========================================="
echo "Building Wedding Website for Production"
echo "========================================="

# Check if .env.production.local exists, otherwise use .env.production
if [ -f .env.production.local ]; then
    echo "Using .env.production.local for environment variables"
else
    echo "Using .env.production for environment variables"
    echo "Note: Create .env.production.local for custom production values"
fi

# Install dependencies
echo ""
echo "Installing dependencies..."
npm install

# Build the React app
echo ""
echo "Building React application..."
npm run build

# Check if build was successful
if [ -d "build" ]; then
    echo ""
    echo "========================================="
    echo "Build successful!"
    echo "========================================="
    echo "Output directory: build/"
    echo "Ready for Cloudflare Pages deployment"
    echo ""
else
    echo ""
    echo "Build failed! build/ directory not found"
    exit 1
fi

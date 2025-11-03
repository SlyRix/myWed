#!/bin/bash
# Quick deployment script for Wedding Website to Cloudflare
# This script automates the deployment of both backend and frontend

set -e  # Exit on error

echo "========================================="
echo "Wedding Website - Cloudflare Deployment"
echo "========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}==>${NC} $1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    print_error "Wrangler CLI is not installed"
    echo "Install it with: npm install -g wrangler"
    exit 1
fi

print_success "Wrangler CLI found"

# Check if logged in to Cloudflare
if ! wrangler whoami &> /dev/null; then
    print_error "Not logged in to Cloudflare"
    echo "Run: wrangler login"
    exit 1
fi

print_success "Authenticated with Cloudflare"
echo ""

# Ask what to deploy
echo "What would you like to deploy?"
echo "1) Backend Worker only"
echo "2) Frontend Pages only"
echo "3) Both Backend and Frontend (full deployment)"
echo ""
read -p "Enter your choice (1-3): " choice

case $choice in
    1)
        DEPLOY_BACKEND=true
        DEPLOY_FRONTEND=false
        ;;
    2)
        DEPLOY_BACKEND=false
        DEPLOY_FRONTEND=true
        ;;
    3)
        DEPLOY_BACKEND=true
        DEPLOY_FRONTEND=true
        ;;
    *)
        print_error "Invalid choice. Exiting."
        exit 1
        ;;
esac

echo ""

# Deploy Backend Worker
if [ "$DEPLOY_BACKEND" = true ]; then
    echo "========================================="
    echo "Deploying Backend Worker"
    echo "========================================="

    cd workers/api

    print_status "Installing worker dependencies..."
    npm install
    print_success "Dependencies installed"

    print_status "Deploying worker to Cloudflare..."
    wrangler deploy --env production
    print_success "Worker deployed successfully!"

    echo ""
    print_success "Backend API is live at: https://api.rushel.me"

    cd ../..
    echo ""
fi

# Deploy Frontend
if [ "$DEPLOY_FRONTEND" = true ]; then
    echo "========================================="
    echo "Deploying Frontend to Pages"
    echo "========================================="

    print_status "Installing frontend dependencies..."
    npm install
    print_success "Dependencies installed"

    print_status "Building React application..."
    npm run build

    if [ ! -d "build" ]; then
        print_error "Build failed! build/ directory not found"
        exit 1
    fi

    print_success "Build completed successfully"

    print_status "Deploying to Cloudflare Pages..."

    # Check if project exists, if not provide instructions
    if wrangler pages project list | grep -q "wedding-website"; then
        wrangler pages deploy build --project-name=wedding-website
        print_success "Frontend deployed successfully!"
    else
        print_warning "Pages project 'wedding-website' not found"
        echo ""
        echo "Please create the project first:"
        echo "  Option A: Via Cloudflare Dashboard"
        echo "    1. Go to https://dash.cloudflare.com"
        echo "    2. Navigate to Workers & Pages > Create application"
        echo "    3. Connect your Git repository or upload directly"
        echo ""
        echo "  Option B: Via Wrangler CLI"
        echo "    wrangler pages project create wedding-website"
        echo "    wrangler pages deploy build --project-name=wedding-website"
        echo ""
        exit 1
    fi

    echo ""
    print_success "Frontend is live at: https://rushel.me"
    echo ""
fi

# Deployment summary
echo "========================================="
echo "Deployment Complete!"
echo "========================================="
echo ""

if [ "$DEPLOY_BACKEND" = true ]; then
    echo "Backend API: https://api.rushel.me"
    echo "  - Test: curl https://api.rushel.me/api/validate/TEST"
fi

if [ "$DEPLOY_FRONTEND" = true ]; then
    echo "Frontend: https://rushel.me"
    echo "  - Admin: https://rushel.me/admin"
fi

echo ""
echo "Next steps:"
echo "  1. Test your website at https://rushel.me"
echo "  2. Verify API is working"
echo "  3. Login to admin dashboard"
echo "  4. Check logs: wrangler tail wedding-api --env production"
echo ""
print_success "All done! Your wedding website is live!"

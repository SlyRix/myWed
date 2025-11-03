# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a bilingual (Christian & Hindu) wedding website built with React. The project features a dual-ceremony design with password-protected access, allowing different guests to access different ceremony sections based on their invitation codes. Supports three languages: English, German, and Tamil.

**Production**: Deployed on Cloudflare (Pages for frontend, Workers + D1 for backend)
**Development**: React dev server + Express.js API or Cloudflare Workers dev mode

## Development Commands

### Frontend Development

```bash
# Start development server (requires NODE_OPTIONS for legacy OpenSSL)
npm start

# Build for production
npm run build

# Run tests
npm test
```

**Platform Note**: npm scripts use Windows syntax (`set NODE_OPTIONS=...`). On Linux/Mac/WSL, use:
```bash
export NODE_OPTIONS=--openssl-legacy-provider
npm start  # or npm run build, npm test
```

### Backend Development

```bash
# Local Express.js server (legacy, for Raspberry Pi deployment)
node src/server/server.js

# Cloudflare Worker (current production approach)
cd workers/api
wrangler dev                    # Development server
wrangler deploy                 # Deploy to production
wrangler tail                   # View production logs

# Database operations (D1)
cd workers/api
wrangler d1 execute wedding-db --file=./schema.sql
wrangler d1 execute wedding-db --command="SELECT * FROM guests"
wrangler d1 execute wedding-db --command="DELETE FROM guests WHERE code='TEST'"
```

### Deployment

```bash
# Automated deployment (recommended)
./build.sh              # Build React app
./deploy.sh             # Interactive deployment (backend/frontend/both)

# Manual deployment
cd workers/api && wrangler deploy --env production  # Backend
cd ../.. && wrangler pages deploy build --project-name=wedding-website  # Frontend

# Monitoring
cd workers/api && wrangler tail --env production  # View production logs
```

**Important**: The `deploy.sh` script is interactive and will prompt you to choose what to deploy (backend, frontend, or both). Build scripts are bash scripts and require execution permissions (`chmod +x build.sh deploy.sh`).

## Architecture Overview

### Frontend Architecture

**React SPA with lazy loading**: The app uses React Router with lazy-loaded route components to reduce initial bundle size. All major page components (HomePage, ceremonies, gallery, etc.) are loaded on demand.

**Context-based state management**:
- `ThemeContext` (src/contexts/ThemeContext.js) - Manages dual-theme colors (Christian/Hindu) via CSS variables
- `AuthContext` (src/contexts/AuthContext.js) - Handles admin authentication state

**Access control system**: The app implements a guest invitation code system:
- Codes stored in `localStorage` after validation
- URL parameter `?code=XXXX` allows automatic code entry
- Codes validated against backend API on app load
- Different codes grant access to different ceremony pages ("christian", "hindu", or both)

**Component organization**:
- `/components/common` - Shared UI components (Header, Footer, animations, loaders)
- `/components/ceremonies` - Christian and Hindu ceremony pages with password protection
- `/components/admin` - Admin dashboard for managing guest list
- `/components/rsvp`, `/gallery`, `/guestbook` - Feature-specific components

### Backend Architecture

The project supports **two deployment modes**:

#### Production: Cloudflare Worker + D1 Database (workers/api/)

**Cloudflare Worker** (workers/api/src/index.js):
- Serverless backend running on Cloudflare's edge network
- Handles authentication, rate limiting, and CORS
- Production URL: https://api.rushel.me/api

**D1 Database** (workers/api/schema.sql):
- SQLite database on Cloudflare's edge
- Tables: `guests`, `sessions`, `rate_limits`
- Replaces JSON file storage in production
- Managed via `wrangler d1` commands

**API Endpoints**:
- `GET /api/guests` - Fetch all guests (admin only)
- `POST /api/guests` - Add/update guest (admin only)
- `DELETE /api/guests/:code` - Delete guest (admin only)
- `GET /api/validate/:code` - Validate invitation code (public)
- `POST /api/generate-code` - Generate unique code from name (admin only)
- `POST /api/admin/login` - Admin authentication

#### Legacy: Express.js API (src/server/)

**Express.js server** (src/server/server.js):
- Port 3001 by default
- JSON file-based database (data/guestList.json)
- Designed for Raspberry Pi deployment
- Not used in current production (Cloudflare is preferred)

**Database layer** (src/server/db.js):
- File-based JSON storage for guest list
- CRUD operations for guests
- Auto-initializes with default data if missing

### Guest Access System

Guests are identified by unique codes (e.g., "SIVA", "RUSH"). Each guest record contains:
```javascript
{
  name: "Guest Name",
  ceremonies: ["christian", "hindu"]  // Controls ceremony access
}
```

The access validation flow:
1. Code entered via URL param (`?code=XXXX`) or password prompt
2. Frontend calls `/api/validate/:code`
3. Backend checks D1 database `guests` table (or data/guestList.json in legacy mode)
4. Returns guest info and ceremony permissions (which ceremonies guest can access)
5. Frontend stores code in localStorage and grants access to permitted ceremonies

**Data Storage Notes**:
- Production uses D1 database (`guests` table in Cloudflare D1)
- Legacy Express.js uses `data/guestList.json`
- `src/data/guestAccess.js` is deprecated and not used

### Internationalization (i18n)

Uses react-i18next with three locales:
- English (en) - Default
- German (de)
- Tamil (ta)

Translation files: `src/i18n/locales/{locale}/translation.json`

Language detection order:
1. localStorage preference
2. Browser language
3. Fallback to English

### Styling

**Tailwind CSS** with custom theme configuration (tailwind.config.js):
- Dual color schemes: Christian (soft cream/golden brown) and Hindu (gold/vermillion)
- Custom fonts: Cormorant Garamond (display), Montserrat (body), Tangerine (script)
- CSS variables set dynamically by ThemeContext

Additional global styles in `src/styles/variables.css` and `src/index.css`.

## Environment Configuration

### Production (.env.production or Cloudflare Pages environment variables)

```bash
REACT_APP_API_URL=https://api.rushel.me/api
REACT_APP_GOOGLE_MAPS_API_KEY=your_key
REACT_APP_EMAILJS_SERVICE_ID=your_service_id
REACT_APP_EMAILJS_TEMPLATE_ID=your_template_id
REACT_APP_EMAILJS_PUBLIC_KEY=your_public_key
NODE_ENV=production
```

### Development (.env or .env.local)

```bash
REACT_APP_API_URL=http://localhost:3001/api
# Or for Cloudflare Worker dev:
# REACT_APP_API_URL=http://localhost:8787/api
```

See `.env.example` for full template.

### Cloudflare Worker Secrets

Set via `wrangler secret put <KEY>` (from workers/api directory):
- `ADMIN_PASSWORD_HASH` - SHA-256 hash of admin password

Generate password hash:
```bash
node -e "const crypto = require('crypto'); console.log(crypto.createHash('sha256').update('your_password').digest('hex'));"
```

Then set the secret:
```bash
cd workers/api
wrangler secret put ADMIN_PASSWORD_HASH --env production
# Paste the hash when prompted
```

## Deployment Architecture

### Current Production (Cloudflare)

- **Frontend**: Cloudflare Pages at https://rushel.me (primary domain)
- **Backend**: Cloudflare Worker at https://api.rushel.me/api
- **Database**: Cloudflare D1 (wedding-db)
  - Database ID: `71f98b31-6ee3-47cf-84e0-33be1a805975`
- **Domain**: rushel.me (configured in Cloudflare DNS)

**Deployment process**: See DEPLOYMENT.md, QUICKSTART.md, or CLOUDFLARE_SETUP_SUMMARY.md for complete guides.

**Testing production API**:
```bash
curl https://api.rushel.me/api/validate/TEST
```

### Legacy Option (Raspberry Pi)

- **Frontend**: nginx serving `build/` folder
- **Backend**: Express.js on port 3001 (managed by PM2 or systemd)
- **Database**: JSON file at `data/guestList.json`

**Setup**: See src/server/README.md for Raspberry Pi configuration.

## Key Technical Considerations

### Security

**Admin authentication**:
- Cloudflare Worker: Session tokens with 24-hour expiration, SHA-256 password hashing
- Express.js: localStorage-based tokens (less secure)
- Rate limiting: 5 login attempts per 15 minutes (Cloudflare Worker only)

**CORS**:
- Cloudflare Worker: Configured for specific domain (rushel.me/wed.rushel.me)
- Express.js: Accepts all origins (should be restricted for production)

**Access control**: Individual ceremony pages use `PasswordProtection` and `CeremonyAccessCheck` components

### Performance

**Lazy loading**: React.lazy() for all major page components reduces initial bundle size

**Animation library**: framer-motion for page transitions and component animations

**CDN**: Cloudflare Pages provides global CDN with edge caching

### Data Management

**Database options**:
- **Cloudflare D1** (production): SQLite on edge, ACID compliant, parameterized queries
- **JSON file** (legacy): Simple storage for `data/guestList.json`, requires file system access

### Important File Locations

- **Frontend API client**: `src/api/guestApi.js` (configured with REACT_APP_API_URL)
- **Guest access validation**: Happens in `src/App.js` on mount via URL param `?code=XXXX`
- **Admin dashboard**: `src/components/admin/AdminDashboard.js`
- **Theme switching**: `src/contexts/ThemeContext.js` (Christian/Hindu color schemes)
- **Translations**: `src/i18n/locales/{en,de,ta}/translation.json`
- **Database schema**: `workers/api/schema.sql`
- **Worker configuration**: `workers/api/wrangler.toml`
- **Deployment scripts**: `build.sh`, `deploy.sh` (bash scripts)

## Working with the D1 Database

The production database uses Cloudflare D1 (SQLite on the edge). All operations must be run from the `workers/api` directory.

### Common Database Operations

```bash
cd workers/api

# Initialize database with schema
wrangler d1 execute wedding-db --file=./schema.sql

# Query guests
wrangler d1 execute wedding-db --command="SELECT * FROM guests"

# Add a guest
wrangler d1 execute wedding-db --command="INSERT INTO guests (code, name, ceremonies) VALUES ('JOHN', 'John Doe', '[\"christian\",\"hindu\"]')"

# Update guest ceremonies
wrangler d1 execute wedding-db --command="UPDATE guests SET ceremonies='[\"christian\"]' WHERE code='JOHN'"

# Delete a guest
wrangler d1 execute wedding-db --command="DELETE FROM guests WHERE code='JOHN'"

# Check sessions (admin)
wrangler d1 execute wedding-db --command="SELECT token, datetime(expires_at/1000, 'unixepoch') as expires FROM sessions"

# Clean up expired sessions
wrangler d1 execute wedding-db --command="DELETE FROM sessions WHERE expires_at < cast(strftime('%s', 'now') as integer) * 1000"
```

### Database Schema

Three main tables:
- `guests`: Guest access codes and ceremony permissions
- `sessions`: Admin authentication sessions (24-hour expiration)
- `rate_limits`: Request rate limiting (5 attempts per 15 minutes)

Ceremonies are stored as JSON strings: `'["christian","hindu"]'` or `'["christian"]'` or `'["hindu"]'`

## Common Issues and Troubleshooting

### Build Issues

**Problem**: npm scripts fail on Linux/Mac/WSL
**Solution**: Export NODE_OPTIONS before running npm commands:
```bash
export NODE_OPTIONS=--openssl-legacy-provider
npm start
```

**Problem**: Build fails with OpenSSL error
**Solution**: This is due to webpack 4 incompatibility with Node.js 17+. The NODE_OPTIONS flag fixes this.

### Deployment Issues

**Problem**: Wrangler commands fail with authentication error
**Solution**: Login to Cloudflare:
```bash
wrangler login
wrangler whoami  # Verify authentication
```

**Problem**: D1 database commands fail
**Solution**: Ensure you're in the `workers/api` directory and using the correct database name (`wedding-db`).

**Problem**: Pages deployment fails with "project not found"
**Solution**: Create the project first via Cloudflare dashboard or:
```bash
wrangler pages project create wedding-website
```

### API Issues

**Problem**: Frontend can't connect to API (CORS errors)
**Solution**: Check that REACT_APP_API_URL in .env matches your backend URL and that the worker's FRONTEND_URL variable is set correctly.

**Problem**: Admin login fails
**Solution**: Verify ADMIN_PASSWORD_HASH secret is set:
```bash
cd workers/api
wrangler secret list --env production
```

### Development Environment

**Problem**: Local development server can't connect to production API
**Solution**: Use `wrangler dev` for local worker development, or point REACT_APP_API_URL to localhost:
```bash
# Terminal 1: Run worker locally
cd workers/api
wrangler dev

# Terminal 2: Run React app
export REACT_APP_API_URL=http://localhost:8787/api
npm start
```

## Security & Best Practices

### Security Guidelines

This codebase follows security best practices. When making changes, adhere to these principles:

#### Authentication & Authorization

1. **Token Validation**: AdminRoute component validates tokens with backend on every access - NEVER rely solely on localStorage
2. **Session Expiration**: Admin sessions expire after 24 hours (Cloudflare Worker) or when token validation fails
3. **Rate Limiting**:
   - Login attempts: 5 per 15 minutes per IP
   - General API: 100 requests per 15 minutes per IP
4. **Password Hashing**: Admin passwords use SHA-256 hashing (Cloudflare Worker)

#### Input Validation

1. **Guest Codes**: Must be 4-10 uppercase alphanumeric characters (`/^[A-Z0-9]{4,10}$/`)
2. **Guest Names**: Max 100 characters, sanitized for XSS
3. **Ceremonies Array**: Must contain only 'christian' and/or 'hindu'
4. **Parameterized Queries**: ALL database queries use parameterized statements to prevent SQL injection

Example of proper validation:
```javascript
// ✅ CORRECT - Strict validation
if (!code || typeof code !== 'string' || !/^[A-Z0-9]{4,10}$/.test(code)) {
    return { error: 'Invalid code format' };
}

// ❌ WRONG - Too permissive
if (code && code.length > 0) {
    // Process code
}
```

#### XSS Prevention

1. **User Input**: Never use `dangerouslySetInnerHTML` with user-controlled data
2. **Alerts/Confirms**: Use React components (`ConfirmDialog`) instead of `window.alert()` or `window.confirm()` - prevents XSS via guest names
3. **Error Messages**: Display generic errors to users, log detailed errors server-side only

#### Data Handling

1. **No Sensitive Data in localStorage**: Only store non-sensitive tokens and codes
2. **No Form Data Caching**: RSVP form data should NOT be persisted to localStorage (security risk)
3. **CORS Configuration**: Restrict origins to known domains (rushel.me, wed.rushel.me)

#### Deprecated Files

The following files are deprecated and should NOT be used:
- `src/utils/accessCodes.js` - DELETED (contained hardcoded access codes)
- `src/data/guestAccess.js` - Empty placeholder for backwards compatibility only

### Code Quality Standards

#### Console Logging

- **Production**: NO console.log statements (information disclosure risk)
- **Development**: Use conditional logging:
```javascript
// ✅ CORRECT
if (process.env.NODE_ENV === 'development') {
    console.log('Debug info');
}

// ❌ WRONG
console.log('User data:', userData);
```

#### Error Handling

All async operations must have try-catch blocks:
```javascript
// ✅ CORRECT
try {
    const result = await apiCall();
    return { success: true, data: result };
} catch (error) {
    console.error('Operation failed:', error.message);  // Generic message only
    return { success: false, error: 'Operation failed' };  // No internal details
}

// ❌ WRONG
const result = await apiCall();  // No error handling
throw new Error(`Failed: ${error.stack}`);  // Exposes internal details
```

#### Component Patterns

1. **Lazy Loading**: Use React.lazy() for route-level components
2. **Error Boundaries**: Wrap app in ErrorBoundary component (already implemented)
3. **Loading States**: Always show loading indicators during async operations
4. **Accessibility**:
   - Add `aria-label` to icon-only buttons
   - Use `role="alert"` for error messages
   - Provide sr-only text for loading spinners

#### Magic Numbers

Extract constants for reusability:
```javascript
// ✅ CORRECT
const MOBILE_BREAKPOINT = 768;
const MAX_GUESTS = 10;
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000;

if (window.innerWidth < MOBILE_BREAKPOINT) { ... }

// ❌ WRONG
if (window.innerWidth < 768) { ... }
```

#### JSDoc Documentation

All exported functions MUST have JSDoc comments:
```javascript
/**
 * Validates a guest invitation code
 * @param {string} code - Invitation code to validate
 * @returns {Promise<Object>} Validation result with valid flag and guest data
 * @throws {Error} If network error occurs
 * @example
 * const result = await validateAccessCode('SMITH123');
 */
export const validateAccessCode = async (code) => { ... }
```

### Performance Considerations

1. **Bundle Size**: Route-level code splitting is implemented - maintain this pattern
2. **API Calls**: Use request deduplication for frequently called endpoints
3. **Re-renders**: Memoize expensive computations with useMemo/useCallback
4. **Images**: Use lazy loading and WebP format where possible

### Testing Before Deployment

Before deploying to production, verify:

```bash
# 1. Build succeeds
npm run build

# 2. No console.log in production code
grep -r "console.log" src/ --exclude-dir=node_modules | grep -v "console.error"

# 3. Worker deploys successfully
cd workers/api && wrangler deploy --dry-run

# 4. Test production API endpoints
curl https://api.rushel.me/api/validate/TEST
```

### Maintenance Tasks

#### Regular Security Tasks

1. **Session Cleanup**: Clear expired sessions monthly
```bash
cd workers/api
wrangler d1 execute wedding-db --command="DELETE FROM sessions WHERE expires_at < cast(strftime('%s', 'now') as integer) * 1000"
```

2. **Rate Limit Cleanup**: Clear old rate limit entries
```bash
cd workers/api
wrangler d1 execute wedding-db --command="DELETE FROM rate_limits WHERE window_start < cast(strftime('%s', 'now') as integer) * 1000 - 900000"
```

3. **Dependency Updates**: Review and update dependencies quarterly
```bash
npm outdated
npm audit
```

#### Monitoring

Check production logs regularly:
```bash
cd workers/api
wrangler tail --env production
```

Watch for:
- Failed authentication attempts (potential brute force)
- Rate limit hits (potential DDoS)
- Database errors
- CORS errors (misconfigured frontend)

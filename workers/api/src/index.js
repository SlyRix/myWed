// workers/api/src/index.js
// Cloudflare Worker for Wedding Website API

// CORS headers configuration (will be set dynamically from env.FRONTEND_URL)
const getCorsHeaders = (env) => ({
    'Access-Control-Allow-Origin': env.FRONTEND_URL || 'https://wed.rushel.me',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
});

// Security headers
const securityHeaders = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' https://maps.googleapis.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://*.emailjs.com https://maps.googleapis.com;",
};

// Combine all headers
const getAllHeaders = (env) => ({
    ...getCorsHeaders(env),
    ...securityHeaders,
    'Content-Type': 'application/json',
});

// Rate limiting storage (using in-memory for simplicity, could use KV for persistence)
class RateLimiter {
    constructor(env) {
        this.env = env;
    }

    async checkRateLimit(identifier, maxRequests, windowMs) {
        const now = Date.now();
        const key = `ratelimit:${identifier}`;

        try {
            // Get existing rate limit data from D1
            const result = await this.env.DB.prepare(
                'SELECT attempts, window_start FROM rate_limits WHERE identifier = ?'
            ).bind(key).first();

            if (!result) {
                // First request
                await this.env.DB.prepare(
                    'INSERT INTO rate_limits (identifier, attempts, window_start) VALUES (?, 1, ?)'
                ).bind(key, now).run();
                return { allowed: true, remaining: maxRequests - 1 };
            }

            const windowStart = result.window_start;
            const attempts = result.attempts;

            // Check if window has expired
            if (now - windowStart > windowMs) {
                // Reset window
                await this.env.DB.prepare(
                    'UPDATE rate_limits SET attempts = 1, window_start = ? WHERE identifier = ?'
                ).bind(now, key).run();
                return { allowed: true, remaining: maxRequests - 1 };
            }

            // Check if rate limit exceeded
            if (attempts >= maxRequests) {
                return { allowed: false, remaining: 0 };
            }

            // Increment attempts
            await this.env.DB.prepare(
                'UPDATE rate_limits SET attempts = attempts + 1 WHERE identifier = ?'
            ).bind(key).run();

            return { allowed: true, remaining: maxRequests - attempts - 1 };
        } catch (error) {
            console.error('Rate limit error:', error);
            // On error, allow the request
            return { allowed: true, remaining: maxRequests };
        }
    }
}

// Hash password using Web Crypto API (SHA-256)
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Generate secure random token
function generateToken() {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// Validate session token
async function validateSession(env, token) {
    if (!token) return false;

    try {
        const result = await env.DB.prepare(
            'SELECT expires_at FROM sessions WHERE token = ?'
        ).bind(token).first();

        if (!result) return false;

        const now = Date.now();
        if (result.expires_at < now) {
            // Session expired, clean it up
            await env.DB.prepare('DELETE FROM sessions WHERE token = ?').bind(token).run();
            return false;
        }

        return true;
    } catch (error) {
        console.error('Session validation error:', error);
        return false;
    }
}

// Extract bearer token from Authorization header
function extractToken(request) {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }
    return authHeader.substring(7);
}

// Admin authentication middleware
async function requireAdmin(env, request) {
    const token = extractToken(request);
    const isValid = await validateSession(env, token);

    if (!isValid) {
        return new Response(
            JSON.stringify({ error: 'Authentication required' }),
            { status: 401, headers: getAllHeaders(env) }
        );
    }

    return null; // Success
}

// Handle admin login
async function handleAdminLogin(env, request, rateLimiter) {
    try {
        const body = await request.json();
        const { password } = body;

        if (!password) {
            return new Response(
                JSON.stringify({ error: 'Password required' }),
                { status: 400, headers: getAllHeaders(env) }
            );
        }

        // Rate limiting for login attempts (5 attempts per 15 minutes)
        const clientIP = request.headers.get('CF-Connecting-IP') || 'unknown';
        const rateLimit = await rateLimiter.checkRateLimit(
            `login:${clientIP}`,
            5,
            15 * 60 * 1000
        );

        if (!rateLimit.allowed) {
            return new Response(
                JSON.stringify({ error: 'Too many login attempts. Please try again later.' }),
                { status: 429, headers: getAllHeaders(env) }
            );
        }

        // Hash the provided password
        const passwordHash = await hashPassword(password);

        // Compare with stored hash
        if (passwordHash === env.ADMIN_PASSWORD_HASH) {
            // Generate session token
            const token = generateToken();
            const expiresAt = Date.now() + (24 * 60 * 60 * 1000); // 24 hours

            // Store session in D1
            await env.DB.prepare(
                'INSERT INTO sessions (token, expires_at) VALUES (?, ?)'
            ).bind(token, expiresAt).run();

            return new Response(
                JSON.stringify({ success: true, token }),
                { status: 200, headers: getAllHeaders(env) }
            );
        } else {
            return new Response(
                JSON.stringify({ error: 'Invalid password' }),
                { status: 401, headers: getAllHeaders(env) }
            );
        }
    } catch (error) {
        console.error('Login error:', error);
        return new Response(
            JSON.stringify({ error: 'Login failed' }),
            { status: 500, headers: getAllHeaders(env) }
        );
    }
}

// Get all guests (admin only)
async function handleGetGuests(env) {
    try {
        const results = await env.DB.prepare(
            'SELECT code, name, ceremonies FROM guests ORDER BY name'
        ).all();

        // Convert ceremonies from JSON string to array
        const guestList = {};
        for (const row of results.results) {
            guestList[row.code] = {
                name: row.name,
                ceremonies: JSON.parse(row.ceremonies)
            };
        }

        return new Response(
            JSON.stringify(guestList),
            { status: 200, headers: getAllHeaders(env) }
        );
    } catch (error) {
        console.error('Get guests error:', error);
        return new Response(
            JSON.stringify({ error: 'Failed to fetch guest list' }),
            { status: 500, headers: getAllHeaders(env) }
        );
    }
}

// Save guest (admin only)
async function handleSaveGuest(env, request) {
    try {
        const body = await request.json();
        const { code, guestData } = body;

        // Input validation
        if (!code || typeof code !== 'string' || !/^[A-Z0-9]{4,10}$/.test(code)) {
            return new Response(
                JSON.stringify({ error: 'Invalid code format. Must be 4-10 uppercase alphanumeric characters.' }),
                { status: 400, headers: getAllHeaders(env) }
            );
        }

        if (!guestData || !guestData.name || typeof guestData.name !== 'string') {
            return new Response(
                JSON.stringify({ error: 'Invalid guest data. Name is required.' }),
                { status: 400, headers: getAllHeaders(env) }
            );
        }

        if (guestData.name.length > 100) {
            return new Response(
                JSON.stringify({ error: 'Guest name too long. Maximum 100 characters.' }),
                { status: 400, headers: getAllHeaders(env) }
            );
        }

        if (!Array.isArray(guestData.ceremonies)) {
            return new Response(
                JSON.stringify({ error: 'Invalid ceremonies data. Must be an array.' }),
                { status: 400, headers: getAllHeaders(env) }
            );
        }

        // Validate ceremonies array values
        const validCeremonies = ['christian', 'hindu'];
        for (const ceremony of guestData.ceremonies) {
            if (!validCeremonies.includes(ceremony)) {
                return new Response(
                    JSON.stringify({ error: 'Invalid ceremony type. Must be "christian" or "hindu".' }),
                    { status: 400, headers: getAllHeaders(env) }
                );
            }
        }

        // Save to D1 (INSERT OR REPLACE for upsert)
        await env.DB.prepare(
            'INSERT OR REPLACE INTO guests (code, name, ceremonies) VALUES (?, ?, ?)'
        ).bind(code, guestData.name, JSON.stringify(guestData.ceremonies)).run();

        return new Response(
            JSON.stringify({ success: true, code, guest: guestData }),
            { status: 200, headers: getAllHeaders(env) }
        );
    } catch (error) {
        console.error('Save guest error:', error);
        return new Response(
            JSON.stringify({ error: 'Failed to save guest' }),
            { status: 500, headers: getAllHeaders(env) }
        );
    }
}

// Delete guest (admin only)
async function handleDeleteGuest(env, code) {
    try {
        // Input validation
        if (!code || typeof code !== 'string' || !/^[A-Z0-9]{4,10}$/.test(code)) {
            return new Response(
                JSON.stringify({ error: 'Invalid code format' }),
                { status: 400, headers: getAllHeaders(env) }
            );
        }

        // Delete from D1
        const result = await env.DB.prepare(
            'DELETE FROM guests WHERE code = ?'
        ).bind(code).run();

        if (result.meta.changes === 0) {
            return new Response(
                JSON.stringify({ error: 'Guest not found or could not be deleted' }),
                { status: 404, headers: getAllHeaders(env) }
            );
        }

        return new Response(
            JSON.stringify({ success: true }),
            { status: 200, headers: getAllHeaders(env) }
        );
    } catch (error) {
        console.error('Delete guest error:', error);
        return new Response(
            JSON.stringify({ error: 'Failed to delete guest' }),
            { status: 500, headers: getAllHeaders(env) }
        );
    }
}

// Validate access code (public)
async function handleValidateCode(env, code) {
    try {
        // Input validation
        if (!code || typeof code !== 'string' || code.length > 20) {
            return new Response(
                JSON.stringify({ valid: false, error: 'Invalid code format' }),
                { status: 400, headers: getAllHeaders(env) }
            );
        }

        const upperCode = code.trim().toUpperCase();

        // Query D1
        const result = await env.DB.prepare(
            'SELECT name, ceremonies FROM guests WHERE code = ?'
        ).bind(upperCode).first();

        if (result) {
            return new Response(
                JSON.stringify({
                    valid: true,
                    guest: {
                        name: result.name,
                        ceremonies: JSON.parse(result.ceremonies)
                    },
                    ceremonies: JSON.parse(result.ceremonies)
                }),
                { status: 200, headers: getAllHeaders(env) }
            );
        } else {
            return new Response(
                JSON.stringify({ valid: false }),
                { status: 200, headers: getAllHeaders(env) }
            );
        }
    } catch (error) {
        console.error('Validate code error:', error);
        return new Response(
            JSON.stringify({ error: 'Failed to validate code' }),
            { status: 500, headers: getAllHeaders(env) }
        );
    }
}

// Generate guest code (admin only)
async function handleGenerateCode(env, request) {
    try {
        const body = await request.json();
        const { name } = body;

        // Input validation
        if (!name || typeof name !== 'string') {
            return new Response(
                JSON.stringify({ error: 'Name is required' }),
                { status: 400, headers: getAllHeaders(env) }
            );
        }

        if (name.length > 100) {
            return new Response(
                JSON.stringify({ error: 'Name too long. Maximum 100 characters.' }),
                { status: 400, headers: getAllHeaders(env) }
            );
        }

        // Generate a unique code
        let newCode;
        let attempts = 0;
        const maxAttempts = 20;

        while (attempts < maxAttempts) {
            // Generate 8-character alphanumeric code
            const array = new Uint8Array(6);
            crypto.getRandomValues(array);
            newCode = Array.from(array)
                .map(b => b.toString(36).toUpperCase())
                .join('')
                .replace(/[^A-Z0-9]/g, '')
                .substring(0, 8);

            // Ensure it's 8 characters
            if (newCode.length !== 8) {
                attempts++;
                continue;
            }

            // Check uniqueness
            const existing = await env.DB.prepare(
                'SELECT code FROM guests WHERE code = ?'
            ).bind(newCode).first();

            if (!existing) {
                return new Response(
                    JSON.stringify({ code: newCode }),
                    { status: 200, headers: getAllHeaders(env) }
                );
            }

            attempts++;
        }

        // Fallback: use name-based code with timestamp
        const timestamp = Date.now().toString(36).toUpperCase();
        const namePrefix = name.trim().substring(0, 4).toUpperCase().replace(/[^A-Z]/g, '');
        newCode = `${namePrefix}${timestamp}`.substring(0, 8);

        return new Response(
            JSON.stringify({ code: newCode }),
            { status: 200, headers: getAllHeaders(env) }
        );
    } catch (error) {
        console.error('Generate code error:', error);
        return new Response(
            JSON.stringify({ error: 'Failed to generate code' }),
            { status: 500, headers: getAllHeaders(env) }
        );
    }
}

// Router
async function handleRequest(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // Handle CORS preflight
    if (method === 'OPTIONS') {
        return new Response(null, {
            status: 204,
            headers: getAllHeaders(env)
        });
    }

    // Initialize rate limiter
    const rateLimiter = new RateLimiter(env);

    // General rate limiting (100 requests per 15 minutes)
    const clientIP = request.headers.get('CF-Connecting-IP') || 'unknown';
    const rateLimit = await rateLimiter.checkRateLimit(
        `general:${clientIP}`,
        100,
        15 * 60 * 1000
    );

    if (!rateLimit.allowed && !path.includes('/admin/login')) {
        return new Response(
            JSON.stringify({ error: 'Too many requests from this IP' }),
            { status: 429, headers: getAllHeaders(env) }
        );
    }

    // Routes
    try {
        // Public routes
        if (path === '/api/admin/login' && method === 'POST') {
            return await handleAdminLogin(env, request, rateLimiter);
        }

        if (path.startsWith('/api/validate/') && method === 'GET') {
            const code = path.split('/').pop();
            return await handleValidateCode(env, code);
        }

        // Protected routes (require admin authentication)
        const authError = await requireAdmin(env, request);
        if (authError) return authError;

        if (path === '/api/guests' && method === 'GET') {
            return await handleGetGuests(env);
        }

        if (path === '/api/guests' && method === 'POST') {
            return await handleSaveGuest(env, request);
        }

        if (path.startsWith('/api/guests/') && method === 'DELETE') {
            const code = path.split('/').pop();
            return await handleDeleteGuest(env, code);
        }

        if (path === '/api/generate-code' && method === 'POST') {
            return await handleGenerateCode(env, request);
        }

        // 404 - Not found
        return new Response(
            JSON.stringify({ error: 'Not found' }),
            { status: 404, headers: getAllHeaders(env) }
        );
    } catch (error) {
        console.error('Request error:', error);
        return new Response(
            JSON.stringify({ error: 'Internal server error' }),
            { status: 500, headers: getAllHeaders(env) }
        );
    }
}

// Worker entry point
export default {
    async fetch(request, env, ctx) {
        return await handleRequest(request, env);
    }
};

// workers/api/src/index.js
// Cloudflare Worker for Wedding Website API

// CORS headers configuration
// Supports multiple origins including localhost for development
const getAllowedOrigins = (env) => {
    const origins = [
        'https://rushel.me',
        'https://wed.rushel.me',
        'http://localhost:3000',
        'http://localhost:3001',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:3001'
    ];

    // Add custom frontend URL from environment if provided
    if (env.FRONTEND_URL && !origins.includes(env.FRONTEND_URL)) {
        origins.push(env.FRONTEND_URL);
    }

    return origins;
};

const getCorsHeaders = (env, requestOrigin) => {
    const allowedOrigins = getAllowedOrigins(env);
    const origin = allowedOrigins.includes(requestOrigin) ? requestOrigin : allowedOrigins[0];

    return {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Credentials': 'true',
    };
};

// Security headers
const securityHeaders = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' https://maps.googleapis.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://*.emailjs.com https://maps.googleapis.com;",
};

// Combine all headers
const getAllHeaders = (env, requestOrigin) => ({
    ...getCorsHeaders(env, requestOrigin),
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
async function requireAdmin(env, request, requestOrigin) {
    const token = extractToken(request);
    const isValid = await validateSession(env, token);

    if (!isValid) {
        return new Response(
            JSON.stringify({ error: 'Authentication required' }),
            { status: 401, headers: getAllHeaders(env, requestOrigin) }
        );
    }

    return null; // Success
}

// Handle admin login
async function handleAdminLogin(env, request, rateLimiter, requestOrigin) {
    try {
        const body = await request.json();
        const { password } = body;

        if (!password) {
            return new Response(
                JSON.stringify({ error: 'Password required' }),
                { status: 400, headers: getAllHeaders(env, requestOrigin) }
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
                { status: 429, headers: getAllHeaders(env, requestOrigin) }
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
                { status: 200, headers: getAllHeaders(env, requestOrigin) }
            );
        } else {
            return new Response(
                JSON.stringify({ error: 'Invalid password' }),
                { status: 401, headers: getAllHeaders(env, requestOrigin) }
            );
        }
    } catch (error) {
        console.error('Login error:', error);
        return new Response(
            JSON.stringify({ error: 'Login failed' }),
            { status: 500, headers: getAllHeaders(env, requestOrigin) }
        );
    }
}

// Get all guests (admin only)
async function handleGetGuests(env, requestOrigin) {
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
            { status: 200, headers: getAllHeaders(env, requestOrigin) }
        );
    } catch (error) {
        console.error('Get guests error:', error);
        return new Response(
            JSON.stringify({ error: 'Failed to fetch guest list' }),
            { status: 500, headers: getAllHeaders(env, requestOrigin) }
        );
    }
}

// Save guest (admin only)
async function handleSaveGuest(env, request, requestOrigin) {
    try {
        const body = await request.json();
        const { code, guestData } = body;

        // Input validation
        if (!code || typeof code !== 'string' || !/^[A-Z0-9]{4,10}$/.test(code)) {
            return new Response(
                JSON.stringify({ error: 'Invalid code format. Must be 4-10 uppercase alphanumeric characters.' }),
                { status: 400, headers: getAllHeaders(env, requestOrigin) }
            );
        }

        if (!guestData || !guestData.name || typeof guestData.name !== 'string') {
            return new Response(
                JSON.stringify({ error: 'Invalid guest data. Name is required.' }),
                { status: 400, headers: getAllHeaders(env, requestOrigin) }
            );
        }

        if (guestData.name.length > 100) {
            return new Response(
                JSON.stringify({ error: 'Guest name too long. Maximum 100 characters.' }),
                { status: 400, headers: getAllHeaders(env, requestOrigin) }
            );
        }

        if (!Array.isArray(guestData.ceremonies)) {
            return new Response(
                JSON.stringify({ error: 'Invalid ceremonies data. Must be an array.' }),
                { status: 400, headers: getAllHeaders(env, requestOrigin) }
            );
        }

        // Validate ceremonies array values
        const validCeremonies = ['christian', 'hindu'];
        for (const ceremony of guestData.ceremonies) {
            if (!validCeremonies.includes(ceremony)) {
                return new Response(
                    JSON.stringify({ error: 'Invalid ceremony type. Must be "christian" or "hindu".' }),
                    { status: 400, headers: getAllHeaders(env, requestOrigin) }
                );
            }
        }

        // Save to D1 (INSERT OR REPLACE for upsert)
        await env.DB.prepare(
            'INSERT OR REPLACE INTO guests (code, name, ceremonies) VALUES (?, ?, ?)'
        ).bind(code, guestData.name, JSON.stringify(guestData.ceremonies)).run();

        return new Response(
            JSON.stringify({ success: true, code, guest: guestData }),
            { status: 200, headers: getAllHeaders(env, requestOrigin) }
        );
    } catch (error) {
        console.error('Save guest error:', error);
        return new Response(
            JSON.stringify({ error: 'Failed to save guest' }),
            { status: 500, headers: getAllHeaders(env, requestOrigin) }
        );
    }
}

// Delete guest (admin only)
async function handleDeleteGuest(env, code, requestOrigin) {
    try {
        // Input validation
        if (!code || typeof code !== 'string' || !/^[A-Z0-9]{4,10}$/.test(code)) {
            return new Response(
                JSON.stringify({ error: 'Invalid code format' }),
                { status: 400, headers: getAllHeaders(env, requestOrigin) }
            );
        }

        // Delete from D1
        const result = await env.DB.prepare(
            'DELETE FROM guests WHERE code = ?'
        ).bind(code).run();

        if (result.meta.changes === 0) {
            return new Response(
                JSON.stringify({ error: 'Guest not found or could not be deleted' }),
                { status: 404, headers: getAllHeaders(env, requestOrigin) }
            );
        }

        return new Response(
            JSON.stringify({ success: true }),
            { status: 200, headers: getAllHeaders(env, requestOrigin) }
        );
    } catch (error) {
        console.error('Delete guest error:', error);
        return new Response(
            JSON.stringify({ error: 'Failed to delete guest' }),
            { status: 500, headers: getAllHeaders(env, requestOrigin) }
        );
    }
}

// Validate access code (public)
async function handleValidateCode(env, code, requestOrigin) {
    try {
        // Input validation - strict format for security
        if (!code || typeof code !== 'string' || !/^[A-Z0-9]{4,10}$/.test(code.trim().toUpperCase())) {
            return new Response(
                JSON.stringify({ valid: false, error: 'Invalid code format' }),
                { status: 400, headers: getAllHeaders(env, requestOrigin) }
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
                { status: 200, headers: getAllHeaders(env, requestOrigin) }
            );
        } else {
            return new Response(
                JSON.stringify({ valid: false }),
                { status: 200, headers: getAllHeaders(env, requestOrigin) }
            );
        }
    } catch (error) {
        console.error('Validate code error:', error);
        return new Response(
            JSON.stringify({ error: 'Failed to validate code' }),
            { status: 500, headers: getAllHeaders(env, requestOrigin) }
        );
    }
}

// Generate guest code (admin only)
async function handleGenerateCode(env, request, requestOrigin) {
    try {
        const body = await request.json();
        const { name } = body;

        // Input validation
        if (!name || typeof name !== 'string') {
            return new Response(
                JSON.stringify({ error: 'Name is required' }),
                { status: 400, headers: getAllHeaders(env, requestOrigin) }
            );
        }

        if (name.length > 100) {
            return new Response(
                JSON.stringify({ error: 'Name too long. Maximum 100 characters.' }),
                { status: 400, headers: getAllHeaders(env, requestOrigin) }
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
                    { status: 200, headers: getAllHeaders(env, requestOrigin) }
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
            { status: 200, headers: getAllHeaders(env, requestOrigin) }
        );
    } catch (error) {
        console.error('Generate code error:', error);
        return new Response(
            JSON.stringify({ error: 'Failed to generate code' }),
            { status: 500, headers: getAllHeaders(env, requestOrigin) }
        );
    }
}

/**
 * Get all gifts with contribution totals (public)
 * Returns gift list with calculated total contributions and remaining amounts
 * @returns {Promise<Response>} JSON array of gifts with contribution data
 */
async function handleGetGifts(env, requestOrigin) {
    try {
        // Get all gifts
        const giftsResult = await env.DB.prepare(
            'SELECT id, name_en, name_de, name_ta, description_en, description_de, description_ta, price, image_url, category, product_url, created_at FROM gifts ORDER BY category, id'
        ).all();

        // For each gift, calculate total contributions
        const giftsWithContributions = await Promise.all(
            giftsResult.results.map(async (gift) => {
                const contributionsResult = await env.DB.prepare(
                    'SELECT COALESCE(SUM(amount), 0) as total_contributed, COUNT(*) as contribution_count FROM contributions WHERE gift_id = ?'
                ).bind(gift.id).first();

                return {
                    id: gift.id,
                    names: {
                        en: gift.name_en,
                        de: gift.name_de,
                        ta: gift.name_ta
                    },
                    descriptions: {
                        en: gift.description_en,
                        de: gift.description_de,
                        ta: gift.description_ta
                    },
                    price: gift.price,
                    imageUrl: gift.image_url,
                    category: gift.category,
                    productUrl: gift.product_url,
                    totalContributed: contributionsResult.total_contributed,
                    contributionCount: contributionsResult.contribution_count,
                    remainingAmount: gift.price - contributionsResult.total_contributed,
                    percentageFunded: Math.round((contributionsResult.total_contributed / gift.price) * 100),
                    createdAt: gift.created_at
                };
            })
        );

        return new Response(
            JSON.stringify(giftsWithContributions),
            { status: 200, headers: getAllHeaders(env, requestOrigin) }
        );
    } catch (error) {
        console.error('Get gifts error:', error);
        return new Response(
            JSON.stringify({ error: 'Failed to fetch gifts' }),
            { status: 500, headers: getAllHeaders(env, requestOrigin) }
        );
    }
}

/**
 * Create a new gift (admin only)
 * @param {Request} request - Request with gift data in body
 * @returns {Promise<Response>} Created gift object
 */
async function handleCreateGift(env, request, requestOrigin) {
    try {
        const body = await request.json();
        const { names, descriptions, price, imageUrl, category, productUrl } = body;

        // Input validation
        if (!names || !names.en || !names.de || !names.ta) {
            return new Response(
                JSON.stringify({ error: 'All language names are required (en, de, ta)' }),
                { status: 400, headers: getAllHeaders(env, requestOrigin) }
            );
        }

        if (!descriptions || !descriptions.en || !descriptions.de || !descriptions.ta) {
            return new Response(
                JSON.stringify({ error: 'All language descriptions are required (en, de, ta)' }),
                { status: 400, headers: getAllHeaders(env, requestOrigin) }
            );
        }

        if (!price || typeof price !== 'number' || price <= 0) {
            return new Response(
                JSON.stringify({ error: 'Valid price is required (must be positive number)' }),
                { status: 400, headers: getAllHeaders(env, requestOrigin) }
            );
        }

        if (!imageUrl || typeof imageUrl !== 'string' || imageUrl.length === 0) {
            return new Response(
                JSON.stringify({ error: 'Image URL is required' }),
                { status: 400, headers: getAllHeaders(env, requestOrigin) }
            );
        }

        if (!category || typeof category !== 'string' || category.length === 0) {
            return new Response(
                JSON.stringify({ error: 'Category is required' }),
                { status: 400, headers: getAllHeaders(env, requestOrigin) }
            );
        }

        // Validate productUrl if provided
        if (productUrl !== null && productUrl !== undefined && productUrl !== '') {
            if (typeof productUrl !== 'string') {
                return new Response(
                    JSON.stringify({ error: 'Product URL must be a string' }),
                    { status: 400, headers: getAllHeaders(env, requestOrigin) }
                );
            }
            // Check if URL starts with http:// or https:// and doesn't contain javascript:
            if (!productUrl.startsWith('http://') && !productUrl.startsWith('https://')) {
                return new Response(
                    JSON.stringify({ error: 'Product URL must start with http:// or https://' }),
                    { status: 400, headers: getAllHeaders(env, requestOrigin) }
                );
            }
            if (productUrl.toLowerCase().includes('javascript:')) {
                return new Response(
                    JSON.stringify({ error: 'Invalid product URL' }),
                    { status: 400, headers: getAllHeaders(env, requestOrigin) }
                );
            }
            if (productUrl.length > 500) {
                return new Response(
                    JSON.stringify({ error: 'Product URL too long. Maximum 500 characters.' }),
                    { status: 400, headers: getAllHeaders(env, requestOrigin) }
                );
            }
        }

        // Validate string lengths
        if (names.en.length > 200 || names.de.length > 200 || names.ta.length > 200) {
            return new Response(
                JSON.stringify({ error: 'Gift names too long. Maximum 200 characters.' }),
                { status: 400, headers: getAllHeaders(env, requestOrigin) }
            );
        }

        if (descriptions.en.length > 500 || descriptions.de.length > 500 || descriptions.ta.length > 500) {
            return new Response(
                JSON.stringify({ error: 'Descriptions too long. Maximum 500 characters.' }),
                { status: 400, headers: getAllHeaders(env, requestOrigin) }
            );
        }

        // Insert gift into database
        const result = await env.DB.prepare(
            'INSERT INTO gifts (name_en, name_de, name_ta, description_en, description_de, description_ta, price, image_url, category, product_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
        ).bind(
            names.en,
            names.de,
            names.ta,
            descriptions.en,
            descriptions.de,
            descriptions.ta,
            price,
            imageUrl,
            category,
            productUrl || null
        ).run();

        const giftId = result.meta.last_row_id;

        return new Response(
            JSON.stringify({
                success: true,
                gift: {
                    id: giftId,
                    names,
                    descriptions,
                    price,
                    imageUrl,
                    category,
                    productUrl: productUrl || null
                }
            }),
            { status: 201, headers: getAllHeaders(env, requestOrigin) }
        );
    } catch (error) {
        console.error('Create gift error:', error);
        return new Response(
            JSON.stringify({ error: 'Failed to create gift' }),
            { status: 500, headers: getAllHeaders(env, requestOrigin) }
        );
    }
}

/**
 * Update an existing gift (admin only)
 * @param {number} giftId - ID of gift to update
 * @param {Request} request - Request with updated gift data
 * @returns {Promise<Response>} Updated gift object
 */
async function handleUpdateGift(env, giftId, request, requestOrigin) {
    try {
        const body = await request.json();
        const { names, descriptions, price, imageUrl, category, productUrl } = body;

        // Input validation
        if (!giftId || isNaN(giftId)) {
            return new Response(
                JSON.stringify({ error: 'Invalid gift ID' }),
                { status: 400, headers: getAllHeaders(env, requestOrigin) }
            );
        }

        // Check if gift exists
        const existingGift = await env.DB.prepare('SELECT id FROM gifts WHERE id = ?').bind(giftId).first();
        if (!existingGift) {
            return new Response(
                JSON.stringify({ error: 'Gift not found' }),
                { status: 404, headers: getAllHeaders(env, requestOrigin) }
            );
        }

        // Validate inputs (same as create)
        if (!names || !names.en || !names.de || !names.ta) {
            return new Response(
                JSON.stringify({ error: 'All language names are required (en, de, ta)' }),
                { status: 400, headers: getAllHeaders(env, requestOrigin) }
            );
        }

        if (!descriptions || !descriptions.en || !descriptions.de || !descriptions.ta) {
            return new Response(
                JSON.stringify({ error: 'All language descriptions are required (en, de, ta)' }),
                { status: 400, headers: getAllHeaders(env, requestOrigin) }
            );
        }

        if (!price || typeof price !== 'number' || price <= 0) {
            return new Response(
                JSON.stringify({ error: 'Valid price is required (must be positive number)' }),
                { status: 400, headers: getAllHeaders(env, requestOrigin) }
            );
        }

        if (!imageUrl || typeof imageUrl !== 'string' || imageUrl.length === 0) {
            return new Response(
                JSON.stringify({ error: 'Image URL is required' }),
                { status: 400, headers: getAllHeaders(env, requestOrigin) }
            );
        }

        if (!category || typeof category !== 'string' || category.length === 0) {
            return new Response(
                JSON.stringify({ error: 'Category is required' }),
                { status: 400, headers: getAllHeaders(env, requestOrigin) }
            );
        }

        // Validate productUrl if provided
        if (productUrl !== null && productUrl !== undefined && productUrl !== '') {
            if (typeof productUrl !== 'string') {
                return new Response(
                    JSON.stringify({ error: 'Product URL must be a string' }),
                    { status: 400, headers: getAllHeaders(env, requestOrigin) }
                );
            }
            // Check if URL starts with http:// or https:// and doesn't contain javascript:
            if (!productUrl.startsWith('http://') && !productUrl.startsWith('https://')) {
                return new Response(
                    JSON.stringify({ error: 'Product URL must start with http:// or https://' }),
                    { status: 400, headers: getAllHeaders(env, requestOrigin) }
                );
            }
            if (productUrl.toLowerCase().includes('javascript:')) {
                return new Response(
                    JSON.stringify({ error: 'Invalid product URL' }),
                    { status: 400, headers: getAllHeaders(env, requestOrigin) }
                );
            }
            if (productUrl.length > 500) {
                return new Response(
                    JSON.stringify({ error: 'Product URL too long. Maximum 500 characters.' }),
                    { status: 400, headers: getAllHeaders(env, requestOrigin) }
                );
            }
        }

        // Update gift in database
        await env.DB.prepare(
            'UPDATE gifts SET name_en = ?, name_de = ?, name_ta = ?, description_en = ?, description_de = ?, description_ta = ?, price = ?, image_url = ?, category = ?, product_url = ? WHERE id = ?'
        ).bind(
            names.en,
            names.de,
            names.ta,
            descriptions.en,
            descriptions.de,
            descriptions.ta,
            price,
            imageUrl,
            category,
            productUrl || null,
            giftId
        ).run();

        return new Response(
            JSON.stringify({
                success: true,
                gift: {
                    id: giftId,
                    names,
                    descriptions,
                    price,
                    imageUrl,
                    category,
                    productUrl: productUrl || null
                }
            }),
            { status: 200, headers: getAllHeaders(env, requestOrigin) }
        );
    } catch (error) {
        console.error('Update gift error:', error);
        return new Response(
            JSON.stringify({ error: 'Failed to update gift' }),
            { status: 500, headers: getAllHeaders(env, requestOrigin) }
        );
    }
}

/**
 * Delete a gift (admin only)
 * WARNING: This also deletes all associated contributions
 * @param {number} giftId - ID of gift to delete
 * @returns {Promise<Response>} Success confirmation
 */
async function handleDeleteGift(env, giftId, requestOrigin) {
    try {
        if (!giftId || isNaN(giftId)) {
            return new Response(
                JSON.stringify({ error: 'Invalid gift ID' }),
                { status: 400, headers: getAllHeaders(env, requestOrigin) }
            );
        }

        const result = await env.DB.prepare('DELETE FROM gifts WHERE id = ?').bind(giftId).run();

        if (result.meta.changes === 0) {
            return new Response(
                JSON.stringify({ error: 'Gift not found or could not be deleted' }),
                { status: 404, headers: getAllHeaders(env, requestOrigin) }
            );
        }

        return new Response(
            JSON.stringify({ success: true }),
            { status: 200, headers: getAllHeaders(env, requestOrigin) }
        );
    } catch (error) {
        console.error('Delete gift error:', error);
        return new Response(
            JSON.stringify({ error: 'Failed to delete gift' }),
            { status: 500, headers: getAllHeaders(env, requestOrigin) }
        );
    }
}

/**
 * Make a contribution to a gift (public with rate limiting)
 * @param {number} giftId - ID of gift to contribute to
 * @param {Request} request - Request with contribution data
 * @param {RateLimiter} rateLimiter - Rate limiter instance
 * @returns {Promise<Response>} Created contribution object
 */
async function handleMakeContribution(env, giftId, request, rateLimiter, requestOrigin) {
    try {
        const body = await request.json();
        const { contributorName, amount, message } = body;

        // Input validation
        if (!giftId || isNaN(giftId)) {
            return new Response(
                JSON.stringify({ error: 'Invalid gift ID' }),
                { status: 400, headers: getAllHeaders(env, requestOrigin) }
            );
        }

        if (!contributorName || typeof contributorName !== 'string' || contributorName.trim().length === 0) {
            return new Response(
                JSON.stringify({ error: 'Contributor name is required' }),
                { status: 400, headers: getAllHeaders(env, requestOrigin) }
            );
        }

        if (contributorName.length > 100) {
            return new Response(
                JSON.stringify({ error: 'Contributor name too long. Maximum 100 characters.' }),
                { status: 400, headers: getAllHeaders(env, requestOrigin) }
            );
        }

        if (!amount || typeof amount !== 'number' || amount <= 0) {
            return new Response(
                JSON.stringify({ error: 'Valid contribution amount is required (must be positive number)' }),
                { status: 400, headers: getAllHeaders(env, requestOrigin) }
            );
        }

        if (message && message.length > 200) {
            return new Response(
                JSON.stringify({ error: 'Message too long. Maximum 200 characters.' }),
                { status: 400, headers: getAllHeaders(env, requestOrigin) }
            );
        }

        // Rate limiting for contributions (10 per 15 minutes per IP)
        const clientIP = request.headers.get('CF-Connecting-IP') || 'unknown';
        const rateLimit = await rateLimiter.checkRateLimit(
            `contribution:${clientIP}`,
            10,
            15 * 60 * 1000
        );

        if (!rateLimit.allowed) {
            return new Response(
                JSON.stringify({ error: 'Too many contribution attempts. Please try again later.' }),
                { status: 429, headers: getAllHeaders(env, requestOrigin) }
            );
        }

        // Check if gift exists and get current contribution total
        const gift = await env.DB.prepare(
            'SELECT id, price FROM gifts WHERE id = ?'
        ).bind(giftId).first();

        if (!gift) {
            return new Response(
                JSON.stringify({ error: 'Gift not found' }),
                { status: 404, headers: getAllHeaders(env, requestOrigin) }
            );
        }

        // Calculate current total contributions
        const contributionsResult = await env.DB.prepare(
            'SELECT COALESCE(SUM(amount), 0) as total_contributed FROM contributions WHERE gift_id = ?'
        ).bind(giftId).first();

        const totalContributed = contributionsResult.total_contributed;
        const remainingAmount = gift.price - totalContributed;

        // Check if contribution exceeds remaining amount
        if (amount > remainingAmount) {
            return new Response(
                JSON.stringify({
                    error: 'Contribution amount exceeds remaining balance',
                    remainingAmount: remainingAmount
                }),
                { status: 400, headers: getAllHeaders(env, requestOrigin) }
            );
        }

        // Insert contribution
        const result = await env.DB.prepare(
            'INSERT INTO contributions (gift_id, contributor_name, amount, message) VALUES (?, ?, ?, ?)'
        ).bind(giftId, contributorName.trim(), amount, message ? message.trim() : null).run();

        const contributionId = result.meta.last_row_id;

        return new Response(
            JSON.stringify({
                success: true,
                contribution: {
                    id: contributionId,
                    giftId,
                    contributorName: contributorName.trim(),
                    amount,
                    message: message ? message.trim() : null
                }
            }),
            { status: 201, headers: getAllHeaders(env, requestOrigin) }
        );
    } catch (error) {
        console.error('Make contribution error:', error);
        return new Response(
            JSON.stringify({ error: 'Failed to make contribution' }),
            { status: 500, headers: getAllHeaders(env, requestOrigin) }
        );
    }
}

/**
 * Get contributions for a specific gift (admin only)
 * @param {number} giftId - ID of gift to get contributions for
 * @returns {Promise<Response>} Array of contributions
 */
async function handleGetGiftContributions(env, giftId, requestOrigin) {
    try {
        if (!giftId || isNaN(giftId)) {
            return new Response(
                JSON.stringify({ error: 'Invalid gift ID' }),
                { status: 400, headers: getAllHeaders(env, requestOrigin) }
            );
        }

        const result = await env.DB.prepare(
            'SELECT id, contributor_name, amount, message, created_at FROM contributions WHERE gift_id = ? ORDER BY created_at DESC'
        ).bind(giftId).all();

        return new Response(
            JSON.stringify(result.results),
            { status: 200, headers: getAllHeaders(env, requestOrigin) }
        );
    } catch (error) {
        console.error('Get contributions error:', error);
        return new Response(
            JSON.stringify({ error: 'Failed to fetch contributions' }),
            { status: 500, headers: getAllHeaders(env, requestOrigin) }
        );
    }
}

/**
 * Get page content by page ID and optional language (public)
 * @param {string} pageId - Page identifier (e.g., 'home', 'christian-ceremony')
 * @param {string} language - Language code (optional: 'en', 'de', 'ta')
 * @returns {Promise<Response>} Page content as JSON
 */
async function handleGetPageContent(env, pageId, language, requestOrigin) {
    try {
        // Input validation
        if (!pageId || typeof pageId !== 'string' || !/^[a-z0-9-]+$/.test(pageId)) {
            return new Response(
                JSON.stringify({ error: 'Invalid page ID format' }),
                { status: 400, headers: getAllHeaders(env, requestOrigin) }
            );
        }

        // Validate language if provided
        const validLanguages = ['en', 'de', 'ta'];
        if (language && !validLanguages.includes(language)) {
            return new Response(
                JSON.stringify({ error: 'Invalid language. Must be en, de, or ta' }),
                { status: 400, headers: getAllHeaders(env, requestOrigin) }
            );
        }

        if (language) {
            // Get content for specific language with fallback to 'en'
            const result = await env.DB.prepare(
                'SELECT content, updated_at, language FROM page_content WHERE page_id = ? AND language = ?'
            ).bind(pageId, language).first();

            if (result) {
                return new Response(
                    JSON.stringify({
                        pageId,
                        language: result.language,
                        content: JSON.parse(result.content),
                        updatedAt: result.updated_at
                    }),
                    { status: 200, headers: getAllHeaders(env, requestOrigin) }
                );
            }

            // Fallback to English
            const fallbackResult = await env.DB.prepare(
                'SELECT content, updated_at, language FROM page_content WHERE page_id = ? AND language = ?'
            ).bind(pageId, 'en').first();

            if (fallbackResult) {
                return new Response(
                    JSON.stringify({
                        pageId,
                        language: fallbackResult.language,
                        content: JSON.parse(fallbackResult.content),
                        updatedAt: fallbackResult.updated_at,
                        fallback: true
                    }),
                    { status: 200, headers: getAllHeaders(env, requestOrigin) }
                );
            }

            // No content found
            return new Response(
                JSON.stringify({ error: 'Page content not found' }),
                { status: 404, headers: getAllHeaders(env, requestOrigin) }
            );
        } else {
            // Get all languages for the page
            const results = await env.DB.prepare(
                'SELECT content, updated_at, language FROM page_content WHERE page_id = ? ORDER BY language'
            ).bind(pageId).all();

            if (!results.results || results.results.length === 0) {
                return new Response(
                    JSON.stringify({ error: 'Page content not found' }),
                    { status: 404, headers: getAllHeaders(env, requestOrigin) }
                );
            }

            // Build response with all languages
            const contentByLanguage = {};
            for (const row of results.results) {
                contentByLanguage[row.language] = {
                    content: JSON.parse(row.content),
                    updatedAt: row.updated_at
                };
            }

            return new Response(
                JSON.stringify({
                    pageId,
                    languages: contentByLanguage
                }),
                { status: 200, headers: getAllHeaders(env, requestOrigin) }
            );
        }
    } catch (error) {
        console.error('Get page content error:', error);
        return new Response(
            JSON.stringify({ error: 'Failed to fetch page content' }),
            { status: 500, headers: getAllHeaders(env, requestOrigin) }
        );
    }
}

/**
 * Update page content for specific language (admin only)
 * @param {string} pageId - Page identifier to update
 * @param {string} language - Language code ('en', 'de', 'ta')
 * @param {Request} request - Request with updated content
 * @returns {Promise<Response>} Updated content confirmation
 */
async function handleUpdatePageContent(env, pageId, language, request, requestOrigin) {
    try {
        // Input validation
        if (!pageId || typeof pageId !== 'string' || !/^[a-z0-9-]+$/.test(pageId)) {
            return new Response(
                JSON.stringify({ error: 'Invalid page ID format' }),
                { status: 400, headers: getAllHeaders(env, requestOrigin) }
            );
        }

        // Validate language
        const validLanguages = ['en', 'de', 'ta'];
        if (!language || !validLanguages.includes(language)) {
            return new Response(
                JSON.stringify({ error: 'Invalid language. Must be en, de, or ta' }),
                { status: 400, headers: getAllHeaders(env, requestOrigin) }
            );
        }

        const body = await request.json();
        const { content } = body;

        if (!content || typeof content !== 'object') {
            return new Response(
                JSON.stringify({ error: 'Content is required and must be an object' }),
                { status: 400, headers: getAllHeaders(env, requestOrigin) }
            );
        }

        // Validate content size (max 1MB JSON)
        const contentStr = JSON.stringify(content);
        if (contentStr.length > 1048576) {
            return new Response(
                JSON.stringify({ error: 'Content too large. Maximum 1MB.' }),
                { status: 400, headers: getAllHeaders(env, requestOrigin) }
            );
        }

        const now = Date.now();

        // Update or insert page content for specific language
        await env.DB.prepare(
            'INSERT OR REPLACE INTO page_content (page_id, language, content, updated_at) VALUES (?, ?, ?, ?)'
        ).bind(pageId, language, contentStr, now).run();

        return new Response(
            JSON.stringify({
                success: true,
                pageId,
                language,
                updatedAt: now
            }),
            { status: 200, headers: getAllHeaders(env, requestOrigin) }
        );
    } catch (error) {
        console.error('Update page content error:', error);
        return new Response(
            JSON.stringify({ error: 'Failed to update page content' }),
            { status: 500, headers: getAllHeaders(env, requestOrigin) }
        );
    }
}

/**
 * Upload image to R2 storage (admin only)
 * @param {Object} env - Environment bindings (includes R2 IMAGES bucket)
 * @param {Request} request - Multipart form request with image file
 * @returns {Promise<Response>} Upload result with public URL
 */
async function handleImageUpload(env, request, requestOrigin) {
    try {
        // Parse multipart form data
        const formData = await request.formData();
        const file = formData.get('image');

        if (!file) {
            return new Response(
                JSON.stringify({ error: 'No image file provided' }),
                { status: 400, headers: getAllHeaders(env, requestOrigin) }
            );
        }

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            return new Response(
                JSON.stringify({ error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.' }),
                { status: 400, headers: getAllHeaders(env, requestOrigin) }
            );
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            return new Response(
                JSON.stringify({ error: 'File too large. Maximum size is 5MB.' }),
                { status: 400, headers: getAllHeaders(env, requestOrigin) }
            );
        }

        // Generate unique filename
        const timestamp = Date.now();
        const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_'); // Sanitize filename
        const extension = originalName.split('.').pop();
        const filename = `${timestamp}-${originalName}`;

        // Upload to R2
        await env.IMAGES.put(filename, file.stream(), {
            httpMetadata: {
                contentType: file.type,
            },
        });

        // Return public URL from R2.dev subdomain
        const publicUrl = `https://pub-9104535923334686922936588689cb93.r2.dev/${filename}`;

        return new Response(
            JSON.stringify({
                success: true,
                url: publicUrl,
                filename: filename,
                size: file.size,
                type: file.type
            }),
            { status: 200, headers: getAllHeaders(env, requestOrigin) }
        );
    } catch (error) {
        console.error('Image upload error:', error);
        return new Response(
            JSON.stringify({ error: 'Failed to upload image' }),
            { status: 500, headers: getAllHeaders(env, requestOrigin) }
        );
    }
}

/**
 * Mark a gift as purchased directly (public with rate limiting)
 * Creates a contribution record for the full remaining amount
 * @param {number} giftId - ID of gift that was purchased
 * @param {Request} request - Request with purchaser data
 * @param {RateLimiter} rateLimiter - Rate limiter instance
 * @returns {Promise<Response>} Created contribution object
 */
async function handleMarkPurchased(env, giftId, request, rateLimiter, requestOrigin) {
    try {
        const body = await request.json();
        const { contributorName, storeName } = body;

        // Input validation
        if (!giftId || isNaN(giftId)) {
            return new Response(
                JSON.stringify({ error: 'Invalid gift ID' }),
                { status: 400, headers: getAllHeaders(env, requestOrigin) }
            );
        }

        if (!contributorName || typeof contributorName !== 'string' || contributorName.trim().length === 0) {
            return new Response(
                JSON.stringify({ error: 'Contributor name is required' }),
                { status: 400, headers: getAllHeaders(env, requestOrigin) }
            );
        }

        if (contributorName.length > 100) {
            return new Response(
                JSON.stringify({ error: 'Contributor name too long. Maximum 100 characters.' }),
                { status: 400, headers: getAllHeaders(env, requestOrigin) }
            );
        }

        if (storeName && storeName.length > 200) {
            return new Response(
                JSON.stringify({ error: 'Store name too long. Maximum 200 characters.' }),
                { status: 400, headers: getAllHeaders(env, requestOrigin) }
            );
        }

        // Rate limiting for direct purchases (same as contributions: 10 per 15 minutes per IP)
        const clientIP = request.headers.get('CF-Connecting-IP') || 'unknown';
        const rateLimit = await rateLimiter.checkRateLimit(
            `contribution:${clientIP}`,
            10,
            15 * 60 * 1000
        );

        if (!rateLimit.allowed) {
            return new Response(
                JSON.stringify({ error: 'Too many purchase attempts. Please try again later.' }),
                { status: 429, headers: getAllHeaders(env, requestOrigin) }
            );
        }

        // Check if gift exists and get current contribution total
        const gift = await env.DB.prepare(
            'SELECT id, price FROM gifts WHERE id = ?'
        ).bind(giftId).first();

        if (!gift) {
            return new Response(
                JSON.stringify({ error: 'Gift not found' }),
                { status: 404, headers: getAllHeaders(env, requestOrigin) }
            );
        }

        // Calculate current total contributions
        const contributionsResult = await env.DB.prepare(
            'SELECT COALESCE(SUM(amount), 0) as total_contributed FROM contributions WHERE gift_id = ?'
        ).bind(giftId).first();

        const totalContributed = contributionsResult.total_contributed;
        const remainingAmount = gift.price - totalContributed;

        // Check if gift is already fully funded
        if (remainingAmount <= 0) {
            return new Response(
                JSON.stringify({
                    error: 'Gift is already fully funded',
                    remainingAmount: 0
                }),
                { status: 400, headers: getAllHeaders(env, requestOrigin) }
            );
        }

        // Create message indicating direct purchase
        const message = storeName
            ? `Purchased directly from ${storeName.trim()}`
            : 'Purchased directly';

        // Insert contribution for full remaining amount
        const result = await env.DB.prepare(
            'INSERT INTO contributions (gift_id, contributor_name, amount, message) VALUES (?, ?, ?, ?)'
        ).bind(giftId, contributorName.trim(), remainingAmount, message).run();

        const contributionId = result.meta.last_row_id;

        return new Response(
            JSON.stringify({
                success: true,
                contribution: {
                    id: contributionId,
                    giftId,
                    contributorName: contributorName.trim(),
                    amount: remainingAmount,
                    message: message
                }
            }),
            { status: 201, headers: getAllHeaders(env, requestOrigin) }
        );
    } catch (error) {
        console.error('Mark purchased error:', error);
        return new Response(
            JSON.stringify({ error: 'Failed to mark gift as purchased' }),
            { status: 500, headers: getAllHeaders(env, requestOrigin) }
        );
    }
}

// Router
async function handleRequest(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;
    const requestOrigin = request.headers.get('Origin') || '';

    // Handle CORS preflight
    if (method === 'OPTIONS') {
        return new Response(null, {
            status: 204,
            headers: getAllHeaders(env, requestOrigin)
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
            { status: 429, headers: getAllHeaders(env, requestOrigin) }
        );
    }

    // Routes
    try {
        // Public routes
        if (path === '/api/admin/login' && method === 'POST') {
            return await handleAdminLogin(env, request, rateLimiter, requestOrigin);
        }

        if (path.startsWith('/api/validate/') && method === 'GET') {
            const code = path.split('/').pop();
            return await handleValidateCode(env, code, requestOrigin);
        }

        // Gift endpoints - public
        if (path === '/api/gifts' && method === 'GET') {
            return await handleGetGifts(env, requestOrigin);
        }

        if (path.startsWith('/api/gifts/') && path.endsWith('/contribute') && method === 'POST') {
            const giftId = parseInt(path.split('/')[3]);
            return await handleMakeContribution(env, giftId, request, rateLimiter, requestOrigin);
        }

        if (path.startsWith('/api/gifts/') && path.endsWith('/mark-purchased') && method === 'POST') {
            const giftId = parseInt(path.split('/')[3]);
            return await handleMarkPurchased(env, giftId, request, rateLimiter, requestOrigin);
        }

        // Page content endpoints - public read
        // GET /api/content/{pageId} - Get all languages
        // GET /api/content/{pageId}/{language} - Get specific language
        if (path.startsWith('/api/content/') && method === 'GET') {
            const parts = path.split('/').filter(p => p);
            const pageId = parts[2];
            const language = parts[3] || null;
            return await handleGetPageContent(env, pageId, language, requestOrigin);
        }

        // Protected routes (require admin authentication)
        const authError = await requireAdmin(env, request, requestOrigin);
        if (authError) return authError;

        if (path === '/api/guests' && method === 'GET') {
            return await handleGetGuests(env, requestOrigin);
        }

        if (path === '/api/guests' && method === 'POST') {
            return await handleSaveGuest(env, request, requestOrigin);
        }

        if (path.startsWith('/api/guests/') && method === 'DELETE') {
            const code = path.split('/').pop();
            return await handleDeleteGuest(env, code, requestOrigin);
        }

        if (path === '/api/generate-code' && method === 'POST') {
            return await handleGenerateCode(env, request, requestOrigin);
        }

        // Gift endpoints - admin only
        if (path === '/api/gifts' && method === 'POST') {
            return await handleCreateGift(env, request, requestOrigin);
        }

        if (path.startsWith('/api/gifts/') && !path.includes('/contribute') && !path.includes('/contributions') && !path.includes('/mark-purchased') && method === 'PUT') {
            const giftId = parseInt(path.split('/')[3]);
            return await handleUpdateGift(env, giftId, request, requestOrigin);
        }

        if (path.startsWith('/api/gifts/') && !path.includes('/contribute') && !path.includes('/contributions') && !path.includes('/mark-purchased') && method === 'DELETE') {
            const giftId = parseInt(path.split('/')[3]);
            return await handleDeleteGift(env, giftId, requestOrigin);
        }

        if (path.startsWith('/api/gifts/') && path.endsWith('/contributions') && method === 'GET') {
            const giftId = parseInt(path.split('/')[3]);
            return await handleGetGiftContributions(env, giftId, requestOrigin);
        }

        // Page content endpoints - admin write
        // PUT /api/content/{pageId}/{language}
        if (path.startsWith('/api/content/') && method === 'PUT') {
            const parts = path.split('/').filter(p => p);
            const pageId = parts[2];
            const language = parts[3];

            if (!language) {
                return new Response(
                    JSON.stringify({ error: 'Language parameter is required in URL: /api/content/{pageId}/{language}' }),
                    { status: 400, headers: getAllHeaders(env, requestOrigin) }
                );
            }

            return await handleUpdatePageContent(env, pageId, language, request, requestOrigin);
        }

        // Image upload endpoint - admin only
        // POST /api/upload-image
        if (path === '/api/upload-image' && method === 'POST') {
            return await handleImageUpload(env, request, requestOrigin);
        }

        // 404 - Not found
        return new Response(
            JSON.stringify({ error: 'Not found' }),
            { status: 404, headers: getAllHeaders(env, requestOrigin) }
        );
    } catch (error) {
        console.error('Request error:', error);
        return new Response(
            JSON.stringify({ error: 'Internal server error' }),
            { status: 500, headers: getAllHeaders(env, requestOrigin) }
        );
    }
}

// Worker entry point
export default {
    async fetch(request, env, ctx) {
        return await handleRequest(request, env);
    }
};

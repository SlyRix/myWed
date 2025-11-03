// src/server/server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;

// Admin credentials (in production, use environment variables and proper password hashing)
const ADMIN_PASSWORD_HASH = crypto.createHash('sha256').update(process.env.ADMIN_PASSWORD || 'wedding2026admin').digest('hex');
const sessions = new Map(); // Store active sessions

// Enable CORS for frontend with credentials
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));

// Parse JSON request bodies
app.use(bodyParser.json());

// Security headers middleware
app.use((req, res, next) => {
    // HTTPS redirect (only in production)
    if (process.env.NODE_ENV === 'production' && !req.secure && req.get('x-forwarded-proto') !== 'https') {
        return res.redirect('https://' + req.headers.host + req.url);
    }

    // Security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    res.setHeader('Content-Security-Policy',
        "default-src 'self'; " +
        "script-src 'self' 'unsafe-inline' https://maps.googleapis.com; " +
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
        "img-src 'self' data: https:; " +
        "font-src 'self' https://fonts.gstatic.com; " +
        "connect-src 'self' https://*.emailjs.com https://maps.googleapis.com;"
    );

    next();
});

// Middleware to check admin authentication
const requireAdmin = (req, res, next) => {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ error: 'Authentication required' });
    }

    const session = sessions.get(token);

    if (!session || session.expiresAt < Date.now()) {
        sessions.delete(token);
        return res.status(401).json({ error: 'Session expired' });
    }

    next();
};

// Rate limiting
const rateLimit = require('express-rate-limit');

const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP'
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5, // 5 attempts per 15 minutes
    message: 'Too many login attempts'
});

app.use('/api/', generalLimiter);

// Admin login endpoint
app.post('/api/admin/login', authLimiter, (req, res) => {
    const { password } = req.body;

    if (!password) {
        return res.status(400).json({ error: 'Password required' });
    }

    const passwordHash = crypto.createHash('sha256').update(password).digest('hex');

    if (passwordHash === ADMIN_PASSWORD_HASH) {
        // Generate session token
        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = Date.now() + (24 * 60 * 60 * 1000); // 24 hours

        sessions.set(token, { expiresAt });

        res.json({ success: true, token });
    } else {
        res.status(401).json({ error: 'Invalid password' });
    }
});

// Get all guests (protected)
app.get('/api/guests', requireAdmin, (req, res) => {
    try {
        const guestList = db.getGuestList();
        res.json(guestList);
    } catch (error) {
        console.error('Error fetching guests:', error);
        res.status(500).json({ error: 'Failed to fetch guest list' });
    }
});

// Add or update a guest (protected with validation)
app.post('/api/guests', requireAdmin, (req, res) => {
    try {
        const { code, guestData } = req.body;

        // Input validation
        if (!code || typeof code !== 'string' || !/^[A-Z0-9]{4,10}$/.test(code)) {
            return res.status(400).json({ error: 'Invalid code format. Must be 4-10 uppercase alphanumeric characters.' });
        }

        if (!guestData || !guestData.name || typeof guestData.name !== 'string') {
            return res.status(400).json({ error: 'Invalid guest data. Name is required.' });
        }

        if (guestData.name.length > 100) {
            return res.status(400).json({ error: 'Guest name too long. Maximum 100 characters.' });
        }

        if (!Array.isArray(guestData.ceremonies)) {
            return res.status(400).json({ error: 'Invalid ceremonies data. Must be an array.' });
        }

        // Validate ceremonies array values
        const validCeremonies = ['christian', 'hindu'];
        for (const ceremony of guestData.ceremonies) {
            if (!validCeremonies.includes(ceremony)) {
                return res.status(400).json({ error: 'Invalid ceremony type. Must be "christian" or "hindu".' });
            }
        }

        const success = db.saveGuest(code, guestData);

        if (success) {
            res.json({ success: true, code, guest: guestData });
        } else {
            res.status(500).json({ error: 'Failed to save guest' });
        }
    } catch (error) {
        console.error('Error saving guest:', error);
        res.status(500).json({ error: 'Failed to save guest' });
    }
});

// Delete a guest (protected with validation)
app.delete('/api/guests/:code', requireAdmin, (req, res) => {
    try {
        const { code } = req.params;

        // Input validation
        if (!code || typeof code !== 'string' || !/^[A-Z0-9]{4,10}$/.test(code)) {
            return res.status(400).json({ error: 'Invalid code format' });
        }

        const success = db.deleteGuest(code);

        if (success) {
            res.json({ success: true });
        } else {
            res.status(404).json({ error: 'Guest not found or could not be deleted' });
        }
    } catch (error) {
        console.error('Error deleting guest:', error);
        res.status(500).json({ error: 'Failed to delete guest' });
    }
});

// Validate access code (public endpoint with validation)
app.get('/api/validate/:code', (req, res) => {
    try {
        const { code } = req.params;

        // Input validation
        if (!code || typeof code !== 'string' || code.length > 20) {
            return res.status(400).json({ valid: false, error: 'Invalid code format' });
        }

        const validation = db.validateAccessCode(code);
        res.json(validation);
    } catch (error) {
        console.error('Error validating code:', error);
        res.status(500).json({ error: 'Failed to validate code' });
    }
});

// Generate a guest code (protected with validation)
app.post('/api/generate-code', requireAdmin, (req, res) => {
    try {
        const { name } = req.body;

        // Input validation
        if (!name || typeof name !== 'string') {
            return res.status(400).json({ error: 'Name is required' });
        }

        if (name.length > 100) {
            return res.status(400).json({ error: 'Name too long. Maximum 100 characters.' });
        }

        const code = db.generateGuestCode(name);
        res.json({ code });
    } catch (error) {
        console.error('Error generating code:', error);
        res.status(500).json({ error: 'Failed to generate code' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
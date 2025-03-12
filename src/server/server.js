// src/server/server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;

// More permissive CORS configuration
app.use(cors({
    origin: '*', // Allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parse JSON request bodies
app.use(bodyParser.json());

// Get all guests
app.get('/api/guests', (req, res) => {
    try {
        const guestList = db.getGuestList();
        res.json(guestList);
    } catch (error) {
        console.error('Error fetching guests:', error);
        res.status(500).json({ error: 'Failed to fetch guest list' });
    }
});

// Add or update a guest
app.post('/api/guests', (req, res) => {
    try {
        const { code, guestData } = req.body;

        if (!code || !guestData || !guestData.name || !Array.isArray(guestData.ceremonies)) {
            return res.status(400).json({ error: 'Invalid guest data' });
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

// Delete a guest
app.delete('/api/guests/:code', (req, res) => {
    try {
        const { code } = req.params;
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

// Validate access code
app.get('/api/validate/:code', (req, res) => {
    try {
        const { code } = req.params;
        const validation = db.validateAccessCode(code);
        res.json(validation);
    } catch (error) {
        console.error('Error validating code:', error);
        res.status(500).json({ error: 'Failed to validate code' });
    }
});

// Generate a guest code
app.post('/api/generate-code', (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'Name is required' });
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
// src/server/db.js
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Path to our JSON database file
const DB_PATH = path.join(__dirname, '../../data/guestList.json');

// Default guest list (will be used if the database file doesn't exist)
const defaultGuestList = {
    "SIVA": {
        name: "Sivani Family",
        ceremonies: ["christian", "hindu"]  // Access to both ceremonies
    },
    "RUSH": {
        name: "Rushel Family",
        ceremonies: ["christian"]  // Only Christian ceremony
    },
    "TEST": {
        name: "Test User",
        ceremonies: ["hindu"]  // Only Hindu ceremony
    }
};

// Ensure the data directory exists
const ensureDataDirExists = () => {
    const dataDir = path.dirname(DB_PATH);
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }
};

// Initialize the database file if it doesn't exist
const initDb = () => {
    ensureDataDirExists();

    if (!fs.existsSync(DB_PATH)) {
        fs.writeFileSync(DB_PATH, JSON.stringify(defaultGuestList, null, 2));
        console.log('Guest database initialized with default data');
    }
};

// Read the entire guest list
const getGuestList = () => {
    try {
        if (!fs.existsSync(DB_PATH)) {
            initDb();
        }

        const data = fs.readFileSync(DB_PATH, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading guest list:', error);
        return defaultGuestList;
    }
};

// Save the entire guest list
const saveGuestList = (guestList) => {
    try {
        ensureDataDirExists();
        fs.writeFileSync(DB_PATH, JSON.stringify(guestList, null, 2));
        return true;
    } catch (error) {
        console.error('Error saving guest list:', error);
        return false;
    }
};

// Add or update a single guest
const saveGuest = (code, guestData) => {
    try {
        const guestList = getGuestList();
        guestList[code] = guestData;
        return saveGuestList(guestList);
    } catch (error) {
        console.error('Error saving guest:', error);
        return false;
    }
};

// Delete a guest
const deleteGuest = (code) => {
    try {
        const guestList = getGuestList();
        if (guestList[code]) {
            delete guestList[code];
            return saveGuestList(guestList);
        }
        return false;
    } catch (error) {
        console.error('Error deleting guest:', error);
        return false;
    }
};

// Validate an access code
const validateAccessCode = (code) => {
    if (!code) return { valid: false };

    const upperCode = code.trim().toUpperCase();
    const guestList = getGuestList();
    const guest = guestList[upperCode];

    if (guest) {
        return {
            valid: true,
            guest,
            ceremonies: guest.ceremonies || []
        };
    }

    return { valid: false };
};

// Generate a unique guest code using cryptographically secure random values
const generateGuestCode = (name) => {
    if (!name) return '';

    const guestList = getGuestList();
    let newCode;
    let attempts = 0;
    const maxAttempts = 20;

    // Generate cryptographically secure random codes
    while (attempts < maxAttempts) {
        // Generate 8-character alphanumeric code
        const randomBytes = crypto.randomBytes(6);
        newCode = randomBytes.toString('base64')
            .replace(/[^A-Z0-9]/gi, '')
            .toUpperCase()
            .substring(0, 8);

        // Ensure uniqueness
        if (!guestList[newCode] && newCode.length === 8) {
            return newCode;
        }

        attempts++;
    }

    // Fallback: use name-based code with timestamp
    const timestamp = Date.now().toString(36).toUpperCase();
    const namePrefix = name.trim().substring(0, 4).toUpperCase().replace(/[^A-Z]/g, '');
    newCode = `${namePrefix}${timestamp}`.substring(0, 8);

    return newCode;
};

// Initialize the DB when this module is first loaded
initDb();

module.exports = {
    getGuestList,
    saveGuestList,
    saveGuest,
    deleteGuest,
    validateAccessCode,
    generateGuestCode
};
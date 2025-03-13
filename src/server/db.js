// src/server/db.js
const fs = require('fs');
const path = require('path');

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

// Generate a unique guest code
const generateGuestCode = (name) => {
    if (!name) return '';

    // Take first 4 letters and convert to uppercase
    let baseCode = name.trim().substring(0, 4).toUpperCase();

    // Check if code already exists
    let newCode = baseCode;
    let counter = 1;
    const guestList = getGuestList();

    while (guestList[newCode]) {
        newCode = `${baseCode}${counter}`;
        counter++;
    }

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
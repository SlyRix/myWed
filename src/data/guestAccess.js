// src/data/guestAccess.js
export const guestList = {
    // Format: [invitationCode]: {name, ceremonies}
    "SIVA123": {
        name: "Sivani Family",
        ceremonies: ["christian", "hindu"]  // Access to both ceremonies
    },
    "RUSH456": {
        name: "Rushel Family",
        ceremonies: ["christian"]  // Only Christian ceremony
    },
    "TEST789": {
        name: "TEST Family",
        ceremonies: ["hindu"]  // Only Hindu ceremony
    }
};
// src/data/guestAccess.js
export const guestList = {
    // Format: [invitationCode]: {name, ceremonies}
    "SIVA": {
        name: "Sivani Family",
        ceremonies: ["christian", "hindu"]  // Access to both ceremonies
    },
    "RUSH": {
        name: "Rushel Family",
        ceremonies: ["christian"]  // Only Christian ceremony
    },
    "TEST": {
        name: "TEST Family",
        ceremonies: ["hindu"]  // Only Hindu ceremony
    },
    "NONE": {
        name: "NONE Family",
        ceremonies: [""] // NONE
    }
};
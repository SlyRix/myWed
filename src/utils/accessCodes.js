// src/utils/accessCodes.js

export const INVITATION_TYPES = {
    ALL: 'all',                           // All ceremonies
    CHRISTIAN_AND_RECEPTION: 'christian', // Christian ceremony + reception
    HINDU_AND_RECEPTION: 'hindu',         // Hindu ceremony + reception
    RECEPTION_ONLY: 'reception'           // Reception only
};

// These would be your actual access codes that you print on the invitations
// For a real implementation, use longer, more secure codes
const ACCESS_CODES = {
    // All ceremonies (close family, wedding party)
    'FULL2026': INVITATION_TYPES.ALL,
    'FAMILY26': INVITATION_TYPES.ALL,
    'PARTYY26': INVITATION_TYPES.ALL,

    // Christian ceremony + reception
    'CHRIST26': INVITATION_TYPES.CHRISTIAN_AND_RECEPTION,
    'CROSS26': INVITATION_TYPES.CHRISTIAN_AND_RECEPTION,

    // Hindu ceremony + reception
    'HINDU26': INVITATION_TYPES.HINDU_AND_RECEPTION,
    'KARMA26': INVITATION_TYPES.HINDU_AND_RECEPTION,

    // Reception only
    'CELEB26': INVITATION_TYPES.RECEPTION_ONLY,
    'PARTY26': INVITATION_TYPES.RECEPTION_ONLY,

    // Master password for testing all views (for you as the site owner)
    'MASTER26': INVITATION_TYPES.ALL
};

// For backward compatibility, also recognize the original password
ACCESS_CODES['wedding2026'] = INVITATION_TYPES.ALL;

export const validateAccessCode = (code) => {
    if (!code) return { valid: false };

    const upperCode = code.toUpperCase();
    const invitationType = ACCESS_CODES[upperCode];

    if (invitationType) {
        return {
            valid: true,
            invitationType
        };
    }

    return { valid: false };
};
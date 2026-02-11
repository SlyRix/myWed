/**
 * Application Constants
 * Centralized location for all magic numbers and configuration values
 * @module constants
 */

// ========== BREAKPOINTS ==========
export const MOBILE_BREAKPOINT = 768;
export const TABLET_BREAKPOINT = 1024;
export const DESKTOP_BREAKPOINT = 1280;

// ========== SCROLL ==========
export const SCROLL_THRESHOLD = 50;
export const SMOOTH_SCROLL_OFFSET = 100;

// ========== LIMITS ==========
export const MAX_GUESTS_PER_CEREMONY = 10;
export const MAX_GUEST_NAME_LENGTH = 100;
export const MIN_CODE_LENGTH = 4;
export const MAX_CODE_LENGTH = 10;

// ========== API ==========
export const API_TIMEOUT_MS = 10000; // 10 seconds
export const API_RETRY_ATTEMPTS = 3;
export const API_RETRY_DELAY_MS = 1000;

// ========== RATE LIMITING ==========
export const LOGIN_RATE_LIMIT_ATTEMPTS = 5;
export const LOGIN_RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
export const API_RATE_LIMIT_REQUESTS = 100;
export const API_RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

// ========== SPLASH SCREEN ==========
export const SPLASH_PHASE_DELAYS = {
    CLOSED: 800,
    OPENING: 1700,
    REVEALED: 2000,
    EXIT: 800,
    SKIP_EXIT: 500
};
export const SPLASH_CARD_PERSPECTIVE = 1200;
export const SPLASH_REDUCED_MOTION_DURATION = 2000;

// ========== ANIMATION ==========
export const BUBBLE_MIN_DURATION = 10000; // 10 seconds
export const BUBBLE_MAX_DURATION = 25000; // 25 seconds
export const BUBBLE_DEFAULT_COUNT = 10;
export const BUBBLE_MIN_SIZE = 50;
export const BUBBLE_MAX_SIZE = 200;
export const BUBBLE_MIN_OPACITY = 0.03;
export const BUBBLE_MAX_OPACITY = 0.08;
export const BUBBLE_MOUSE_STRENGTH = 20;

export const FADE_IN_DURATION = 300;
export const FADE_OUT_DURATION = 300;
export const SLIDE_DURATION = 500;

// ========== SESSION ==========
export const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours
export const SESSION_REFRESH_INTERVAL_MS = 60 * 60 * 1000; // 1 hour
export const TOKEN_EXPIRY_BUFFER_MS = 5 * 60 * 1000; // 5 minutes

// ========== QR CODE ==========
export const QR_CODE_SIZE = 200;
export const QR_CODE_ERROR_CORRECTION_LEVEL = 'H';
export const QR_CODE_MARGIN = true;

// ========== IMAGES ==========
export const IMAGE_LAZY_LOAD_THRESHOLD = '200px';
export const IMAGE_MAX_UPLOAD_SIZE_MB = 5;
export const IMAGE_QUALITY = 0.85;
export const THUMBNAIL_SIZE = 150;

// ========== FORM VALIDATION ==========
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const CODE_REGEX = /^[A-Z0-9]{4,10}$/;
export const PHONE_REGEX = /^\+?[\d\s\-()]+$/;

// ========== TIMEOUTS ==========
export const DEBOUNCE_DELAY_MS = 300;
export const THROTTLE_DELAY_MS = 100;
export const NOTIFICATION_DURATION_MS = 3000;
export const ERROR_MESSAGE_DURATION_MS = 5000;
export const SUCCESS_MESSAGE_DURATION_MS = 2000;

// ========== Z-INDEX LAYERS ==========
export const Z_INDEX_HEADER = 40;
export const Z_INDEX_MODAL = 50;
export const Z_INDEX_OVERLAY = 45;
export const Z_INDEX_DROPDOWN = 30;
export const Z_INDEX_TOOLTIP = 60;

// ========== DATES ==========
export const WEDDING_DATE = new Date('2024-09-07T14:00:00'); // Adjust to actual date

// ========== COLORS (for programmatic use) ==========
export const COLORS = {
    christian: {
        primary: '#faf9f6',
        secondary: '#d4af37',
        accent: '#1a3a5c',
        text: '#0f1c2e'
    },
    hindu: {
        primary: '#faf9f6',
        secondary: '#d4af37',
        accent: '#1a3a5c',
        text: '#0f1c2e'
    },
    wedding: {
        love: '#d4af37',
        gold: '#e8d48b',
        gray: '#0f1c2e',
        background: '#faf9f6'
    }
};

// ========== PAGINATION ==========
export const ITEMS_PER_PAGE = 20;
export const GALLERY_ITEMS_PER_PAGE = 12;
export const GUEST_LIST_PAGE_SIZE = 50;

// ========== FILE UPLOADS ==========
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
export const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm'];
export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

// ========== LOCAL STORAGE KEYS ==========
export const STORAGE_KEYS = {
    ADMIN_TOKEN: 'adminToken',
    INVITATION_CODE: 'invitationCode',
    HAS_SEEN_SPLASH: 'hasSeenSplash',
    LANGUAGE: 'i18nextLng',
    THEME_PREFERENCE: 'themePreference'
};

// ========== ERROR MESSAGES ==========
export const ERROR_MESSAGES = {
    NETWORK_ERROR: 'Network error - please check your connection',
    INVALID_CODE: 'Invalid invitation code',
    UNAUTHORIZED: 'Unauthorized - please log in again',
    SERVER_ERROR: 'Server error - please try again later',
    VALIDATION_FAILED: 'Validation failed - please check your input',
    TIMEOUT: 'Request timeout - please try again'
};

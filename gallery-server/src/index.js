require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const rateLimit = require('express-rate-limit');
const { requireGalleryCode } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 4000;
const STORAGE_PATH = process.env.STORAGE_PATH || '/gallery-storage';

// CORS
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map(o => o.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, cb) {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-gallery-code']
}));

app.use(express.json({ limit: '1mb' }));

// Rate limiting
const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 30,
  message: { error: 'Too many uploads, try again later' },
  standardHeaders: true,
  legacyHeaders: false
});

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false
});

app.use('/api', generalLimiter);

// Serve uploaded files (publicly accessible — needed for img src URLs)
app.use('/uploads', express.static(path.join(STORAGE_PATH, 'photos')));
app.use('/uploads/photos', express.static(path.join(STORAGE_PATH, 'photos')));
app.use('/uploads/videos', express.static(path.join(STORAGE_PATH, 'videos')));

// Public gallery routes (require gallery code)
app.use('/api/photos', requireGalleryCode, require('./routes/photos'));

// Upload (requires gallery code + upload rate limit)
app.use('/api/upload', requireGalleryCode, uploadLimiter, require('./routes/upload'));

// Admin routes (require admin token — no gallery code needed)
app.use('/api/admin', require('./routes/admin'));

// Health check (no auth)
app.get('/api/health', (req, res) => res.json({ ok: true, ts: Date.now() }));

app.listen(PORT, () => {
  console.log(`Wedding gallery server running on port ${PORT}`);
  console.log(`Storage path: ${STORAGE_PATH}`);
  console.log(`AI tagging: ${process.env.OPENAI_API_KEY ? 'enabled' : 'disabled (no OPENAI_API_KEY)'}`);
});

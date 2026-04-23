const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const mime = require('mime-types');
const { getDb } = require('../db');
const { tagPhoto } = require('../services/aiTagger');

const router = express.Router();

const STORAGE_PATH = process.env.STORAGE_PATH || '/gallery-storage';
const PHOTOS_DIR = path.join(STORAGE_PATH, 'photos');
const VIDEOS_DIR = path.join(STORAGE_PATH, 'videos');

fs.mkdirSync(PHOTOS_DIR, { recursive: true });
fs.mkdirSync(VIDEOS_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination(req, file, cb) {
    const isVideo = file.mimetype.startsWith('video/');
    cb(null, isVideo ? VIDEOS_DIR : PHOTOS_DIR);
  },
  filename(req, file, cb) {
    const id = uuidv4();
    const ext = mime.extension(file.mimetype) || path.extname(file.originalname).slice(1) || 'bin';
    req.photoId = id;
    cb(null, `${id}.${ext}`);
  }
});

const upload = multer({
  storage,
  fileFilter(req, file, cb) {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif',
      'video/mp4', 'video/quicktime', 'video/webm', 'video/x-msvideo'];
    cb(null, allowed.includes(file.mimetype));
  }
});

const CEREMONY_TAGS = ['christian', 'hindu', 'reception', 'other'];

router.post('/', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No valid file provided' });
  }

  const {
    uploader_name = 'Guest',
    caption = '',
    ceremony_tag = '',
    is_public = '1',
    device_id = ''
  } = req.body;

  if (uploader_name.length > 80) {
    return res.status(400).json({ error: 'Name too long' });
  }
  if (caption.length > 300) {
    return res.status(400).json({ error: 'Caption too long' });
  }

  const safeTag = CEREMONY_TAGS.includes(ceremony_tag) ? ceremony_tag : '';
  const isPublic = is_public === '1' || is_public === 'true' ? 1 : 0;
  const isVideo = req.file.mimetype.startsWith('video/');
  const id = req.photoId || uuidv4();

  getDb().prepare(`
    INSERT INTO photos (id, filename, local_path, uploader_name, caption, ceremony_tag,
      ai_tags, is_public, is_featured, likes, media_type, file_size, created_at)
    VALUES (?, ?, ?, ?, ?, ?, '[]', ?, 0, 0, ?, ?, ?)
  `).run(
    id,
    req.file.filename,
    req.file.path,
    uploader_name.trim(),
    caption.trim(),
    safeTag,
    isPublic,
    isVideo ? 'video' : 'image',
    req.file.size,
    Date.now()
  );

  // AI tagging runs async — never blocks the response
  if (!isVideo) {
    tagPhoto(id, req.file.path);
  }

  const base = process.env.BASE_URL || '';
  const subfolder = isVideo ? 'videos' : 'photos';

  res.status(201).json({
    id,
    url: `${base}/uploads/${subfolder}/${req.file.filename}`,
    media_type: isVideo ? 'video' : 'image',
    uploader_name: uploader_name.trim(),
    caption: caption.trim(),
    ceremony_tag: safeTag,
    ai_tags: [],
    is_public: isPublic,
    likes: 0,
    created_at: Date.now()
  });
});

module.exports = router;

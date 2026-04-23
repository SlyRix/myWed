const express = require('express');
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const { getDb } = require('../db');
const { requireAdminToken } = require('../middleware/auth');

const router = express.Router();
router.use(requireAdminToken);

const BASE_URL = () => process.env.BASE_URL || '';

function buildPhotoUrl(photo) {
  const subfolder = photo.media_type === 'video' ? 'videos' : 'photos';
  return {
    ...photo,
    url: `${BASE_URL()}/uploads/${subfolder}/${photo.filename}`,
    ai_tags: JSON.parse(photo.ai_tags || '[]'),
    is_public: !!photo.is_public,
    is_featured: !!photo.is_featured
  };
}

// GET /api/admin/photos — all photos (public + private)
router.get('/photos', (req, res) => {
  const { limit = 50, offset = 0 } = req.query;
  const photos = getDb()
    .prepare('SELECT * FROM photos ORDER BY created_at DESC LIMIT ? OFFSET ?')
    .all(Number(limit), Number(offset))
    .map(buildPhotoUrl);
  const total = getDb().prepare('SELECT COUNT(*) as count FROM photos').get().count;
  res.json({ photos, total });
});

// GET /api/admin/stats
router.get('/stats', (req, res) => {
  const db = getDb();
  const total = db.prepare('SELECT COUNT(*) as c FROM photos').get().c;
  const publicCount = db.prepare('SELECT COUNT(*) as c FROM photos WHERE is_public = 1').get().c;
  const privateCount = total - publicCount;
  const topPhoto = db.prepare('SELECT id, filename, uploader_name, likes FROM photos WHERE is_public = 1 ORDER BY likes DESC LIMIT 1').get();
  const totalLikes = db.prepare('SELECT SUM(likes) as s FROM photos').get().s || 0;

  res.json({ total, public: publicCount, private: privateCount, totalLikes, topPhoto: topPhoto || null });
});

// PATCH /api/admin/photos/:id
router.patch('/photos/:id', (req, res) => {
  const { id } = req.params;
  const allowed = ['is_public', 'is_featured'];
  const updates = {};

  for (const key of allowed) {
    if (key in req.body) {
      updates[key] = req.body[key] ? 1 : 0;
    }
  }

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: 'No valid fields to update' });
  }

  const sets = Object.keys(updates).map(k => `${k} = ?`).join(', ');
  const values = [...Object.values(updates), id];

  const result = getDb().prepare(`UPDATE photos SET ${sets} WHERE id = ?`).run(...values);
  if (result.changes === 0) return res.status(404).json({ error: 'Not found' });

  res.json({ ok: true });
});

// DELETE /api/admin/photos/:id
router.delete('/photos/:id', (req, res) => {
  const photo = getDb().prepare('SELECT * FROM photos WHERE id = ?').get(req.params.id);
  if (!photo) return res.status(404).json({ error: 'Not found' });

  // Delete file from disk
  try { fs.unlinkSync(photo.local_path); } catch { /* file may already be gone */ }

  getDb().prepare('DELETE FROM photos WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

// GET /api/admin/zip — stream ZIP of all photos/videos
router.get('/zip', (req, res) => {
  res.setHeader('Content-Type', 'application/zip');
  res.setHeader('Content-Disposition', 'attachment; filename="wedding-photos.zip"');

  const archive = archiver('zip', { zlib: { level: 1 } });
  archive.pipe(res);

  const photos = getDb().prepare('SELECT * FROM photos').all();
  for (const photo of photos) {
    if (fs.existsSync(photo.local_path)) {
      const label = `${photo.uploader_name}_${photo.id.slice(0, 8)}_${photo.filename}`;
      archive.file(photo.local_path, { name: label });
    }
  }

  archive.finalize();
});

module.exports = router;

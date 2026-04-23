const express = require('express');
const { getDb } = require('../db');

const router = express.Router();
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

// GET /api/photos — public gallery (paginated, sorted by likes desc or newest)
router.get('/', (req, res) => {
  const { sort = 'likes', tag, ceremony, limit = 30, offset = 0 } = req.query;

  const orderBy = sort === 'newest' ? 'created_at DESC' : 'is_featured DESC, likes DESC, created_at DESC';
  const params = [];
  const conditions = ['is_public = 1'];

  if (ceremony && ['christian', 'hindu', 'reception', 'other'].includes(ceremony)) {
    conditions.push('ceremony_tag = ?');
    params.push(ceremony);
  }

  // Filter by AI tag (JSON array contains check)
  if (tag) {
    conditions.push(`ai_tags LIKE ?`);
    params.push(`%"${tag}"%`);
  }

  const where = conditions.join(' AND ');
  params.push(Number(limit), Number(offset));

  const photos = getDb()
    .prepare(`SELECT * FROM photos WHERE ${where} ORDER BY ${orderBy} LIMIT ? OFFSET ?`)
    .all(...params)
    .map(buildPhotoUrl);

  const total = getDb()
    .prepare(`SELECT COUNT(*) as count FROM photos WHERE ${where}`)
    .get(...params.slice(0, -2)).count;

  res.json({ photos, total, offset: Number(offset) });
});

// POST /api/photos/:id/like
router.post('/:id/like', (req, res) => {
  const { id } = req.params;
  const { device_id } = req.body;

  if (!device_id || typeof device_id !== 'string' || device_id.length > 64) {
    return res.status(400).json({ error: 'device_id required' });
  }

  const photo = getDb().prepare('SELECT id, likes FROM photos WHERE id = ? AND is_public = 1').get(id);
  if (!photo) return res.status(404).json({ error: 'Photo not found' });

  const already = getDb()
    .prepare('SELECT 1 FROM likes WHERE photo_id = ? AND device_id = ?')
    .get(id, device_id);

  if (already) {
    // Unlike
    getDb().prepare('DELETE FROM likes WHERE photo_id = ? AND device_id = ?').run(id, device_id);
    getDb().prepare('UPDATE photos SET likes = MAX(0, likes - 1) WHERE id = ?').run(id);
    return res.json({ liked: false, likes: Math.max(0, photo.likes - 1) });
  }

  getDb().prepare('INSERT INTO likes (photo_id, device_id, created_at) VALUES (?, ?, ?)').run(id, device_id, Date.now());
  getDb().prepare('UPDATE photos SET likes = likes + 1 WHERE id = ?').run(id);
  res.json({ liked: true, likes: photo.likes + 1 });
});

// GET /api/photos/tags — available AI tags with counts
router.get('/tags', (req, res) => {
  const photos = getDb()
    .prepare('SELECT ai_tags FROM photos WHERE is_public = 1 AND ai_tags != ?')
    .all('[]');

  const counts = {};
  for (const row of photos) {
    const tags = JSON.parse(row.ai_tags || '[]');
    for (const t of tags) {
      counts[t] = (counts[t] || 0) + 1;
    }
  }

  const sorted = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([tag, count]) => ({ tag, count }));

  res.json(sorted);
});

module.exports = router;

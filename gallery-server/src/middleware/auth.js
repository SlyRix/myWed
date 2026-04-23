function requireGalleryCode(req, res, next) {
  const code = req.headers['x-gallery-code'] || req.query.gallery;
  if (!code || code !== process.env.GALLERY_CODE) {
    return res.status(401).json({ error: 'Invalid gallery code' });
  }
  next();
}

function requireAdminToken(req, res, next) {
  const auth = req.headers['authorization'];
  const headerToken = auth && auth.startsWith('Bearer ') ? auth.slice(7) : null;
  // Allow ?token= query param for GET requests (needed for direct download links)
  const queryToken = req.method === 'GET' ? req.query.token : null;
  const token = headerToken || queryToken;
  if (!token || token !== process.env.ADMIN_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

module.exports = { requireGalleryCode, requireAdminToken };

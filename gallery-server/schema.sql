CREATE TABLE IF NOT EXISTS photos (
  id          TEXT PRIMARY KEY,
  filename    TEXT NOT NULL,
  local_path  TEXT NOT NULL,
  uploader_name TEXT NOT NULL DEFAULT '',
  caption     TEXT DEFAULT '',
  ceremony_tag TEXT DEFAULT '',
  ai_tags     TEXT DEFAULT '[]',
  is_public   INTEGER DEFAULT 1,
  is_featured INTEGER DEFAULT 0,
  likes       INTEGER DEFAULT 0,
  media_type  TEXT DEFAULT 'image',
  file_size   INTEGER DEFAULT 0,
  created_at  INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS likes (
  photo_id   TEXT NOT NULL,
  device_id  TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  PRIMARY KEY (photo_id, device_id),
  FOREIGN KEY (photo_id) REFERENCES photos(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_photos_public ON photos(is_public, likes DESC, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_photos_ceremony ON photos(ceremony_tag);
CREATE INDEX IF NOT EXISTS idx_photos_featured ON photos(is_featured);

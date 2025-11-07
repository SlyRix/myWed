-- D1 Database Schema for Wedding Website
-- This schema defines the database structure for guest management and authentication

-- Guests table - stores guest access codes and permissions
CREATE TABLE IF NOT EXISTS guests (
    code TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    ceremonies TEXT NOT NULL  -- JSON array stored as text: ["christian", "hindu"]
);

-- Sessions table - stores admin authentication sessions
CREATE TABLE IF NOT EXISTS sessions (
    token TEXT PRIMARY KEY,
    expires_at INTEGER NOT NULL  -- Unix timestamp in milliseconds
);

-- Rate limits table - tracks request rate limiting
CREATE TABLE IF NOT EXISTS rate_limits (
    identifier TEXT PRIMARY KEY,
    attempts INTEGER NOT NULL DEFAULT 1,
    window_start INTEGER NOT NULL  -- Unix timestamp in milliseconds
);

-- Create index for session expiration queries
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);

-- Create index for rate limit cleanup queries
CREATE INDEX IF NOT EXISTS idx_rate_limits_window ON rate_limits(window_start);

-- Insert default test guests
INSERT OR REPLACE INTO guests (code, name, ceremonies) VALUES
    ('SIVA', 'Sivani Family', '["christian","hindu"]'),
    ('RUSH', 'Rushel Family', '["christian"]'),
    ('TEST', 'Test User', '["hindu"]');

-- Page content table - stores editable page content for CMS with multi-language support
CREATE TABLE IF NOT EXISTS page_content (
    page_id TEXT NOT NULL,                  -- Page identifier (e.g., 'home', 'christian-ceremony')
    language TEXT NOT NULL DEFAULT 'en',    -- Language code: 'en', 'de', or 'ta'
    content TEXT NOT NULL,                  -- JSON blob containing all page content
    updated_at INTEGER NOT NULL,            -- Unix timestamp in milliseconds
    updated_by TEXT DEFAULT 'admin',        -- Admin who made the last update
    PRIMARY KEY (page_id, language)         -- Composite primary key
);

-- Create indexes for page content queries
CREATE INDEX IF NOT EXISTS idx_page_content_updated ON page_content(updated_at);
CREATE INDEX IF NOT EXISTS idx_page_content_page_id ON page_content(page_id);
CREATE INDEX IF NOT EXISTS idx_page_content_language ON page_content(language);

-- Cleanup query for expired sessions (run periodically)
-- DELETE FROM sessions WHERE expires_at < unixepoch('now') * 1000;

-- Cleanup query for old rate limit entries (run periodically)
-- DELETE FROM rate_limits WHERE window_start < (unixepoch('now') * 1000) - 3600000;

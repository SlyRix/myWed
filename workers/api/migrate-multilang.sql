-- Migration Script: Add Multi-Language Support to Page Content
-- This migration adds language column to page_content table
-- and migrates existing content to 'en' language

-- Step 1: Create new table with language support
CREATE TABLE IF NOT EXISTS page_content_new (
    page_id TEXT NOT NULL,                  -- Page identifier (e.g., 'home', 'christian-ceremony')
    language TEXT NOT NULL DEFAULT 'en',    -- Language code: 'en', 'de', or 'ta'
    content TEXT NOT NULL,                  -- JSON blob containing all page content
    updated_at INTEGER NOT NULL,            -- Unix timestamp in milliseconds
    updated_by TEXT DEFAULT 'admin',        -- Admin who made the last update
    PRIMARY KEY (page_id, language)         -- Composite primary key
);

-- Step 2: Migrate existing data to 'en' language
INSERT INTO page_content_new (page_id, language, content, updated_at, updated_by)
SELECT page_id, 'en' as language, content, updated_at, updated_by
FROM page_content;

-- Step 3: Drop old table
DROP TABLE page_content;

-- Step 4: Rename new table to original name
ALTER TABLE page_content_new RENAME TO page_content;

-- Step 5: Create indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_page_content_updated ON page_content(updated_at);
CREATE INDEX IF NOT EXISTS idx_page_content_page_id ON page_content(page_id);
CREATE INDEX IF NOT EXISTS idx_page_content_language ON page_content(language);

-- Verification query (commented out - uncomment to test)
-- SELECT page_id, language, length(content) as content_length, datetime(updated_at/1000, 'unixepoch') as updated_at
-- FROM page_content
-- ORDER BY page_id, language;

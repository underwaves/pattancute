-- Migration: 0002_site_settings.sql
-- Store dynamic settings like background music YouTube URL
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- Default pleasant cute lo-fi YouTube music
INSERT OR IGNORE INTO site_settings (key, value, updated_at)
VALUES ('youtube_music_url', 'https://www.youtube.com/watch?v=jfKfPfyJRdk', datetime('now'));

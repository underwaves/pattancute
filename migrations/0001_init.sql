-- Migration: 0001_init.sql
-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  rating INTEGER NOT NULL,
  comment TEXT NOT NULL,
  created_at TEXT NOT NULL,
  hidden INTEGER DEFAULT 0
);

-- Review attached images table
CREATE TABLE IF NOT EXISTS review_images (
  id TEXT PRIMARY KEY,
  review_id TEXT NOT NULL,
  r2_key TEXT NOT NULL,
  FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE CASCADE
);

-- Rate limits table (stores SHA-256 hash of IP to protect privacy)
CREATE TABLE IF NOT EXISTS rate_limits (
  ip_hash TEXT NOT NULL,
  created_at TEXT NOT NULL
);

-- Indexes for fast query performance
CREATE INDEX IF NOT EXISTS idx_reviews_hidden_created ON reviews(hidden, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_review_images_review_id ON review_images(review_id);
CREATE INDEX IF NOT EXISTS idx_rate_limits_ip_created ON rate_limits(ip_hash, created_at);

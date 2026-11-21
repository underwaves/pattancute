-- Migration: 0003_review_editing.sql
-- Allow customers to edit their own reviews via a secret edit token (only SHA-256 hash is stored)
ALTER TABLE reviews ADD COLUMN edit_token_hash TEXT;
ALTER TABLE reviews ADD COLUMN updated_at TEXT;

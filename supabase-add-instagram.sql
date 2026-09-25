-- Run this if you already have the database set up
-- Adds instagram_link column to properties table

ALTER TABLE properties ADD COLUMN IF NOT EXISTS instagram_link text;

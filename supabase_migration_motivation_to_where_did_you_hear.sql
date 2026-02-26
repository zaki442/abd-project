-- Migration: Replace motivation with where_did_you_hear
-- Run this if you already have registrations table with motivation column

ALTER TABLE registrations RENAME COLUMN motivation TO where_did_you_hear;

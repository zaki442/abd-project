-- Add is_certified column to formations table
ALTER TABLE formations ADD COLUMN IF NOT EXISTS is_certified BOOLEAN DEFAULT false NOT NULL;

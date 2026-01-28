-- =============================================
-- SEED DATA FOR ABD PROJECT
-- Run this AFTER running supabase_schema.sql
-- =============================================

-- Insert default admin
-- You can add more admins by copying this line and changing email/password
INSERT INTO admins (email, password_hash) 
VALUES ('admin@abd.com', 'zaki442')
ON CONFLICT (email) DO NOTHING;

-- Optional: Insert a test registration to verify the table works
-- Uncomment if you want test data
/*
INSERT INTO registrations (full_name, email, formation_id)
VALUES 
  ('Test User', 'test@example.com', 'formation-1'),
  ('Another User', 'another@example.com', 'formation-2');
*/

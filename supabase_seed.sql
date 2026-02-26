-- =============================================
-- SEED DATA FOR ABD PROJECT
-- Run this AFTER running supabase_schema.sql
-- =============================================

-- Insert default admin
-- You can add more admins by copying this line and changing name/email/password
INSERT INTO admins (name, email, password_hash) 
VALUES ('Admin', 'admin@abd.com', 'zaki442')
ON CONFLICT (email) DO NOTHING;

-- Insert default categories
INSERT INTO formations_category (name) VALUES 
('Ramadan Bootcamp'), 
('Agile'), 
('Soft Skills'), 
('DevOps'),
('Other')
ON CONFLICT (name) DO NOTHING;

-- Create the 'formations' storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('formations', 'formations', true)
ON CONFLICT (id) DO NOTHING;

-- Optional: Insert a test registration to verify the table works
-- Uncomment if you want test data (replace FORMATION_UUID with a real formation id from formations table)
/*
INSERT INTO registrations (full_name, email, phone_number, where_did_you_hear, formation_id)
VALUES 
  ('Test User', 'test@example.com', '+212600000001', 'linkedin', 'FORMATION_UUID'),
  ('Another User', 'another@example.com', '+212600000002', 'facebook', 'FORMATION_UUID');
*/

-- =============================================
-- SEED DATA FOR FORMATIONS
-- =============================================

DO $$
DECLARE
    cat_ramadan uuid;
    cat_agile uuid;
    cat_soft_skills uuid;
    cat_devops uuid;
    
    form_agile_darija uuid;
    form_mindset uuid;
    form_teamwork uuid;
    form_dt uuid;
BEGIN
    -- Get category IDs
    SELECT id INTO cat_ramadan FROM formations_category WHERE name = 'Ramadan Bootcamp';
    SELECT id INTO cat_agile FROM formations_category WHERE name = 'Agile';
    SELECT id INTO cat_soft_skills FROM formations_category WHERE name = 'Soft Skills';

    -- Insert Formations
    INSERT INTO formations (title, description, date, price, image_url) VALUES
    ('Agile B Darija', 'Learn Agile & Scrum in Moroccan Darija.', 'February 2, 2026', 'Free', '/formations/agile-darija-v2.png') RETURNING id INTO form_agile_darija;
    
    INSERT INTO formations (title, description, date, price, image_url) VALUES
    ('Mindset & Soft Skills', 'Develop your personality and mindset.', 'February 9, 2026', 'Free', '/formations/mindset.png') RETURNING id INTO form_mindset;
    
    INSERT INTO formations (title, description, date, price, image_url) VALUES
    ('Agile Teamwork', 'Learn how to work with your team successfully.', 'February 16, 2026', 'Free', '/formations/agile-teamwork.png') RETURNING id INTO form_teamwork;
    
    INSERT INTO formations (title, description, date, price, image_url) VALUES
    ('Design Thinking', 'Problem-solving skills in a creative way.', 'February 23, 2026', 'Free', '/formations/design-thinking.png') RETURNING id INTO form_dt;

    -- Link Formations to Categories
    INSERT INTO formation_category_link (formation_id, category_id) VALUES
    (form_agile_darija, cat_agile),
    (form_mindset, cat_soft_skills),
    (form_teamwork, cat_agile),
    (form_dt, cat_soft_skills);
END $$;

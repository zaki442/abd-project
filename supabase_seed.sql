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
-- Uncomment if you want test data
/*
INSERT INTO registrations (full_name, email, phone_number, motivation, formation_id)
VALUES 
  ('Test User', 'test@example.com', '+212600000001', 'I want to learn more about Agile.', 'agile-darija'),
  ('Another User', 'another@example.com', '+212600000002', 'Improving my soft skills.', 'soft-skills');
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
BEGIN
    -- Get category IDs
    SELECT id INTO cat_ramadan FROM formations_category WHERE name = 'Ramadan Bootcamp';
    SELECT id INTO cat_agile FROM formations_category WHERE name = 'Agile';
    SELECT id INTO cat_soft_skills FROM formations_category WHERE name = 'Soft Skills';

    -- Insert Formations
    INSERT INTO formations (title, description, date, price, image_url, category_id)
    VALUES
    (
        'Agile B Darija',
        'Learn Agile and Scrum in Moroccan Darija. Understand how teams work with speed and efficiency.',
        'February 2, 2026',
        'Free',
        '/formations/agile-darija-v2.png',
        cat_agile
    ),
    (
        'Mindset & Soft Skills',
        'Develop your personality and mindset to benefit your professional life. Communication, leadership, and time management.',
        'February 9, 2026',
        'Free',
        '/formations/mindset.png',
        cat_soft_skills
    ),
    (
        'Agile Teamwork',
        'Learn how to work with your team successfully. Workshops and practical exercises to understand team dynamics.',
        'February 16, 2026',
        'Free',
        '/formations/agile-teamwork.png',
        cat_agile
    ),
    (
        'Design Thinking',
        'Problem-solving skills in a creative way. Learn how to think like a designer to find innovative solutions.',
        'February 23, 2026',
        'Free',
        '/formations/design-thinking.png',
        cat_soft_skills
    );
END $$;

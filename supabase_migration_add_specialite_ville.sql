-- Migration to add specialite and ville to registrations table
ALTER TABLE registrations
ADD COLUMN specialite text,
ADD COLUMN ville text;

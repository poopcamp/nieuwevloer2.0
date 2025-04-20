
-- Add columns to admin_settings table
ALTER TABLE admin_settings 
ADD COLUMN IF NOT EXISTS showroom_visit_enabled BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS showroom_visit_text TEXT DEFAULT 'Showroom van Qtile bezoeken';

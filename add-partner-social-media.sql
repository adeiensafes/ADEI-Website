-- ===================================
-- PARTNER SOCIAL MEDIA COLUMNS
-- Run this SQL on your production database
-- ===================================

-- Add social media columns to partners table
ALTER TABLE partners 
ADD COLUMN facebook VARCHAR(500) NULL,
ADD COLUMN instagram VARCHAR(500) NULL,
ADD COLUMN whatsapp VARCHAR(500) NULL;

-- Verify the columns were added
DESCRIBE partners;

-- Test update (replace PARTNER_ID with actual partner ID)
-- UPDATE partners SET 
--   facebook = 'https://facebook.com/example',
--   instagram = 'https://instagram.com/example',
--   whatsapp = 'https://wa.me/212600000000'
-- WHERE id = 1;

-- Check if update worked
-- SELECT id, name, facebook, instagram, whatsapp FROM partners WHERE id = 1;
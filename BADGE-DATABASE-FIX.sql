-- ===================================
-- BADGE SYSTEM DATABASE FIX
-- Run this SQL on your production database
-- ===================================

-- 1. Add badge columns to users table
ALTER TABLE users 
ADD COLUMN is_president BOOLEAN DEFAULT FALSE,
ADD COLUMN is_representant BOOLEAN DEFAULT FALSE,
ADD COLUMN is_membre_adei BOOLEAN DEFAULT FALSE,
ADD COLUMN is_bureau_adei BOOLEAN DEFAULT FALSE;

-- 2. Add userId column to feedbacks table for badge display
ALTER TABLE feedbacks 
ADD COLUMN userId INT NULL,
ADD FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL;

-- 3. Verify the columns were added
DESCRIBE users;
DESCRIBE feedbacks;

-- 4. Test update (replace USER_ID with actual user ID)
-- UPDATE users SET is_president = TRUE WHERE id = 1;

-- 5. Check if update worked
-- SELECT id, username, is_president, is_representant, is_membre_adei, is_bureau_adei FROM users WHERE id = 1;
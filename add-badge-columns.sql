-- Add badge columns to users table if they don't exist
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS is_president BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS is_representant BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS is_membre_adei BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS is_bureau_adei BOOLEAN DEFAULT FALSE;

-- Add userId column to feedbacks table if it doesn't exist
ALTER TABLE feedbacks 
ADD COLUMN IF NOT EXISTS userId INT NULL,
ADD FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL;

-- Show current table structure
DESCRIBE users;
DESCRIBE feedbacks;
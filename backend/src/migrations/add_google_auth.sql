-- Add auth provider and email verified columns to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS auth_provider VARCHAR(20) DEFAULT 'email',
ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT false;

-- Create index on auth_provider for faster queries
CREATE INDEX IF NOT EXISTS idx_users_auth_provider ON users(auth_provider);

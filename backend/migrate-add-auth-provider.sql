-- Migration: Add auth_provider column to users table
-- This column is required to distinguish between local and Google OAuth authentication

-- Add auth_provider column if it doesn't exist
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS auth_provider VARCHAR(50) DEFAULT 'local' CHECK (auth_provider IN ('local', 'google'));

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'auth_provider column added to users table successfully!';
END $$;

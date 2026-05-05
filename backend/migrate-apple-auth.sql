-- Add Apple Sign In support
ALTER TABLE users ADD COLUMN IF NOT EXISTS apple_user_id VARCHAR(255) UNIQUE;

-- Update auth_provider constraint to allow 'apple'
-- Note: check your existing constraint name with: \d users
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_auth_provider_check;
ALTER TABLE users ADD CONSTRAINT users_auth_provider_check
  CHECK (auth_provider IN ('local', 'google', 'apple'));

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_users_apple_user_id ON users(apple_user_id);

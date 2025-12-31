-- Create password_resets table for storing password reset tokens
CREATE TABLE IF NOT EXISTS password_resets (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  token TEXT NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  used BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on expires_at for cleanup queries
CREATE INDEX IF NOT EXISTS idx_password_resets_expires_at ON password_resets(expires_at);

-- Migration: Remove payment_methods, Add bank_accounts

-- Drop payment_methods table if it exists
DROP TABLE IF EXISTS payment_methods CASCADE;

-- Create bank_accounts table
CREATE TABLE IF NOT EXISTS bank_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    account_holder_name VARCHAR(255) NOT NULL,
    bank_name VARCHAR(255) NOT NULL,
    account_number VARCHAR(50) NOT NULL,
    account_type VARCHAR(50) CHECK (account_type IN ('checking', 'savings', 'business')),
    swift_code VARCHAR(50),
    iban VARCHAR(100),
    currency VARCHAR(10) DEFAULT 'USD',
    country VARCHAR(100),
    is_default BOOLEAN DEFAULT false,
    verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_bank_accounts_user ON bank_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_bank_accounts_verified ON bank_accounts(user_id, verified);

-- Create trigger for automatic updated_at
CREATE TRIGGER IF NOT EXISTS update_bank_accounts_updated_at BEFORE UPDATE ON bank_accounts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Verify tables
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name IN ('bank_accounts', 'payment_methods')
ORDER BY table_name;

-- Migration: Add approval_status column to products table
-- This allows admin approval workflow for new products

-- Add approval_status column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'products' AND column_name = 'approval_status'
    ) THEN
        ALTER TABLE products 
        ADD COLUMN approval_status VARCHAR(50) DEFAULT 'pending' 
        CHECK (approval_status IN ('pending', 'approved', 'rejected'));
        
        -- Set existing products to 'approved' so they remain visible
        UPDATE products SET approval_status = 'approved' WHERE approval_status IS NULL;
        
        RAISE NOTICE 'Column approval_status added successfully';
    ELSE
        RAISE NOTICE 'Column approval_status already exists';
    END IF;
END $$;

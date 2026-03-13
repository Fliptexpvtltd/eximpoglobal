-- Migration: Add display_order column to products table
-- This migration adds the display_order column to the products table
-- if it doesn't already exist, allowing custom product ordering

ALTER TABLE products
ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- Create an index on display_order for faster sorting
CREATE INDEX IF NOT EXISTS idx_products_display_order ON products(display_order ASC, created_at DESC);

-- Create an index on supplier_id with display_order for seller product queries
CREATE INDEX IF NOT EXISTS idx_products_supplier_display_order ON products(supplier_id, display_order ASC, created_at DESC);

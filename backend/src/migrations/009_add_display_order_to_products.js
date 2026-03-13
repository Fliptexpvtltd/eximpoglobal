import { query } from '../config/database.js';

/**
 * Migration: Add display_order column to products table
 * Created: 2026-03-13
 * Purpose: Enable custom product ordering/sequencing for sellers
 */

export async function up() {
  try {
    // Add display_order column if it doesn't exist
    await query(`
      ALTER TABLE products
      ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0
    `);

    // Create index for efficient sorting
    await query(`
      CREATE INDEX IF NOT EXISTS idx_products_display_order 
      ON products(display_order ASC, created_at DESC)
    `);

    // Create index for seller product queries
    await query(`
      CREATE INDEX IF NOT EXISTS idx_products_supplier_display_order 
      ON products(supplier_id, display_order ASC, created_at DESC)
    `);

    console.log('✓ Migration: Added display_order column to products table');
  } catch (error) {
    if (error.message.includes('already exists')) {
      console.log('✓ Migration: display_order column already exists');
    } else {
      throw error;
    }
  }
}

export async function down() {
  try {
    // Drop indexes
    await query(`DROP INDEX IF EXISTS idx_products_display_order`);
    await query(`DROP INDEX IF EXISTS idx_products_supplier_display_order`);

    // Drop column
    await query(`
      ALTER TABLE products
      DROP COLUMN IF EXISTS display_order
    `);

    console.log('✓ Rollback: Removed display_order column from products table');
  } catch (error) {
    console.error('Rollback failed:', error.message);
    throw error;
  }
}

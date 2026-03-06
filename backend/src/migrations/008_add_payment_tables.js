import { query } from '../config/database.js';

/**
 * Migration: Add payment and order tables
 * Created: 2026-03-03
 * Purpose: Enable Razorpay payment processing for product orders
 */

export async function up() {
  // Create orders table
  await query(`
    CREATE TABLE IF NOT EXISTS orders (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      order_number VARCHAR(50) UNIQUE NOT NULL,
      buyer_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
      seller_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
      product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
      
      -- Order details
      quantity INTEGER NOT NULL CHECK (quantity > 0),
      unit_price DECIMAL(12, 2) NOT NULL,
      total_amount DECIMAL(12, 2) NOT NULL,
      currency VARCHAR(3) DEFAULT 'INR',
      
      -- Shipping details
      shipping_address JSONB NOT NULL,
      incoterms VARCHAR(10),
      estimated_delivery_date DATE,
      
      -- Status tracking
      status VARCHAR(30) DEFAULT 'pending_payment' CHECK (
        status IN ('pending_payment', 'payment_failed', 'paid', 'processing', 
                   'shipped', 'delivered', 'cancelled', 'refunded')
      ),
      payment_status VARCHAR(20) DEFAULT 'pending' CHECK (
        payment_status IN ('pending', 'processing', 'completed', 'failed', 'refunded')
      ),
      
      -- Timestamps
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      paid_at TIMESTAMP,
      shipped_at TIMESTAMP,
      delivered_at TIMESTAMP,
      cancelled_at TIMESTAMP,
      
      -- Order notes
      buyer_notes TEXT,
      seller_notes TEXT,
      cancellation_reason TEXT
    );
  `);

  // Create payments table
  await query(`
    CREATE TABLE IF NOT EXISTS payments (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
      
      -- Razorpay details
      razorpay_order_id VARCHAR(100) UNIQUE,
      razorpay_payment_id VARCHAR(100) UNIQUE,
      razorpay_signature VARCHAR(200),
      
      -- Payment details
      amount DECIMAL(12, 2) NOT NULL,
      currency VARCHAR(3) DEFAULT 'INR',
      status VARCHAR(20) DEFAULT 'created' CHECK (
        status IN ('created', 'authorized', 'captured', 'refunded', 'failed')
      ),
      
      -- Payment method
      method VARCHAR(50),
      method_details JSONB,
      
      -- Contact details
      email VARCHAR(255),
      contact VARCHAR(20),
      
      -- Timestamps
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      authorized_at TIMESTAMP,
      captured_at TIMESTAMP,
      failed_at TIMESTAMP,
      
      -- Error details
      error_code VARCHAR(50),
      error_description TEXT,
      
      -- Webhook data
      webhook_payload JSONB
    );
  `);

  // Create payment transactions log table for audit trail
  await query(`
    CREATE TABLE IF NOT EXISTS payment_transactions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      payment_id UUID NOT NULL REFERENCES payments(id) ON DELETE CASCADE,
      
      event_type VARCHAR(50) NOT NULL,
      event_data JSONB NOT NULL,
      
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Create indexes for performance
  await query(`
    CREATE INDEX IF NOT EXISTS idx_orders_buyer_id ON orders(buyer_id);
    CREATE INDEX IF NOT EXISTS idx_orders_seller_id ON orders(seller_id);
    CREATE INDEX IF NOT EXISTS idx_orders_product_id ON orders(product_id);
    CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
    CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
    
    CREATE INDEX IF NOT EXISTS idx_payments_order_id ON payments(order_id);
    CREATE INDEX IF NOT EXISTS idx_payments_razorpay_order_id ON payments(razorpay_order_id);
    CREATE INDEX IF NOT EXISTS idx_payments_razorpay_payment_id ON payments(razorpay_payment_id);
    CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
    CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments(created_at DESC);
    
    CREATE INDEX IF NOT EXISTS idx_payment_transactions_payment_id ON payment_transactions(payment_id);
    CREATE INDEX IF NOT EXISTS idx_payment_transactions_event_type ON payment_transactions(event_type);
  `);

  // Add function to auto-update updated_at
  await query(`
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = CURRENT_TIMESTAMP;
      RETURN NEW;
    END;
    $$ language 'plpgsql';
  `);

  // Create triggers
  await query(`
    DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
    CREATE TRIGGER update_orders_updated_at
      BEFORE UPDATE ON orders
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
      
    DROP TRIGGER IF EXISTS update_payments_updated_at ON payments;
    CREATE TRIGGER update_payments_updated_at
      BEFORE UPDATE ON payments
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  `);

  console.log('✅ Payment and order tables created successfully');
}

export async function down() {
  await query(`
    DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
    DROP TRIGGER IF EXISTS update_payments_updated_at ON payments;
    DROP FUNCTION IF EXISTS update_updated_at_column();
    
    DROP INDEX IF EXISTS idx_payment_transactions_event_type;
    DROP INDEX IF EXISTS idx_payment_transactions_payment_id;
    DROP INDEX IF EXISTS idx_payments_created_at;
    DROP INDEX IF EXISTS idx_payments_status;
    DROP INDEX IF EXISTS idx_payments_razorpay_payment_id;
    DROP INDEX IF EXISTS idx_payments_razorpay_order_id;
    DROP INDEX IF EXISTS idx_payments_order_id;
    DROP INDEX IF EXISTS idx_orders_order_number;
    DROP INDEX IF EXISTS idx_orders_created_at;
    DROP INDEX IF EXISTS idx_orders_status;
    DROP INDEX IF EXISTS idx_orders_product_id;
    DROP INDEX IF EXISTS idx_orders_seller_id;
    DROP INDEX IF EXISTS idx_orders_buyer_id;
    
    DROP TABLE IF EXISTS payment_transactions CASCADE;
    DROP TABLE IF EXISTS payments CASCADE;
    DROP TABLE IF EXISTS orders CASCADE;
  `);

  console.log('✅ Payment and order tables dropped successfully');
}

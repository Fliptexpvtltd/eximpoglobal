-- Fix orders table status constraint
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;

ALTER TABLE orders ADD CONSTRAINT orders_status_check 
CHECK (status IN ('pending_payment', 'payment_failed', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'));

-- Also add check for quantity if not exists
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_quantity_check;
ALTER TABLE orders ADD CONSTRAINT orders_quantity_check CHECK (quantity > 0);
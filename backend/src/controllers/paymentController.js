import Razorpay from 'razorpay';
import crypto from 'crypto';
import { query } from '../config/database.js';
import { sendEmail } from '../services/emailService.js';

// Initialize Razorpay instance only if credentials are available
let razorpay = null;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });
  console.log('✅ Razorpay initialized');
} else {
  console.warn('⚠️  Razorpay credentials not configured. Payment features will be disabled.');
}

// Generate unique order number
function generateOrderNumber() {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ORD-${timestamp}-${random}`;
}

// Helper function to safely parse JSON fields (handles both string and object)
function safeJsonParse(value) {
  if (!value) return null;
  if (typeof value === 'object') return value;
  try {
    return JSON.parse(value);
  } catch (e) {
    return value;
  }
}

/**
 * Create order and Razorpay payment
 * POST /api/payments/create-order
 */
export const createOrder = async (req, res) => {
  try {
    // Check if Razorpay is configured
    if (!razorpay) {
      return res.status(503).json({
        success: false,
        message: 'Payment service is not configured. Please contact administrator.'
      });
    }

    const {
      product_id,
      quantity,
      unit_price,
      shipping_address,
      incoterms,
      buyer_notes
    } = req.body;

    const buyer_id = req.user.id || req.user.userId;
    
    // Validate required fields
    if (!product_id || !quantity || !unit_price || !shipping_address) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Get product details
    const productResult = await query(
      'SELECT * FROM products WHERE id = $1 AND available = true AND approval_status = $2',
      [product_id, 'approved']
    );

    if (productResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found or unavailable'
      });
    }

    const product = productResult.rows[0];
    const seller_id = product.supplier_id;

    // Check if buyer is not the seller
    if (buyer_id === seller_id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot buy your own product'
      });
    }

    // Calculate total amount
    const total_amount = parseFloat(unit_price) * parseInt(quantity);

    // Create order in database
    const orderNumber = generateOrderNumber();
    
    // Prepare items array for legacy compatibility
    const items = [{
      product_id,
      product_name: product.name,
      quantity,
      unit_price,
      total: total_amount
    }];
    
    const orderResult = await query(`
      INSERT INTO orders (
        order_number, buyer_id, seller_id, product_id,
        quantity, unit_price, total_amount, currency,
        shipping_address, incoterms, buyer_notes,
        status, payment_status, items, subtotal
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING *
    `, [
      orderNumber, buyer_id, seller_id, product_id,
      quantity, unit_price, total_amount, 'INR',
      JSON.stringify(shipping_address), incoterms, buyer_notes,
      'pending_payment', 'pending', JSON.stringify(items), total_amount
    ]);

    const order = orderResult.rows[0];

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(total_amount * 100), // Amount in paise
      currency: 'INR',
      receipt: order.order_number,
      notes: {
        order_id: order.id,
        product_id: product_id,
        product_name: product.name
      }
    });

    // Save payment record
    await query(`
      INSERT INTO payments (
        order_id, razorpay_order_id, amount, currency, status, email, contact
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
    `, [
      order.id,
      razorpayOrder.id,
      total_amount,
      'INR',
      'created',
      req.user.email || null,
      shipping_address.phone || null
    ]);

    res.json({
      success: true,
      message: 'Order created successfully',
      order: {
        ...order,
        shipping_address: safeJsonParse(order.shipping_address)
      },
      razorpay: {
        order_id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        key: process.env.RAZORPAY_KEY_ID
      }
    });

  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message
    });
  }
};

/**
 * Verify payment signature
 * POST /api/payments/verify
 */
export const verifyPayment = async (req, res) => {
  try {
    // Check if Razorpay is configured
    if (!razorpay) {
      return res.status(503).json({
        success: false,
        message: 'Payment service is not configured. Please contact administrator.'
      });
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    // Verify signature
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment signature'
      });
    }

    // Update payment record
    await query(`
      UPDATE payments 
      SET razorpay_payment_id = $1, 
          razorpay_signature = $2,
          status = 'authorized',
          authorized_at = CURRENT_TIMESTAMP
      WHERE razorpay_order_id = $3
      RETURNING order_id
    `, [razorpay_payment_id, razorpay_signature, razorpay_order_id]);

    // Fetch payment details from Razorpay
    const payment = await razorpay.payments.fetch(razorpay_payment_id);

    // Update payment with method details
    await query(`
      UPDATE payments 
      SET method = $1,
          method_details = $2,
          email = $3,
          contact = $4
      WHERE razorpay_payment_id = $5
    `, [
      payment.method,
      JSON.stringify({
        card_id: payment.card_id,
        bank: payment.bank,
        wallet: payment.wallet
      }),
      payment.email,
      payment.contact,
      razorpay_payment_id
    ]);

    // Capture the payment only if not already captured
    let capturedPayment;
    if (payment.status === 'authorized') {
      try {
        capturedPayment = await razorpay.payments.capture(
          razorpay_payment_id,
          payment.amount,
          payment.currency
        );
      } catch (captureError) {
        // If payment already captured, fetch latest status
        if (captureError.error && captureError.error.description && 
            captureError.error.description.includes('already been captured')) {
          capturedPayment = await razorpay.payments.fetch(razorpay_payment_id);
        } else {
          throw captureError;
        }
      }
    } else if (payment.status === 'captured') {
      // Payment already captured
      capturedPayment = payment;
    } else {
      throw new Error(`Payment status is ${payment.status}, cannot process`);
    }

    // Update payment status to captured
    await query(`
      UPDATE payments 
      SET status = 'captured',
          captured_at = CURRENT_TIMESTAMP
      WHERE razorpay_payment_id = $1
    `, [razorpay_payment_id]);

    // Update order status
    const orderUpdateResult = await query(`
      UPDATE orders 
      SET status = 'paid',
          payment_status = 'completed',
          paid_at = CURRENT_TIMESTAMP
      WHERE id = (
        SELECT order_id FROM payments 
        WHERE razorpay_payment_id = $1
      )
      RETURNING *
    `, [razorpay_payment_id]);

    const order = orderUpdateResult.rows[0];

    // Fetch buyer and seller details for email
    try {
      const orderDetails = await query(`
        SELECT 
          o.*,
          u1.full_name as buyer_name, u1.email as buyer_email,
          u2.company_name as seller_name, u2.email as seller_email,
          p.name as product_name
        FROM orders o
        LEFT JOIN users u1 ON o.buyer_id = u1.id
        LEFT JOIN users u2 ON o.seller_id = u2.id
        LEFT JOIN products p ON o.product_id = p.id
        WHERE o.id = $1
      `, [order.id]);

      if (orderDetails.rows.length > 0) {
        const orderData = orderDetails.rows[0];
        const shippingAddr = safeJsonParse(orderData.shipping_address);
        const shippingAddress = shippingAddr ? 
          `${shippingAddr.address_line1}, ${shippingAddr.city}, ${shippingAddr.state} ${shippingAddr.postal_code}, ${shippingAddr.country}` :
          'N/A';

        // Send order confirmation email to buyer
        await sendEmail(
          orderData.buyer_email,
          'orderConfirmed',
          {
            buyerName: orderData.buyer_name || 'Customer',
            orderNumber: orderData.order_number,
            productName: orderData.product_name,
            quantity: orderData.quantity,
            totalAmount: parseFloat(orderData.total_amount).toLocaleString(),
            orderDate: new Date(orderData.created_at).toLocaleDateString(),
            sellerName: orderData.seller_name,
            shippingAddress: shippingAddress
          }
        );
        console.log('📧 Order confirmation email sent to:', orderData.buyer_email);
      }
    } catch (emailError) {
      console.error('Failed to send order confirmation email:', emailError);
      // Don't fail the payment verification if email fails
    }

    // Log transaction
    await query(`
      INSERT INTO payment_transactions (payment_id, event_type, event_data)
      VALUES (
        (SELECT id FROM payments WHERE razorpay_payment_id = $1),
        'payment.captured',
        $2
      )
    `, [razorpay_payment_id, JSON.stringify(capturedPayment)]);

    res.json({
      success: true,
      message: 'Payment verified successfully',
      order: {
        ...order,
        shipping_address: safeJsonParse(order.shipping_address)
      }
    });

  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Payment verification failed',
      error: error.message
    });
  }
};

/**
 * Get user's orders
 * GET /api/payments/orders
 */
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id || req.user.userId;
    const { role = 'buyer', status, page = 1, limit = 20 } = req.query;
    
    const offset = (page - 1) * limit;
    
    let whereClause = role === 'buyer' ? 'o.buyer_id = $1' : 'o.seller_id = $1';
    const params = [userId];
    
    if (status) {
      whereClause += ` AND o.status = $${params.length + 1}`;
      params.push(status);
    }
    
    params.push(limit, offset);

    const ordersResult = await query(`
      SELECT 
        o.*,
        p.name as product_name,
        p.images as product_images,
        buyer.full_name as buyer_name,
        buyer.email as buyer_email,
        seller.company_name as seller_company,
        seller.email as seller_email,
        pay.razorpay_payment_id,
        pay.status as payment_status,
        pay.method as payment_method
      FROM orders o
      JOIN products p ON o.product_id = p.id
      JOIN users buyer ON o.buyer_id = buyer.id
      JOIN users seller ON o.seller_id = seller.id
      LEFT JOIN payments pay ON o.id = pay.order_id
      WHERE ${whereClause}
      ORDER BY o.created_at DESC
      LIMIT $${params.length - 1} OFFSET $${params.length}
    `, params);

    const countResult = await query(`
      SELECT COUNT(*) FROM orders o WHERE ${whereClause}
    `, params.slice(0, -2));

    const orders = ordersResult.rows.map(order => ({
      ...order,
      shipping_address: safeJsonParse(order.shipping_address),
      product_images: safeJsonParse(order.product_images) || []
    }));

    res.json({
      success: true,
      orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(countResult.rows[0].count),
        totalPages: Math.ceil(countResult.rows[0].count / limit)
      }
    });

  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message
    });
  }
};

/**
 * Get order details
 * GET /api/payments/orders/:orderId
 */
export const getOrderDetails = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.id || req.user.userId;

    const orderResult = await query(`
      SELECT 
        o.*,
        p.name as product_name,
        p.description as product_description,
        p.images as product_images,
        p.category,
        p.moq,
        buyer.full_name as buyer_name,
        buyer.email as buyer_email,
        buyer.phone as buyer_phone,
        buyer.company_name as buyer_company,
        seller.full_name as seller_name,
        seller.email as seller_email,
        seller.phone as seller_phone,
        seller.company_name as seller_company,
        pay.razorpay_order_id,
        pay.razorpay_payment_id,
        pay.status as payment_status,
        pay.method as payment_method,
        pay.method_details,
        pay.created_at as payment_created_at,
        pay.captured_at as payment_captured_at
      FROM orders o
      JOIN products p ON o.product_id = p.id
      JOIN users buyer ON o.buyer_id = buyer.id
      JOIN users seller ON o.seller_id = seller.id
      LEFT JOIN payments pay ON o.id = pay.order_id
      WHERE o.id = $1 AND (o.buyer_id = $2 OR o.seller_id = $2)
    `, [orderId, userId]);

    if (orderResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const order = orderResult.rows[0];

    res.json({
      success: true,
      order: {
        ...order,
        shipping_address: safeJsonParse(order.shipping_address),
        product_images: safeJsonParse(order.product_images) || [],
        method_details: safeJsonParse(order.method_details)
      }
    });

  } catch (error) {
    console.error('Get order details error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order details',
      error: error.message
    });
  }
};

/**
 * Update order status (sellers only)
 * PUT /api/payments/orders/:orderId/status
 */
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, notes, tracking_number, carrier } = req.body;
    const userId = req.user.id || req.user.userId;

    const allowedStatuses = ['processing', 'shipped', 'delivered', 'cancelled'];
    
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    // Verify seller owns this order
    const orderResult = await query(
      'SELECT * FROM orders WHERE id = $1 AND seller_id = $2',
      [orderId, userId]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found or you do not have permission'
      });
    }

    // Check if tracking_number column exists, if not add it
    try {
      await query(`
        DO $$ 
        BEGIN
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'orders' AND column_name = 'tracking_number') THEN
            ALTER TABLE orders ADD COLUMN tracking_number VARCHAR(100);
          END IF;
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'orders' AND column_name = 'carrier') THEN
            ALTER TABLE orders ADD COLUMN carrier VARCHAR(100);
          END IF;
        END $$;
      `);
    } catch (err) {
      console.log('Column check/add error (may already exist):', err.message);
    }

    // Update order
    const updateFields = ['status = $1', 'seller_notes = $2'];
    const updateParams = [status, notes];
    
    // Add tracking info if provided and status is shipped
    if (status === 'shipped' && tracking_number) {
      updateFields.push(`tracking_number = $${updateParams.length + 1}`);
      updateParams.push(tracking_number);
      
      if (carrier) {
        updateFields.push(`carrier = $${updateParams.length + 1}`);
        updateParams.push(carrier);
      }
      
      updateFields.push('shipped_at = CURRENT_TIMESTAMP');
    } else if (status === 'shipped') {
      updateFields.push('shipped_at = CURRENT_TIMESTAMP');
    } else if (status === 'delivered') {
      updateFields.push('delivered_at = CURRENT_TIMESTAMP');
    } else if (status === 'cancelled') {
      updateFields.push('cancelled_at = CURRENT_TIMESTAMP');
    }

    const updatedOrder = await query(`
      UPDATE orders 
      SET ${updateFields.join(', ')}
      WHERE id = $${updateParams.length + 1}
      RETURNING *
    `, [...updateParams, orderId]);

    // Send email notifications based on status
    try {
      const orderDetails = await query(`
        SELECT 
          o.*,
          u1.full_name as buyer_name, u1.email as buyer_email,
          u2.company_name as seller_name,
          p.name as product_name
        FROM orders o
        LEFT JOIN users u1 ON o.buyer_id = u1.id
        LEFT JOIN users u2 ON o.seller_id = u2.id
        LEFT JOIN products p ON o.product_id = p.id
        WHERE o.id = $1
      `, [orderId]);

      if (orderDetails.rows.length > 0) {
        const orderData = orderDetails.rows[0];

        if (status === 'shipped' && tracking_number) {
          // Send shipment notification email to buyer
          await sendEmail(
            orderData.buyer_email,
            'orderShipped',
            {
              buyerName: orderData.buyer_name || 'Customer',
              orderNumber: orderData.order_number,
              productName: orderData.product_name,
              quantity: orderData.quantity,
              trackingNumber: tracking_number,
              carrier: carrier || 'N/A',
              shippedDate: new Date().toLocaleDateString(),
              sellerNotes: notes
            }
          );
          console.log('📧 Shipment notification email sent to:', orderData.buyer_email);
        } else if (status === 'delivered') {
          // Send delivery confirmation email to buyer
          await sendEmail(
            orderData.buyer_email,
            'orderDelivered',
            {
              buyerName: orderData.buyer_name || 'Customer',
              orderNumber: orderData.order_number,
              productName: orderData.product_name,
              quantity: orderData.quantity,
              totalAmount: parseFloat(orderData.total_amount).toLocaleString(),
              deliveredDate: new Date().toLocaleDateString(),
              sellerName: orderData.seller_name
            }
          );
          console.log('📧 Delivery confirmation email sent to:', orderData.buyer_email);
        }
      }
    } catch (emailError) {
      console.error('Failed to send status update email:', emailError);
      // Don't fail the status update if email fails
    }

    res.json({
      success: true,
      message: 'Order status updated successfully',
      order: {
        ...updatedOrder.rows[0],
        shipping_address: safeJsonParse(updatedOrder.rows[0].shipping_address)
      }
    });

  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order status',
      error: error.message
    });
  }
};

/**
 * Razorpay webhook handler
 * POST /api/payments/webhook
 */
export const handleWebhook = async (req, res) => {
  try {
    // Check if webhook secret is configured
    if (!process.env.RAZORPAY_WEBHOOK_SECRET) {
      console.warn('⚠️  Webhook received but RAZORPAY_WEBHOOK_SECRET not configured');
      return res.status(503).json({ 
        success: false, 
        message: 'Webhook service not configured' 
      });
    }

    const webhookBody = JSON.stringify(req.body);
    const webhookSignature = req.headers['x-razorpay-signature'];

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(webhookBody)
      .digest('hex');

    if (webhookSignature !== expectedSignature) {
      return res.status(400).json({ success: false, message: 'Invalid signature' });
    }

    const event = req.body;

    // Log webhook
    console.log('Razorpay Webhook:', event.event, event.payload);

    // Handle different events
    switch (event.event) {
      case 'payment.authorized':
        await handlePaymentAuthorized(event.payload.payment.entity);
        break;
      case 'payment.captured':
        await handlePaymentCaptured(event.payload.payment.entity);
        break;
      case 'payment.failed':
        await handlePaymentFailed(event.payload.payment.entity);
        break;
      default:
        console.log('Unhandled webhook event:', event.event);
    }

    res.json({ success: true });

  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Webhook event handlers
async function handlePaymentAuthorized(payment) {
  await query(`
    UPDATE payments 
    SET status = 'authorized', authorized_at = CURRENT_TIMESTAMP
    WHERE razorpay_payment_id = $1
  `, [payment.id]);
}

async function handlePaymentCaptured(payment) {
  await query(`
    UPDATE payments 
    SET status = 'captured', captured_at = CURRENT_TIMESTAMP
    WHERE razorpay_payment_id = $1
  `, [payment.id]);
  
  await query(`
    UPDATE orders 
    SET status = 'paid', payment_status = 'completed', paid_at = CURRENT_TIMESTAMP
    WHERE id = (SELECT order_id FROM payments WHERE razorpay_payment_id = $1)
  `, [payment.id]);
}

async function handlePaymentFailed(payment) {
  await query(`
    UPDATE payments 
    SET status = 'failed', 
        failed_at = CURRENT_TIMESTAMP,
        error_code = $1,
        error_description = $2
    WHERE razorpay_payment_id = $3
  `, [payment.error_code, payment.error_description, payment.id]);
  
  await query(`
    UPDATE orders 
    SET status = 'payment_failed', payment_status = 'failed'
    WHERE id = (SELECT order_id FROM payments WHERE razorpay_payment_id = $1)
  `, [payment.id]);
}

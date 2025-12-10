import pool from '../config/database.js';
import { sendEmail } from '../services/emailService.js';

// Generate unique order number
const generateOrderNumber = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ORD-${timestamp}-${random}`;
};

// Get all orders for a user
export const getOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    const { status } = req.query;

    let query = `
      SELECT o.*, 
             b.company_name as buyer_company,
             b.email as buyer_email,
             s.company_name as seller_company,
             s.email as seller_email
      FROM orders o
      LEFT JOIN users b ON o.buyer_id = b.id
      LEFT JOIN users s ON o.seller_id = s.id
      WHERE 1=1
    `;

    const params = [];
    let paramCount = 1;

    // Filter by user role
    if (userRole === 'buyer') {
      query += ` AND o.buyer_id = $${paramCount}`;
      params.push(userId);
      paramCount++;
    } else if (userRole === 'seller') {
      query += ` AND o.seller_id = $${paramCount}`;
      params.push(userId);
      paramCount++;
    }

    // Filter by status if provided
    if (status) {
      query += ` AND o.status = $${paramCount}`;
      params.push(status);
      paramCount++;
    }

    query += ' ORDER BY o.created_at DESC';

    const result = await pool.query(query, params);

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders'
    });
  }
};

// Get single order by ID
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const result = await pool.query(
      `SELECT o.*, 
              b.company_name as buyer_company,
              b.email as buyer_email,
              b.phone as buyer_phone,
              s.company_name as seller_company,
              s.email as seller_email,
              s.phone as seller_phone
       FROM orders o
       LEFT JOIN users b ON o.buyer_id = b.id
       LEFT JOIN users s ON o.seller_id = s.id
       WHERE o.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const order = result.rows[0];

    // Verify access
    if (
      userRole !== 'admin' &&
      order.buyer_id !== userId &&
      order.seller_id !== userId
    ) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order'
    });
  }
};

// Create new order from accepted quote
export const createOrder = async (req, res) => {
  try {
    const buyerId = req.user.id;
    const {
      quote_id,
      delivery_address,
      notes
    } = req.body;

    // Get quote details
    const quoteResult = await pool.query(
      `SELECT q.*, r.id as rfq_id
       FROM quotes q
       JOIN rfqs r ON q.rfq_id = r.id
       WHERE q.id = $1 AND q.status = 'accepted'`,
      [quote_id]
    );

    if (quoteResult.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Quote not found or not accepted'
      });
    }

    const quote = quoteResult.rows[0];

    // Verify buyer owns the RFQ
    const rfqCheck = await pool.query(
      'SELECT buyer_id FROM rfqs WHERE id = $1',
      [quote.rfq_id]
    );

    if (rfqCheck.rows[0].buyer_id !== buyerId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const orderNumber = generateOrderNumber();

    const result = await pool.query(
      `INSERT INTO orders (
        order_number, buyer_id, seller_id, quote_id, rfq_id,
        items, subtotal, tax, shipping_cost, total_amount,
        delivery_address, notes, status, payment_status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, 'pending', 'pending')
      RETURNING *`,
      [
        orderNumber,
        buyerId,
        quote.seller_id,
        quote_id,
        quote.rfq_id,
        quote.line_items,
        quote.subtotal,
        quote.tax,
        quote.shipping_cost,
        quote.total_amount,
        delivery_address,
        notes
      ]
    );

    const order = result.rows[0];

    // Get buyer and seller details for email
    const buyerResult = await pool.query(
      'SELECT email, company_name FROM users WHERE id = $1',
      [buyerId]
    );
    const sellerResult = await pool.query(
      'SELECT email, company_name FROM users WHERE id = $1',
      [quote.seller_id]
    );

    if (buyerResult.rows.length > 0) {
      const buyer = buyerResult.rows[0];
      
      // Send order confirmation to buyer
      sendEmail(buyer.email, 'orderCreated', {
        companyName: buyer.company_name,
        orderNumber: orderNumber,
        totalAmount: order.total_amount,
        deliveryAddress: delivery_address,
        sellerCompany: sellerResult.rows.length > 0 ? sellerResult.rows[0].company_name : 'Supplier'
      }).catch(err => console.error('Failed to send order confirmation email to buyer:', err));
    }

    if (sellerResult.rows.length > 0) {
      const seller = sellerResult.rows[0];
      
      // Send order notification to seller
      sendEmail(seller.email, 'orderCreated', {
        companyName: seller.company_name,
        orderNumber: orderNumber,
        totalAmount: order.total_amount,
        deliveryAddress: delivery_address,
        buyerCompany: buyerResult.rows.length > 0 ? buyerResult.rows[0].company_name : 'Buyer'
      }).catch(err => console.error('Failed to send order notification email to seller:', err));
    }

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order'
    });
  }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }

    // Get order
    const orderCheck = await pool.query(
      'SELECT buyer_id, seller_id FROM orders WHERE id = $1',
      [id]
    );

    if (orderCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const order = orderCheck.rows[0];

    // Verify access: only seller or admin can update status
    if (userRole !== 'admin' && order.seller_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Only seller can update order status'
      });
    }

    const result = await pool.query(
      'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order status'
    });
  }
};

// Update payment status
export const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { payment_status } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

    const validPaymentStatuses = ['pending', 'paid', 'failed', 'refunded'];
    if (!validPaymentStatuses.includes(payment_status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment status value'
      });
    }

    // Get order
    const orderCheck = await pool.query(
      'SELECT buyer_id, seller_id FROM orders WHERE id = $1',
      [id]
    );

    if (orderCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const order = orderCheck.rows[0];

    // Only buyer or admin can update payment status
    if (userRole !== 'admin' && order.buyer_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Only buyer can update payment status'
      });
    }

    const result = await pool.query(
      'UPDATE orders SET payment_status = $1 WHERE id = $2 RETURNING *',
      [payment_status, id]
    );

    res.json({
      success: true,
      message: 'Payment status updated successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating payment status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update payment status'
    });
  }
};

// Cancel order
export const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const orderCheck = await pool.query(
      'SELECT buyer_id, seller_id, status FROM orders WHERE id = $1',
      [id]
    );

    if (orderCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const order = orderCheck.rows[0];

    // Can't cancel if already shipped or delivered
    if (['shipped', 'delivered'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel order that is already shipped or delivered'
      });
    }

    // Verify access: buyer or seller can cancel
    if (
      userRole !== 'admin' &&
      order.buyer_id !== userId &&
      order.seller_id !== userId
    ) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const result = await pool.query(
      "UPDATE orders SET status = 'cancelled' WHERE id = $1 RETURNING *",
      [id]
    );

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel order'
    });
  }
};

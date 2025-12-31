import { query } from '../config/database.js';
import { sendEmail } from '../services/emailService.js';

// Get platform statistics
export const getPlatformStats = async (req, res) => {
  try {
    // Total and active users
    const usersResult = await query(
      `SELECT 
        COUNT(*) as total_users,
        COUNT(*) FILTER (WHERE verified = true) as active_users
       FROM users`
    );

    // Total and pending products
    const productsResult = await query(
      `SELECT 
        COUNT(*) as total_products,
        COUNT(*) FILTER (WHERE available = false) as pending_products
       FROM products`
    );

    // Total and active RFQs
    const rfqsResult = await query(
      `SELECT 
        COUNT(*) as total_rfqs,
        COUNT(*) FILTER (WHERE status = 'open') as active_rfqs
       FROM rfqs`
    );

    // Total orders and revenue
    const ordersResult = await query(
      `SELECT 
        COUNT(*) as total_orders,
        COALESCE(SUM(total_amount), 0) as revenue
       FROM orders`
    );

    res.json({
      success: true,
      data: {
        totalUsers: parseInt(usersResult.rows[0].total_users),
        activeUsers: parseInt(usersResult.rows[0].active_users),
        totalProducts: parseInt(productsResult.rows[0].total_products),
        pendingProducts: parseInt(productsResult.rows[0].pending_products),
        totalRFQs: parseInt(rfqsResult.rows[0].total_rfqs),
        activeRFQs: parseInt(rfqsResult.rows[0].active_rfqs),
        totalOrders: parseInt(ordersResult.rows[0].total_orders),
        revenue: parseFloat(ordersResult.rows[0].revenue)
      }
    });
  } catch (error) {
    console.error('Get platform stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch platform statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get all users (admin only)
export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, role, verified } = req.query;
    const offset = (page - 1) * limit;

    let queryText = `
      SELECT id, email, role, company_name, full_name, phone, country, verified, created_at
      FROM users
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 0;

    if (role) {
      paramCount++;
      queryText += ` AND role = $${paramCount}`;
      params.push(role);
    }

    if (verified !== undefined) {
      paramCount++;
      queryText += ` AND verified = $${paramCount}`;
      params.push(verified === 'true');
    }

    queryText += ` ORDER BY created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    params.push(limit, offset);

    const result = await query(queryText, params);

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Verify user (admin only)
export const verifyUser = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      `UPDATE users 
       SET verified = true 
       WHERE id = $1 
       RETURNING id, email, role, company_name, full_name, verified`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const user = result.rows[0];

    // Send verification email
    await sendEmail(user.email, 'userVerification', {
      userName: user.full_name || user.company_name || 'User'
    });

    res.json({
      success: true,
      message: 'User verified successfully',
      data: user
    });
  } catch (error) {
    console.error('Verify user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify user',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get all products (admin only)
export const getAllProductsAdmin = async (req, res) => {
  try {
    console.log('getAllProductsAdmin called with query:', req.query);
    const { page = 1, limit = 10, category, status } = req.query;
    const offset = (page - 1) * limit;

    let queryText = `
      SELECT p.*, u.company_name as supplier_name
      FROM products p
      JOIN users u ON p.supplier_id = u.id
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 0;

    if (category) {
      paramCount++;
      queryText += ` AND p.category = $${paramCount}`;
      params.push(category);
    }

    if (status && status !== 'all') {
      paramCount++;
      queryText += ` AND p.approval_status = $${paramCount}`;
      params.push(status);
    }

    queryText += ` ORDER BY p.created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    params.push(limit, offset);

    const result = await query(queryText, params);
    console.log('Admin found products:', result.rows.length);

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Get all products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Approve product (admin only)
export const approveProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'approved' or 'rejected'

    if (!status || !['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be "approved" or "rejected"'
      });
    }

    const result = await query(
      `UPDATE products 
       SET approval_status = $1 
       WHERE id = $2 
       RETURNING *`,
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const product = result.rows[0];

    // Get seller details
    const sellerResult = await query(
      'SELECT email, company_name FROM users WHERE id = $1',
      [product.supplier_id]
    );

    if (sellerResult.rows.length > 0) {
      const seller = sellerResult.rows[0];
      
      // Send approval/rejection email to seller
      const emailType = status === 'approved' ? 'productApproved' : 'productRejected';
      sendEmail(seller.email, emailType, {
        companyName: seller.company_name,
        productName: product.name,
        category: product.category,
        price: product.price,
        moq: product.moq,
        status: status
      }).catch(err => console.error(`Failed to send product ${status} email:`, err));
    }

    res.json({
      success: true,
      message: `Product ${status} successfully`,
      data: product
    });
  } catch (error) {
    console.error('Approve product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve product',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Delete user (admin only)
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Don't allow deleting yourself
    if (id === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account'
      });
    }

    await query('DELETE FROM users WHERE id = $1', [id]);

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get all RFQs (admin only)
export const getAllRFQsAdmin = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const result = await query(
      `SELECT r.*, u.company_name as buyer_name, u.country as buyer_country,
              (SELECT COUNT(*) FROM quotes WHERE rfq_id = r.id) as quote_count
       FROM rfqs r
       JOIN users u ON r.buyer_id = u.id
       ORDER BY r.created_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Get all RFQs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch RFQs',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

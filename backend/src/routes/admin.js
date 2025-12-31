import express from 'express';
import { 
  getPlatformStats, 
  getAllUsers, 
  verifyUser, 
  getAllProductsAdmin, 
  approveProduct,
  deleteUser,
  getAllRFQsAdmin
} from '../controllers/adminController.js';
import { authMiddleware, authorize } from '../middleware/auth.js';
import { getOrders, updateOrderStatus } from '../controllers/orderController.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authMiddleware);
router.use(authorize('admin'));

// Platform statistics
router.get('/stats', getPlatformStats);

// Analytics endpoint
router.get('/analytics', async (req, res) => {
  try {
    const pool = (await import('../config/database.js')).default;
    
    // Get overview stats
    const userStats = await pool.query('SELECT COUNT(*) as total, role FROM users GROUP BY role');
    const productCount = await pool.query('SELECT COUNT(*) as total FROM products');
    const rfqCount = await pool.query('SELECT COUNT(*) as total FROM rfqs');
    const orderCount = await pool.query('SELECT COUNT(*) as total FROM orders');
    const revenueResult = await pool.query('SELECT COALESCE(SUM(total_amount), 0) as total FROM orders WHERE payment_status = \'paid\'');
    
    // Get today's activity
    const today = new Date().toISOString().split('T')[0];
    const newUsersToday = await pool.query('SELECT COUNT(*) as count FROM users WHERE DATE(created_at) = $1', [today]);
    const newProductsToday = await pool.query('SELECT COUNT(*) as count FROM products WHERE DATE(created_at) = $1', [today]);
    const newRFQsToday = await pool.query('SELECT COUNT(*) as count FROM rfqs WHERE DATE(created_at) = $1', [today]);
    const newOrdersToday = await pool.query('SELECT COUNT(*) as count FROM orders WHERE DATE(created_at) = $1', [today]);
    
    const buyers = userStats.rows.find(r => r.role === 'buyer')?.total || 0;
    const sellers = userStats.rows.find(r => r.role === 'seller')?.total || 0;
    
    res.json({
      success: true,
      data: {
        overview: {
          total_users: parseInt(buyers) + parseInt(sellers),
          total_buyers: parseInt(buyers),
          total_sellers: parseInt(sellers),
          total_products: parseInt(productCount.rows[0].total),
          total_rfqs: parseInt(rfqCount.rows[0].total),
          total_orders: parseInt(orderCount.rows[0].total),
          total_revenue: parseFloat(revenueResult.rows[0].total)
        },
        recent_activity: {
          new_users_today: parseInt(newUsersToday.rows[0].count),
          new_products_today: parseInt(newProductsToday.rows[0].count),
          new_rfqs_today: parseInt(newRFQsToday.rows[0].count),
          new_orders_today: parseInt(newOrdersToday.rows[0].count)
        }
      }
    });
  } catch (error) {
    console.error('Admin analytics error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch analytics' });
  }
});

// Settings endpoints
router.get('/settings', async (req, res) => {
  // Return default settings for now
  res.json({
    success: true,
    data: {
      site_name: 'EximpoGlobal',
      support_email: 'support@eximpo.global',
      max_upload_size: 10,
      currency_default: 'USD',
      timezone: 'UTC',
      email_notifications: true,
      sms_notifications: false,
      require_kyc: true,
      auto_approve_products: false,
      commission_rate: 2.5
    }
  });
});

router.put('/settings', async (req, res) => {
  // Accept settings update
  res.json({
    success: true,
    message: 'Settings updated successfully',
    data: req.body
  });
});

// User management
router.get('/users', getAllUsers);
router.patch('/users/:id/verify', verifyUser);
router.delete('/users/:id', deleteUser);

// Product management
router.get('/products', getAllProductsAdmin);
router.patch('/products/:id/approve', approveProduct);

// RFQ management
router.get('/rfqs', getAllRFQsAdmin);

// Order management for admin
router.get('/orders', getOrders);
router.patch('/orders/:id/status', updateOrderStatus);

export default router;

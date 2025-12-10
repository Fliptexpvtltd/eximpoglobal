import pool from '../config/database.js';

// Get buyer dashboard analytics
export const getBuyerAnalytics = async (req, res) => {
  try {
    const buyerId = req.user.id;

    // Get all relevant stats in parallel
    const [
      totalRFQs,
      openRFQs,
      totalOrders,
      activeOrders,
      totalSpent,
      pendingQuotes,
      recentActivity
    ] = await Promise.all([
      // Total RFQs created
      pool.query('SELECT COUNT(*) FROM rfqs WHERE buyer_id = $1', [buyerId]),
      
      // Open RFQs
      pool.query(
        "SELECT COUNT(*) FROM rfqs WHERE buyer_id = $1 AND status = 'open'",
        [buyerId]
      ),
      
      // Total orders
      pool.query('SELECT COUNT(*) FROM orders WHERE buyer_id = $1', [buyerId]),
      
      // Active orders (not delivered or cancelled)
      pool.query(
        "SELECT COUNT(*) FROM orders WHERE buyer_id = $1 AND status NOT IN ('delivered', 'cancelled')",
        [buyerId]
      ),
      
      // Total amount spent
      pool.query(
        "SELECT COALESCE(SUM(total_amount), 0) as total FROM orders WHERE buyer_id = $1 AND status != 'cancelled'",
        [buyerId]
      ),
      
      // Pending quotes for buyer's RFQs
      pool.query(
        `SELECT COUNT(*) FROM quotes q
         JOIN rfqs r ON q.rfq_id = r.id
         WHERE r.buyer_id = $1 AND q.status = 'pending'`,
        [buyerId]
      ),
      
      // Recent activity (last 5 updates)
      pool.query(
        `(SELECT 'rfq' as type, id, title as description, created_at FROM rfqs WHERE buyer_id = $1 ORDER BY created_at DESC LIMIT 5)
         UNION ALL
         (SELECT 'order' as type, o.id, 'Order ' || o.order_number as description, o.created_at 
          FROM orders o WHERE o.buyer_id = $1 ORDER BY o.created_at DESC LIMIT 5)
         ORDER BY created_at DESC LIMIT 10`,
        [buyerId]
      )
    ]);

    // Get order status breakdown
    const orderStatusResult = await pool.query(
      `SELECT status, COUNT(*) as count
       FROM orders
       WHERE buyer_id = $1
       GROUP BY status`,
      [buyerId]
    );

    const orderStatusBreakdown = {};
    orderStatusResult.rows.forEach(row => {
      orderStatusBreakdown[row.status] = parseInt(row.count);
    });

    // Get monthly spending (last 6 months)
    const monthlySpendingResult = await pool.query(
      `SELECT 
         TO_CHAR(created_at, 'YYYY-MM') as month,
         SUM(total_amount) as total
       FROM orders
       WHERE buyer_id = $1 
         AND created_at >= NOW() - INTERVAL '6 months'
         AND status != 'cancelled'
       GROUP BY TO_CHAR(created_at, 'YYYY-MM')
       ORDER BY month DESC`,
      [buyerId]
    );

    res.json({
      success: true,
      data: {
        overview: {
          total_rfqs: parseInt(totalRFQs.rows[0].count),
          open_rfqs: parseInt(openRFQs.rows[0].count),
          total_orders: parseInt(totalOrders.rows[0].count),
          active_orders: parseInt(activeOrders.rows[0].count),
          total_spent: parseFloat(totalSpent.rows[0].total),
          pending_quotes: parseInt(pendingQuotes.rows[0].count)
        },
        order_status_breakdown: orderStatusBreakdown,
        monthly_spending: monthlySpendingResult.rows,
        recent_activity: recentActivity.rows
      }
    });
  } catch (error) {
    console.error('Error fetching buyer analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch buyer analytics'
    });
  }
};

// Get seller dashboard analytics
export const getSellerAnalytics = async (req, res) => {
  try {
    const sellerId = req.user.id;

    const [
      totalProducts,
      activeProducts,
      totalQuotes,
      acceptedQuotes,
      totalOrders,
      activeOrders,
      totalRevenue,
      recentActivity
    ] = await Promise.all([
      // Total products
      pool.query('SELECT COUNT(*) FROM products WHERE supplier_id = $1', [sellerId]),
      
      // Active products
      pool.query(
        'SELECT COUNT(*) FROM products WHERE supplier_id = $1 AND available = true',
        [sellerId]
      ),
      
      // Total quotes submitted
      pool.query('SELECT COUNT(*) FROM quotes WHERE seller_id = $1', [sellerId]),
      
      // Accepted quotes
      pool.query(
        "SELECT COUNT(*) FROM quotes WHERE seller_id = $1 AND status = 'accepted'",
        [sellerId]
      ),
      
      // Total orders
      pool.query('SELECT COUNT(*) FROM orders WHERE seller_id = $1', [sellerId]),
      
      // Active orders
      pool.query(
        "SELECT COUNT(*) FROM orders WHERE seller_id = $1 AND status NOT IN ('delivered', 'cancelled')",
        [sellerId]
      ),
      
      // Total revenue
      pool.query(
        "SELECT COALESCE(SUM(total_amount), 0) as total FROM orders WHERE seller_id = $1 AND status != 'cancelled'",
        [sellerId]
      ),
      
      // Recent activity
      pool.query(
        `(SELECT 'quote' as type, q.id, 'Quote for RFQ' as description, q.created_at 
          FROM quotes q WHERE q.seller_id = $1 ORDER BY q.created_at DESC LIMIT 5)
         UNION ALL
         (SELECT 'order' as type, o.id, 'Order ' || o.order_number as description, o.created_at 
          FROM orders o WHERE o.seller_id = $1 ORDER BY o.created_at DESC LIMIT 5)
         ORDER BY created_at DESC LIMIT 10`,
        [sellerId]
      )
    ]);

    // Quote conversion rate
    const totalQuotesCount = parseInt(totalQuotes.rows[0].count);
    const acceptedQuotesCount = parseInt(acceptedQuotes.rows[0].count);
    const conversionRate = totalQuotesCount > 0 
      ? ((acceptedQuotesCount / totalQuotesCount) * 100).toFixed(2)
      : 0;

    // Order status breakdown
    const orderStatusResult = await pool.query(
      `SELECT status, COUNT(*) as count
       FROM orders
       WHERE seller_id = $1
       GROUP BY status`,
      [sellerId]
    );

    const orderStatusBreakdown = {};
    orderStatusResult.rows.forEach(row => {
      orderStatusBreakdown[row.status] = parseInt(row.count);
    });

    // Monthly revenue (last 6 months)
    const monthlyRevenueResult = await pool.query(
      `SELECT 
         TO_CHAR(created_at, 'YYYY-MM') as month,
         SUM(total_amount) as total,
         COUNT(*) as order_count
       FROM orders
       WHERE seller_id = $1 
         AND created_at >= NOW() - INTERVAL '6 months'
         AND status != 'cancelled'
       GROUP BY TO_CHAR(created_at, 'YYYY-MM')
       ORDER BY month DESC`,
      [sellerId]
    );

    res.json({
      success: true,
      data: {
        overview: {
          total_products: parseInt(totalProducts.rows[0].count),
          active_products: parseInt(activeProducts.rows[0].count),
          total_quotes: totalQuotesCount,
          accepted_quotes: acceptedQuotesCount,
          quote_conversion_rate: parseFloat(conversionRate),
          total_orders: parseInt(totalOrders.rows[0].count),
          active_orders: parseInt(activeOrders.rows[0].count),
          total_revenue: parseFloat(totalRevenue.rows[0].total)
        },
        order_status_breakdown: orderStatusBreakdown,
        monthly_revenue: monthlyRevenueResult.rows,
        recent_activity: recentActivity.rows
      }
    });
  } catch (error) {
    console.error('Error fetching seller analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch seller analytics'
    });
  }
};

// Get admin dashboard analytics
export const getAdminAnalytics = async (req, res) => {
  try {
    const [
      totalUsers,
      totalBuyers,
      totalSellers,
      totalProducts,
      totalRFQs,
      totalQuotes,
      totalOrders,
      totalRevenue,
      recentUsers
    ] = await Promise.all([
      // Total users
      pool.query('SELECT COUNT(*) FROM users'),
      
      // Total buyers
      pool.query("SELECT COUNT(*) FROM users WHERE role = 'buyer'"),
      
      // Total sellers
      pool.query("SELECT COUNT(*) FROM users WHERE role = 'seller'"),
      
      // Total products
      pool.query('SELECT COUNT(*) FROM products'),
      
      // Total RFQs
      pool.query('SELECT COUNT(*) FROM rfqs'),
      
      // Total quotes
      pool.query('SELECT COUNT(*) FROM quotes'),
      
      // Total orders
      pool.query('SELECT COUNT(*) FROM orders'),
      
      // Total platform revenue (sum of all orders)
      pool.query(
        "SELECT COALESCE(SUM(total_amount), 0) as total FROM orders WHERE status != 'cancelled'"
      ),
      
      // Recent user registrations
      pool.query(
        `SELECT id, email, role, company_name, created_at
         FROM users
         ORDER BY created_at DESC
         LIMIT 10`
      )
    ]);

    // User growth (monthly registrations for last 6 months)
    const userGrowthResult = await pool.query(
      `SELECT 
         TO_CHAR(created_at, 'YYYY-MM') as month,
         role,
         COUNT(*) as count
       FROM users
       WHERE created_at >= NOW() - INTERVAL '6 months'
       GROUP BY TO_CHAR(created_at, 'YYYY-MM'), role
       ORDER BY month DESC`
    );

    // Order status overview
    const orderStatusResult = await pool.query(
      `SELECT status, COUNT(*) as count, SUM(total_amount) as revenue
       FROM orders
       GROUP BY status`
    );

    const orderStatusOverview = {};
    orderStatusResult.rows.forEach(row => {
      orderStatusOverview[row.status] = {
        count: parseInt(row.count),
        revenue: parseFloat(row.revenue || 0)
      };
    });

    // Platform revenue by month (last 6 months)
    const monthlyRevenueResult = await pool.query(
      `SELECT 
         TO_CHAR(created_at, 'YYYY-MM') as month,
         SUM(total_amount) as total,
         COUNT(*) as order_count
       FROM orders
       WHERE created_at >= NOW() - INTERVAL '6 months'
         AND status != 'cancelled'
       GROUP BY TO_CHAR(created_at, 'YYYY-MM')
       ORDER BY month DESC`
    );

    // Top sellers by revenue
    const topSellersResult = await pool.query(
      `SELECT 
         u.id,
         u.company_name,
         u.email,
         COUNT(o.id) as order_count,
         COALESCE(SUM(o.total_amount), 0) as total_revenue
       FROM users u
       LEFT JOIN orders o ON u.id = o.seller_id AND o.status != 'cancelled'
       WHERE u.role = 'seller'
       GROUP BY u.id, u.company_name, u.email
       ORDER BY total_revenue DESC
       LIMIT 10`
    );

    // Top buyers by spending
    const topBuyersResult = await pool.query(
      `SELECT 
         u.id,
         u.company_name,
         u.email,
         COUNT(o.id) as order_count,
         COALESCE(SUM(o.total_amount), 0) as total_spent
       FROM users u
       LEFT JOIN orders o ON u.id = o.buyer_id AND o.status != 'cancelled'
       WHERE u.role = 'buyer'
       GROUP BY u.id, u.company_name, u.email
       ORDER BY total_spent DESC
       LIMIT 10`
    );

    res.json({
      success: true,
      data: {
        overview: {
          total_users: parseInt(totalUsers.rows[0].count),
          total_buyers: parseInt(totalBuyers.rows[0].count),
          total_sellers: parseInt(totalSellers.rows[0].count),
          total_products: parseInt(totalProducts.rows[0].count),
          total_rfqs: parseInt(totalRFQs.rows[0].count),
          total_quotes: parseInt(totalQuotes.rows[0].count),
          total_orders: parseInt(totalOrders.rows[0].count),
          total_revenue: parseFloat(totalRevenue.rows[0].total)
        },
        user_growth: userGrowthResult.rows,
        order_status_overview: orderStatusOverview,
        monthly_revenue: monthlyRevenueResult.rows,
        top_sellers: topSellersResult.rows,
        top_buyers: topBuyersResult.rows,
        recent_users: recentUsers.rows
      }
    });
  } catch (error) {
    console.error('Error fetching admin analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch admin analytics'
    });
  }
};

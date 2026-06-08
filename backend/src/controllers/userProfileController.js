import pool from '../config/database.js';

// Get user stats (orders, spending, etc.)
export const getUserStats = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const role = req.user.role;

    let stats = {};

    if (role === 'buyer' || role === 'both') {
      // Get buyer stats
      const orderStats = await pool.query(
        `SELECT 
          COUNT(*) FILTER (WHERE status IN ('pending', 'confirmed', 'processing')) as active_orders,
          COUNT(*) as total_orders,
          COALESCE(SUM(total_amount), 0) as total_spent
        FROM orders 
        WHERE buyer_id = $1`,
        [userId]
      );

      const orderData = orderStats.rows[0];

      stats = {
        activeOrders: parseInt(orderData.active_orders) || 0,
        totalOrders: parseInt(orderData.total_orders) || 0,
        totalSpent: parseFloat(orderData.total_spent) || 0,
        onTimeRate: 100
      };
    } else if (role === 'seller') {
      // Get seller stats
      const sellerStats = await pool.query(
        `SELECT 
          COUNT(*) FILTER (WHERE status IN ('pending', 'confirmed', 'processing')) as active_orders,
          COUNT(*) as total_orders,
          COALESCE(SUM(total_amount), 0) as total_revenue
        FROM orders 
        WHERE seller_id = $1`,
        [userId]
      );

      const productCount = await pool.query(
        'SELECT COUNT(*) as count FROM products WHERE supplier_id = $1',
        [userId]
      );

      const sellerData = sellerStats.rows[0];

      stats = {
        activeOrders: parseInt(sellerData.active_orders) || 0,
        totalOrders: parseInt(sellerData.total_orders) || 0,
        totalRevenue: parseFloat(sellerData.total_revenue) || 0,
        totalProducts: parseInt(productCount.rows[0].count) || 0,
        onTimeRate: 100
      };
    }

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user stats',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get company details
export const getCompanyDetails = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;

    const result = await pool.query(
      `SELECT 
        u.company_name,
        u.full_name,
        u.email,
        u.phone,
        u.country,
        cp.legal_name,
        cp.business_type,
        cp.industry,
        cp.year_established,
        cp.employee_count,
        cp.registration_number,
        cp.tax_id,
        cp.website,
        cp.description,
        cp.address,
        cp.city,
        cp.state,
        cp.zip_code,
        cp.country as company_country
      FROM users u
      LEFT JOIN company_profiles cp ON u.id = cp.user_id
      WHERE u.id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching company details:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch company details',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update company details
export const updateCompanyDetails = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const {
      legalName,
      businessType,
      industry,
      yearEstablished,
      employeeCount,
      registrationNumber,
      taxId,
      website,
      description,
      address,
      city,
      state,
      zipCode,
      country
    } = req.body;

    // Check if company profile exists
    const checkResult = await pool.query(
      'SELECT id FROM company_profiles WHERE user_id = $1',
      [userId]
    );

    let result;
    if (checkResult.rows.length === 0) {
      // Create new company profile
      result = await pool.query(
        `INSERT INTO company_profiles (
          user_id, legal_name, business_type, industry, year_established,
          employee_count, registration_number, tax_id, website, description,
          address, city, state, zip_code, country
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
        RETURNING *`,
        [
          userId, legalName, businessType, industry, yearEstablished,
          employeeCount, registrationNumber, taxId, website, description,
          address, city, state, zipCode, country
        ]
      );
    } else {
      // Update existing company profile
      result = await pool.query(
        `UPDATE company_profiles SET
          legal_name = COALESCE($1, legal_name),
          business_type = COALESCE($2, business_type),
          industry = COALESCE($3, industry),
          year_established = COALESCE($4, year_established),
          employee_count = COALESCE($5, employee_count),
          registration_number = COALESCE($6, registration_number),
          tax_id = COALESCE($7, tax_id),
          website = COALESCE($8, website),
          description = COALESCE($9, description),
          address = COALESCE($10, address),
          city = COALESCE($11, city),
          state = COALESCE($12, state),
          zip_code = COALESCE($13, zip_code),
          country = COALESCE($14, country),
          updated_at = NOW()
        WHERE user_id = $15
        RETURNING *`,
        [
          legalName, businessType, industry, yearEstablished,
          employeeCount, registrationNumber, taxId, website, description,
          address, city, state, zipCode, country, userId
        ]
      );
    }

    res.json({
      success: true,
      message: 'Company details updated successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating company details:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update company details',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};


// Get user preferences
export const getUserPreferences = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;

    const result = await pool.query(
      `SELECT language, currency, timezone, date_format,
              email_notifications, sms_notifications, marketing_emails,
              order_updates, price_alerts
       FROM user_preferences
       WHERE user_id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      // Return default preferences
      return res.json({
        success: true,
        data: {
          language: 'en',
          currency: 'USD',
          timezone: 'America/New_York',
          dateFormat: 'MM/DD/YYYY',
          emailNotifications: true,
          smsNotifications: false,
          marketingEmails: false,
          orderUpdates: true,
          priceAlerts: true
        }
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching user preferences:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user preferences',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update user preferences
export const updateUserPreferences = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const preferences = req.body;

    // Check if preferences exist
    const checkResult = await pool.query(
      'SELECT id FROM user_preferences WHERE user_id = $1',
      [userId]
    );

    let result;
    if (checkResult.rows.length === 0) {
      // Create new preferences
      result = await pool.query(
        `INSERT INTO user_preferences (
          user_id, language, currency, timezone, date_format,
          email_notifications, sms_notifications, marketing_emails,
          order_updates, price_alerts
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *`,
        [
          userId,
          preferences.language,
          preferences.currency,
          preferences.timezone,
          preferences.dateFormat,
          preferences.emailNotifications,
          preferences.smsNotifications,
          preferences.marketingEmails,
          preferences.orderUpdates,
          preferences.priceAlerts
        ]
      );
    } else {
      // Update existing preferences
      result = await pool.query(
        `UPDATE user_preferences SET
          language = COALESCE($1, language),
          currency = COALESCE($2, currency),
          timezone = COALESCE($3, timezone),
          date_format = COALESCE($4, date_format),
          email_notifications = COALESCE($5, email_notifications),
          sms_notifications = COALESCE($6, sms_notifications),
          marketing_emails = COALESCE($7, marketing_emails),
          order_updates = COALESCE($8, order_updates),
          price_alerts = COALESCE($9, price_alerts),
          updated_at = NOW()
        WHERE user_id = $10
        RETURNING *`,
        [
          preferences.language,
          preferences.currency,
          preferences.timezone,
          preferences.dateFormat,
          preferences.emailNotifications,
          preferences.smsNotifications,
          preferences.marketingEmails,
          preferences.orderUpdates,
          preferences.priceAlerts,
          userId
        ]
      );
    }

    res.json({
      success: true,
      message: 'Preferences updated successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating user preferences:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user preferences',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

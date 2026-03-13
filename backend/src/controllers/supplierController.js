import pool from '../config/database.js';

// Get all suppliers (paginated with filters)
export const getSuppliers = async (req, res) => {
  try {
    const { category, country, verified, limit = 20, offset = 0 } = req.query;

    let query = `
      SELECT u.id, u.email, u.company_name, u.country, u.verified,
             sp.rating, sp.total_reviews, sp.years_in_business,
             sp.certifications, sp.specializations, sp.about,
             sp.logo_url, sp.verified as profile_verified
      FROM users u
      LEFT JOIN supplier_profiles sp ON u.id = sp.user_id
      WHERE u.role = 'seller'
    `;

    const params = [];
    let paramCount = 1;

    if (country) {
      query += ` AND u.country = $${paramCount}`;
      params.push(country);
      paramCount++;
    }

    if (verified === 'true') {
      query += ` AND u.verified = true AND sp.verified = true`;
    }

    if (category) {
      query += ` AND EXISTS (
        SELECT 1 FROM products p 
        WHERE p.supplier_id = u.id AND p.category = $${paramCount}
      )`;
      params.push(category);
      paramCount++;
    }

    query += ` ORDER BY sp.rating DESC NULLS LAST, sp.total_reviews DESC NULLS LAST`;
    query += ` LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) FROM users u WHERE u.role = \'seller\'';
    const countParams = [];
    let countParamIdx = 1;

    if (country) {
      countQuery += ` AND u.country = $${countParamIdx}`;
      countParams.push(country);
      countParamIdx++;
    }

    if (verified === 'true') {
      countQuery += ` AND u.verified = true`;
    }

    const countResult = await pool.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].count);

    res.json({
      success: true,
      data: result.rows,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: parseInt(offset) + result.rows.length < total
      }
    });
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch suppliers'
    });
  }
};

// Get single supplier by ID
export const getSupplierById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT u.id, u.email, u.company_name, u.full_name, u.phone, 
              u.country, u.verified, u.created_at,
              sp.rating, sp.total_reviews, sp.years_in_business,
              sp.certifications, sp.specializations, sp.production_capacity,
              sp.about, sp.logo_url, sp.banner_url, sp.verified as profile_verified
       FROM users u
       LEFT JOIN supplier_profiles sp ON u.id = sp.user_id
       WHERE u.id = $1 AND u.role = 'seller'`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Supplier not found'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching supplier:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch supplier'
    });
  }
};

// Get supplier's products
export const getSupplierProducts = async (req, res) => {
  try {
    const { id } = req.params;
    const { category, available = 'true' } = req.query;

    // Verify supplier exists
    const supplierCheck = await pool.query(
      "SELECT id FROM users WHERE id = $1 AND role = 'seller'",
      [id]
    );

    if (supplierCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Supplier not found'
      });
    }

    let query = 'SELECT * FROM products WHERE supplier_id = $1';
    const params = [id];
    let paramCount = 2;

    if (available === 'true') {
      query += ' AND available = true';
    }

    if (category) {
      query += ` AND category = $${paramCount}`;
      params.push(category);
      paramCount++;
    }

    query += ' ORDER BY display_order ASC, created_at DESC';

    const result = await pool.query(query, params);

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching supplier products:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch supplier products'
    });
  }
};

// Update supplier profile (seller updates their own profile)
export const updateSupplierProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      business_license,
      tax_id,
      years_in_business,
      certifications,
      specializations,
      production_capacity,
      about,
      logo_url,
      banner_url
    } = req.body;

    // Verify user is a seller
    if (req.user.role !== 'seller') {
      return res.status(403).json({
        success: false,
        message: 'Only sellers can update supplier profile'
      });
    }

    // Check if profile exists
    const profileCheck = await pool.query(
      'SELECT id FROM supplier_profiles WHERE user_id = $1',
      [userId]
    );

    let result;

    if (profileCheck.rows.length === 0) {
      // Create new profile
      result = await pool.query(
        `INSERT INTO supplier_profiles (
          user_id, business_license, tax_id, years_in_business,
          certifications, specializations, production_capacity,
          about, logo_url, banner_url
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *`,
        [
          userId,
          business_license,
          tax_id,
          years_in_business,
          certifications,
          specializations,
          production_capacity,
          about,
          logo_url,
          banner_url
        ]
      );
    } else {
      // Update existing profile
      result = await pool.query(
        `UPDATE supplier_profiles SET
          business_license = COALESCE($1, business_license),
          tax_id = COALESCE($2, tax_id),
          years_in_business = COALESCE($3, years_in_business),
          certifications = COALESCE($4, certifications),
          specializations = COALESCE($5, specializations),
          production_capacity = COALESCE($6, production_capacity),
          about = COALESCE($7, about),
          logo_url = COALESCE($8, logo_url),
          banner_url = COALESCE($9, banner_url)
        WHERE user_id = $10
        RETURNING *`,
        [
          business_license,
          tax_id,
          years_in_business,
          certifications,
          specializations,
          production_capacity,
          about,
          logo_url,
          banner_url,
          userId
        ]
      );
    }

    res.json({
      success: true,
      message: 'Supplier profile updated successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating supplier profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update supplier profile'
    });
  }
};

// Get current user's supplier profile
export const getMySupplierProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    if (req.user.role !== 'seller') {
      return res.status(403).json({
        success: false,
        message: 'Only sellers can access supplier profile'
      });
    }

    const result = await pool.query(
      `SELECT u.id, u.email, u.company_name, u.full_name, u.phone, 
              u.country, u.verified,
              sp.*
       FROM users u
       LEFT JOIN supplier_profiles sp ON u.id = sp.user_id
       WHERE u.id = $1`,
      [userId]
    );

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching supplier profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch supplier profile'
    });
  }
};

// Get supplier statistics
export const getSupplierStats = async (req, res) => {
  try {
    const { id } = req.params;

    // Verify supplier exists
    const supplierCheck = await pool.query(
      "SELECT id FROM users WHERE id = $1 AND role = 'seller'",
      [id]
    );

    if (supplierCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Supplier not found'
      });
    }

    // Get statistics
    const [productsCount, quotesCount, ordersCount, activeOrders] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM products WHERE supplier_id = $1', [id]),
      pool.query('SELECT COUNT(*) FROM quotes WHERE seller_id = $1', [id]),
      pool.query('SELECT COUNT(*) FROM orders WHERE seller_id = $1', [id]),
      pool.query(
        "SELECT COUNT(*) FROM orders WHERE seller_id = $1 AND status NOT IN ('delivered', 'cancelled')",
        [id]
      )
    ]);

    res.json({
      success: true,
      data: {
        total_products: parseInt(productsCount.rows[0].count),
        total_quotes: parseInt(quotesCount.rows[0].count),
        total_orders: parseInt(ordersCount.rows[0].count),
        active_orders: parseInt(activeOrders.rows[0].count)
      }
    });
  } catch (error) {
    console.error('Error fetching supplier stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch supplier statistics'
    });
  }
};

// Get product categories by supplier
export const getSupplierProductCategories = async (req, res) => {
  try {
    const { id } = req.params;

    // Verify supplier exists
    const supplierCheck = await pool.query(
      "SELECT id FROM users WHERE id = $1 AND role = 'seller'",
      [id]
    );

    if (supplierCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Supplier not found'
      });
    }

    // Get product categories with counts
    const result = await pool.query(
      `SELECT category as name, COUNT(*) as count
       FROM products 
       WHERE supplier_id = $1 AND available = true
       GROUP BY category
       ORDER BY count DESC`,
      [id]
    );

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching product categories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product categories'
    });
  }
};

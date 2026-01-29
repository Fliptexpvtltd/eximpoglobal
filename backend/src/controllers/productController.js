import { query } from '../config/database.js';

export const getAllProducts = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let queryText = `
      SELECT p.*, u.company_name as supplier_name, u.country as supplier_country
      FROM products p
      JOIN users u ON p.supplier_id = u.id
      WHERE p.available = true AND p.approval_status = 'approved'
    `;
    const params = [];
    let paramCount = 0;

    if (category) {
      paramCount++;
      queryText += ` AND p.category = $${paramCount}`;
      params.push(category);
    }

    if (search) {
      paramCount++;
      queryText += ` AND (p.name ILIKE $${paramCount} OR p.description ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }

    queryText += ` ORDER BY p.created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    params.push(limit, offset);

    const result = await query(queryText, params);

    // Get total count
    const countResult = await query(
      'SELECT COUNT(*) FROM products WHERE available = true AND approval_status = \'approved\'' + 
      (category ? ' AND category = $1' : ''),
      category ? [category] : []
    );

    res.json({
      success: true,
      data: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(countResult.rows[0].count)
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      `SELECT p.*, u.company_name as supplier_name, u.country as supplier_country, u.email as supplier_email
       FROM products p
       JOIN users u ON p.supplier_id = u.id
       WHERE p.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, category, subcategory, description, price, moq, unit, incoterms, certifications, images, specifications } = req.body;

    // Debug logging
    console.log('📦 Creating product with data:', {
      name,
      category,
      images: images,
      imagesType: typeof images,
      imagesLength: Array.isArray(images) ? images.length : 'not an array'
    });

    const result = await query(
      `INSERT INTO products (supplier_id, name, category, subcategory, description, price, moq, unit, incoterms, certifications, images, specifications, approval_status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, 'pending')
       RETURNING *`,
      [req.user.id, name, category, subcategory || null, description || null, price || null, moq || null, unit || null, incoterms || [], certifications || [], images || [], JSON.stringify(specifications || {})]
    );

    res.status(201).json({
      success: true,
      message: 'Product created successfully and submitted for approval',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create product',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, subcategory, description, price, moq, unit, incoterms, certifications, images, specifications, available } = req.body;

    // Check ownership
    const checkResult = await query(
      'SELECT supplier_id FROM products WHERE id = $1',
      [id]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (checkResult.rows[0].supplier_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this product'
      });
    }

    const result = await query(
      `UPDATE products 
       SET name = COALESCE($1, name),
           category = COALESCE($2, category),
           subcategory = COALESCE($3, subcategory),
           description = COALESCE($4, description),
           price = COALESCE($5, price),
           moq = COALESCE($6, moq),
           unit = COALESCE($7, unit),
           incoterms = COALESCE($8, incoterms),
           certifications = COALESCE($9, certifications),
           images = COALESCE($10, images),
           specifications = COALESCE($11, specifications),
           available = COALESCE($12, available)
       WHERE id = $13
       RETURNING *`,
      [name, category, subcategory, description, price, moq, unit, incoterms, certifications, images, specifications ? JSON.stringify(specifications) : null, available, id]
    );

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update product',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Check ownership
    const checkResult = await query(
      'SELECT supplier_id FROM products WHERE id = $1',
      [id]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (checkResult.rows[0].supplier_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this product'
      });
    }

    await query('DELETE FROM products WHERE id = $1', [id]);

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete product',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const approveProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, rejectionReason } = req.body; // 'approved' or 'rejected'

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid approval status'
      });
    }

    // Get product with seller info before updating
    const productResult = await query(
      `SELECT p.*, u.email as seller_email, u.company_name as seller_company
       FROM products p
       JOIN users u ON p.supplier_id = u.id
       WHERE p.id = $1`,
      [id]
    );

    if (productResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const product = productResult.rows[0];

    // Update approval status and rejection reason
    const result = await query(
      `UPDATE products 
       SET approval_status = $1, rejection_reason = $2, updated_at = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING *`,
      [status, status === 'rejected' ? rejectionReason : null, id]
    );

    // Send email notification to seller
    const { sendEmail } = await import('../services/emailService.js');
    const emailTemplate = status === 'approved' ? 'productApproved' : 'productRejected';
    
    await sendEmail(product.seller_email, emailTemplate, {
      productName: product.name,
      category: product.category,
      price: product.price,
      moq: product.moq,
      unit: product.unit,
      sellerCompany: product.seller_company,
      rejectionReason: status === 'rejected' ? rejectionReason : ''
    });

    res.json({
      success: true,
      message: `Product ${status} successfully`,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Approve product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update product approval status',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const getPendingProducts = async (req, res) => {
  try {
    const result = await query(
      `SELECT p.*, u.company_name as supplier_name, u.country as supplier_country, u.email as supplier_email
       FROM products p
       JOIN users u ON p.supplier_id = u.id
       WHERE p.approval_status = 'pending'
       ORDER BY p.created_at DESC`
    );

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Get pending products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pending products',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get seller's own products (seller only)
export const getMyProducts = async (req, res) => {
  try {
    console.log('getMyProducts called - User ID:', req.user?.id);
    const sellerId = req.user.id;
    const { status } = req.query; // Filter by approval_status if provided

    let queryText = `
      SELECT p.*
      FROM products p
      WHERE p.supplier_id = $1
    `;
    const params = [sellerId];
    console.log('Querying products for seller:', sellerId);

    if (status && ['pending', 'approved', 'rejected'].includes(status)) {
      queryText += ` AND p.approval_status = $2`;
      params.push(status);
    }

    queryText += ` ORDER BY p.created_at DESC`;

    const result = await query(queryText, params);
    console.log('Found products:', result.rows.length);

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Get my products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch your products',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

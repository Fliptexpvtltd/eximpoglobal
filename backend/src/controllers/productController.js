import { query } from '../config/database.js';

export const getAllProducts = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let queryText = `
      SELECT p.*, u.company_name as supplier_name, u.country as supplier_country
      FROM products p
      JOIN users u ON p.supplier_id = u.id
      WHERE p.available = true
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
      'SELECT COUNT(*) FROM products WHERE available = true' + 
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

    const result = await query(
      `INSERT INTO products (supplier_id, name, category, subcategory, description, price, moq, unit, incoterms, certifications, images, specifications)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       RETURNING *`,
      [req.user.id, name, category, subcategory || null, description || null, price || null, moq || null, unit || null, incoterms || [], certifications || [], images || [], JSON.stringify(specifications || {})]
    );

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
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

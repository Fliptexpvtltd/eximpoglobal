import { query } from '../config/database.js';
import { sendEmail, sendBulkEmail } from '../services/emailService.js';

export const getAllRFQs = async (req, res) => {
  try {
    const { status, category, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let queryText = `
      SELECT r.*, u.company_name as buyer_name, u.country as buyer_country,
             (SELECT COUNT(*) FROM quotes WHERE rfq_id = r.id) as quote_count
      FROM rfqs r
      JOIN users u ON r.buyer_id = u.id
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 0;

    // Sellers see open RFQs, buyers see their own
    if (req.user.role === 'seller') {
      queryText += ` AND r.status = 'open'`;
    } else if (req.user.role === 'buyer') {
      paramCount++;
      queryText += ` AND r.buyer_id = $${paramCount}`;
      params.push(req.user.id);
    }

    if (status) {
      paramCount++;
      queryText += ` AND r.status = $${paramCount}`;
      params.push(status);
    }

    if (category) {
      paramCount++;
      queryText += ` AND r.category = $${paramCount}`;
      params.push(category);
    }

    queryText += ` ORDER BY r.created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    params.push(limit, offset);

    const result = await query(queryText, params);

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Get RFQs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch RFQs',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const createRFQ = async (req, res) => {
  try {
    const { title, description, category, lineItems, deliveryDate, deliveryLocation, incoterms, paymentTerms, expiresAt } = req.body;

    const result = await query(
      `INSERT INTO rfqs (buyer_id, title, description, category, line_items, delivery_date, delivery_location, incoterms, payment_terms, expires_at, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'open')
       RETURNING *`,
      [req.user.id, title, description || null, category || null, JSON.stringify(lineItems), deliveryDate || null, deliveryLocation || null, incoterms || null, paymentTerms || null, expiresAt || null]
    );

    const rfq = result.rows[0];

    // Send confirmation email to buyer
    await sendEmail(req.user.email, 'rfqCreated', {
      buyerName: req.user.full_name || req.user.company_name,
      rfqId: rfq.id.slice(0, 8),
      title: rfq.title,
      category: rfq.category || 'General',
      itemCount: lineItems.length,
      deliveryLocation: deliveryLocation || 'Not specified',
      expiresAt: expiresAt ? new Date(expiresAt).toLocaleDateString() : 'Not specified'
    });

    // Notify relevant suppliers (sellers in the same category)
    if (category) {
      const sellers = await query(
        `SELECT DISTINCT u.id, u.email, u.full_name, u.company_name
         FROM users u
         JOIN products p ON u.id = p.supplier_id
         WHERE u.role = 'seller' AND p.category = $1 AND u.verified = true
         LIMIT 20`,
        [category]
      );

      if (sellers.rows.length > 0) {
        await sendBulkEmail(sellers.rows, 'rfqNotification', {
          rfqId: rfq.id.slice(0, 8),
          title: rfq.title,
          category: rfq.category,
          buyerCompany: req.user.company_name || 'Buyer',
          deliveryLocation: deliveryLocation || 'Not specified',
          expiresAt: expiresAt ? new Date(expiresAt).toLocaleDateString() : 'Not specified',
          sellerName: (seller) => seller.full_name || seller.company_name
        });
      }
    }

    res.status(201).json({
      success: true,
      message: 'RFQ created successfully',
      data: rfq
    });
  } catch (error) {
    console.error('Create RFQ error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create RFQ',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const getRFQById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      `SELECT r.*, u.company_name as buyer_name, u.country as buyer_country, u.email as buyer_email
       FROM rfqs r
       JOIN users u ON r.buyer_id = u.id
       WHERE r.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'RFQ not found'
      });
    }

    const rfq = result.rows[0];

    // Check access
    if (req.user.role === 'buyer' && rfq.buyer_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this RFQ'
      });
    }

    res.json({
      success: true,
      data: rfq
    });
  } catch (error) {
    console.error('Get RFQ error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch RFQ',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

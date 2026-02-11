import pool from '../config/database.js';
import { sendEmail } from '../services/emailService.js';
import { createNotification } from './notificationController.js';

// Get all quotes for a user (seller sees their quotes, buyer sees quotes for their RFQs)
export const getQuotes = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    let query;
    let params;

    if (userRole === 'seller') {
      // Seller sees quotes they created
      query = `
        SELECT q.*, 
               r.title as rfq_title,
               u.company_name as buyer_company,
               u.email as buyer_email
        FROM quotes q
        JOIN rfqs r ON q.rfq_id = r.id
        JOIN users u ON r.buyer_id = u.id
        WHERE q.seller_id = $1
        ORDER BY q.created_at DESC
      `;
      params = [userId];
    } else if (userRole === 'buyer') {
      // Buyer sees quotes for their RFQs
      query = `
        SELECT q.*, 
               r.title as rfq_title,
               u.company_name as seller_company,
               u.email as seller_email
        FROM quotes q
        JOIN rfqs r ON q.rfq_id = r.id
        JOIN users u ON q.seller_id = u.id
        WHERE r.buyer_id = $1
        ORDER BY q.created_at DESC
      `;
      params = [userId];
    } else {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const result = await pool.query(query, params);

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching quotes:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch quotes'
    });
  }
};

// Get quotes for a specific RFQ
export const getQuotesByRFQ = async (req, res) => {
  try {
    const { rfqId } = req.params;
    const userId = req.user.id;

    // Verify user has access to this RFQ
    const rfqCheck = await pool.query(
      'SELECT buyer_id FROM rfqs WHERE id = $1',
      [rfqId]
    );

    if (rfqCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'RFQ not found'
      });
    }

    // Only the buyer who created the RFQ can see all quotes
    if (rfqCheck.rows[0].buyer_id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const result = await pool.query(
      `SELECT q.*, 
              u.company_name as seller_company,
              u.email as seller_email,
              sp.rating as seller_rating
       FROM quotes q
       JOIN users u ON q.seller_id = u.id
       LEFT JOIN supplier_profiles sp ON u.id = sp.user_id
       WHERE q.rfq_id = $1
       ORDER BY q.created_at DESC`,
      [rfqId]
    );

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching quotes for RFQ:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch quotes'
    });
  }
};

// Get single quote by ID
export const getQuoteById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT q.*, 
              r.title as rfq_title,
              r.buyer_id,
              u.company_name as seller_company,
              u.email as seller_email
       FROM quotes q
       JOIN rfqs r ON q.rfq_id = r.id
       JOIN users u ON q.seller_id = u.id
       WHERE q.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Quote not found'
      });
    }

    const quote = result.rows[0];

    // Verify access: seller who created it, buyer who requested it, or admin
    if (
      quote.seller_id !== userId &&
      quote.buyer_id !== userId &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: quote
    });
  } catch (error) {
    console.error('Error fetching quote:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch quote'
    });
  }
};

// Create a new quote (seller responds to RFQ)
export const createQuote = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const {
      rfq_id,
      line_items,
      subtotal,
      tax,
      shipping_cost,
      total_amount,
      incoterms,
      payment_terms,
      delivery_time,
      notes,
      valid_until
    } = req.body;

    // Verify RFQ exists and is open
    const rfqCheck = await pool.query(
      "SELECT status FROM rfqs WHERE id = $1 AND status = 'open'",
      [rfq_id]
    );

    if (rfqCheck.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'RFQ not found or not accepting quotes'
      });
    }

    // Check if seller already submitted a quote for this RFQ
    const existingQuote = await pool.query(
      'SELECT id FROM quotes WHERE rfq_id = $1 AND seller_id = $2',
      [rfq_id, sellerId]
    );

    if (existingQuote.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted a quote for this RFQ'
      });
    }

    const result = await pool.query(
      `INSERT INTO quotes (
        rfq_id, seller_id, line_items, subtotal, tax, 
        shipping_cost, total_amount, incoterms, payment_terms, 
        delivery_time, notes, valid_until, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, 'pending')
      RETURNING *`,
      [
        rfq_id,
        sellerId,
        JSON.stringify(line_items),
        subtotal,
        tax || 0,
        shipping_cost || 0,
        total_amount,
        incoterms,
        payment_terms,
        delivery_time,
        notes,
        valid_until
      ]
    );

    const quote = result.rows[0];

    // Get buyer and seller info for email
    const buyerInfo = await pool.query(
      'SELECT u.id, u.email, u.full_name, u.company_name FROM rfqs r JOIN users u ON r.buyer_id = u.id WHERE r.id = $1',
      [rfq_id]
    );

    if (buyerInfo.rows.length > 0) {
      const buyer = buyerInfo.rows[0];
      await sendEmail(buyer.email, 'quoteReceived', {
        buyerName: buyer.full_name || buyer.company_name,
        rfqId: rfq_id.slice(0, 8),
        sellerCompany: req.user.company_name || 'Supplier',
        totalAmount: total_amount.toLocaleString(),
        deliveryTime: delivery_time || 'Contact supplier',
        currency: 'USD'
      });

      // Create notification for buyer
      await createNotification(
        buyer.id,
        'quote',
        'Quote Received',
        `Quote from ${req.user.company_name || 'Supplier'} - $${total_amount}`,
        quote.id
      );
    }

    res.status(201).json({
      success: true,
      message: 'Quote submitted successfully',
      data: quote
    });
  } catch (error) {
    console.error('Error creating quote:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create quote'
    });
  }
};

// Update quote (seller can edit before buyer accepts)
export const updateQuote = async (req, res) => {
  try {
    const { id } = req.params;
    const sellerId = req.user.id;
    const {
      line_items,
      subtotal,
      tax,
      shipping_cost,
      total_amount,
      incoterms,
      payment_terms,
      delivery_time,
      notes,
      valid_until
    } = req.body;

    // Verify quote belongs to seller and is still pending
    const quoteCheck = await pool.query(
      "SELECT seller_id, status FROM quotes WHERE id = $1 AND status = 'pending'",
      [id]
    );

    if (quoteCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Quote not found or cannot be edited'
      });
    }

    if (quoteCheck.rows[0].seller_id !== sellerId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const result = await pool.query(
      `UPDATE quotes SET
        line_items = COALESCE($1, line_items),
        subtotal = COALESCE($2, subtotal),
        tax = COALESCE($3, tax),
        shipping_cost = COALESCE($4, shipping_cost),
        total_amount = COALESCE($5, total_amount),
        incoterms = COALESCE($6, incoterms),
        payment_terms = COALESCE($7, payment_terms),
        delivery_time = COALESCE($8, delivery_time),
        notes = COALESCE($9, notes),
        valid_until = COALESCE($10, valid_until)
      WHERE id = $11
      RETURNING *`,
      [
        line_items ? JSON.stringify(line_items) : null,
        subtotal,
        tax,
        shipping_cost,
        total_amount,
        incoterms,
        payment_terms,
        delivery_time,
        notes,
        valid_until,
        id
      ]
    );

    res.json({
      success: true,
      message: 'Quote updated successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating quote:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update quote'
    });
  }
};

// Accept quote (buyer accepts seller's quote)
export const acceptQuote = async (req, res) => {
  try {
    const { id } = req.params;
    const buyerId = req.user.id;

    // Verify quote exists and buyer has access
    const quoteCheck = await pool.query(
      `SELECT q.*, r.buyer_id 
       FROM quotes q
       JOIN rfqs r ON q.rfq_id = r.id
       WHERE q.id = $1 AND q.status = 'pending'`,
      [id]
    );

    if (quoteCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Quote not found or already processed'
      });
    }

    if (quoteCheck.rows[0].buyer_id !== buyerId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Update quote status to accepted
    await pool.query(
      "UPDATE quotes SET status = 'accepted' WHERE id = $1",
      [id]
    );

    // Close the RFQ
    await pool.query(
      "UPDATE rfqs SET status = 'closed' WHERE id = $1",
      [quoteCheck.rows[0].rfq_id]
    );

    // Reject other quotes for this RFQ
    await pool.query(
      "UPDATE quotes SET status = 'rejected' WHERE rfq_id = $1 AND id != $2",
      [quoteCheck.rows[0].rfq_id, id]
    );

    // Get seller info and send email
    const sellerInfo = await pool.query(
      'SELECT u.email, u.full_name, u.company_name FROM users u WHERE u.id = $1',
      [quoteCheck.rows[0].seller_id]
    );

    if (sellerInfo.rows.length > 0) {
      const seller = sellerInfo.rows[0];
      await sendEmail(seller.email, 'quoteAccepted', {
        sellerName: seller.full_name || seller.company_name,
        quoteId: id.slice(0, 8),
        rfqId: quoteCheck.rows[0].rfq_id.slice(0, 8),
        buyerCompany: req.user.company_name || 'Buyer',
        totalAmount: quoteCheck.rows[0].total_amount.toLocaleString(),
        currency: 'USD',
        paymentTerms: quoteCheck.rows[0].payment_terms || 'As per agreement'
      });
    }

    res.json({
      success: true,
      message: 'Quote accepted successfully'
    });
  } catch (error) {
    console.error('Error accepting quote:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to accept quote'
    });
  }
};

// Reject quote (buyer rejects seller's quote)
export const rejectQuote = async (req, res) => {
  try {
    const { id } = req.params;
    const buyerId = req.user.id;

    // Verify quote exists and buyer has access
    const quoteCheck = await pool.query(
      `SELECT q.*, r.buyer_id 
       FROM quotes q
       JOIN rfqs r ON q.rfq_id = r.id
       WHERE q.id = $1 AND q.status = 'pending'`,
      [id]
    );

    if (quoteCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Quote not found or already processed'
      });
    }

    if (quoteCheck.rows[0].buyer_id !== buyerId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Update quote status to rejected
    await pool.query(
      "UPDATE quotes SET status = 'rejected' WHERE id = $1",
      [id]
    );

    res.json({
      success: true,
      message: 'Quote rejected'
    });
  } catch (error) {
    console.error('Error rejecting quote:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reject quote'
    });
  }
};

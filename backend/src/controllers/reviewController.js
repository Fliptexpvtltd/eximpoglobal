import pool from '../config/database.js';

// Create a new review
export const createReview = async (req, res) => {
  try {
    const { supplier_id, order_id, rating, comment } = req.body;
    const reviewer_id = req.user.id;

    // Validate rating
    if (rating < 0 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 0 and 5'
      });
    }

    // Check if user already reviewed this supplier for this order
    if (order_id) {
      const existingReview = await pool.query(
        'SELECT id FROM reviews WHERE reviewer_id = $1 AND supplier_id = $2 AND order_id = $3',
        [reviewer_id, supplier_id, order_id]
      );

      if (existingReview.rows.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'You have already reviewed this order'
        });
      }
    }

    // Verify order belongs to reviewer (verified purchase)
    let verified_purchase = false;
    if (order_id) {
      const orderCheck = await pool.query(
        'SELECT id FROM orders WHERE id = $1 AND buyer_id = $2 AND seller_id = $3 AND status = $4',
        [order_id, reviewer_id, supplier_id, 'delivered']
      );
      verified_purchase = orderCheck.rows.length > 0;
    }

    // Insert review
    const result = await pool.query(
      `INSERT INTO reviews (reviewer_id, supplier_id, order_id, rating, comment, verified_purchase, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
       RETURNING *`,
      [reviewer_id, supplier_id, order_id, rating, comment, verified_purchase]
    );

    // Update supplier profile rating
    await updateSupplierRating(supplier_id);

    res.json({
      success: true,
      message: 'Review created successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create review'
    });
  }
};

// Get reviews for a supplier
export const getSupplierReviews = async (req, res) => {
  try {
    const { supplier_id } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const result = await pool.query(
      `SELECT r.*, u.company_name as reviewer_name, u.country as reviewer_country
       FROM reviews r
       JOIN users u ON r.reviewer_id = u.id
       WHERE r.supplier_id = $1
       ORDER BY r.created_at DESC
       LIMIT $2 OFFSET $3`,
      [supplier_id, limit, offset]
    );

    const countResult = await pool.query(
      'SELECT COUNT(*) FROM reviews WHERE supplier_id = $1',
      [supplier_id]
    );

    res.json({
      success: true,
      data: result.rows,
      pagination: {
        total: parseInt(countResult.rows[0].count),
        page: parseInt(page),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews'
    });
  }
};

// Get reviews by supplier ID (alternative endpoint for route params)
export const getReviewsBySupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const result = await pool.query(
      `SELECT r.*, u.company_name as reviewer_name, u.country as reviewer_country
       FROM reviews r
       JOIN users u ON r.reviewer_id = u.id
       WHERE r.supplier_id = $1
       ORDER BY r.created_at DESC
       LIMIT $2 OFFSET $3`,
      [id, limit, offset]
    );

    const countResult = await pool.query(
      'SELECT COUNT(*) FROM reviews WHERE supplier_id = $1',
      [id]
    );

    res.json({
      success: true,
      data: result.rows,
      pagination: {
        total: parseInt(countResult.rows[0].count),
        page: parseInt(page),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews'
    });
  }
};

// Update helpful votes
export const voteHelpful = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `UPDATE reviews SET helpful_votes = helpful_votes + 1
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Vote helpful error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to vote'
    });
  }
};

// Seller response to review
export const respondToReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { seller_response } = req.body;
    const seller_id = req.user.id;

    // Verify the review is for this seller
    const reviewCheck = await pool.query(
      'SELECT supplier_id FROM reviews WHERE id = $1',
      [id]
    );

    if (reviewCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    if (reviewCheck.rows[0].supplier_id !== seller_id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to respond to this review'
      });
    }

    const result = await pool.query(
      `UPDATE reviews SET seller_response = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING *`,
      [seller_response, id]
    );

    res.json({
      success: true,
      message: 'Response added successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Respond to review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add response'
    });
  }
};

// Helper function to update supplier rating
async function updateSupplierRating(supplier_id) {
  const result = await pool.query(
    `SELECT AVG(rating) as avg_rating, COUNT(*) as total_reviews
     FROM reviews WHERE supplier_id = $1`,
    [supplier_id]
  );

  const avg_rating = parseFloat(result.rows[0].avg_rating) || 0;
  const total_reviews = parseInt(result.rows[0].total_reviews) || 0;

  await pool.query(
    `INSERT INTO supplier_profiles (user_id, rating, total_reviews)
     VALUES ($1, $2, $3)
     ON CONFLICT (user_id) 
     DO UPDATE SET rating = $2, total_reviews = $3`,
    [supplier_id, avg_rating, total_reviews]
  );
}

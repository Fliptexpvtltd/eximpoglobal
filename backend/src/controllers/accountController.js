import { query } from '../config/database.js';

// Delete user account (requires authentication)
export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Delete user and all related data
    await query('BEGIN');

    try {
      // Delete user's chat messages
      await query('DELETE FROM chat_messages WHERE sender_id = $1 OR receiver_id = $1', [userId]);

      // Delete user's notifications
      await query('DELETE FROM notifications WHERE user_id = $1', [userId]);

      // Delete user's orders (if buyer)
      await query('DELETE FROM orders WHERE buyer_id = $1', [userId]);

      // Delete user's products (if seller)
      await query('DELETE FROM products WHERE supplier_id = $1', [userId]);

      // Delete user's supplier profile
      await query('DELETE FROM supplier_profiles WHERE user_id = $1', [userId]);

      // Delete user's company profile
      await query('DELETE FROM company_profiles WHERE user_id = $1', [userId]);

      // Delete the user account
      const result = await query('DELETE FROM users WHERE id = $1 RETURNING email', [userId]);

      await query('COMMIT');

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.json({
        success: true,
        message: 'Account successfully deleted',
        email: result.rows[0].email
      });

    } catch (innerError) {
      await query('ROLLBACK');
      throw innerError;
    }

  } catch (error) {
    console.error('Account deletion error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete account'
    });
  }
};

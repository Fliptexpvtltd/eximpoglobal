import { query } from '../config/database.js';

// Delete user account (requires authentication)
export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Hard delete user account and all related data (cascade delete)
    try {
      const result = await query(
        'DELETE FROM users WHERE id = $1 RETURNING email, id',
        [userId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      const deletedUser = result.rows[0];
      console.log(`Account permanently deleted: ${deletedUser.email} (ID: ${deletedUser.id})`);

      res.json({
        success: true,
        message: 'Account successfully deleted',
        email: deletedUser.email
      });

    } catch (innerError) {
      console.error('Database error during account deletion:', innerError.message);
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

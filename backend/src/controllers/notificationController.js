import pool from '../config/database.js';

// Get all notifications for logged-in user
export const getNotifications = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const userId = req.user.id;

    const result = await pool.query(
      `SELECT id, type, title, description, related_id, is_read, created_at
       FROM notifications
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT 50`,
      [userId]
    );

    const notifications = result.rows.map(row => ({
      id: row.id,
      type: row.type,
      title: row.title,
      description: row.description,
      timestamp: row.created_at.toISOString(),
      isRead: row.is_read,
      actionUrl: row.related_id
    }));

    res.json({ success: true, data: notifications });
  } catch (error) {
    console.error('❌ Error fetching notifications:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch notifications' });
  }
};

// Mark notification as read
export const markAsRead = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { notificationId } = req.params;
    const userId = req.user.id;

    const result = await pool.query(
      `UPDATE notifications
       SET is_read = true, updated_at = CURRENT_TIMESTAMP
       WHERE id = $1 AND user_id = $2
       RETURNING id`,
      [notificationId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    res.json({ success: true, message: 'Notification marked as read' });
  } catch (error) {
    console.error('❌ Error marking notification as read:', error);
    res.status(500).json({ success: false, message: 'Failed to mark notification as read' });
  }
};

// Dismiss/delete notification
export const dismissNotification = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { notificationId } = req.params;
    const userId = req.user.id;

    const result = await pool.query(
      `DELETE FROM notifications
       WHERE id = $1 AND user_id = $2
       RETURNING id`,
      [notificationId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    res.json({ success: true, message: 'Notification dismissed' });
  } catch (error) {
    console.error('❌ Error dismissing notification:', error);
    res.status(500).json({ success: false, message: 'Failed to dismiss notification' });
  }
};

// Create notification (for internal use when events happen)
export const createNotification = async (userId, type, title, description, relatedId = null) => {
  try {
    await pool.query(
      `INSERT INTO notifications (user_id, type, title, description, related_id)
       VALUES ($1, $2, $3, $4, $5)`,
      [userId, type, title, description, relatedId]
    );
  } catch (error) {
    console.error('❌ Error creating notification:', error);
  }
};

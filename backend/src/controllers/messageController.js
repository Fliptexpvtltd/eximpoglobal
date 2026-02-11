import pool from '../config/database.js';
import { createNotification } from './notificationController.js';

// Get conversations for a user
export const getConversations = async (req, res) => {
  try {
    console.log('📨 getConversations - req.user:', req.user);
    
    if (!req.user || !req.user.id) {
      console.error('❌ No user in request, headers:', req.headers.authorization);
      return res.status(401).json({ success: false, message: 'Unauthorized - no user' });
    }
    
    const userId = req.user.id;
    console.log('✅ User ID:', userId);

    // Get all unique conversation partners with their latest message
    const result = await pool.query(
      `WITH ranked_messages AS (
        SELECT 
          m.*,
          CASE 
            WHEN m.sender_id = $1 THEN m.receiver_id
            ELSE m.sender_id
          END as partner_id,
          CASE 
            WHEN m.sender_id = $1 THEN receiver.company_name
            ELSE sender.company_name
          END as partner_name,
          CASE 
            WHEN m.sender_id = $1 THEN receiver.role
            ELSE sender.role
          END as partner_role,
          ROW_NUMBER() OVER (
            PARTITION BY CASE 
              WHEN m.sender_id = $1 THEN m.receiver_id
              ELSE m.sender_id
            END 
            ORDER BY m.created_at DESC
          ) as rn
        FROM messages m
        JOIN users sender ON m.sender_id = sender.id
        JOIN users receiver ON m.receiver_id = receiver.id
        WHERE m.sender_id = $1 OR m.receiver_id = $1
      ),
      unread_counts AS (
        SELECT 
          sender_id as partner_id,
          COUNT(*) as unread_count
        FROM messages
        WHERE receiver_id = $1 AND is_read = false
        GROUP BY sender_id
      )
      SELECT 
        rm.partner_id as conversation_partner,
        rm.partner_name,
        rm.partner_role,
        rm.message,
        rm.created_at,
        rm.is_read,
        rm.rfq_id,
        rm.order_id,
        COALESCE(uc.unread_count, 0) as unread_count
      FROM ranked_messages rm
      LEFT JOIN unread_counts uc ON rm.partner_id = uc.partner_id
      WHERE rm.rn = 1
      ORDER BY rm.created_at DESC`,
      [userId]
    );

    console.log('✅ Returning conversations:', result.rows.length, 'items');
    console.log('📋 Conversation data:', JSON.stringify(result.rows, null, 2));
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch conversations',
      error: error.message
    });
  }
};

// Get messages in a conversation
export const getMessages = async (req, res) => {
  try {
    const userId = req.user.id;
    const { partnerId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;

    const result = await pool.query(
      `SELECT m.*, 
         s.company_name as sender_name,
         r.company_name as receiver_name
       FROM messages m
       JOIN users s ON m.sender_id = s.id
       JOIN users r ON m.receiver_id = r.id
       WHERE (m.sender_id = $1 AND m.receiver_id = $2)
          OR (m.sender_id = $2 AND m.receiver_id = $1)
       ORDER BY m.created_at DESC
       LIMIT $3 OFFSET $4`,
      [userId, partnerId, limit, offset]
    );

    // Mark messages as read
    await pool.query(
      `UPDATE messages 
       SET is_read = true 
       WHERE receiver_id = $1 AND sender_id = $2 AND is_read = false`,
      [userId, partnerId]
    );

    res.json({
      success: true,
      data: result.rows.reverse() // Return in chronological order
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch messages'
    });
  }
};

// Send a message
export const sendMessage = async (req, res) => {
  try {
    const sender_id = req.user.id;
    const { receiver_id, message, rfq_id, order_id } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Message cannot be empty'
      });
    }

    const result = await pool.query(
      `INSERT INTO messages (sender_id, receiver_id, message, rfq_id, order_id, is_read, created_at)
       VALUES ($1, $2, $3, $4, $5, false, CURRENT_TIMESTAMP)
       RETURNING *`,
      [sender_id, receiver_id, message.trim(), rfq_id || null, order_id || null]
    );

    // Get sender company name for notification
    const senderInfo = await pool.query(
      'SELECT company_name FROM users WHERE id = $1',
      [sender_id]
    );

    const senderCompany = senderInfo.rows.length > 0 ? senderInfo.rows[0].company_name : 'User';

    // Create notification for receiver
    await createNotification(
      receiver_id,
      'message',
      'New Message',
      `Message from ${senderCompany}: ${message.trim().substring(0, 50)}${message.trim().length > 50 ? '...' : ''}`,
      result.rows[0].id
    );

    res.json({
      success: true,
      message: 'Message sent successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message'
    });
  }
};

// Mark messages as read
export const markAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const { partnerId } = req.params;

    await pool.query(
      `UPDATE messages 
       SET is_read = true 
       WHERE receiver_id = $1 AND sender_id = $2 AND is_read = false`,
      [userId, partnerId]
    );

    res.json({
      success: true,
      message: 'Messages marked as read'
    });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark messages as read'
    });
  }
};

// Get unread message count
export const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT COUNT(*) as unread_count 
       FROM messages 
       WHERE receiver_id = $1 AND is_read = false`,
      [userId]
    );

    res.json({
      success: true,
      unread: parseInt(result.rows[0].unread_count)
    });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get unread count'
    });
  }
};

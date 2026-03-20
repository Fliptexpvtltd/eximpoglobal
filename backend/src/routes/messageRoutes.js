import express from 'express';
import { 
  getConversations, 
  getMessages, 
  sendMessage, 
  markAsRead,
  getUnreadCount 
} from '../controllers/messageController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// All message routes require authentication
router.use(authMiddleware);

// Get all conversations for the logged-in user
router.get('/conversations', getConversations);

// Get unread message count (must be before /:partnerId wildcard)
router.get('/unread/count', getUnreadCount);

// Send a new message
router.post('/', sendMessage);

// Mark messages as read
router.patch('/:partnerId/read', markAsRead);

// Get messages with a specific partner
router.get('/:partnerId', getMessages);

export default router;

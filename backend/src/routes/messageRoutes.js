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

// Get messages with a specific partner
router.get('/:partnerId', getMessages);

// Send a new message
router.post('/', sendMessage);

// Mark messages as read
router.patch('/:partnerId/read', markAsRead);

// Get unread message count
router.get('/unread/count', getUnreadCount);

export default router;

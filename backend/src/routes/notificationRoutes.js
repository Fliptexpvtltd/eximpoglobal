import express from 'express';
import {
  getNotifications,
  markAsRead,
  dismissNotification
} from '../controllers/notificationController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// All notification routes require authentication
router.use(authMiddleware);

// Get all notifications for logged-in user
router.get('/', getNotifications);

// Mark a notification as read
router.patch('/:notificationId/read', markAsRead);

// Dismiss a notification
router.delete('/:notificationId', dismissNotification);

export default router;

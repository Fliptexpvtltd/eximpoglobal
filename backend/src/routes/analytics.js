import express from 'express';
import {
  getBuyerAnalytics,
  getSellerAnalytics,
  getAdminAnalytics
} from '../controllers/analyticsController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Get buyer dashboard analytics
router.get('/buyer', getBuyerAnalytics);

// Get seller dashboard analytics
router.get('/seller', getSellerAnalytics);

// Get admin dashboard analytics (admin only)
router.get('/admin', getAdminAnalytics);

export default router;

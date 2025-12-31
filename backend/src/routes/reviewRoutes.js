import express from 'express';
import { 
  createReview, 
  getSupplierReviews, 
  voteHelpful, 
  respondToReview 
} from '../controllers/reviewController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Get reviews for a supplier (public)
router.get('/supplier/:supplierId', getSupplierReviews);

// Create a review (requires authentication)
router.post('/', authMiddleware, createReview);

// Vote a review as helpful (requires authentication)
router.patch('/:reviewId/helpful', authMiddleware, voteHelpful);

// Respond to a review (requires authentication, seller only)
router.patch('/:reviewId/respond', authMiddleware, respondToReview);

export default router;

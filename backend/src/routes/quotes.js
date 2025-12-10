import express from 'express';
import {
  getQuotes,
  getQuotesByRFQ,
  getQuoteById,
  createQuote,
  updateQuote,
  acceptQuote,
  rejectQuote
} from '../controllers/quoteController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Get all quotes for current user
router.get('/', getQuotes);

// Get quotes for a specific RFQ
router.get('/rfq/:rfqId', getQuotesByRFQ);

// Get single quote by ID
router.get('/:id', getQuoteById);

// Create new quote (seller responds to RFQ)
router.post('/', createQuote);

// Update quote (seller edits pending quote)
router.put('/:id', updateQuote);

// Accept quote (buyer accepts seller's quote)
router.post('/:id/accept', acceptQuote);

// Reject quote (buyer rejects seller's quote)
router.post('/:id/reject', rejectQuote);

export default router;

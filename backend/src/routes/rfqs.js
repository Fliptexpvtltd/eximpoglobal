import express from 'express';
import { getAllRFQs, createRFQ, getRFQById } from '../controllers/rfqController.js';
import { authMiddleware, authorize } from '../middleware/auth.js';
import { validate, schemas } from '../middleware/validator.js';

const router = express.Router();

// Protected routes
router.get('/', authMiddleware, getAllRFQs);
router.get('/:id', authMiddleware, getRFQById);
router.post('/', authMiddleware, authorize('buyer', 'admin'), validate(schemas.rfq), createRFQ);

export default router;

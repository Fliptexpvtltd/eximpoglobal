import express from 'express';
import {
  getSuppliers,
  getSupplierById,
  getSupplierProducts,
  updateSupplierProfile,
  getMySupplierProfile,
  getSupplierStats,
  getSupplierProductCategories
} from '../controllers/supplierController.js';
import { getReviewsBySupplier } from '../controllers/reviewController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Public routes (no authentication)
router.get('/', getSuppliers);
router.get('/:id', getSupplierById);
router.get('/:id/products', getSupplierProducts);
router.get('/:id/stats', getSupplierStats);
router.get('/:id/reviews', getReviewsBySupplier);
router.get('/:id/product-categories', getSupplierProductCategories);

// Protected routes (authentication required)
router.get('/me/profile', authMiddleware, getMySupplierProfile);
router.put('/me/profile', authMiddleware, updateSupplierProfile);

export default router;

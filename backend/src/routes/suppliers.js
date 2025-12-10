import express from 'express';
import {
  getSuppliers,
  getSupplierById,
  getSupplierProducts,
  updateSupplierProfile,
  getMySupplierProfile,
  getSupplierStats
} from '../controllers/supplierController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Public routes (no authentication)
router.get('/', getSuppliers);
router.get('/:id', getSupplierById);
router.get('/:id/products', getSupplierProducts);
router.get('/:id/stats', getSupplierStats);

// Protected routes (authentication required)
router.get('/me/profile', authMiddleware, getMySupplierProfile);
router.put('/me/profile', authMiddleware, updateSupplierProfile);

export default router;

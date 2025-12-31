import express from 'express';
import { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct, approveProduct, getPendingProducts, getMyProducts } from '../controllers/productController.js';
import { authMiddleware, authorize } from '../middleware/auth.js';
import { validate, schemas } from '../middleware/validator.js';

const router = express.Router();

// Public routes
router.get('/', getAllProducts);

// Admin routes (must come before /:id)
router.get('/admin/pending', authMiddleware, authorize('admin'), getPendingProducts);
router.patch('/:id/approve', authMiddleware, authorize('admin'), approveProduct);

// Seller routes (must come before /:id)
router.get('/my/products', authMiddleware, authorize('seller', 'admin'), getMyProducts);
router.post('/', authMiddleware, authorize('seller', 'admin'), validate(schemas.product), createProduct);
router.put('/:id', authMiddleware, authorize('seller', 'admin'), updateProduct);
router.delete('/:id', authMiddleware, authorize('seller', 'admin'), deleteProduct);

// This must be last to avoid catching specific routes
router.get('/:id', getProductById);

export default router;

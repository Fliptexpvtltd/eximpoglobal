import express from 'express';
import { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../controllers/productController.js';
import { authMiddleware, authorize } from '../middleware/auth.js';
import { validate, schemas } from '../middleware/validator.js';

const router = express.Router();

// Public routes
router.get('/', getAllProducts);
router.get('/:id', getProductById);

// Seller routes
router.post('/', authMiddleware, authorize('seller', 'admin'), validate(schemas.product), createProduct);
router.put('/:id', authMiddleware, authorize('seller', 'admin'), updateProduct);
router.delete('/:id', authMiddleware, authorize('seller', 'admin'), deleteProduct);

export default router;

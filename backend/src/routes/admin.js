import express from 'express';
import { 
  getPlatformStats, 
  getAllUsers, 
  verifyUser, 
  getAllProductsAdmin, 
  approveProduct,
  deleteUser,
  getAllRFQsAdmin
} from '../controllers/adminController.js';
import { authMiddleware, authorize } from '../middleware/auth.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authMiddleware);
router.use(authorize('admin'));

// Platform statistics
router.get('/stats', getPlatformStats);

// User management
router.get('/users', getAllUsers);
router.patch('/users/:id/verify', verifyUser);
router.delete('/users/:id', deleteUser);

// Product management
router.get('/products', getAllProductsAdmin);
router.patch('/products/:id/approve', approveProduct);

// RFQ management
router.get('/rfqs', getAllRFQsAdmin);

export default router;

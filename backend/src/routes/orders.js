import express from 'express';
import {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  updatePaymentStatus,
  cancelOrder
} from '../controllers/orderController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Get all orders for current user
router.get('/', getOrders);

// Get single order by ID
router.get('/:id', getOrderById);

// Create new order from accepted quote
router.post('/', createOrder);

// Update order status (seller)
router.put('/:id/status', updateOrderStatus);

// Update payment status (buyer)
router.put('/:id/payment', updatePaymentStatus);

// Cancel order
router.post('/:id/cancel', cancelOrder);

export default router;

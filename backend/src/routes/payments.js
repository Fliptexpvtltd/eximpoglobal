import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import {
  createOrder,
  verifyPayment,
  getUserOrders,
  getOrderDetails,
  updateOrderStatus,
  handleWebhook
} from '../controllers/paymentController.js';

const router = express.Router();

// Create order and initiate payment (requires auth)
router.post('/create-order', authMiddleware, createOrder);

// Verify payment after successful transaction (requires auth)
router.post('/verify', authMiddleware, verifyPayment);

// Get user's orders (buyer or seller) (requires auth)
router.get('/orders', authMiddleware, getUserOrders);

// Get specific order details (requires auth)
router.get('/orders/:orderId', authMiddleware, getOrderDetails);

// Update order status - sellers only (requires auth)
router.put('/orders/:orderId/status', authMiddleware, updateOrderStatus);

// Razorpay webhook (no auth - verified by signature)
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

export default router;

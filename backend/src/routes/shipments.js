import express from 'express';
import {
  getShipments,
  getShipmentById,
  getShipmentByTracking,
  createShipment,
  updateShipmentTracking,
  updateShipment
} from '../controllers/shipmentController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Public route for tracking (no auth required)
router.get('/track/:trackingNumber', getShipmentByTracking);

// All other routes require authentication
router.use(authMiddleware);

// Get all shipments for current user
router.get('/', getShipments);

// Get single shipment by ID
router.get('/:id', getShipmentById);

// Create new shipment (seller)
router.post('/', createShipment);

// Update shipment tracking status (seller adds tracking events)
router.post('/:id/tracking', updateShipmentTracking);

// Update shipment details (seller updates carrier, tracking number, etc.)
router.put('/:id', updateShipment);

export default router;

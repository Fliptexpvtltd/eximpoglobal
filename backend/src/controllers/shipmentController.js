import pool from '../config/database.js';
import { sendEmail } from '../services/emailService.js';

// Get all shipments
export const getShipments = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    let query = `
      SELECT s.*, 
             o.order_number,
             o.buyer_id,
             o.seller_id,
             b.company_name as buyer_company,
             sel.company_name as seller_company
      FROM shipments s
      JOIN orders o ON s.order_id = o.id
      LEFT JOIN users b ON o.buyer_id = b.id
      LEFT JOIN users sel ON o.seller_id = sel.id
      WHERE 1=1
    `;

    const params = [];
    let paramCount = 1;

    // Filter based on user role
    if (userRole === 'buyer') {
      query += ` AND o.buyer_id = $${paramCount}`;
      params.push(userId);
      paramCount++;
    } else if (userRole === 'seller') {
      query += ` AND o.seller_id = $${paramCount}`;
      params.push(userId);
      paramCount++;
    }

    query += ' ORDER BY s.created_at DESC';

    const result = await pool.query(query, params);

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching shipments:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch shipments'
    });
  }
};

// Get single shipment by ID
export const getShipmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const result = await pool.query(
      `SELECT s.*, 
              o.order_number,
              o.buyer_id,
              o.seller_id,
              b.company_name as buyer_company,
              sel.company_name as seller_company
       FROM shipments s
       JOIN orders o ON s.order_id = o.id
       LEFT JOIN users b ON o.buyer_id = b.id
       LEFT JOIN users sel ON o.seller_id = sel.id
       WHERE s.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Shipment not found'
      });
    }

    const shipment = result.rows[0];

    // Verify access
    if (
      userRole !== 'admin' &&
      shipment.buyer_id !== userId &&
      shipment.seller_id !== userId
    ) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: shipment
    });
  } catch (error) {
    console.error('Error fetching shipment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch shipment'
    });
  }
};

// Get shipment by tracking number
export const getShipmentByTracking = async (req, res) => {
  try {
    const { trackingNumber } = req.params;

    const result = await pool.query(
      `SELECT s.*, 
              o.order_number,
              b.company_name as buyer_company,
              sel.company_name as seller_company
       FROM shipments s
       JOIN orders o ON s.order_id = o.id
       LEFT JOIN users b ON o.buyer_id = b.id
       LEFT JOIN users sel ON o.seller_id = sel.id
       WHERE s.tracking_number = $1`,
      [trackingNumber]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Shipment not found'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching shipment by tracking number:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch shipment'
    });
  }
};

// Create new shipment (seller creates after order confirmed)
export const createShipment = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      order_id,
      tracking_number,
      carrier,
      method,
      origin,
      destination,
      estimated_delivery
    } = req.body;

    // Verify order exists and user is the seller
    const orderCheck = await pool.query(
      "SELECT seller_id, status FROM orders WHERE id = $1 AND status IN ('confirmed', 'processing')",
      [order_id]
    );

    if (orderCheck.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order not found or not ready for shipment'
      });
    }

    if (orderCheck.rows[0].seller_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Only the seller can create shipment'
      });
    }

    // Check if shipment already exists for this order
    const existingShipment = await pool.query(
      'SELECT id FROM shipments WHERE order_id = $1',
      [order_id]
    );

    if (existingShipment.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Shipment already exists for this order'
      });
    }

    const result = await pool.query(
      `INSERT INTO shipments (
        order_id, tracking_number, carrier, method, 
        origin, destination, estimated_delivery, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending')
      RETURNING *`,
      [order_id, tracking_number, carrier, method, origin, destination, estimated_delivery]
    );

    // Update order status to shipped
    await pool.query(
      "UPDATE orders SET status = 'shipped' WHERE id = $1",
      [order_id]
    );

    res.status(201).json({
      success: true,
      message: 'Shipment created successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating shipment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create shipment'
    });
  }
};

// Update shipment tracking
export const updateShipmentTracking = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;
    const { status, location, description } = req.body;

    const validStatuses = ['pending', 'picked_up', 'in_transit', 'customs', 'out_for_delivery', 'delivered', 'failed'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }

    // Get shipment and verify seller access
    const shipmentCheck = await pool.query(
      `SELECT s.*, o.seller_id 
       FROM shipments s
       JOIN orders o ON s.order_id = o.id
       WHERE s.id = $1`,
      [id]
    );

    if (shipmentCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Shipment not found'
      });
    }

    const shipment = shipmentCheck.rows[0];

    // Only seller or admin can update tracking
    if (userRole !== 'admin' && shipment.seller_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Only seller can update shipment tracking'
      });
    }

    // Create tracking event
    const trackingEvent = {
      timestamp: new Date().toISOString(),
      status: status || shipment.status,
      location: location || '',
      description: description || ''
    };

    // Get existing tracking events
    const existingEvents = shipment.tracking_events || [];
    existingEvents.push(trackingEvent);

    // Update shipment
    const updateFields = [];
    const params = [];
    let paramCount = 1;

    if (status) {
      updateFields.push(`status = $${paramCount}`);
      params.push(status);
      paramCount++;

      // If delivered, set actual delivery date
      if (status === 'delivered') {
        updateFields.push(`actual_delivery = CURRENT_DATE`);
        
        // Update order status
        await pool.query(
          "UPDATE orders SET status = 'delivered' WHERE id = $1",
          [shipment.order_id]
        );
      }
    }

    updateFields.push(`tracking_events = $${paramCount}`);
    params.push(JSON.stringify(existingEvents));
    paramCount++;

    params.push(id);

    const query = `
      UPDATE shipments 
      SET ${updateFields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, params);
    const updatedShipment = result.rows[0];

    // Get buyer details for email notification
    const orderResult = await pool.query(
      `SELECT o.order_number, o.buyer_id, b.email, b.company_name
       FROM orders o
       JOIN users b ON o.buyer_id = b.id
       WHERE o.id = $1`,
      [updatedShipment.order_id]
    );

    if (orderResult.rows.length > 0 && status) {
      const orderData = orderResult.rows[0];
      
      // Send shipment update email to buyer
      sendEmail(orderData.email, 'shipmentUpdate', {
        companyName: orderData.company_name,
        orderNumber: orderData.order_number,
        trackingNumber: updatedShipment.tracking_number,
        status: status,
        location: location || 'In transit',
        description: description || `Shipment status updated to ${status}`
      }).catch(err => console.error('Failed to send shipment update email:', err));
    }

    res.json({
      success: true,
      message: 'Shipment tracking updated successfully',
      data: updatedShipment
    });
  } catch (error) {
    console.error('Error updating shipment tracking:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update shipment tracking'
    });
  }
};

// Update shipment details
export const updateShipment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;
    const {
      tracking_number,
      carrier,
      method,
      estimated_delivery
    } = req.body;

    // Get shipment and verify seller access
    const shipmentCheck = await pool.query(
      `SELECT s.*, o.seller_id 
       FROM shipments s
       JOIN orders o ON s.order_id = o.id
       WHERE s.id = $1`,
      [id]
    );

    if (shipmentCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Shipment not found'
      });
    }

    const shipment = shipmentCheck.rows[0];

    // Only seller or admin can update shipment
    if (userRole !== 'admin' && shipment.seller_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Only seller can update shipment'
      });
    }

    const result = await pool.query(
      `UPDATE shipments SET
        tracking_number = COALESCE($1, tracking_number),
        carrier = COALESCE($2, carrier),
        method = COALESCE($3, method),
        estimated_delivery = COALESCE($4, estimated_delivery)
      WHERE id = $5
      RETURNING *`,
      [tracking_number, carrier, method, estimated_delivery, id]
    );

    res.json({
      success: true,
      message: 'Shipment updated successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating shipment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update shipment'
    });
  }
};

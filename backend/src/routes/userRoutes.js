import express from 'express';
import pool from '../config/database.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Get users list (for messaging)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { role } = req.query;
    const currentUserId = req.user.id;
    
    let query = `
      SELECT id, email, company_name, role, country, 
             full_name, phone, verified as is_verified
      FROM users 
      WHERE id != $1 AND verified = true
    `;
    const params = [currentUserId];
    
    if (role) {
      query += ' AND role = $2';
      params.push(role);
    }
    
    query += ' ORDER BY company_name ASC LIMIT 100';
    
    const result = await pool.query(query, params);
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users'
    });
  }
});

export default router;

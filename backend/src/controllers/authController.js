import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../config/database.js';
import { sendEmail } from '../services/emailService.js';

export const register = async (req, res) => {
  try {
    const { email, password, role, companyName, fullName, phone, country } = req.body;

    // Check if user exists
    const existingUser = await query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const result = await query(
      `INSERT INTO users (email, password_hash, role, company_name, full_name, phone, country)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, email, role, company_name, full_name, phone, country, verified, created_at`,
      [email, passwordHash, role, companyName, fullName, phone || null, country || null]
    );

    const user = result.rows[0];

    // Send welcome email
    try {
      await sendEmail(user.email, 'welcome', {
        email: user.email,
        companyName: user.company_name,
        fullName: user.full_name,
        role: user.role
      });
      console.log(`✅ Welcome email queued for ${user.email}`);
    } catch (emailError) {
      console.error('⚠️ Failed to send welcome email:', emailError);
      // Don't fail registration if email fails
    }

    // Generate token
    const token = jwt.sign(
      { 
        userId: user.id,
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          companyName: user.company_name,
          fullName: user.full_name,
          phone: user.phone,
          country: user.country,
          verified: user.verified
        },
        token
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user (including deleted ones)
    const result = await query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const user = result.rows[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate token
    const token = jwt.sign(
      { 
        userId: user.id,
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          companyName: user.company_name,
          fullName: user.full_name,
          phone: user.phone,
          country: user.country,
          verified: user.verified
        },
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    console.log('📋 getProfile called - User from token:', req.user);
    
    // Token has userId property, not id
    const userId = req.user.userId || req.user.id;
    
    const result = await query(
      `SELECT id, email, role, company_name, full_name, phone, country, verified, created_at
       FROM users WHERE id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      console.log('❌ User not found in database:', userId);
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const user = result.rows[0];
    console.log('✅ Profile fetched successfully for:', user.email);

    res.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        role: user.role,
        companyName: user.company_name,
        fullName: user.full_name,
        phone: user.phone,
        country: user.country,
        verified: user.verified,
        createdAt: user.created_at
      }
    });
  } catch (error) {
    console.error('❌ Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { companyName, fullName, phone, country } = req.body;

    const result = await query(
      `UPDATE users 
       SET company_name = COALESCE($1, company_name),
           full_name = COALESCE($2, full_name),
           phone = COALESCE($3, phone),
           country = COALESCE($4, country)
       WHERE id = $5
       RETURNING id, email, role, company_name, full_name, phone, country, verified`,
      [companyName, fullName, phone, country, req.user.id]
    );

    const user = result.rows[0];

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        id: user.id,
        email: user.email,
        role: user.role,
        companyName: user.company_name,
        fullName: user.full_name,
        phone: user.phone,
        country: user.country,
        verified: user.verified
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

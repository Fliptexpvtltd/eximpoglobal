import jwt from 'jsonwebtoken';
import { query } from '../config/database.js';
import bcrypt from 'bcryptjs';
import { sendEmail } from '../services/emailService.js';

// Verify Google token and get user info
async function verifyGoogleToken(token) {
  try {
    const response = await fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${token}`);
    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error_description || 'Invalid token');
    }
    
    // Verify the token is for our client ID
    if (data.aud !== process.env.GOOGLE_CLIENT_ID) {
      throw new Error('Token not for this application');
    }
    
    return {
      email: data.email,
      name: data.name,
      picture: data.picture,
      emailVerified: data.email_verified === 'true'
    };
  } catch (error) {
    console.error('Google token verification error:', error);
    throw error;
  }
}

// Handle Google Sign-In
export const googleSignIn = async (req, res) => {
  try {
    const { credential } = req.body;
    
    if (!credential) {
      return res.status(400).json({
        success: false,
        message: 'Google credential is required'
      });
    }
    
    // Verify the Google token
    const googleUser = await verifyGoogleToken(credential);
    
    // Check if user exists
    const userResult = await query(
      'SELECT * FROM users WHERE email = $1',
      [googleUser.email]
    );
    
    let user;
    let isNewUser = false;
    
    if (userResult.rows.length > 0) {
      // Existing user - login
      user = userResult.rows[0];
      
      // Update last login
      await query(
        'UPDATE users SET updated_at = NOW() WHERE id = $1',
        [user.id]
      );
    } else {
      // New user - needs to complete registration with role
      isNewUser = true;
      
      // Return a temporary token that requires role selection
      const tempToken = jwt.sign(
        { 
          email: googleUser.email,
          name: googleUser.name,
          picture: googleUser.picture,
          tempAuth: true
        },
        process.env.JWT_SECRET,
        { expiresIn: '15m' }
      );
      
      return res.json({
        success: true,
        isNewUser: true,
        tempToken,
        user: {
          email: googleUser.email,
          name: googleUser.name,
          picture: googleUser.picture
        }
      });
    }
    
    // Generate JWT token for existing user
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    
    res.json({
      success: true,
      isNewUser: false,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.full_name,
          role: user.role,
          companyName: user.company_name,
          verified: user.verified
        }
      }
    });
    
  } catch (error) {
    console.error('Google sign-in error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to authenticate with Google'
    });
  }
};

// Complete Google registration with role
export const completeGoogleRegistration = async (req, res) => {
  try {
    const { tempToken, role, companyName, industry, phone, countryCode } = req.body;
    
    if (!tempToken) {
      return res.status(400).json({
        success: false,
        message: 'Temporary token is required'
      });
    }
    
    // Verify temp token
    let decoded;
    try {
      decoded = jwt.verify(tempToken, process.env.JWT_SECRET);
      
      if (!decoded.tempAuth) {
        return res.status(400).json({
          success: false,
          message: 'Invalid temporary token'
        });
      }
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: 'Temporary token expired or invalid'
      });
    }
    
    // Validate required fields
    if (!role || !companyName) {
      return res.status(400).json({
        success: false,
        message: 'Role and company name are required'
      });
    }
    
    // Check if user already exists (shouldn't happen but safety check)
    const existingUser = await query(
      'SELECT id FROM users WHERE email = $1',
      [decoded.email]
    );
    
    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }
    
    // Create user with Google data
    const randomPassword = bcrypt.hashSync(Math.random().toString(36), 10);
    
    const result = await query(
      `INSERT INTO users (email, password_hash, full_name, role, company_name, verified, email_verified, auth_provider)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id, email, full_name, role, company_name, verified`,
      [
        decoded.email,
        randomPassword, // Random password since they use Google OAuth
        decoded.name,
        role,
        companyName,
        false, // KYC verification still required
        true, // Email is verified by Google
        'google'
      ]
    );
    
    const user = result.rows[0];
    
    // Send welcome email
    try {
      await sendEmail(user.email, 'welcome', {
        email: user.email,
        fullName: user.full_name,
        companyName: user.company_name,
        role: user.role
      });
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // Don't fail registration if email fails
    }
    
    // Generate full JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    
    res.status(201).json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.full_name,
          role: user.role,
          companyName: user.company_name,
          verified: user.verified
        }
      }
    });
    
  } catch (error) {
    console.error('Google registration completion error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to complete registration'
    });
  }
};

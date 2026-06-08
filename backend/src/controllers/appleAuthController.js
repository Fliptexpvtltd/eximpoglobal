import jwt from 'jsonwebtoken';
import appleSignin from 'apple-signin-auth';
import { query } from '../config/database.js';
import bcrypt from 'bcryptjs';
import { sendEmail } from '../services/emailService.js';

const APPLE_BUNDLE_ID = process.env.APPLE_BUNDLE_ID || 'net.eximpoglobal.eximpoglobal';

// Handle Apple Sign-In
// iOS sends: { identityToken, user, email, fullName }
export const appleSignIn = async (req, res) => {
  try {
    const { identityToken, user: appleUserId, email, fullName } = req.body;

    if (!identityToken) {
      return res.status(400).json({
        success: false,
        message: 'Apple identity token is required'
      });
    }

    // Verify the identity token against Apple's public keys
    let payload;
    try {
      payload = await appleSignin.verifyIdToken(identityToken, {
        audience: APPLE_BUNDLE_ID,
        ignoreExpiration: false,
      });
    } catch (verifyError) {
      console.error('Apple token verification failed:', verifyError);
      return res.status(401).json({
        success: false,
        message: 'Invalid Apple identity token'
      });
    }

    // payload.sub is the stable Apple user ID
    const stableAppleId = payload.sub;
    const verifiedEmail = payload.email || email || null;

    // Check if user exists by Apple user ID or email
    let userResult;
    if (verifiedEmail) {
      userResult = await query(
        'SELECT * FROM users WHERE apple_user_id = $1 OR email = $2',
        [stableAppleId, verifiedEmail]
      );
    } else {
      userResult = await query(
        'SELECT * FROM users WHERE apple_user_id = $1',
        [stableAppleId]
      );
    }

    if (userResult.rows.length > 0) {
      // Existing user — login
      const dbUser = userResult.rows[0];

      if (!dbUser.apple_user_id) {
        await query(
          'UPDATE users SET apple_user_id = $1, updated_at = NOW() WHERE id = $2',
          [stableAppleId, dbUser.id]
        );
      } else {
        await query('UPDATE users SET updated_at = NOW() WHERE id = $1', [dbUser.id]);
      }

      const token = jwt.sign(
        { userId: dbUser.id, email: dbUser.email, role: dbUser.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      return res.json({
        success: true,
        isNewUser: false,
        data: {
          token,
          user: {
            id: dbUser.id,
            email: dbUser.email,
            fullName: dbUser.full_name,
            role: dbUser.role,
            companyName: dbUser.company_name,
            verified: dbUser.verified
          }
        }
      });
    }

    // New user — auto-register immediately with default role 'buyer'
    // User can update role/company from profile settings after login
    console.log('🍎 New Apple user — auto-registering:', verifiedEmail || stableAppleId);

    const userName = fullName || 'Apple User';
    const emailToUse = verifiedEmail || `apple_${stableAppleId}@privaterelay.appleid.com`;
    const randomPassword = bcrypt.hashSync(Math.random().toString(36), 10);

    const newUserResult = await query(
      `INSERT INTO users (email, password_hash, full_name, role, company_name, verified, email_verified, auth_provider, apple_user_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING id, email, full_name, role, company_name, verified`,
      [
        emailToUse,
        randomPassword,
        userName,
        'buyer',           // default role — can be changed in profile
        userName,          // default company name = their name
        false,             // KYC still required
        true,              // email verified by Apple
        'apple',
        stableAppleId
      ]
    );

    const newUser = newUserResult.rows[0];
    console.log('✅ New Apple user registered:', newUser.email);

    // Send welcome email asynchronously (non-blocking)
    if (verifiedEmail) {
      sendEmail(newUser.email, 'welcome', {
        email: newUser.email,
        fullName: newUser.full_name,
        companyName: newUser.company_name,
        role: newUser.role
      }).catch(emailError => {
        console.error('⚠️ Failed to queue welcome email:', emailError.message);
      });
    }

    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    return res.status(201).json({
      success: true,
      isNewUser: true,
      data: {
        token,
        user: {
          id: newUser.id,
          email: newUser.email,
          fullName: newUser.full_name,
          role: newUser.role,
          companyName: newUser.company_name,
          verified: newUser.verified
        }
      }
    });

  } catch (error) {
    console.error('Apple sign-in error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to authenticate with Apple'
    });
  }
};

// Complete Apple registration with role
export const completeAppleRegistration = async (req, res) => {
  try {
    const { tempToken, role, companyName, fullName } = req.body;

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
      if (!decoded.tempAuth || decoded.provider !== 'apple') {
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

    if (!role || !companyName) {
      return res.status(400).json({
        success: false,
        message: 'Role and company name are required'
      });
    }

    // Check if user already exists
    const existingUser = await query(
      'SELECT id FROM users WHERE email = $1 OR apple_user_id = $2',
      [decoded.email || '', decoded.appleUserId]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    const userName = fullName || decoded.name || 'Apple User';
    const randomPassword = bcrypt.hashSync(Math.random().toString(36), 10);

    const result = await query(
      `INSERT INTO users (email, password_hash, full_name, role, company_name, verified, email_verified, auth_provider, apple_user_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING id, email, full_name, role, company_name, verified`,
      [
        decoded.email || `apple_${decoded.appleUserId}@privaterelay.appleid.com`,
        randomPassword,
        userName,
        role,
        companyName,
        false,   // KYC still required
        true,    // Email verified by Apple
        'apple',
        decoded.appleUserId
      ]
    );

    const user = result.rows[0];

    // Send welcome email asynchronously (non-blocking) - don't wait for it
    if (decoded.email) {
      sendEmail(user.email, 'welcome', {
        email: user.email,
        fullName: user.full_name,
        companyName: user.company_name,
        role: user.role
      }).catch(emailError => {
        console.error('⚠️ Failed to queue welcome email (user registered successfully):', emailError.message);
        // Email failure does NOT block registration
      });
    }

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
    console.error('Apple complete registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to complete Apple registration'
    });
  }
};

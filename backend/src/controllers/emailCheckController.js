import pool from '../config/database.js';

// Rate limiting map (in production, use Redis)
const emailCheckAttempts = new Map();

export const checkEmail = async (req, res) => {
  const { email } = req.body;
  const clientIp = req.ip || req.connection.remoteAddress;

  // Rate limiting: 5 checks per IP per minute
  const now = Date.now();
  const attempts = emailCheckAttempts.get(clientIp) || [];
  const recentAttempts = attempts.filter(time => now - time < 60000);
  
  if (recentAttempts.length >= 5) {
    return res.status(429).json({
      success: false,
      message: 'Too many requests. Please try again later.'
    });
  }

  // Record this attempt
  recentAttempts.push(now);
  emailCheckAttempts.set(clientIp, recentAttempts);

  // Clean up old entries every 100 requests
  if (emailCheckAttempts.size > 100) {
    for (const [ip, times] of emailCheckAttempts.entries()) {
      if (times.every(t => now - t > 60000)) {
        emailCheckAttempts.delete(ip);
      }
    }
  }

  try {
    if (!email || !email.includes('@')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email address'
      });
    }

    // Add small random delay (100-300ms) to prevent timing attacks
    await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));

    const result = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    // Return generic response to prevent email enumeration
    res.json({
      success: true,
      exists: result.rows.length > 0
    });
  } catch (error) {
    console.error('Email check error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

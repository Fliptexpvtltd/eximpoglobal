import jwt from 'jsonwebtoken';

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    console.log('🔐 Auth header:', authHeader ? 'Present' : 'Missing');
    
    const token = authHeader?.split(' ')[1];
    
    if (!token) {
      console.log('❌ No token in header');
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Token decoded, userId:', decoded.userId);
    
    // Map userId to id for consistency
    req.user = {
      id: decoded.userId,
      email: decoded.email,
      role: decoded.role
    };
    
    console.log('✅ User set in request:', req.user.id);
    next();
  } catch (error) {
    console.log('❌ Token verification failed:', error.message);
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      console.log('No user in request');
      return res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    console.log('Authorization check - User role:', req.user.role, '| Required roles:', roles);
    
    if (!roles.includes(req.user.role)) {
      console.log('Access forbidden - User role not in allowed roles');
      return res.status(403).json({
        success: false, 
        message: 'Access forbidden'
      });
    }

    console.log('Authorization passed');
    next();
  };
};

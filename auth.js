// Authentication middleware for the hybrid mental health platform
// Handles JWT verification and user authentication

const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Environment variables (would be properly configured in production)
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || '24h';

// Generate JWT token for authenticated user
const generateToken = (user) => {
  const payload = {
    id: user._id,
    email: user.email,
    role: user.role
  };
  
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
};

// Verify JWT token middleware
const verifyToken = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided or invalid format.'
      });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Find user by ID from token
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. User not found.'
      });
    }
    
    // Check if user is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. User account is inactive.'
      });
    }
    
    // Attach user to request object
    req.user = user;
    
    // Proceed to next middleware
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired. Please log in again.'
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. Please log in again.'
      });
    }
    
    console.error('Authentication error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during authentication.'
    });
  }
};

// Role-based authorization middleware
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions.'
      });
    }
    
    next();
  };
};

// Two-factor authentication verification
const verifyTwoFactor = async (req, res, next) => {
  try {
    // This would be implemented with a proper 2FA library in production
    // For now, we'll just check if 2FA is enabled for the user
    
    if (req.user.twoFactorEnabled) {
      const { twoFactorCode } = req.body;
      
      if (!twoFactorCode) {
        return res.status(401).json({
          success: false,
          message: 'Two-factor authentication code required.'
        });
      }
      
      // In a real implementation, we would verify the code against the user's secret
      // For this MVP, we'll just check if the code is '123456' (for demonstration)
      if (twoFactorCode !== '123456') {
        return res.status(401).json({
          success: false,
          message: 'Invalid two-factor authentication code.'
        });
      }
    }
    
    next();
  } catch (error) {
    console.error('Two-factor authentication error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during two-factor authentication.'
    });
  }
};

module.exports = {
  generateToken,
  verifyToken,
  authorize,
  verifyTwoFactor
};

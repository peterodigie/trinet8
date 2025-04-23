// Security and compliance middleware for the hybrid mental health platform
// Implements HIPAA and GDPR compliant security measures

const crypto = require('crypto');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
const { v4: uuidv4 } = require('uuid');

// Encryption utilities
const encryption = {
  // Encryption key management (in production, would use a secure key management service)
  getEncryptionKey: () => {
    return process.env.ENCRYPTION_KEY || 'a-secure-encryption-key-would-be-used-in-production';
  },
  
  // Encrypt sensitive data
  encrypt: (text) => {
    if (!text) return null;
    
    const iv = crypto.randomBytes(16);
    const key = Buffer.from(encryption.getEncryptionKey(), 'hex');
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    return `${iv.toString('hex')}:${encrypted}`;
  },
  
  // Decrypt sensitive data
  decrypt: (encryptedText) => {
    if (!encryptedText) return null;
    
    const [ivHex, encryptedHex] = encryptedText.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const key = Buffer.from(encryption.getEncryptionKey(), 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    
    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }
};

// Audit logging
const auditLogger = {
  // Log data access events
  logAccess: (req, dataType, dataId, action) => {
    const logEntry = {
      timestamp: new Date(),
      userId: req.user ? req.user.id : 'unauthenticated',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      dataType,
      dataId,
      action,
      requestId: req.requestId
    };
    
    // In production, would write to a secure audit log storage
    console.log('AUDIT LOG:', JSON.stringify(logEntry));
    
    // Would also implement a mechanism to store these logs securely
    // and make them available for compliance reporting
  }
};

// Request tracking middleware
const requestTracker = (req, res, next) => {
  // Assign unique ID to each request for tracking
  req.requestId = uuidv4();
  
  // Add request timestamp
  req.requestTimestamp = new Date();
  
  // Log request
  console.log(`[${req.requestId}] ${req.method} ${req.originalUrl} - ${new Date().toISOString()}`);
  
  // Track response time
  const start = process.hrtime();
  
  // Override end method to log response
  const originalEnd = res.end;
  res.end = function(chunk, encoding) {
    // Calculate response time
    const diff = process.hrtime(start);
    const responseTime = (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(2);
    
    // Log response
    console.log(`[${req.requestId}] ${req.method} ${req.originalUrl} - ${res.statusCode} - ${responseTime}ms`);
    
    // Call original end method
    originalEnd.call(this, chunk, encoding);
  };
  
  next();
};

// HIPAA compliance middleware
const hipaaCompliance = (req, res, next) => {
  // Add HIPAA compliance headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  
  next();
};

// GDPR consent verification middleware
const verifyConsent = (dataUsageType) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }
    
    // Check user's privacy settings based on data usage type
    switch (dataUsageType) {
      case 'therapist_sharing':
        if (!req.user.privacySettings.shareDataWithTherapist) {
          return res.status(403).json({
            success: false,
            message: 'User has not consented to sharing data with therapists'
          });
        }
        break;
        
      case 'ai_usage':
        if (!req.user.privacySettings.allowAIDataUsage) {
          return res.status(403).json({
            success: false,
            message: 'User has not consented to AI data usage'
          });
        }
        break;
        
      case 'research':
        if (!req.user.privacySettings.allowAnonymousResearch) {
          return res.status(403).json({
            success: false,
            message: 'User has not consented to anonymous research usage'
          });
        }
        break;
        
      default:
        // For any other data usage, require explicit consent
        return res.status(403).json({
          success: false,
          message: 'User consent not verified for this operation'
        });
    }
    
    next();
  };
};

// Data retention enforcement middleware
const enforceDataRetention = async (req, res, next) => {
  try {
    // This would be a scheduled job in production
    // For demonstration, we'll implement the logic here
    
    const User = require('../models/User');
    const ThoughtDiary = require('../models/ThoughtDiary');
    const MoodTracker = require('../models/MoodTracker');
    
    // Get all users
    const users = await User.find({});
    
    for (const user of users) {
      // Skip users with indefinite retention
      if (user.privacySettings.dataRetentionPeriod === 'indefinite') {
        continue;
      }
      
      // Calculate retention period in milliseconds
      let retentionPeriod;
      switch (user.privacySettings.dataRetentionPeriod) {
        case '3months':
          retentionPeriod = 90 * 24 * 60 * 60 * 1000;
          break;
        case '6months':
          retentionPeriod = 180 * 24 * 60 * 60 * 1000;
          break;
        case '1year':
          retentionPeriod = 365 * 24 * 60 * 60 * 1000;
          break;
        case '2years':
          retentionPeriod = 2 * 365 * 24 * 60 * 60 * 1000;
          break;
        default:
          retentionPeriod = 180 * 24 * 60 * 60 * 1000; // Default to 6 months
      }
      
      // Calculate cutoff date
      const cutoffDate = new Date(Date.now() - retentionPeriod);
      
      // Delete thought diary entries older than retention period
      await ThoughtDiary.deleteMany({
        user: user._id,
        createdAt: { $lt: cutoffDate }
      });
      
      // Delete mood tracker entries older than retention period
      await MoodTracker.deleteMany({
        user: user._id,
        recordedAt: { $lt: cutoffDate }
      });
      
      // Note: Session data would also be handled similarly
    }
    
    next();
  } catch (error) {
    console.error('Data retention enforcement error:', error);
    next();
  }
};

// Configure security middleware
const configureSecurityMiddleware = (app) => {
  // Set security HTTP headers
  app.use(helmet());
  
  // Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later'
  });
  app.use('/api/', limiter);
  
  // Body parser, reading data from body into req.body
  app.use(express.json({ limit: '10kb' }));
  
  // Data sanitization against NoSQL query injection
  app.use(mongoSanitize());
  
  // Data sanitization against XSS
  app.use(xss());
  
  // Prevent parameter pollution
  app.use(hpp());
  
  // CORS configuration
  app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Length', 'X-Request-ID'],
    credentials: true,
    maxAge: 600 // 10 minutes
  }));
  
  // Request tracking
  app.use(requestTracker);
  
  // HIPAA compliance headers
  app.use(hipaaCompliance);
  
  // Data retention enforcement (would be a scheduled job in production)
  // app.use(enforceDataRetention);
};

module.exports = {
  encryption,
  auditLogger,
  requestTracker,
  hipaaCompliance,
  verifyConsent,
  enforceDataRetention,
  configureSecurityMiddleware
};

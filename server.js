// Server configuration for the hybrid mental health platform
// Implements security middleware and API routes

const express = require('express');
const mongoose = require('mongoose');
const { pgPool, connectMongoDB } = require('./config/database');
const { configureSecurityMiddleware } = require('./middleware/security');

// Create Express app
const app = express();

// Apply security middleware
configureSecurityMiddleware(app);

// Import API routes
const authRoutes = require('./api/auth');
const userRoutes = require('./api/users');
const therapistRoutes = require('./api/therapists');
const sessionRoutes = require('./api/sessions');
const thoughtDiaryRoutes = require('./api/thoughtDiary');
const moodTrackerRoutes = require('./api/moodTracker');
const aiRoutes = require('./api/ai');

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/therapists', therapistRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/thought-diary', thoughtDiaryRoutes);
app.use('/api/mood-tracker', moodTrackerRoutes);
app.use('/api/ai', aiRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running',
    timestamp: new Date()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  // Log error details for security incidents
  if (err.name === 'SecurityError' || err.statusCode === 401 || err.statusCode === 403) {
    console.error('Security incident:', {
      requestId: req.requestId,
      userId: req.user ? req.user.id : 'unauthenticated',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      path: req.originalUrl,
      method: req.method,
      timestamp: new Date(),
      error: err.message
    });
  }
  
  // Send appropriate response
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    requestId: req.requestId
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    requestId: req.requestId
  });
});

// Initialize database connections and start server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectMongoDB();
    
    // Test PostgreSQL connection
    const client = await pgPool.connect();
    console.log('PostgreSQL connected successfully');
    client.release();
    
    // Start server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION:', err);
  // In production, we might want to gracefully shut down the server
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err);
  // In production, we would gracefully shut down the server
  process.exit(1);
});

// Export for testing
module.exports = { app, startServer };

// Start server if this file is run directly
if (require.main === module) {
  startServer();
}

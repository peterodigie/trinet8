// API endpoint for feedback collection
// Handles storing and retrieving user feedback

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { verifyToken } = require('../middleware/auth');
const { auditLogger } = require('../middleware/security');

// Define feedback schema
const FeedbackSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['general', 'session', 'ai', 'feature'],
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  overallRating: {
    type: Number,
    min: 0,
    max: 5,
    required: true
  },
  // Session-specific fields
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session'
  },
  // AI-specific fields
  aiInteractionId: {
    type: String
  },
  // Feature-specific fields
  featureName: {
    type: String
  },
  // Common rating fields
  empathyRating: {
    type: Number,
    min: 0,
    max: 5
  },
  helpfulnessRating: {
    type: Number,
    min: 0,
    max: 5
  },
  usabilityRating: {
    type: Number,
    min: 0,
    max: 5
  },
  // Text feedback
  comments: {
    type: String
  },
  improvement: {
    type: String
  },
  wouldRecommend: {
    type: String,
    enum: ['yes', 'maybe', 'no']
  }
});

const Feedback = mongoose.model('Feedback', FeedbackSchema);

// Submit feedback
router.post('/', verifyToken, async (req, res) => {
  try {
    const {
      type,
      overallRating,
      sessionId,
      aiInteractionId,
      featureName,
      empathyRating,
      helpfulnessRating,
      usabilityRating,
      comments,
      improvement,
      wouldRecommend
    } = req.body;

    // Validate required fields
    if (!type || !overallRating) {
      return res.status(400).json({
        success: false,
        message: 'Type and overall rating are required'
      });
    }

    // Create new feedback
    const feedback = new Feedback({
      userId: req.user.id,
      type,
      overallRating,
      sessionId,
      aiInteractionId,
      featureName,
      empathyRating,
      helpfulnessRating,
      usabilityRating,
      comments,
      improvement,
      wouldRecommend
    });

    // Save feedback
    await feedback.save();

    // Log feedback submission
    auditLogger.logDataAccess(req, 'Feedback', feedback._id, 'create');

    res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully',
      feedbackId: feedback._id
    });
  } catch (error) {
    console.error('Feedback submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during feedback submission'
    });
  }
});

// Submit quick AI feedback
router.post('/ai-quick', verifyToken, async (req, res) => {
  try {
    const { aiResponseId, helpful } = req.body;

    // Validate required fields
    if (!aiResponseId || helpful === undefined) {
      return res.status(400).json({
        success: false,
        message: 'AI response ID and helpful indicator are required'
      });
    }

    // Create new feedback
    const feedback = new Feedback({
      userId: req.user.id,
      type: 'ai',
      aiInteractionId: aiResponseId,
      overallRating: helpful ? 5 : 2, // Convert boolean to rating
      helpfulnessRating: helpful ? 5 : 2
    });

    // Save feedback
    await feedback.save();

    // Log feedback submission
    auditLogger.logDataAccess(req, 'Feedback', feedback._id, 'create');

    res.status(201).json({
      success: true,
      message: 'Quick feedback submitted successfully',
      feedbackId: feedback._id
    });
  } catch (error) {
    console.error('Quick feedback submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during quick feedback submission'
    });
  }
});

// Get feedback statistics (admin only)
router.get('/stats', verifyToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    // Get feedback statistics
    const stats = await Feedback.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          avgOverallRating: { $avg: '$overallRating' },
          avgEmpathyRating: { $avg: '$empathyRating' },
          avgHelpfulnessRating: { $avg: '$helpfulnessRating' },
          avgUsabilityRating: { $avg: '$usabilityRating' }
        }
      }
    ]);

    // Get recommendation statistics
    const recommendations = await Feedback.aggregate([
      {
        $group: {
          _id: '$wouldRecommend',
          count: { $sum: 1 }
        }
      }
    ]);

    // Log data access
    auditLogger.logDataAccess(req, 'Feedback', 'stats', 'read');

    res.status(200).json({
      success: true,
      stats,
      recommendations
    });
  } catch (error) {
    console.error('Feedback stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching feedback statistics'
    });
  }
});

// Get feedback for a specific session (therapist or user who owns the session)
router.get('/session/:sessionId', verifyToken, async (req, res) => {
  try {
    const { sessionId } = req.params;

    // Validate session ID
    if (!mongoose.Types.ObjectId.isValid(sessionId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid session ID'
      });
    }

    // Get session to check permissions
    const Session = mongoose.model('Session');
    const session = await Session.findById(sessionId);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    // Check if user is authorized to view this feedback
    if (
      session.user.toString() !== req.user.id &&
      session.therapist.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Not authorized to view this feedback.'
      });
    }

    // Get feedback for session
    const feedback = await Feedback.find({ sessionId });

    // Log data access
    auditLogger.logDataAccess(req, 'Feedback', sessionId, 'read');

    res.status(200).json({
      success: true,
      feedback
    });
  } catch (error) {
    console.error('Session feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching session feedback'
    });
  }
});

// Get user's own feedback history
router.get('/my-feedback', verifyToken, async (req, res) => {
  try {
    // Get pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get user's feedback
    const feedback = await Feedback.find({ userId: req.user.id })
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count
    const total = await Feedback.countDocuments({ userId: req.user.id });

    // Log data access
    auditLogger.logDataAccess(req, 'Feedback', req.user.id, 'read');

    res.status(200).json({
      success: true,
      feedback,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('My feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching your feedback'
    });
  }
});

module.exports = router;

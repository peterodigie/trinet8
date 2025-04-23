// MoodTracker model for the hybrid mental health platform
// Stores user mood entries for tracking emotional states over time

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MoodTrackerSchema = new Schema({
  // Reference to user who created this entry
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Mood data
  mood: {
    type: Number,
    required: [true, 'Mood rating is required'],
    min: 1,
    max: 5,
    validate: {
      validator: Number.isInteger,
      message: 'Mood rating must be an integer between 1 and 5'
    }
  },
  
  // Optional notes about the mood
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },
  
  // Factors that may have influenced mood (optional)
  factors: [{
    type: String,
    enum: [
      'sleep', 'exercise', 'nutrition', 'social', 'work', 
      'family', 'health', 'weather', 'other'
    ]
  }],
  
  // AI analysis
  aiAnalysis: {
    pattern: String,
    suggestions: [String],
    processed: {
      type: Boolean,
      default: false
    }
  },
  
  // Sharing settings
  isSharedWithTherapist: {
    type: Boolean,
    default: true
  },
  
  // Timestamp (when the mood was recorded)
  recordedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient querying by user and date range
MoodTrackerSchema.index({ user: 1, recordedAt: -1 });

// Static method to get mood trends for a specific user
MoodTrackerSchema.statics.getMoodTrends = async function(userId, startDate, endDate) {
  const trends = await this.aggregate([
    {
      $match: {
        user: mongoose.Types.ObjectId(userId),
        recordedAt: {
          $gte: startDate,
          $lte: endDate || new Date()
        }
      }
    },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$recordedAt' }
        },
        averageMood: { $avg: '$mood' },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { _id: 1 }
    }
  ]);
  
  return trends;
};

// Create and export MoodTracker model
const MoodTracker = mongoose.model('MoodTracker', MoodTrackerSchema);
module.exports = MoodTracker;

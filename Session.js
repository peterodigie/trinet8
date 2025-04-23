// Session model for the hybrid mental health platform
// Manages therapy sessions between users and therapists

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SessionSchema = new Schema({
  // Session participants
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  therapist: {
    type: Schema.Types.ObjectId,
    ref: 'Therapist',
    required: true
  },
  
  // Session details
  scheduledStartTime: {
    type: Date,
    required: [true, 'Scheduled start time is required']
  },
  scheduledEndTime: {
    type: Date,
    required: [true, 'Scheduled end time is required']
  },
  actualStartTime: {
    type: Date
  },
  actualEndTime: {
    type: Date
  },
  
  // Session type
  sessionType: {
    type: String,
    enum: ['video', 'audio', 'chat', 'in-person'],
    default: 'video'
  },
  
  // Session status
  status: {
    type: String,
    enum: ['scheduled', 'confirmed', 'in-progress', 'completed', 'cancelled', 'no-show'],
    default: 'scheduled'
  },
  
  // Cancellation details
  cancelledBy: {
    type: String,
    enum: ['user', 'therapist', 'system', null],
    default: null
  },
  cancellationReason: {
    type: String
  },
  cancellationTime: {
    type: Date
  },
  
  // Session notes
  therapistNotes: {
    content: {
      type: String
    },
    lastUpdated: {
      type: Date
    },
    isSharedWithUser: {
      type: Boolean,
      default: false
    }
  },
  
  userNotes: {
    content: {
      type: String
    },
    lastUpdated: {
      type: Date
    }
  },
  
  // AI-assisted notes
  aiGeneratedSummary: {
    content: {
      type: String
    },
    generatedAt: {
      type: Date
    },
    isApprovedByTherapist: {
      type: Boolean,
      default: false
    }
  },
  
  // Session recording (if applicable and consented)
  recording: {
    isRecorded: {
      type: Boolean,
      default: false
    },
    recordingUrl: {
      type: String
    },
    userConsent: {
      type: Boolean,
      default: false
    },
    therapistConsent: {
      type: Boolean,
      default: false
    },
    expirationDate: {
      type: Date
    }
  },
  
  // Follow-up actions
  followUpActions: [{
    description: String,
    assignedTo: {
      type: String,
      enum: ['user', 'therapist']
    },
    dueDate: Date,
    isCompleted: {
      type: Boolean,
      default: false
    },
    completedDate: Date
  }],
  
  // Feedback and ratings
  userFeedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comments: String,
    submittedAt: Date
  },
  
  therapistFeedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comments: String,
    submittedAt: Date
  },
  
  // Payment information
  payment: {
    amount: Number,
    currency: {
      type: String,
      default: 'USD'
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'refunded', 'failed'],
      default: 'pending'
    },
    transactionId: String,
    paymentMethod: String,
    paymentDate: Date
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp on save
SessionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Indexes for efficient querying
SessionSchema.index({ user: 1, scheduledStartTime: -1 });
SessionSchema.index({ therapist: 1, scheduledStartTime: -1 });
SessionSchema.index({ status: 1 });

// Virtual for session duration in minutes
SessionSchema.virtual('scheduledDuration').get(function() {
  if (this.scheduledStartTime && this.scheduledEndTime) {
    return Math.round((this.scheduledEndTime - this.scheduledStartTime) / (1000 * 60));
  }
  return null;
});

// Virtual for actual session duration in minutes
SessionSchema.virtual('actualDuration').get(function() {
  if (this.actualStartTime && this.actualEndTime) {
    return Math.round((this.actualEndTime - this.actualStartTime) / (1000 * 60));
  }
  return null;
});

// Method to check if session can be cancelled without penalty
SessionSchema.methods.canCancelWithoutPenalty = function() {
  // Check if cancellation is at least 24 hours before scheduled start
  const cancellationDeadline = new Date(this.scheduledStartTime);
  cancellationDeadline.setHours(cancellationDeadline.getHours() - 24);
  
  return new Date() < cancellationDeadline;
};

// Create and export Session model
const Session = mongoose.model('Session', SessionSchema);
module.exports = Session;

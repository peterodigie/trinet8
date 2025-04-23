// User model for the hybrid mental health platform
// Handles user authentication, profile, and preferences

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

// User schema definition
const UserSchema = new Schema({
  // Basic user information
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long']
  },
  
  // User profile
  dateOfBirth: {
    type: Date
  },
  phoneNumber: {
    type: String,
    trim: true
  },
  profileImage: {
    type: String // URL to profile image
  },
  
  // User role and status
  role: {
    type: String,
    enum: ['user', 'therapist', 'admin'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  
  // Privacy and data sharing preferences
  privacySettings: {
    shareDataWithTherapist: {
      type: Boolean,
      default: true
    },
    allowAIDataUsage: {
      type: Boolean,
      default: true
    },
    allowAnonymousResearch: {
      type: Boolean,
      default: false
    },
    dataRetentionPeriod: {
      type: String,
      enum: ['3months', '6months', '1year', '2years', 'indefinite'],
      default: '6months'
    }
  },
  
  // Security settings
  twoFactorEnabled: {
    type: Boolean,
    default: false
  },
  twoFactorSecret: {
    type: String
  },
  
  // Session management
  lastLogin: {
    type: Date
  },
  passwordResetToken: {
    type: String
  },
  passwordResetExpires: {
    type: Date
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

// Pre-save hook to hash password before saving
UserSchema.pre('save', async function(next) {
  const user = this;
  
  // Only hash the password if it's modified or new
  if (!user.isModified('password')) return next();
  
  try {
    // Generate salt
    const salt = await bcrypt.genSalt(10);
    
    // Hash password with salt
    const hashedPassword = await bcrypt.hash(user.password, salt);
    
    // Replace plain text password with hashed password
    user.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

// Update the updatedAt timestamp on save
UserSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Method to compare password for login
UserSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error(error);
  }
};

// Method to generate password reset token
UserSchema.methods.generatePasswordResetToken = function() {
  // Generate random token
  const resetToken = crypto.randomBytes(32).toString('hex');
  
  // Hash token and set to resetPasswordToken field
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
    
  // Set token expiry (1 hour)
  this.passwordResetExpires = Date.now() + 3600000;
  
  return resetToken;
};

// Create and export User model
const User = mongoose.model('User', UserSchema);
module.exports = User;

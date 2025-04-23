// Therapist model for the hybrid mental health platform
// Stores therapist profiles, specializations, and availability

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const TherapistSchema = new Schema({
  // Basic therapist information
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Professional information
  title: {
    type: String,
    required: [true, 'Professional title is required'],
    trim: true
  },
  licenseNumber: {
    type: String,
    required: [true, 'License number is required'],
    unique: true,
    trim: true
  },
  licenseVerified: {
    type: Boolean,
    default: false
  },
  
  // Specializations and expertise
  specializations: [{
    type: String,
    enum: [
      'anxiety', 'depression', 'trauma', 'addiction', 'relationships',
      'grief', 'stress', 'eating_disorders', 'family', 'career',
      'lgbtq', 'identity', 'personality_disorders', 'ocd', 'bipolar',
      'schizophrenia', 'adhd', 'autism', 'chronic_illness', 'other'
    ]
  }],
  
  // Therapist profile
  bio: {
    type: String,
    required: [true, 'Bio is required'],
    maxlength: [2000, 'Bio cannot exceed 2000 characters']
  },
  yearsOfExperience: {
    type: Number,
    required: [true, 'Years of experience is required'],
    min: 0
  },
  education: [{
    institution: String,
    degree: String,
    fieldOfStudy: String,
    year: Number
  }],
  certifications: [{
    name: String,
    issuingOrganization: String,
    issueDate: Date,
    expirationDate: Date
  }],
  
  // Therapy approach
  approaches: [{
    type: String,
    enum: [
      'cbt', 'dbt', 'psychodynamic', 'humanistic', 'existential',
      'gestalt', 'solution_focused', 'narrative', 'family_systems',
      'mindfulness', 'acceptance_commitment', 'motivational_interviewing',
      'eclectic', 'other'
    ]
  }],
  
  // Languages spoken
  languages: [{
    language: String,
    proficiencyLevel: {
      type: String,
      enum: ['basic', 'conversational', 'fluent', 'native']
    }
  }],
  
  // Availability and scheduling
  availability: {
    monday: [{ start: String, end: String }],
    tuesday: [{ start: String, end: String }],
    wednesday: [{ start: String, end: String }],
    thursday: [{ start: String, end: String }],
    friday: [{ start: String, end: String }],
    saturday: [{ start: String, end: String }],
    sunday: [{ start: String, end: String }]
  },
  timeZone: {
    type: String,
    default: 'UTC'
  },
  sessionDuration: {
    type: Number,
    enum: [30, 45, 60, 90],
    default: 60
  },
  
  // Session rates
  sessionRate: {
    amount: {
      type: Number,
      required: [true, 'Session rate is required']
    },
    currency: {
      type: String,
      default: 'USD'
    }
  },
  acceptsInsurance: {
    type: Boolean,
    default: false
  },
  insuranceProviders: [{
    type: String
  }],
  
  // Rating and reviews
  averageRating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  
  // Status
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
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
TherapistSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for efficient searching
TherapistSchema.index({ specializations: 1, isActive: 1, isVerified: 1 });
TherapistSchema.index({ 'languages.language': 1 });

// Create and export Therapist model
const Therapist = mongoose.model('Therapist', TherapistSchema);
module.exports = Therapist;

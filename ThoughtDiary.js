// ThoughtDiary model for the hybrid mental health platform
// Stores user thought entries for CBT exercises

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ThoughtDiarySchema = new Schema({
  // Reference to user who created this entry
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Entry content
  situation: {
    type: String,
    required: [true, 'Situation description is required']
  },
  thoughts: {
    type: String,
    required: [true, 'Thoughts are required']
  },
  emotions: {
    type: String,
    required: [true, 'Emotions are required']
  },
  emotionIntensity: {
    type: Number,
    min: 0,
    max: 100,
    default: 50
  },
  alternativePerspective: {
    type: String
  },
  
  // AI analysis and suggestions
  aiAnalysis: {
    sentimentScore: Number,
    cognitiveDistortions: [String],
    suggestions: [String],
    processed: {
      type: Boolean,
      default: false
    }
  },
  
  // Sharing settings
  isSharedWithTherapist: {
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
ThoughtDiarySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create and export ThoughtDiary model
const ThoughtDiary = mongoose.model('ThoughtDiary', ThoughtDiarySchema);
module.exports = ThoughtDiary;

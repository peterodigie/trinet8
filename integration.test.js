// Integration tests for the hybrid mental health platform
// Tests API endpoints and component interactions

const chai = require('chai');
const chaiHttp = require('chai-http');
const { app } = require('../server');
const User = require('../models/User');
const ThoughtDiary = require('../models/ThoughtDiary');
const MoodTracker = require('../models/MoodTracker');
const mongoose = require('mongoose');

// Configure chai
chai.use(chaiHttp);
chai.should();
const expect = chai.expect;

describe('API Integration Tests', function() {
  // Test user data
  const testUser = {
    firstName: 'Integration',
    lastName: 'Test',
    email: 'integration@example.com',
    password: 'Test@123456'
  };
  
  let authToken;
  let userId;
  
  // Before all tests, connect to test database and create test user
  before(async function() {
    // Use test database
    const testDbUri = process.env.TEST_MONGO_URI || 'mongodb://localhost:27017/mental_health_platform_test';
    await mongoose.connect(testDbUri);
    
    // Clear collections
    await User.deleteMany({});
    await ThoughtDiary.deleteMany({});
    await MoodTracker.deleteMany({});
    
    // Register test user
    const res = await chai.request(app)
      .post('/api/auth/register')
      .send(testUser);
    
    authToken = res.body.token;
    userId = res.body.user.id;
  });
  
  // After all tests, disconnect from database
  after(async function() {
    await mongoose.connection.close();
  });
  
  // Test thought diary API
  describe('Thought Diary API', function() {
    let thoughtDiaryId;
    
    it('should create a new thought diary entry', function(done) {
      const entry = {
        situation: 'Job interview',
        thoughts: 'I will definitely fail this interview',
        emotions: 'Anxiety, fear',
        emotionIntensity: 85
      };
      
      chai.request(app)
        .post('/api/thought-diary')
        .set('Authorization', `Bearer ${authToken}`)
        .send(entry)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql(true);
          res.body.should.have.property('thoughtDiary');
          res.body.thoughtDiary.should.have.property('situation').eql(entry.situation);
          res.body.thoughtDiary.should.have.property('thoughts').eql(entry.thoughts);
          res.body.thoughtDiary.should.have.property('emotions').eql(entry.emotions);
          res.body.thoughtDiary.should.have.property('emotionIntensity').eql(entry.emotionIntensity);
          
          // Save ID for later tests
          thoughtDiaryId = res.body.thoughtDiary._id;
          done();
        });
    });
    
    it('should get all thought diary entries for the user', function(done) {
      chai.request(app)
        .get('/api/thought-diary')
        .set('Authorization', `Bearer ${authToken}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql(true);
          res.body.should.have.property('thoughtDiaries');
          res.body.thoughtDiaries.should.be.a('array');
          res.body.thoughtDiaries.length.should.be.eql(1);
          done();
        });
    });
    
    it('should get a specific thought diary entry', function(done) {
      chai.request(app)
        .get(`/api/thought-diary/${thoughtDiaryId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql(true);
          res.body.should.have.property('thoughtDiary');
          res.body.thoughtDiary.should.have.property('_id').eql(thoughtDiaryId);
          done();
        });
    });
    
    it('should update a thought diary entry', function(done) {
      const updatedEntry = {
        alternativePerspective: 'I have prepared well and have relevant experience. Even if I don\'t get this job, it\'s a learning experience.'
      };
      
      chai.request(app)
        .put(`/api/thought-diary/${thoughtDiaryId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updatedEntry)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql(true);
          res.body.should.have.property('thoughtDiary');
          res.body.thoughtDiary.should.have.property('alternativePerspective').eql(updatedEntry.alternativePerspective);
          done();
        });
    });
    
    it('should process thought diary with AI analysis', function(done) {
      chai.request(app)
        .post(`/api/thought-diary/${thoughtDiaryId}/analyze`)
        .set('Authorization', `Bearer ${authToken}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql(true);
          res.body.should.have.property('analysis');
          res.body.analysis.should.have.property('cognitiveDistortions');
          res.body.analysis.should.have.property('suggestions');
          done();
        });
    });
  });
  
  // Test mood tracker API
  describe('Mood Tracker API', function() {
    let moodEntryId;
    
    it('should create a new mood entry', function(done) {
      const entry = {
        mood: 3,
        notes: 'Feeling a bit stressed about upcoming deadline',
        factors: ['work', 'sleep']
      };
      
      chai.request(app)
        .post('/api/mood-tracker')
        .set('Authorization', `Bearer ${authToken}`)
        .send(entry)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql(true);
          res.body.should.have.property('moodEntry');
          res.body.moodEntry.should.have.property('mood').eql(entry.mood);
          res.body.moodEntry.should.have.property('notes').eql(entry.notes);
          res.body.moodEntry.should.have.property('factors').eql(entry.factors);
          
          // Save ID for later tests
          moodEntryId = res.body.moodEntry._id;
          done();
        });
    });
    
    it('should get all mood entries for the user', function(done) {
      chai.request(app)
        .get('/api/mood-tracker')
        .set('Authorization', `Bearer ${authToken}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql(true);
          res.body.should.have.property('moodEntries');
          res.body.moodEntries.should.be.a('array');
          res.body.moodEntries.length.should.be.eql(1);
          done();
        });
    });
    
    it('should get mood trends', function(done) {
      // Add more mood entries for trends
      const entries = [
        { mood: 4, factors: ['exercise', 'social'] },
        { mood: 2, factors: ['work', 'health'] },
        { mood: 3, factors: ['family'] }
      ];
      
      // Create promises for each entry
      const promises = entries.map(entry => {
        return chai.request(app)
          .post('/api/mood-tracker')
          .set('Authorization', `Bearer ${authToken}`)
          .send(entry);
      });
      
      // Execute all promises
      Promise.all(promises)
        .then(() => {
          // Get trends
          chai.request(app)
            .get('/api/mood-tracker/trends')
            .set('Authorization', `Bearer ${authToken}`)
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('success').eql(true);
              res.body.should.have.property('trends');
              res.body.should.have.property('factorAnalysis');
              done();
            });
        })
        .catch(err => done(err));
    });
  });
  
  // Test feedback API
  describe('Feedback API', function() {
    it('should submit general feedback', function(done) {
      const feedback = {
        type: 'general',
        overallRating: 4.5,
        comments: 'Great platform overall',
        improvement: 'Could use more mindfulness exercises',
        wouldRecommend: 'yes'
      };
      
      chai.request(app)
        .post('/api/feedback')
        .set('Authorization', `Bearer ${authToken}`)
        .send(feedback)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql(true);
          res.body.should.have.property('feedbackId');
          done();
        });
    });
    
    it('should submit quick AI feedback', function(done) {
      const feedback = {
        aiResponseId: 'ai-response-123',
        helpful: true
      };
      
      chai.request(app)
        .post('/api/feedback/ai-quick')
        .set('Authorization', `Bearer ${authToken}`)
        .send(feedback)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql(true);
          res.body.should.have.property('feedbackId');
          done();
        });
    });
    
    it('should get user\'s feedback history', function(done) {
      chai.request(app)
        .get('/api/feedback/my-feedback')
        .set('Authorization', `Bearer ${authToken}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql(true);
          res.body.should.have.property('feedback');
          res.body.feedback.should.be.a('array');
          res.body.feedback.length.should.be.at.least(2);
          done();
        });
    });
  });
  
  // Test AI service API
  describe('AI Service API', function() {
    it('should analyze text sentiment', function(done) {
      const data = {
        text: 'I\'m feeling really anxious about my upcoming presentation'
      };
      
      chai.request(app)
        .post('/api/ai/analyze-sentiment')
        .set('Authorization', `Bearer ${authToken}`)
        .send(data)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql(true);
          res.body.should.have.property('sentiment');
          res.body.sentiment.should.have.property('score');
          res.body.sentiment.should.have.property('interpretation');
          done();
        });
    });
    
    it('should detect cognitive distortions', function(done) {
      const data = {
        text: 'I always fail at everything I try. Nobody ever supports me.'
      };
      
      chai.request(app)
        .post('/api/ai/detect-distortions')
        .set('Authorization', `Bearer ${authToken}`)
        .send(data)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql(true);
          res.body.should.have.property('distortions');
          res.body.distortions.should.be.a('array');
          res.body.distortions.length.should.be.at.least(1);
          done();
        });
    });
    
    it('should generate reframing suggestions', function(done) {
      const data = {
        thought: 'I\'m going to fail this presentation and everyone will think I\'m incompetent'
      };
      
      chai.request(app)
        .post('/api/ai/generate-reframing')
        .set('Authorization', `Bearer ${authToken}`)
        .send(data)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql(true);
          res.body.should.have.property('suggestions');
          res.body.suggestions.should.be.a('array');
          res.body.suggestions.length.should.be.at.least(1);
          done();
        });
    });
  });
});

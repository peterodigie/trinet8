// Unit tests for the hybrid mental health platform
// Tests authentication, user management, and security features

const chai = require('chai');
const chaiHttp = require('chai-http');
const { app } = require('../server');
const User = require('../models/User');
const { encryption } = require('../middleware/security');
const mongoose = require('mongoose');

// Configure chai
chai.use(chaiHttp);
chai.should();
const expect = chai.expect;

describe('Authentication System', function() {
  // Test user data
  const testUser = {
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    password: 'Test@123456'
  };
  
  let authToken;
  
  // Before all tests, connect to test database
  before(async function() {
    // Use test database
    const testDbUri = process.env.TEST_MONGO_URI || 'mongodb://localhost:27017/mental_health_platform_test';
    await mongoose.connect(testDbUri);
    
    // Clear users collection
    await User.deleteMany({});
  });
  
  // After all tests, disconnect from database
  after(async function() {
    await mongoose.connection.close();
  });
  
  // Test user registration
  describe('User Registration', function() {
    it('should register a new user', function(done) {
      chai.request(app)
        .post('/api/auth/register')
        .send(testUser)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql(true);
          res.body.should.have.property('token');
          res.body.should.have.property('user');
          res.body.user.should.have.property('email').eql(testUser.email);
          done();
        });
    });
    
    it('should not register a user with existing email', function(done) {
      chai.request(app)
        .post('/api/auth/register')
        .send(testUser)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql(false);
          res.body.should.have.property('message').includes('already exists');
          done();
        });
    });
    
    it('should not register a user with invalid email', function(done) {
      const invalidUser = { ...testUser, email: 'invalid-email' };
      
      chai.request(app)
        .post('/api/auth/register')
        .send(invalidUser)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql(false);
          res.body.should.have.property('errors');
          done();
        });
    });
    
    it('should not register a user with weak password', function(done) {
      const weakPasswordUser = { ...testUser, email: 'new@example.com', password: 'weak' };
      
      chai.request(app)
        .post('/api/auth/register')
        .send(weakPasswordUser)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql(false);
          res.body.should.have.property('errors');
          done();
        });
    });
  });
  
  // Test user login
  describe('User Login', function() {
    it('should login a registered user', function(done) {
      chai.request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql(true);
          res.body.should.have.property('token');
          authToken = res.body.token;
          done();
        });
    });
    
    it('should not login with incorrect password', function(done) {
      chai.request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword'
        })
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql(false);
          done();
        });
    });
    
    it('should not login with non-existent email', function(done) {
      chai.request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: testUser.password
        })
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql(false);
          done();
        });
    });
  });
  
  // Test authentication middleware
  describe('Authentication Middleware', function() {
    it('should access protected route with valid token', function(done) {
      chai.request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${authToken}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql(true);
          res.body.should.have.property('user');
          res.body.user.should.have.property('email').eql(testUser.email);
          done();
        });
    });
    
    it('should not access protected route without token', function(done) {
      chai.request(app)
        .get('/api/auth/me')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql(false);
          done();
        });
    });
    
    it('should not access protected route with invalid token', function(done) {
      chai.request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalidtoken')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql(false);
          done();
        });
    });
  });
  
  // Test profile management
  describe('Profile Management', function() {
    it('should update user profile', function(done) {
      const updatedProfile = {
        firstName: 'Updated',
        lastName: 'Name',
        phoneNumber: '+1234567890'
      };
      
      chai.request(app)
        .put('/api/auth/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updatedProfile)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql(true);
          res.body.should.have.property('user');
          res.body.user.should.have.property('firstName').eql(updatedProfile.firstName);
          res.body.user.should.have.property('lastName').eql(updatedProfile.lastName);
          res.body.user.should.have.property('phoneNumber').eql(updatedProfile.phoneNumber);
          done();
        });
    });
    
    it('should update privacy settings', function(done) {
      const privacySettings = {
        shareDataWithTherapist: true,
        allowAIDataUsage: true,
        allowAnonymousResearch: false,
        dataRetentionPeriod: '1year'
      };
      
      chai.request(app)
        .put('/api/auth/privacy-settings')
        .set('Authorization', `Bearer ${authToken}`)
        .send(privacySettings)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql(true);
          res.body.should.have.property('privacySettings');
          res.body.privacySettings.should.have.property('shareDataWithTherapist').eql(privacySettings.shareDataWithTherapist);
          res.body.privacySettings.should.have.property('allowAIDataUsage').eql(privacySettings.allowAIDataUsage);
          res.body.privacySettings.should.have.property('allowAnonymousResearch').eql(privacySettings.allowAnonymousResearch);
          res.body.privacySettings.should.have.property('dataRetentionPeriod').eql(privacySettings.dataRetentionPeriod);
          done();
        });
    });
    
    it('should change password', function(done) {
      const passwordData = {
        currentPassword: testUser.password,
        newPassword: 'NewTest@123456'
      };
      
      chai.request(app)
        .put('/api/auth/change-password')
        .set('Authorization', `Bearer ${authToken}`)
        .send(passwordData)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql(true);
          done();
        });
    });
    
    it('should login with new password', function(done) {
      chai.request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'NewTest@123456'
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql(true);
          res.body.should.have.property('token');
          done();
        });
    });
  });
});

describe('Security Features', function() {
  // Test encryption utilities
  describe('Encryption Utilities', function() {
    it('should encrypt and decrypt data correctly', function() {
      const sensitiveData = 'This is sensitive information';
      
      // Encrypt data
      const encrypted = encryption.encrypt(sensitiveData);
      
      // Encrypted data should be different from original
      expect(encrypted).to.not.equal(sensitiveData);
      
      // Decrypt data
      const decrypted = encryption.decrypt(encrypted);
      
      // Decrypted data should match original
      expect(decrypted).to.equal(sensitiveData);
    });
    
    it('should handle null values gracefully', function() {
      const encrypted = encryption.encrypt(null);
      expect(encrypted).to.be.null;
      
      const decrypted = encryption.decrypt(null);
      expect(decrypted).to.be.null;
    });
  });
  
  // Test HIPAA compliance headers
  describe('HIPAA Compliance Headers', function() {
    it('should include security headers in responses', function(done) {
      chai.request(app)
        .get('/health')
        .end((err, res) => {
          res.should.have.header('X-Content-Type-Options', 'nosniff');
          res.should.have.header('X-XSS-Protection', '1; mode=block');
          res.should.have.header('Strict-Transport-Security');
          res.should.have.header('Cache-Control');
          done();
        });
    });
  });
});

// More test suites would be added for:
// - ThoughtDiary functionality
// - MoodTracker functionality
// - Therapist matching
// - Session management
// - AI service integration
// - Feedback collection

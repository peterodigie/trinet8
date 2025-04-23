// End-to-end tests for the hybrid mental health platform
// Tests complete user journeys and workflows

const puppeteer = require('puppeteer');
const { expect } = require('chai');

describe('End-to-End Tests', function() {
  // Increase timeout for E2E tests
  this.timeout(30000);
  
  let browser;
  let page;
  
  // Test user credentials
  const testUser = {
    firstName: 'E2E',
    lastName: 'Test',
    email: 'e2e-test@example.com',
    password: 'Test@123456'
  };
  
  // Before all tests, launch browser
  before(async function() {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    page = await browser.newPage();
    
    // Set viewport size
    await page.setViewport({ width: 1280, height: 800 });
  });
  
  // After all tests, close browser
  after(async function() {
    await browser.close();
  });
  
  // Test user registration and login flow
  describe('User Authentication Flow', function() {
    it('should navigate to the landing page', async function() {
      await page.goto('http://localhost:3000');
      
      // Check that the landing page loaded
      const title = await page.title();
      expect(title).to.include('Mental Health Platform');
      
      // Check for key elements
      const heading = await page.$eval('h1', el => el.textContent);
      expect(heading).to.include('Hybrid Mental Health');
    });
    
    it('should navigate to registration page', async function() {
      // Click on sign up button
      await page.click('[data-testid="signup-button"]');
      
      // Wait for registration form to load
      await page.waitForSelector('[data-testid="registration-form"]');
      
      // Check that we're on the registration page
      const formTitle = await page.$eval('[data-testid="form-title"]', el => el.textContent);
      expect(formTitle).to.include('Create an Account');
    });
    
    it('should register a new user', async function() {
      // Fill out registration form
      await page.type('[data-testid="first-name-input"]', testUser.firstName);
      await page.type('[data-testid="last-name-input"]', testUser.lastName);
      await page.type('[data-testid="email-input"]', testUser.email);
      await page.type('[data-testid="password-input"]', testUser.password);
      await page.type('[data-testid="confirm-password-input"]', testUser.password);
      
      // Accept terms and conditions
      await page.click('[data-testid="terms-checkbox"]');
      
      // Submit form
      await Promise.all([
        page.click('[data-testid="register-button"]'),
        page.waitForNavigation()
      ]);
      
      // Check that we're redirected to the dashboard
      const url = page.url();
      expect(url).to.include('/dashboard');
    });
    
    it('should log out', async function() {
      // Click on user menu
      await page.click('[data-testid="user-menu"]');
      
      // Click on logout
      await Promise.all([
        page.click('[data-testid="logout-button"]'),
        page.waitForNavigation()
      ]);
      
      // Check that we're redirected to the login page
      const url = page.url();
      expect(url).to.include('/login');
    });
    
    it('should log in with registered credentials', async function() {
      // Fill out login form
      await page.type('[data-testid="email-input"]', testUser.email);
      await page.type('[data-testid="password-input"]', testUser.password);
      
      // Submit form
      await Promise.all([
        page.click('[data-testid="login-button"]'),
        page.waitForNavigation()
      ]);
      
      // Check that we're redirected to the dashboard
      const url = page.url();
      expect(url).to.include('/dashboard');
      
      // Check for welcome message
      const welcomeMessage = await page.$eval('[data-testid="welcome-message"]', el => el.textContent);
      expect(welcomeMessage).to.include(testUser.firstName);
    });
  });
  
  // Test thought diary functionality
  describe('Thought Diary Flow', function() {
    it('should navigate to thought diary page', async function() {
      // Click on thought diary in navigation
      await Promise.all([
        page.click('[data-testid="thought-diary-nav"]'),
        page.waitForNavigation()
      ]);
      
      // Check that we're on the thought diary page
      const url = page.url();
      expect(url).to.include('/thought-diary');
      
      // Check for page title
      const pageTitle = await page.$eval('[data-testid="page-title"]', el => el.textContent);
      expect(pageTitle).to.include('Thought Diary');
    });
    
    it('should create a new thought diary entry', async function() {
      // Click on new entry button
      await page.click('[data-testid="new-entry-button"]');
      
      // Wait for form to load
      await page.waitForSelector('[data-testid="thought-diary-form"]');
      
      // Fill out form
      await page.type('[data-testid="situation-input"]', 'Job interview tomorrow');
      await page.type('[data-testid="thoughts-input"]', 'I\'m going to mess up and they won\'t hire me');
      await page.type('[data-testid="emotions-input"]', 'Anxiety, fear, nervousness');
      
      // Set emotion intensity slider
      await page.click('[data-testid="emotion-slider"] input', { position: { x: 75, y: 0 } });
      
      // Submit form
      await Promise.all([
        page.click('[data-testid="save-entry-button"]'),
        page.waitForSelector('[data-testid="entry-saved-message"]')
      ]);
      
      // Check for success message
      const successMessage = await page.$eval('[data-testid="entry-saved-message"]', el => el.textContent);
      expect(successMessage).to.include('saved');
    });
    
    it('should view AI analysis and suggestions', async function() {
      // Click on analyze button
      await page.click('[data-testid="analyze-button"]');
      
      // Wait for analysis to load
      await page.waitForSelector('[data-testid="ai-analysis"]', { timeout: 10000 });
      
      // Check for cognitive distortions
      const distortionsSection = await page.$eval('[data-testid="cognitive-distortions"]', el => el.textContent);
      expect(distortionsSection).to.not.be.empty;
      
      // Check for reframing suggestions
      const suggestionsSection = await page.$eval('[data-testid="reframing-suggestions"]', el => el.textContent);
      expect(suggestionsSection).to.not.be.empty;
    });
    
    it('should add alternative perspective', async function() {
      // Click on add perspective button
      await page.click('[data-testid="add-perspective-button"]');
      
      // Enter alternative perspective
      await page.type(
        '[data-testid="alternative-perspective-input"]', 
        'I\'ve prepared well for this interview. Even if I don\'t get this job, it\'s a learning experience.'
      );
      
      // Save perspective
      await Promise.all([
        page.click('[data-testid="save-perspective-button"]'),
        page.waitForSelector('[data-testid="perspective-saved-message"]')
      ]);
      
      // Check for success message
      const successMessage = await page.$eval('[data-testid="perspective-saved-message"]', el => el.textContent);
      expect(successMessage).to.include('saved');
    });
  });
  
  // Test mood tracker functionality
  describe('Mood Tracker Flow', function() {
    it('should navigate to mood tracker page', async function() {
      // Click on mood tracker in navigation
      await Promise.all([
        page.click('[data-testid="mood-tracker-nav"]'),
        page.waitForNavigation()
      ]);
      
      // Check that we're on the mood tracker page
      const url = page.url();
      expect(url).to.include('/mood-tracker');
      
      // Check for page title
      const pageTitle = await page.$eval('[data-testid="page-title"]', el => el.textContent);
      expect(pageTitle).to.include('Mood Tracker');
    });
    
    it('should log a mood entry', async function() {
      // Click on log mood button
      await page.click('[data-testid="log-mood-button"]');
      
      // Wait for form to load
      await page.waitForSelector('[data-testid="mood-form"]');
      
      // Select mood level (3 out of 5)
      await page.click('[data-testid="mood-level-3"]');
      
      // Add factors
      await page.click('[data-testid="factor-work"]');
      await page.click('[data-testid="factor-sleep"]');
      
      // Add notes
      await page.type('[data-testid="mood-notes"]', 'Feeling a bit stressed about work deadline');
      
      // Submit form
      await Promise.all([
        page.click('[data-testid="save-mood-button"]'),
        page.waitForSelector('[data-testid="mood-saved-message"]')
      ]);
      
      // Check for success message
      const successMessage = await page.$eval('[data-testid="mood-saved-message"]', el => el.textContent);
      expect(successMessage).to.include('saved');
    });
    
    it('should show mood history', async function() {
      // Click on history tab
      await page.click('[data-testid="mood-history-tab"]');
      
      // Wait for history to load
      await page.waitForSelector('[data-testid="mood-history-list"]');
      
      // Check that history contains entries
      const historyItems = await page.$$('[data-testid="mood-history-item"]');
      expect(historyItems.length).to.be.at.least(1);
    });
  });
  
  // Test feedback submission
  describe('Feedback Submission', function() {
    it('should submit platform feedback', async function() {
      // Click on feedback button
      await page.click('[data-testid="feedback-button"]');
      
      // Wait for feedback form to load
      await page.waitForSelector('[data-testid="feedback-form"]');
      
      // Set overall rating
      await page.click('[data-testid="overall-rating"] [aria-label="4 Stars"]');
      
      // Add comments
      await page.type('[data-testid="feedback-comments"]', 'Great platform, very helpful for managing anxiety');
      
      // Add improvement suggestions
      await page.type('[data-testid="feedback-improvements"]', 'Could use more guided meditation exercises');
      
      // Select recommendation
      await page.click('[data-testid="recommend-yes"]');
      
      // Submit form
      await Promise.all([
        page.click('[data-testid="submit-feedback-button"]'),
        page.waitForSelector('[data-testid="feedback-submitted-message"]')
      ]);
      
      // Check for success message
      const successMessage = await page.$eval('[data-testid="feedback-submitted-message"]', el => el.textContent);
      expect(successMessage).to.include('Thank you');
    });
  });
  
  // Test AI interaction
  describe('AI Interaction', function() {
    it('should navigate to AI chat', async function() {
      // Click on AI chat in navigation
      await Promise.all([
        page.click('[data-testid="ai-chat-nav"]'),
        page.waitForNavigation()
      ]);
      
      // Check that we're on the AI chat page
      const url = page.url();
      expect(url).to.include('/ai-chat');
      
      // Check for chat interface
      const chatInterface = await page.$('[data-testid="chat-interface"]');
      expect(chatInterface).to.not.be.null;
    });
    
    it('should send message to AI and get response', async function() {
      // Type message
      await page.type('[data-testid="chat-input"]', 'I\'m feeling anxious about a presentation tomorrow');
      
      // Send message
      await page.click('[data-testid="send-message-button"]');
      
      // Wait for AI response
      await page.waitForSelector('[data-testid="ai-response"]', { timeout: 10000 });
      
      // Check that response is not empty
      const aiResponse = await page.$eval('[data-testid="ai-response"]', el => el.textContent);
      expect(aiResponse).to.not.be.empty;
    });
    
    it('should provide feedback on AI response', async function() {
      // Click on helpful button
      await page.click('[data-testid="response-helpful-button"]');
      
      // Wait for feedback confirmation
      await page.waitForSelector('[data-testid="feedback-confirmation"]');
      
      // Check for confirmation message
      const confirmationMessage = await page.$eval('[data-testid="feedback-confirmation"]', el => el.textContent);
      expect(confirmationMessage).to.include('Thanks');
    });
  });
});

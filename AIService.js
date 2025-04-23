// AI Service for the hybrid mental health platform
// Handles sentiment analysis, text classification, and therapeutic recommendations

const { Configuration, OpenAIApi } = require('openai');
const natural = require('natural');
const tokenizer = new natural.WordTokenizer();
const stopwords = require('natural').stopwords;

class AIService {
  constructor() {
    // Initialize OpenAI configuration (would use environment variables in production)
    this.configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.openai = new OpenAIApi(this.configuration);
    
    // Initialize sentiment analyzer
    this.sentimentAnalyzer = new natural.SentimentAnalyzer('English', natural.PorterStemmer, 'afinn');
    
    // Initialize cognitive distortion patterns
    this.cognitiveDistortions = {
      'all_or_nothing': [
        'always', 'never', 'everything', 'nothing', 'everyone', 'nobody', 'completely', 'totally'
      ],
      'overgeneralization': [
        'every time', 'all the time', 'constantly', 'everyone', 'no one', 'everything'
      ],
      'mental_filter': [
        'terrible', 'horrible', 'awful', 'worst', 'disaster', 'catastrophe'
      ],
      'disqualifying_positive': [
        'doesn\'t count', 'doesn\'t matter', 'not important', 'yeah but', 'that\'s not the point'
      ],
      'jumping_to_conclusions': [
        'must be thinking', 'must be feeling', 'knows that', 'I know they', 'they think', 'they know'
      ],
      'magnification': [
        'disaster', 'horrible', 'terrible', 'unbearable', 'can\'t stand', 'can\'t handle'
      ],
      'emotional_reasoning': [
        'I feel', 'I don\'t feel', 'it feels like', 'because I feel'
      ],
      'should_statements': [
        'should', 'must', 'have to', 'ought to', 'supposed to'
      ],
      'labeling': [
        'I\'m a', 'they\'re a', 'he\'s a', 'she\'s a', 'I am', 'they are', 'loser', 'failure', 'idiot'
      ],
      'personalization': [
        'my fault', 'because of me', 'my responsibility', 'I caused', 'I\'m to blame'
      ]
    };
  }

  // Analyze sentiment of text
  analyzeSentiment(text) {
    if (!text) return { score: 0, comparative: 0 };
    
    const tokens = tokenizer.tokenize(text.toLowerCase());
    const filteredTokens = tokens.filter(token => !stopwords.includes(token));
    
    const result = this.sentimentAnalyzer.getSentiment(filteredTokens);
    
    return {
      score: result,
      comparative: tokens.length > 0 ? result / tokens.length : 0,
      // Map to a -1 to 1 scale where -1 is very negative, 0 is neutral, 1 is very positive
      interpretation: this.interpretSentiment(result)
    };
  }
  
  // Interpret sentiment score
  interpretSentiment(score) {
    if (score < -0.5) return 'very negative';
    if (score < -0.2) return 'negative';
    if (score < 0.2) return 'neutral';
    if (score < 0.5) return 'positive';
    return 'very positive';
  }
  
  // Detect cognitive distortions in text
  detectCognitiveDistortions(text) {
    if (!text) return [];
    
    const lowerText = text.toLowerCase();
    const detectedDistortions = [];
    
    for (const [distortion, patterns] of Object.entries(this.cognitiveDistortions)) {
      for (const pattern of patterns) {
        if (lowerText.includes(pattern)) {
          if (!detectedDistortions.includes(distortion)) {
            detectedDistortions.push(distortion);
          }
          break;
        }
      }
    }
    
    return detectedDistortions;
  }
  
  // Generate reframing suggestions for thought diary entries
  async generateReframingSuggestions(thoughtText) {
    if (!this.configuration.apiKey) {
      return [
        "Consider whether this thought is based on facts or assumptions.",
        "How would you advise a friend who had this thought?",
        "Is there another way to interpret this situation?"
      ];
    }
    
    try {
      const response = await this.openai.createCompletion({
        model: "text-davinci-003",
        prompt: `The following is a negative thought from a thought diary. Please provide 3 alternative, more balanced perspectives that could help reframe this thought in a CBT (Cognitive Behavioral Therapy) context. Keep the suggestions compassionate and non-dismissive of the person's feelings.\n\nNegative thought: "${thoughtText}"\n\nReframing suggestions:`,
        max_tokens: 250,
        temperature: 0.7,
      });
      
      const suggestions = response.data.choices[0].text
        .split(/\d+\./)
        .filter(s => s.trim().length > 0)
        .map(s => s.trim());
      
      return suggestions.length > 0 ? suggestions : [
        "Consider whether this thought is based on facts or assumptions.",
        "How would you advise a friend who had this thought?",
        "Is there another way to interpret this situation?"
      ];
    } catch (error) {
      console.error('Error generating reframing suggestions:', error);
      return [
        "Consider whether this thought is based on facts or assumptions.",
        "How would you advise a friend who had this thought?",
        "Is there another way to interpret this situation?"
      ];
    }
  }
  
  // Analyze mood patterns from mood tracking data
  analyzeMoodPatterns(moodEntries) {
    if (!moodEntries || moodEntries.length < 5) {
      return {
        pattern: 'insufficient_data',
        suggestions: ['Continue tracking your mood daily to receive personalized insights.']
      };
    }
    
    // Calculate average mood
    const moodValues = moodEntries.map(entry => entry.mood);
    const averageMood = moodValues.reduce((sum, value) => sum + value, 0) / moodValues.length;
    
    // Calculate mood variability
    const moodVariability = Math.sqrt(
      moodValues.reduce((sum, value) => sum + Math.pow(value - averageMood, 2), 0) / moodValues.length
    );
    
    // Detect trends
    const recentEntries = moodEntries.slice(-5);
    const recentValues = recentEntries.map(entry => entry.mood);
    const recentAverage = recentValues.reduce((sum, value) => sum + value, 0) / recentValues.length;
    const trend = recentAverage - averageMood;
    
    // Generate insights based on patterns
    let pattern = '';
    let suggestions = [];
    
    if (moodVariability > 1.2) {
      pattern = 'high_variability';
      suggestions = [
        'Your mood shows significant fluctuations. Consider tracking factors that might influence these changes.',
        'Mindfulness practices might help stabilize mood fluctuations.',
        'Discuss these mood patterns with your therapist to identify potential triggers.'
      ];
    } else if (moodVariability < 0.5) {
      pattern = 'low_variability';
      suggestions = [
        'Your mood appears relatively stable. This can be positive if you\'re feeling good consistently.',
        'If you\'re consistently feeling low, consider discussing this with your therapist.',
        'Try new activities that bring joy and note their impact on your mood.'
      ];
    }
    
    if (trend > 0.5) {
      pattern += '_improving';
      suggestions.push('Your mood appears to be improving recently. Reflect on positive changes you\'ve made.');
    } else if (trend < -0.5) {
      pattern += '_declining';
      suggestions.push('Your mood appears to be declining recently. Consider discussing this with your therapist.');
    } else {
      pattern += '_stable';
      suggestions.push('Your mood has been relatively consistent recently.');
    }
    
    if (averageMood < 2.5) {
      suggestions.push('Your average mood is on the lower side. Consider scheduling a session with your therapist to discuss this.');
    }
    
    return {
      pattern,
      averageMood,
      moodVariability,
      trend,
      suggestions
    };
  }
  
  // Determine if AI conversation should be escalated to human therapist
  shouldEscalateToTherapist(conversationHistory) {
    if (!conversationHistory || conversationHistory.length === 0) {
      return { escalate: false, reason: null };
    }
    
    // Get the last few user messages
    const userMessages = conversationHistory
      .filter(msg => msg.role === 'user')
      .slice(-3)
      .map(msg => msg.content);
    
    // Join messages for analysis
    const combinedText = userMessages.join(' ');
    
    // Check for crisis keywords
    const crisisKeywords = [
      'suicide', 'kill myself', 'end my life', 'don\'t want to live',
      'hurt myself', 'self-harm', 'cutting myself', 'overdose',
      'emergency', 'crisis', 'dangerous', 'immediate help'
    ];
    
    for (const keyword of crisisKeywords) {
      if (combinedText.toLowerCase().includes(keyword)) {
        return { 
          escalate: true, 
          reason: 'crisis_detected',
          message: 'I notice you mentioned something concerning. I think it would be best to connect you with a human therapist right away.'
        };
      }
    }
    
    // Check sentiment
    const sentiment = this.analyzeSentiment(combinedText);
    if (sentiment.score < -0.7) {
      return { 
        escalate: true, 
        reason: 'severe_negative_sentiment',
        message: 'I can see you\'re going through a difficult time. Would you like to speak with a human therapist who might be better able to help?'
      };
    }
    
    // Check for repeated dissatisfaction with AI responses
    const dissatisfactionKeywords = [
      'you don\'t understand', 'not helping', 'useless', 
      'want to talk to a real person', 'want a human', 'need a therapist'
    ];
    
    let dissatisfactionCount = 0;
    for (const keyword of dissatisfactionKeywords) {
      if (combinedText.toLowerCase().includes(keyword)) {
        dissatisfactionCount++;
      }
    }
    
    if (dissatisfactionCount >= 2) {
      return { 
        escalate: true, 
        reason: 'user_dissatisfaction',
        message: 'I understand I might not be meeting your needs right now. Would you prefer to speak with a human therapist?'
      };
    }
    
    return { escalate: false, reason: null };
  }
}

module.exports = new AIService();

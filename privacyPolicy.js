// Privacy Policy for the Hybrid Mental Health Platform
// Compliant with HIPAA and GDPR requirements

/**
 * Privacy Policy
 * 
 * This document outlines how user data is collected, processed, stored, and protected
 * in compliance with HIPAA and GDPR regulations.
 */

const privacyPolicy = {
  // General Information
  generalInfo: {
    lastUpdated: new Date().toISOString(),
    effectiveDate: new Date().toISOString(),
    contactEmail: 'privacy@mentalhealthplatform.com',
    dataProtectionOfficer: 'dpo@mentalhealthplatform.com'
  },
  
  // Introduction
  introduction: `
    This Privacy Policy describes how we collect, use, process, and protect your personal information
    when you use our Hybrid Mental Health Platform. We are committed to protecting your privacy and
    ensuring the security of your personal and health information.
    
    We comply with applicable data protection laws, including the Health Insurance Portability and
    Accountability Act (HIPAA) and the General Data Protection Regulation (GDPR).
    
    By using our platform, you consent to the practices described in this Privacy Policy.
  `,
  
  // Data Controller Information
  dataController: {
    name: 'Hybrid Mental Health Platform',
    address: '123 Health Street, Wellness City, 12345',
    contactEmail: 'privacy@mentalhealthplatform.com',
    phone: '+1-123-456-7890'
  },
  
  // Data We Collect
  dataCollected: [
    {
      category: 'Account Information',
      examples: [
        'Name',
        'Email address',
        'Phone number',
        'Password (encrypted)',
        'Profile picture'
      ],
      purpose: 'To create and manage your account, authenticate you, and provide our services',
      legalBasis: 'Contract Performance and Consent'
    },
    {
      category: 'Health Information',
      examples: [
        'Mental health history',
        'Therapy session notes',
        'Mood tracking data',
        'Thought diary entries',
        'Assessment results'
      ],
      purpose: 'To provide therapeutic services, track progress, and offer personalized support',
      legalBasis: 'Explicit Consent and Legitimate Interest'
    },
    {
      category: 'Usage Data',
      examples: [
        'Login times',
        'Features used',
        'Time spent on platform',
        'Device information',
        'IP address'
      ],
      purpose: 'To improve our services, ensure security, and enhance user experience',
      legalBasis: 'Legitimate Interest and Consent'
    },
    {
      category: 'Communication Data',
      examples: [
        'Messages with therapists',
        'Interactions with AI assistant',
        'Feedback and ratings',
        'Support requests'
      ],
      purpose: 'To facilitate communication, provide support, and improve our services',
      legalBasis: 'Contract Performance and Legitimate Interest'
    }
  ],
  
  // How We Use Your Data
  dataUse: [
    {
      purpose: 'Providing Mental Health Services',
      description: 'We use your data to deliver therapy sessions, AI-assisted support, and track your mental health progress.'
    },
    {
      purpose: 'Account Management',
      description: 'We use your data to create and manage your account, authenticate you, and maintain the security of your account.'
    },
    {
      purpose: 'Communication',
      description: 'We use your data to facilitate communication between you and therapists, and to send important notifications about your care.'
    },
    {
      purpose: 'Service Improvement',
      description: 'We analyze anonymized data to improve our platform, enhance features, and develop new services.'
    },
    {
      purpose: 'Security and Compliance',
      description: 'We use your data to ensure the security of our platform, prevent fraud, and comply with legal obligations.'
    }
  ],
  
  // Data Sharing
  dataSharing: {
    thirdParties: [
      {
        category: 'Healthcare Providers',
        purpose: 'To facilitate your mental health care',
        dataShared: 'Health information with your explicit consent',
        safeguards: 'Business Associate Agreements, encryption, access controls'
      },
      {
        category: 'Service Providers',
        purpose: 'To help us operate our platform (e.g., cloud storage, payment processing)',
        dataShared: 'Limited personal information necessary for the service',
        safeguards: 'Data Processing Agreements, encryption, access controls'
      },
      {
        category: 'Legal Authorities',
        purpose: 'To comply with legal obligations or protect rights',
        dataShared: 'Information required by law or to prevent harm',
        safeguards: 'Minimum necessary disclosure, legal review process'
      }
    ],
    noSelling: 'We never sell your personal information to third parties.',
    internationalTransfers: 'If we transfer your data outside your region, we ensure appropriate safeguards are in place to protect your data, such as Standard Contractual Clauses or adequacy decisions.'
  },
  
  // Data Security
  dataSecurity: {
    measures: [
      'End-to-end encryption for sensitive data',
      'Multi-factor authentication',
      'Role-based access controls',
      'Regular security audits and penetration testing',
      'Staff training on data protection',
      'Incident response procedures',
      'Physical, technical, and administrative safeguards'
    ],
    breachNotification: 'In the event of a data breach that affects your personal information, we will notify you and relevant authorities as required by law.'
  },
  
  // Data Retention
  dataRetention: {
    policy: 'We retain your data for as long as necessary to provide our services, comply with legal obligations, and resolve disputes.',
    userControl: 'You can choose your data retention period in your privacy settings (3 months, 6 months, 1 year, 2 years, or indefinite).',
    defaultPeriod: 'If you do not select a retention period, we default to 6 months.',
    accountDeletion: 'When you delete your account, we will delete or anonymize your data according to your retention settings and legal requirements.'
  },
  
  // Your Rights
  dataSubjectRights: {
    accessRight: 'You have the right to access the personal data we hold about you.',
    rectificationRight: 'You have the right to request correction of inaccurate or incomplete data.',
    erasureRight: 'You have the right to request deletion of your data in certain circumstances.',
    restrictionRight: 'You have the right to request restriction of processing in certain circumstances.',
    portabilityRight: 'You have the right to receive your data in a structured, commonly used format.',
    objectRight: 'You have the right to object to processing based on legitimate interests.',
    consentWithdrawal: 'You have the right to withdraw consent at any time for processing based on consent.',
    automatedDecisions: 'You have the right to not be subject to decisions based solely on automated processing that significantly affect you.',
    exercisingRights: 'You can exercise these rights through your account privacy settings or by contacting our Data Protection Officer.'
  },
  
  // Cookies and Tracking
  cookiesAndTracking: {
    types: [
      {
        name: 'Essential Cookies',
        purpose: 'Required for the platform to function properly',
        duration: 'Session or persistent (up to 1 year)',
        required: true
      },
      {
        name: 'Functional Cookies',
        purpose: 'Enhance functionality and personalization',
        duration: 'Up to 1 year',
        required: false
      },
      {
        name: 'Analytics Cookies',
        purpose: 'Help us understand how users interact with our platform',
        duration: 'Up to 2 years',
        required: false
      }
    ],
    controls: 'You can manage cookie preferences through your browser settings and our cookie consent tool.',
    doNotTrack: 'We respect Do Not Track signals from your browser.'
  },
  
  // Children's Privacy
  childrensPrivacy: {
    minimumAge: 16,
    parentalConsent: 'For users under 16, we require verifiable parental consent before collecting personal information.',
    specialProtections: 'We implement additional safeguards for data from minors.'
  },
  
  // Changes to Privacy Policy
  policyChanges: {
    notification: 'We will notify you of significant changes to this Privacy Policy via email or platform notification.',
    effectiveDate: 'Changes will be effective after the notification period, typically 30 days.',
    continuedUse: 'Your continued use after changes take effect constitutes acceptance of the updated policy.'
  },
  
  // Contact Information
  contactInfo: {
    privacyQuestions: 'privacy@mentalhealthplatform.com',
    dataProtectionOfficer: 'dpo@mentalhealthplatform.com',
    address: '123 Health Street, Wellness City, 12345',
    phone: '+1-123-456-7890'
  },
  
  // Regulatory Information
  regulatoryInfo: {
    supervisoryAuthority: 'You have the right to lodge a complaint with your local data protection authority.',
    hipaaCompliance: 'As a covered entity under HIPAA, we maintain a Notice of Privacy Practices that provides additional information about how we handle protected health information.'
  }
};

module.exports = privacyPolicy;

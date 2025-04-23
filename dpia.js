// Data Protection Impact Assessment (DPIA) for the hybrid mental health platform
// This document outlines the privacy risks and mitigation strategies

/**
 * Data Protection Impact Assessment (DPIA)
 * 
 * This assessment identifies and minimizes data protection risks for the
 * hybrid mental health platform in compliance with GDPR Article 35.
 */

const dpia = {
  // Project Information
  projectInfo: {
    name: 'Hybrid Mental Health Platform',
    description: 'A scalable hybrid mental health platform combining licensed therapist services with AI-driven therapeutic tools',
    dataController: 'Platform Operator', // Would be the actual organization name in production
    dataProtectionOfficer: 'DPO Name', // Would be the actual DPO in production
    assessmentDate: new Date().toISOString()
  },
  
  // Data Processing Activities
  dataProcessingActivities: [
    {
      activity: 'User Registration and Authentication',
      dataCategories: ['Personal Identifiers', 'Contact Information', 'Authentication Data'],
      purpose: 'To create and secure user accounts',
      legalBasis: 'Contract Performance and Consent',
      dataSubjects: 'Platform Users',
      retention: 'Account Lifetime + Regulatory Requirements'
    },
    {
      activity: 'Therapy Session Management',
      dataCategories: ['Personal Identifiers', 'Health Data', 'Session Notes', 'Audio/Video Recordings'],
      purpose: 'To provide therapy services',
      legalBasis: 'Consent and Legitimate Interest',
      dataSubjects: 'Platform Users',
      retention: 'According to User Data Retention Settings'
    },
    {
      activity: 'AI-Assisted Therapeutic Tools',
      dataCategories: ['Personal Identifiers', 'Health Data', 'User Inputs', 'Behavioral Data'],
      purpose: 'To provide AI-driven therapeutic support',
      legalBasis: 'Explicit Consent',
      dataSubjects: 'Platform Users',
      retention: 'According to User Data Retention Settings'
    },
    {
      activity: 'Mood and Thought Tracking',
      dataCategories: ['Personal Identifiers', 'Health Data', 'User Inputs'],
      purpose: 'To track user mental health progress',
      legalBasis: 'Explicit Consent',
      dataSubjects: 'Platform Users',
      retention: 'According to User Data Retention Settings'
    }
  ],
  
  // Necessity and Proportionality Assessment
  necessityAssessment: {
    dataMinimization: 'Only necessary data is collected for each function. Users can opt out of non-essential data collection.',
    accuracy: 'Regular data verification processes and user-initiated corrections are supported.',
    retentionLimits: 'User-configurable retention periods with default of 6 months.',
    informationProvided: 'Comprehensive privacy policy and just-in-time notices for data collection points.',
    dataSubjectRights: 'Full implementation of access, rectification, erasure, and portability rights.',
    thirdPartyProcessors: 'Limited to essential service providers with appropriate contractual safeguards.',
    internationalTransfers: 'Data kept within compliant jurisdictions with appropriate safeguards.'
  },
  
  // Risk Assessment
  riskAssessment: [
    {
      risk: 'Unauthorized Access to Sensitive Health Data',
      likelihood: 'Medium',
      impact: 'High',
      overallRisk: 'High',
      mitigationMeasures: [
        'End-to-end encryption for all data in transit and at rest',
        'Strong authentication with MFA',
        'Role-based access controls',
        'Regular security audits and penetration testing',
        'Comprehensive audit logging'
      ]
    },
    {
      risk: 'Data Breach of User Accounts',
      likelihood: 'Medium',
      impact: 'High',
      overallRisk: 'High',
      mitigationMeasures: [
        'Password hashing with strong algorithms',
        'Account lockout after failed attempts',
        'Regular security training for staff',
        'Breach detection systems',
        'Incident response plan'
      ]
    },
    {
      risk: 'Misuse of AI-Generated Insights',
      likelihood: 'Medium',
      impact: 'Medium',
      overallRisk: 'Medium',
      mitigationMeasures: [
        'Explicit consent for AI processing',
        'Transparency in AI decision-making',
        'Human oversight of AI systems',
        'Regular bias testing and correction',
        'User control over AI-generated content'
      ]
    },
    {
      risk: 'Excessive Data Retention',
      likelihood: 'Medium',
      impact: 'Medium',
      overallRisk: 'Medium',
      mitigationMeasures: [
        'User-configurable retention periods',
        'Automated data deletion processes',
        'Regular data minimization reviews',
        'Clear retention policies'
      ]
    },
    {
      risk: 'Lack of Informed Consent',
      likelihood: 'Low',
      impact: 'High',
      overallRisk: 'Medium',
      mitigationMeasures: [
        'Layered consent mechanisms',
        'Clear and simple language',
        'Just-in-time consent notices',
        'Ability to withdraw consent easily',
        'Regular consent refresh for long-term users'
      ]
    }
  ],
  
  // Compliance Measures
  complianceMeasures: {
    technicalMeasures: [
      'End-to-end encryption for all sensitive data',
      'Secure authentication with MFA',
      'Role-based access control',
      'Comprehensive audit logging',
      'Regular security testing',
      'Automated data retention enforcement',
      'Secure development practices',
      'Regular vulnerability scanning'
    ],
    organizationalMeasures: [
      'Staff training on data protection',
      'Data protection policies and procedures',
      'Regular compliance audits',
      'Incident response plan',
      'Data processor agreements',
      'Privacy by design methodology',
      'DPO appointment and involvement'
    ],
    userControlMeasures: [
      'Comprehensive privacy dashboard',
      'Data access and export functionality',
      'Consent management interface',
      'Data deletion requests handling',
      'Transparent privacy notices',
      'Communication channels for privacy concerns'
    ]
  },
  
  // Recommendations
  recommendations: [
    'Implement regular penetration testing schedule',
    'Conduct annual HIPAA and GDPR compliance audits',
    'Develop comprehensive data breach response plan',
    'Create regular staff training program for security awareness',
    'Establish data protection working group for ongoing oversight',
    'Implement privacy-enhancing technologies as they become available',
    'Regular review and update of this DPIA'
  ],
  
  // Conclusion
  conclusion: 'This DPIA has identified several risks associated with processing sensitive health data in the hybrid mental health platform. With the implementation of the identified mitigation measures and compliance controls, the residual risk is considered acceptable. Regular reviews of this assessment will be conducted as the platform evolves.'
};

module.exports = dpia;

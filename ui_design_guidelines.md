# UI Design Guidelines for Hybrid Mental Health Platform

## Design Principles

### 1. Accessibility
- Follow WCAG 2.1 AA standards
- Support screen readers and keyboard navigation
- Ensure sufficient color contrast (minimum 4.5:1 ratio)
- Provide text alternatives for non-text content
- Design for different screen sizes and orientations

### 2. Empathy
- Use warm, calming color palette
- Implement gentle transitions and animations
- Avoid overwhelming users with too much information
- Provide clear, supportive messaging
- Use inclusive, non-stigmatizing language

### 3. Privacy-Focused
- Clear visual indicators for data collection points
- Prominent privacy controls
- Transparent consent mechanisms
- Visual security indicators (encryption, secure connection)
- Discreet UI elements for sensitive information

### 4. Simplicity
- Intuitive navigation with minimal learning curve
- Progressive disclosure of complex features
- Clear visual hierarchy
- Consistent UI patterns across the platform
- Focused functionality with minimal distractions

## Color Palette

### Primary Colors
- Teal: #2A9D8F (Calming, professional)
- Soft Blue: #457B9D (Trustworthy, stable)
- Light Sage: #8DB38B (Natural, growth-oriented)

### Secondary Colors
- Warm Beige: #F2E9E4 (Neutral background)
- Soft Coral: #F4A261 (Warm accent)
- Deep Purple: #6D597A (Depth, wisdom)

### Functional Colors
- Success: #43AA8B (Positive feedback)
- Warning: #F8961E (Caution)
- Error: #E76F51 (Alerts, errors)
- Info: #4EA8DE (Informational)

## Typography

### Font Families
- Primary: 'Open Sans' (Clean, readable)
- Secondary: 'Merriweather' (Warm, empathetic)
- Monospace: 'Source Code Pro' (For code or technical information)

### Font Sizes
- Base size: 16px
- Scale: 1.25 ratio
- Headings: h1 (2.441rem), h2 (1.953rem), h3 (1.563rem), h4 (1.25rem)
- Small text: 0.8rem (minimum for accessibility)

### Font Weights
- Regular: 400
- Medium: 500
- Bold: 700

## Component Guidelines

### Buttons
- Primary: Filled, rounded corners (8px radius)
- Secondary: Outlined, same radius
- Tertiary: Text-only with subtle hover effect
- Size: Minimum touch target of 44x44px
- States: Default, Hover, Active, Disabled

### Forms
- Clear, concise labels positioned above inputs
- Visible focus states
- Inline validation with helpful error messages
- Progress indicators for multi-step forms
- Autofill support where appropriate

### Cards
- Subtle shadows (0px 4px 6px rgba(0, 0, 0, 0.1))
- Rounded corners (12px radius)
- Consistent padding (16px)
- Clear visual hierarchy for content
- Interactive states for clickable cards

### Navigation
- Web: Horizontal navigation for desktop, hamburger menu for mobile
- Mobile: Bottom tab navigation for primary actions
- Breadcrumbs for complex flows
- Back buttons for multi-step processes
- Visual indicators for current section

### Modals & Dialogs
- Centered on screen with overlay background
- Clear dismiss options (X button, cancel button, click outside)
- Focus trapped within modal when open
- Purposeful use - only for important interruptions
- Responsive sizing based on content and screen size

## Responsive Breakpoints

- Mobile: 320px - 480px
- Tablet: 481px - 768px
- Desktop: 769px - 1024px
- Large Desktop: 1025px and above

## Iconography

- Style: Outlined, consistent stroke width (2px)
- Size: 24x24px (standard), 16x16px (compact), 32x32px (prominent)
- Touch targets: Minimum 44x44px for interactive icons
- Purpose: Functional, not decorative
- Accessibility: Always paired with text or aria-labels

## Animation & Transitions

- Duration: 200-300ms for standard transitions
- Easing: Ease-out for entering elements, ease-in for exiting
- Purpose: Enhance understanding, not decoration
- Reduced motion option for users with vestibular disorders
- Subtle feedback animations for interactions

## Specific UI Patterns

### Mood Tracking
- Simple, intuitive scale (1-5 or emoji-based)
- Visual representation of historical data
- Color-coding that avoids stigmatizing negative emotions
- Optional notes field for context
- Privacy controls for sharing data with therapists

### Thought Diary
- Clean, distraction-free writing interface
- Structured prompts based on CBT principles
- Progress saving and auto-save functionality
- Private by default with explicit sharing options
- Supportive, non-judgmental language

### Therapist Interaction
- Clear availability indicators
- Secure messaging interface
- Video call interface with minimal controls
- Session preparation and follow-up screens
- Emergency contact options always accessible

### AI Conversation Interface
- Clear indication of AI vs. human responses
- Conversation history with timestamp
- Typing indicators for responsiveness
- Options to save or reference conversations
- Transparent escalation to human therapists

## Accessibility Checklist

- Keyboard navigable interface
- Screen reader compatible content
- Sufficient color contrast
- Text resizing without loss of functionality
- Alternative text for images
- Captions for video content
- Transcripts for audio content
- No content that flashes more than 3 times per second
- Multiple ways to navigate and find content
- Error identification and suggestions

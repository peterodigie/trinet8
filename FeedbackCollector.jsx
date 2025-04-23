// Feedback collection component for the hybrid mental health platform
// Implements in-app surveys and feedback mechanisms

import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  Button,
  TextField,
  Typography,
  Rating,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Snackbar,
  Alert,
  Box
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      marginBottom: theme.spacing(2),
    },
  },
  ratingContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
  },
  ratingLabel: {
    marginRight: theme.spacing(2),
  },
  formControl: {
    marginBottom: theme.spacing(2),
  },
  dialogActions: {
    padding: theme.spacing(2),
  },
  feedbackButton: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
    zIndex: 1000,
  }
}));

// Main feedback collection component
const FeedbackCollector = ({ 
  type = 'general', // general, session, ai, feature
  featureName = '',
  sessionId = '',
  aiInteractionId = '',
  onSubmit = null,
  autoPrompt = false,
  autoPromptDelay = 5000, // ms
  floatingButton = false
}) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  
  // Feedback form state
  const [rating, setRating] = useState(0);
  const [empathyRating, setEmpathyRating] = useState(0);
  const [helpfulnessRating, setHelpfulnessRating] = useState(0);
  const [usabilityRating, setUsabilityRating] = useState(0);
  const [comments, setComments] = useState('');
  const [improvement, setImprovement] = useState('');
  const [wouldRecommend, setWouldRecommend] = useState('');
  
  // Auto-prompt for feedback
  useEffect(() => {
    let timeoutId;
    
    if (autoPrompt && !submitted) {
      timeoutId = setTimeout(() => {
        setOpen(true);
      }, autoPromptDelay);
    }
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [autoPrompt, submitted, autoPromptDelay]);
  
  // Handle dialog open/close
  const handleOpen = () => {
    setOpen(true);
  };
  
  const handleClose = () => {
    setOpen(false);
  };
  
  // Reset form
  const resetForm = () => {
    setRating(0);
    setEmpathyRating(0);
    setHelpfulnessRating(0);
    setUsabilityRating(0);
    setComments('');
    setImprovement('');
    setWouldRecommend('');
  };
  
  // Handle form submission
  const handleSubmit = async () => {
    // Create feedback object based on feedback type
    const feedbackData = {
      timestamp: new Date().toISOString(),
      type,
      overallRating: rating
    };
    
    // Add type-specific data
    switch (type) {
      case 'session':
        feedbackData.sessionId = sessionId;
        feedbackData.empathyRating = empathyRating;
        feedbackData.helpfulnessRating = helpfulnessRating;
        break;
      case 'ai':
        feedbackData.aiInteractionId = aiInteractionId;
        feedbackData.empathyRating = empathyRating;
        feedbackData.helpfulnessRating = helpfulnessRating;
        break;
      case 'feature':
        feedbackData.featureName = featureName;
        feedbackData.usabilityRating = usabilityRating;
        break;
      default:
        // General feedback
        break;
    }
    
    // Add common fields
    if (comments) feedbackData.comments = comments;
    if (improvement) feedbackData.improvement = improvement;
    if (wouldRecommend) feedbackData.wouldRecommend = wouldRecommend;
    
    // In a real implementation, this would send data to the server
    console.log('Submitting feedback:', feedbackData);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Call onSubmit callback if provided
      if (onSubmit) {
        onSubmit(feedbackData);
      }
      
      // Close dialog and show success message
      setOpen(false);
      setSubmitted(true);
      setSnackbarOpen(true);
      resetForm();
    } catch (error) {
      console.error('Error submitting feedback:', error);
      // Would show error message in production
    }
  };
  
  // Handle snackbar close
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  
  // Get dialog title based on feedback type
  const getDialogTitle = () => {
    switch (type) {
      case 'session':
        return 'Session Feedback';
      case 'ai':
        return 'AI Interaction Feedback';
      case 'feature':
        return `${featureName} Feedback`;
      default:
        return 'Share Your Feedback';
    }
  };
  
  return (
    <>
      {floatingButton && (
        <Button
          variant="contained"
          color="primary"
          className={classes.feedbackButton}
          onClick={handleOpen}
        >
          Feedback
        </Button>
      )}
      
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="feedback-dialog-title"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle id="feedback-dialog-title">{getDialogTitle()}</DialogTitle>
        <DialogContent>
          <form className={classes.root}>
            {/* Overall Rating - for all feedback types */}
            <div className={classes.ratingContainer}>
              <Typography component="legend" className={classes.ratingLabel}>
                Overall Rating:
              </Typography>
              <Rating
                name="overall-rating"
                value={rating}
                onChange={(event, newValue) => {
                  setRating(newValue);
                }}
                precision={0.5}
              />
            </div>
            
            {/* Type-specific questions */}
            {(type === 'session' || type === 'ai') && (
              <>
                <div className={classes.ratingContainer}>
                  <Typography component="legend" className={classes.ratingLabel}>
                    Empathy:
                  </Typography>
                  <Rating
                    name="empathy-rating"
                    value={empathyRating}
                    onChange={(event, newValue) => {
                      setEmpathyRating(newValue);
                    }}
                  />
                </div>
                
                <div className={classes.ratingContainer}>
                  <Typography component="legend" className={classes.ratingLabel}>
                    Helpfulness:
                  </Typography>
                  <Rating
                    name="helpfulness-rating"
                    value={helpfulnessRating}
                    onChange={(event, newValue) => {
                      setHelpfulnessRating(newValue);
                    }}
                  />
                </div>
              </>
            )}
            
            {type === 'feature' && (
              <div className={classes.ratingContainer}>
                <Typography component="legend" className={classes.ratingLabel}>
                  Ease of Use:
                </Typography>
                <Rating
                  name="usability-rating"
                  value={usabilityRating}
                  onChange={(event, newValue) => {
                    setUsabilityRating(newValue);
                  }}
                />
              </div>
            )}
            
            {/* Common questions for all feedback types */}
            <TextField
              label="What did you like about your experience?"
              multiline
              rows={3}
              variant="outlined"
              fullWidth
              value={comments}
              onChange={(e) => setComments(e.target.value)}
            />
            
            <TextField
              label="What could be improved?"
              multiline
              rows={3}
              variant="outlined"
              fullWidth
              value={improvement}
              onChange={(e) => setImprovement(e.target.value)}
            />
            
            <FormControl component="fieldset" className={classes.formControl}>
              <FormLabel component="legend">Would you recommend this platform to others?</FormLabel>
              <RadioGroup
                aria-label="recommendation"
                name="recommendation"
                value={wouldRecommend}
                onChange={(e) => setWouldRecommend(e.target.value)}
              >
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="maybe" control={<Radio />} label="Maybe" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
              </RadioGroup>
            </FormControl>
          </form>
        </DialogContent>
        <DialogActions className={classes.dialogActions}>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            color="primary" 
            variant="contained"
            disabled={rating === 0}
          >
            Submit Feedback
          </Button>
        </DialogActions>
      </Dialog>
      
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity="success">
          Thank you for your feedback!
        </Alert>
      </Snackbar>
    </>
  );
};

// Quick feedback component for AI interactions
export const QuickAIFeedback = ({ aiResponseId, onSubmit }) => {
  const [submitted, setSubmitted] = useState(false);
  const [helpful, setHelpful] = useState(null);
  
  const handleFeedback = async (isHelpful) => {
    setHelpful(isHelpful);
    
    const feedbackData = {
      aiResponseId,
      helpful: isHelpful,
      timestamp: new Date().toISOString()
    };
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Call onSubmit callback if provided
      if (onSubmit) {
        onSubmit(feedbackData);
      }
      
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting quick feedback:', error);
    }
  };
  
  if (submitted) {
    return (
      <Box mt={1} mb={1}>
        <Typography variant="body2" color="textSecondary">
          {helpful ? 'Thanks for your feedback!' : 'Thanks for your feedback. We\'ll work to improve.'}
        </Typography>
      </Box>
    );
  }
  
  return (
    <Box mt={1} mb={1} display="flex" alignItems="center">
      <Typography variant="body2" color="textSecondary" style={{ marginRight: 8 }}>
        Was this response helpful?
      </Typography>
      <Button 
        size="small" 
        variant="outlined" 
        color="primary" 
        style={{ marginRight: 8, minWidth: 'auto' }}
        onClick={() => handleFeedback(true)}
      >
        Yes
      </Button>
      <Button 
        size="small" 
        variant="outlined" 
        onClick={() => handleFeedback(false)}
        style={{ minWidth: 'auto' }}
      >
        No
      </Button>
    </Box>
  );
};

export default FeedbackCollector;

// Sample React Component for the Thought Diary Page

import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Grid,
  Box,
  Card,
  CardContent,
  Divider
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Sidebar from '../components/Sidebar';
import AIRecommendations from '../components/AIRecommendations';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    minHeight: '100vh',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  title: {
    marginBottom: theme.spacing(3),
    color: theme.palette.primary.main,
  },
  formContainer: {
    marginBottom: theme.spacing(4),
  },
  textField: {
    marginBottom: theme.spacing(3),
  },
  saveButton: {
    marginTop: theme.spacing(2),
  },
  aiSuggestions: {
    marginTop: theme.spacing(4),
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.default,
  },
}));

const ThoughtDiaryPage = () => {
  const classes = useStyles();
  const [diaryEntry, setDiaryEntry] = useState({
    situation: '',
    thoughts: '',
    emotions: '',
    alternativePerspective: '',
  });
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDiaryEntry({
      ...diaryEntry,
      [name]: value,
    });
  };

  // Get AI suggestions when thoughts field is updated
  useEffect(() => {
    const getAISuggestions = async () => {
      // Only fetch suggestions if there's meaningful content
      if (diaryEntry.thoughts.length > 20) {
        setIsLoading(true);
        try {
          // This would be an actual API call in production
          // Simulating API call delay
          setTimeout(() => {
            // Mock AI suggestions
            setAiSuggestions([
              "Consider whether this thought is based on facts or assumptions.",
              "How would you advise a friend who had this thought?",
              "Is there another way to interpret this situation?"
            ]);
            setIsLoading(false);
          }, 1000);
        } catch (error) {
          console.error('Error fetching AI suggestions:', error);
          setIsLoading(false);
        }
      }
    };

    getAISuggestions();
  }, [diaryEntry.thoughts]);

  // Save diary entry
  const handleSave = async () => {
    setIsLoading(true);
    try {
      // This would be an actual API call in production
      console.log('Saving diary entry:', diaryEntry);
      // Simulate API call
      setTimeout(() => {
        alert('Diary entry saved successfully!');
        setIsLoading(false);
        // Clear form or redirect as needed
      }, 1000);
    } catch (error) {
      console.error('Error saving diary entry:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className={classes.root}>
      <Sidebar />
      <main className={classes.content}>
        <Container maxWidth="lg">
          <Typography variant="h4" className={classes.title}>
            Thought Diary
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Date: {new Date().toLocaleDateString()}
          </Typography>
          
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <Paper elevation={2} className={classes.formContainer}>
                <Box p={3}>
                  <TextField
                    className={classes.textField}
                    label="Situation"
                    name="situation"
                    value={diaryEntry.situation}
                    onChange={handleInputChange}
                    fullWidth
                    multiline
                    rows={2}
                    variant="outlined"
                    placeholder="Describe the situation that triggered your thoughts..."
                  />
                  
                  <TextField
                    className={classes.textField}
                    label="Thoughts"
                    name="thoughts"
                    value={diaryEntry.thoughts}
                    onChange={handleInputChange}
                    fullWidth
                    multiline
                    rows={4}
                    variant="outlined"
                    placeholder="What went through your mind?"
                  />
                  
                  <TextField
                    className={classes.textField}
                    label="Emotions"
                    name="emotions"
                    value={diaryEntry.emotions}
                    onChange={handleInputChange}
                    fullWidth
                    multiline
                    rows={2}
                    variant="outlined"
                    placeholder="How did you feel? Rate intensity (0-100%)"
                  />
                  
                  <TextField
                    className={classes.textField}
                    label="Alternative Perspective"
                    name="alternativePerspective"
                    value={diaryEntry.alternativePerspective}
                    onChange={handleInputChange}
                    fullWidth
                    multiline
                    rows={4}
                    variant="outlined"
                    placeholder="What's another way to look at this situation?"
                  />
                  
                  <Button
                    variant="contained"
                    color="primary"
                    className={classes.saveButton}
                    onClick={handleSave}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Saving...' : 'Save Entry'}
                  </Button>
                </Box>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    AI Suggestions
                  </Typography>
                  <Divider />
                  <Box mt={2}>
                    {isLoading ? (
                      <Typography>Analyzing your thoughts...</Typography>
                    ) : aiSuggestions.length > 0 ? (
                      <AIRecommendations suggestions={aiSuggestions} />
                    ) : (
                      <Typography variant="body2" color="textSecondary">
                        Add more details to your thoughts to receive AI-powered suggestions.
                      </Typography>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </main>
    </div>
  );
};

export default ThoughtDiaryPage;

import React, { useState,  } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';
import { Box, Container, Paper, Typography, Stepper, Step, StepLabel, TextField, Button, Stack, MenuItem, Select, ThemeProvider, createTheme, CircularProgress, Alert } from '@mui/material';
import KeyIcon from '@mui/icons-material/Key';
import EditNoteIcon from '@mui/icons-material/EditNote';
import UploadIcon from '@mui/icons-material/Upload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';



const API_BASE_URL = "https://fastapi-research-evaluator.onrender.com";
//const API_BASE_URL = "http://127.0.0.1:8000"

const theme = createTheme({
  palette: {
    primary: {
      main: '#4B7BF5',
    },
    background: {
      default: '#F5F7FF',
    },
  },
  typography: {
    h4: { fontWeight: 700, letterSpacing: '-0.01em' },
    subtitle1: { fontSize: '1.1rem' },
  },
});




const steps = [
  { label: 'API Key', icon: <KeyIcon /> },
  { label: 'Details', icon: <EditNoteIcon /> },
  { label: 'Upload', icon: <UploadIcon /> },
  { label: 'Results', icon: <CheckCircleIcon /> },
];

const App = () => {
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <Routes>
          <Route path="/" element={<EvaluationPage />} />
          <Route path="/compare" element={<ComparisonPage />} />
        </Routes>
      </ThemeProvider>
    </Router>
  );
};
const EvaluationPage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [apiKey, setApiKey] = useState('');
  const [evaluationPrompt, setEvaluationPrompt] = useState('');
  const [targetConference, setTargetConference] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [evaluationResult, setEvaluationResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  // const handleNext = () => setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
  const handleBack = () => setActiveStep((prev) => Math.max(prev - 1, 0));
  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      navigate('/compare', { state: { evaluationResult ,apiKey} });
    } else {
      setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const handleFileUpload = async (event) => {
    try {
      const file = event.target.files[0];
      if (!file) return;

      setUploadedFile(file);
      setLoading(true);
      setError('');
      setSuccess('');

      const formData = new FormData();
      formData.append("file", file);
      formData.append("gemini_key", apiKey);
      formData.append("prompt", evaluationPrompt);
      formData.append("conference", targetConference);

      const response = await axios.post(`${API_BASE_URL}/upload/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 1800000,
      });

      setEvaluationResult(response.data.evaluation);
      setSuccess("File processed successfully!");
      setActiveStep(3);
    } catch (error) {
      setError("An error occurred while processing the file. Please try again.");
      console.error("Error processing the file:", error);
    } finally {
      setLoading(false);
      event.target.value = "";
    }
  };

  const copyResponse = async () => {
    // const markdownElement = document.getElementById("markdown-content");
    // console.log(markdownElement)
    // if (!markdownElement) return;
  
    const textToCopy = evaluationResult; // Extract text content
    console.log(textToCopy)
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        setSuccess("Markdown content copied to clipboard!");
      })
      .catch((err) => {
        setError("Failed to copy text: ", err);
      });
  };

  return (
    <ThemeProvider theme={theme}>
      {/* <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 8 }}> */}
      <Box sx={{ 
        backgroundImage: `${process.env.PUBLIC_URL}/background.jpg`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
        py: 8,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <Container maxWidth="md">
          <Paper elevation={3} sx={{ p: 6, borderRadius: 3 }}>
            <Stack spacing={5}>
              <Typography variant="h4" textAlign="center">
                AI Research Paper Evaluator
              </Typography>
              <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((step, index) => (
                  <Step key={step.label}>
                    <StepLabel>{step.label}</StepLabel>
                  </Step>
                ))}
              </Stepper>

              {loading && <CircularProgress sx={{ alignSelf: 'center' }} />}
              {/* {error && <Alert severity="error">{error}</Alert>}
              {success && <Alert severity="success">{success}</Alert>} */}
              {error && (
                <Alert 
                  severity="error" 
                  onClose={() => setError('')} // Clears the error state
                >
                  {error}
                </Alert>
              )}

              {success && (
                <Alert 
                  severity="success" 
                  onClose={() => setSuccess('')} // Clears the success state
                >
                  {success}
                </Alert>
              )}

              <Box sx={{ mt: 4 }} id="evaluation-section">
                {activeStep === 0 && (
                  <Stack spacing={3}>
                    <Typography variant="h6">Enter API Key</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      type="password"
                      placeholder="Enter your Gemini API key"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                    />
                  </Stack>
                )}
                {activeStep === 1 && (
                  <Stack spacing={3}>
                    <Typography variant="h6">Enter Evaluation Details </Typography>
                    <Select
                      fullWidth
                      displayEmpty
                      value={targetConference}
                      onChange={(e) => setTargetConference(e.target.value)}
                    >
                      <MenuItem value="" disabled>Select a conference</MenuItem>
                      <MenuItem value="ACL">ACL</MenuItem>
                      <MenuItem value="NeurIPS">NeurIPS</MenuItem>
                      <MenuItem value="ICLR">ICLR</MenuItem>
                      <MenuItem value="CVPR">CVPR</MenuItem>
                      <MenuItem value="ICML">ICML</MenuItem>
                    </Select>

                    <TextField
                      fullWidth
                      variant="outlined"
                      placeholder="Enter additional evaluation prompt"
                      value={evaluationPrompt}
                      onChange={(e) => setEvaluationPrompt(e.target.value)}
                      multiline
                      rows={4}
                    />
                    
                  </Stack>
                )}
                {activeStep === 2 && (
                  <Stack spacing={3} alignItems="center">
                    <Typography variant="h6">Upload Research Paper</Typography>
                    <Button variant="contained" component="label">
                      Upload File
                      <input hidden type="file" accept=".pdf" onChange={handleFileUpload} />
                    </Button>
                    {uploadedFile && <Typography>{uploadedFile.name} ({(uploadedFile.size / 1024 / 1024).toFixed(2)} MB)</Typography>}
                  </Stack>
                )}
                {activeStep === 3 && (
                  <Stack spacing={3} textAlign="center">
                    <Typography variant="h6">Evaluation Results</Typography>
                    {/* <Paper elevation={2} sx={{ p: 2, bgcolor: 'white' }}>
                      <ReactMarkdown style={{textAlign: 'justify'}}>{evaluationResult}</ReactMarkdown>
                    </Paper> */}
                    <Paper 
                      elevation={2} 
                      sx={{ 
                        p: 2, 
                        bgcolor: 'white', 
                        maxHeight: '50vh', // Makes it fit within the screen
                        overflowY: 'auto', // Enables scrolling
                        width: '100%', 
                      }}
                    >
                      {/* <ReactMarkdown style={{ textAlign: 'left' }} id="markdown-content">
                        {evaluationResult}
                      </ReactMarkdown> */}
                      <ReactMarkdown 
                        components={{ 
                          p: ({node, ...props}) => <p style={{ textAlign: 'left' }} {...props} /> 
                        }}
                      >{evaluationResult}</ReactMarkdown>
                    </Paper>

                    <Button variant="contained" onClick={()=>{copyResponse()}}>Copy Response</Button>
                  </Stack>
                )}
              </Box>
              <Box display="flex" justifyContent="space-between" sx={{ mt: 4 }}>
                <Button onClick={handleBack} variant="outlined" style={{ visibility: activeStep === 0 ? 'hidden' : 'visible' }}>
                  Previous
                </Button>
                <Button variant="contained" onClick={handleNext} disabled={  
                  (activeStep === 2 && evaluationResult=='') || 
                  (activeStep === 0 && apiKey=='') ||
                  (activeStep == 1 && targetConference == '')}>
                  {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                </Button>
              </Box>
            </Stack>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
};



const ComparisonPage = () => {
  const location = useLocation(); // Get location object
  const navigate = useNavigate();
  const [humanReview, setHumanReview] = useState('');
  const [comparisonResult, setComparisonResult] = useState('');
  const evaluationResult = location.state?.evaluationResult || ''; // Safely access evaluationResult
  const apiKey = location.state?.apiKey || '';

  const compare_reviews = async (apiKey, humanReview, evaluationResult) => {
    try {
      const response = await axios.post(API_BASE_URL +"/compare/", 
        new URLSearchParams({
          gemini_key: apiKey,
          gemini_review: evaluationResult,
          human_review: humanReview
        }),
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }
      );
      setComparisonResult(response.data.comparison);
    } catch (error) {
      console.error("Error comparing reviews:", error.response?.data || error.message);
      return "An error occurred while comparing the reviews.";
    }
  };
  
  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 6, borderRadius: 3 }}>
        <Stack spacing={5}>
          <Typography variant="h4" textAlign="center">Compare AI and Human Review</Typography>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Paste human review here"
            value={humanReview}
            onChange={(e) => setHumanReview(e.target.value)}
            multiline
            rows={4}
          />
          <Typography variant="h6">AI Evaluation</Typography>
          <Paper elevation={2} sx={{ p: 2, bgcolor: 'white', maxHeight: '50vh', overflowY: 'auto' }}>
            <ReactMarkdown>{evaluationResult}</ReactMarkdown>
          </Paper>
          {comparisonResult && (
            <Paper elevation={2} sx={{ p: 2, bgcolor: 'white', maxHeight: '50vh', overflowY: 'auto' }}>
              <Typography variant="h6">Comparison Result</Typography>
              {/* <ReactMarkdown>{comparisonResult}</ReactMarkdown> */}
              <ReactMarkdown 
                components={{ 
                  p: ({node, ...props}) => <p style={{ textAlign: 'left' }} {...props} /> 
                }}
              >
                {comparisonResult}
              </ReactMarkdown>
            </Paper>
          )}
          <Box display="flex" justifyContent="space-between" sx={{ mt: 4 }}>
            <Button variant="outlined" onClick={() => navigate('/')}>Home</Button>
            <Button variant="contained" onClick={() => compare_reviews(apiKey,humanReview,evaluationResult)}>Compare Evaluations</Button> 
          </Box>
          
        </Stack>
        
      </Paper>

    </Container>
  );
};


export default App;


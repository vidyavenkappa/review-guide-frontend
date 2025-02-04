import { useState, useEffect, useRef } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import {
  Container,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  Paper,
  Button,
  TextField,
  Snackbar,
  Alert,
  Box,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { UploadFile as UploadIcon } from "@mui/icons-material";
import { motion } from "framer-motion";

const API_BASE_URL = "https://fastapi-research-evaluator.onrender.com";
//const API_BASE_URL="http://127.0.0.1:8000"
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
];

function App() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [geminiKey, setGeminiKey] = useState("");
  const [prompt, setPrompt] = useState("");
  const [conference, setConference] = useState("NeurIPS");
  const [fileUploaded, setFileUploaded] = useState(false);
  const [error, setError] = useState({
    show: false,
    message: "",
    severity: "error",
  });
  const [activeStep, setActiveStep] = useState(0);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const showError = (message, severity = "error") => {
    setError({ show: true, message, severity });
  };

  const handleCloseError = () => {
    setError({ ...error, show: false });
  };

  const validateFile = (file) => {
    if (!file) throw new Error("Please select a file to upload.");
    if (file.size > MAX_FILE_SIZE)
      throw new Error("File size exceeds 10MB limit.");
    if (!ALLOWED_FILE_TYPES.includes(file.type))
      throw new Error("Invalid file type.");
    return true;
  };

  const validateGeminiKey = () => {
    if (!geminiKey.trim())
      throw new Error("Please enter your Gemini API Key.");
    if (geminiKey.length < 30)
      throw new Error("Invalid Gemini API Key format.");
    return true;
  };

  const validatePrompt = () => {
    if (!prompt.trim()) throw new Error("Please enter your prompt.");
    return true;
  };

  const handleFileChange = async (event) => {
    try {
      const file = event.target.files[0];
      setFileUploaded(!!file);
      validateFile(file);
      validateGeminiKey();
      validatePrompt();

      setLoading(true);
      const fileTitle = file.name.replace(/\.[^/.]+$/, "");
      setMessages((prev) => [
        ...prev,
        {
          type: "user",
          content: `📄 Uploading: **${fileTitle}** with prompt for **${conference}**`,
        },
      ]);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("gemini_key", geminiKey);
      formData.append("prompt", prompt);
      formData.append("conference", conference);

      const result = await axios.post(`${API_BASE_URL}/upload/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 30000 * 60,
      });

      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          content: `📄 **Evaluation for:** **${fileTitle}**\n\n${result.data.evaluation}`,
        },
      ]);
      showError("File processed successfully!", "success");
      setActiveStep(2);
    } catch (error) {
      showError(
        error.response?.data?.error ||
          error.message ||
          "An error occurred while processing the file."
      );
      setFileUploaded(false);
    } finally {
      setLoading(false);
      event.target.value = "";
    }
  };

  return (
    <Container
      maxWidth="md"
      sx={{
        backgroundColor: "#f4f4f4",
        padding: "20px",
        borderRadius: "10px",
        height: "90vh",
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{ color: "#333", fontWeight: "bold" }}
      >
        📚 Review Guide: AI Research Paper Evaluator
      </Typography>

      <Stepper activeStep={activeStep} alternativeLabel>
        <Step>
          <StepLabel>Enter API Key</StepLabel>
        </Step>
        <Step>
          <StepLabel>
            Enter Prompt, Select Conference & Upload File
          </StepLabel>
        </Step>
        <Step>
          <StepLabel>View Evaluation</StepLabel>
        </Step>
      </Stepper>

      <Snackbar
        open={error.show}
        autoHideDuration={6000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseError}
          severity={error.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          <Typography variant="body2">
            {error.message}
            {error.severity === "error" && (
              <Typography
                variant="caption"
                display="block"
                sx={{ mt: 1 }}
              >
                Need help? Check the instructions above for troubleshooting steps.
              </Typography>
            )}
          </Typography>
        </Alert>
      </Snackbar>

      {activeStep === 0 && (
        <TextField
          type="password"
          label="Enter Gemini API Key"
          variant="outlined"
          fullWidth
          value={geminiKey}
          onChange={(e) => setGeminiKey(e.target.value)}
        />
      )}

      {activeStep === 1 && (
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Enter prompt (Markdown supported)"
            variant="outlined"
            fullWidth
            multiline
            minRows={4}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <FormControl fullWidth>
            <InputLabel id="conference-select-label">
              Select Conference
            </InputLabel>
            <Select
              labelId="conference-select-label"
              id="conference-select"
              value={conference}
              label="Select Conference"
              onChange={(e) => setConference(e.target.value)}
            >
              <MenuItem value="NeurIPS">NeurIPS</MenuItem>
              <MenuItem value="ICLR">ICLR</MenuItem>
              <MenuItem value="ICML">ICML</MenuItem>
              <MenuItem value="CoNLL">CoNLL</MenuItem>
              <MenuItem value="ACL">ACL</MenuItem>
            </Select>
          </FormControl>
          <input
            type="file"
            onChange={handleFileChange}
            style={{ display: "none" }}
            id="file-input"
            accept=".pdf,.doc,.docx,.txt"
          />
          <label htmlFor="file-input">
            <Button
              variant="contained"
              color="primary"
              component="span"
              startIcon={<UploadIcon />}
              disabled={loading}
            >
              {loading ? "Processing..." : "Upload & Evaluate"}
            </Button>
          </label>
        </Box>
      )}

      {activeStep === 2 && (
        <Paper
          elevation={3}
          sx={{
            flexGrow: 1,
            overflowY: "auto",
            padding: "15px",
            borderRadius: "10px",
            backgroundColor: "#fff",
          }}
        >
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card sx={{ marginBottom: 1 }}>
                <CardContent>
                  {msg.type === "bot" ? (
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  ) : (
                    <Typography>{msg.content}</Typography>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
          <div ref={chatEndRef} />
        </Paper>
      )}

      <Box display="flex" justifyContent="space-between">
        {activeStep === 1 && (
          <Button
            variant="contained"
            disabled={activeStep === 0}
            onClick={() => setActiveStep((prev) => prev - 1)}
          >
            Back
          </Button>
        )}
        {activeStep === 2 && (
          <Button
            variant="contained"
            onClick={() => {
              setActiveStep(1);
              setMessages([]);
            }}
          >
            Test a different paper
          </Button>
        )}
        {activeStep !== 2 && (
          <Button
            variant="contained"
            disabled={
              loading ||
              activeStep === 2 ||
              (activeStep === 1 && !fileUploaded && !prompt.trim())
            }
            onClick={() => setActiveStep((prev) => prev + 1)}
          >
            Next Step
          </Button>
        )}
      </Box>
      {loading && (
        <Box textAlign="center">
          <CircularProgress size={30} />
        </Box>
      )}
    </Container>
  );
}

export default App;

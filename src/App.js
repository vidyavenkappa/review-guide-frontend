import { useState, useEffect, useRef } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import {
  Container,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  Avatar,
  Paper,
  Button,
  TextField,
} from "@mui/material";
import { UploadFile as UploadIcon, Key as KeyIcon } from "@mui/icons-material";
import { motion } from "framer-motion";

const API_BASE_URL = "https://fastapi-research-evaluator.onrender.com"; // Replace with your backend URL

function App() {
  const [messages, setMessages] = useState([]); // Chat messages
  const [loading, setLoading] = useState(false);
  const [geminiKey, setGeminiKey] = useState(""); // User-entered Gemini API Key
  const chatEndRef = useRef(null);

  // Scroll to the bottom when new messages are added
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!geminiKey) {
      alert("Please enter your Gemini API Key before uploading.");
      return;
    }

    const fileTitle = file.name.replace(/\.[^/.]+$/, ""); // Extract filename without extension
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("gemini_key", geminiKey); // Send Gemini API Key to backend

    // Add temporary "Uploading" message
    setMessages((prev) => [
      ...prev,
      { type: "user", content: `📄 Uploading: **${fileTitle}**` },
    ]);

    try {
      const result = await axios.post(`${API_BASE_URL}/upload/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const botMessage = {
        type: "bot",
        content: `📄 **Evaluation for:** **${fileTitle}**\n\n` + result.data.evaluation,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      setMessages((prev) => [...prev, { type: "bot", content: "⚠️ Error processing the document." }]);
    } finally {
      setLoading(false);
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
      }}
    >
      <Typography variant="h4" align="center" gutterBottom sx={{ color: "#333", fontWeight: "bold" }}>
        📚 AI Research Paper Evaluator
      </Typography>

      {/* Gemini API Key Input */}
      <TextField
        type="password"
        label="Enter Gemini API Key"
        variant="outlined"
        fullWidth
        value={geminiKey}
        onChange={(e) => setGeminiKey(e.target.value)}
        sx={{ marginBottom: "10px" }}
        InputProps={{
          startAdornment: <KeyIcon sx={{ marginRight: "10px" }} />,
        }}
      />

      {/* Chat Box */}
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
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: msg.type === "user" ? "flex-end" : "flex-start",
              marginBottom: "12px",
            }}
          >
            {msg.type === "bot" && <Avatar sx={{ bgcolor: "#1976d2", marginRight: "10px" }}>🤖</Avatar>}

            <Card
              sx={{
                maxWidth: "75%",
                padding: "12px",
                borderRadius: "15px",
                backgroundColor: msg.type === "user" ? "#1976d2" : "#f0f0f0",
                color: msg.type === "user" ? "#fff" : "#000",
                boxShadow: 2,
              }}
            >
              <CardContent>
                {msg.type === "bot" ? <ReactMarkdown>{msg.content}</ReactMarkdown> : <Typography>{msg.content}</Typography>}
              </CardContent>
            </Card>

            {msg.type === "user" && <Avatar sx={{ bgcolor: "#1976d2", marginLeft: "10px" }}>👤</Avatar>}
          </motion.div>
        ))}

        {/* Keeps chat scrolled to the latest message */}
        <div ref={chatEndRef} />
      </Paper>

      {/* File Upload Button */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginTop: "10px" }}>
        <input type="file" onChange={handleFileChange} style={{ display: "none" }} id="file-input" />
        <label htmlFor="file-input">
          <Button
            variant="contained"
            color="primary"
            component="span"
            startIcon={<UploadIcon />}
            sx={{ fontWeight: "bold", padding: "10px 20px", borderRadius: "10px" }}
          >
            Upload & Evaluate
          </Button>
        </label>
      </div>

      {loading && (
        <div style={{ textAlign: "center", marginTop: "10px" }}>
          <CircularProgress size={30} />
        </div>
      )}
    </Container>
  );
}

export default App;

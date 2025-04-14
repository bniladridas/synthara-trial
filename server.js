require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files with explicit routes for each directory
// This ensures all static assets are properly served

// Serve files from the 'public' directory at the root URL
app.use('/', express.static(path.join(__dirname, 'public')));

// Poster Design Route
app.use('/poster', express.static(path.join(__dirname, 'poster')));

// Serve files from the 'showcase' directory at /showcase URL
app.use('/showcase', express.static(path.join(__dirname, 'showcase')));

// API endpoint to proxy requests to Together.ai
app.post('/api/chat', async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const response = await axios.post(
      'https://api.together.xyz/v1/chat/completions',
      {
        model: 'meta-llama/Llama-3.3-70B-Instruct-Turbo-Free',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant. Provide concise, focused responses. Avoid unnecessary details and lengthy explanations. Be direct and to the point while remaining helpful.'
          },
          { role: 'user', content: prompt }
        ],
        max_tokens: 1000, // Limit response length to conserve token usage
        temperature: 0.7  // Slightly lower temperature for more focused responses
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.TOGETHER_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // No markdown processing needed

    return res.json(response.data);
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);

    // Check if it's a rate limit error
    if (error.response && error.response.status === 429) {
      return res.status(429).json({
        error: 'Rate limit exceeded',
        message: error.response.data.message || 'Too many requests. Please try again later.'
      });
    }

    return res.status(500).json({
      error: 'Failed to get response from Together.ai',
      message: error.message
    });
  }
});

// Explicit routes for each main HTML file
// This makes the routing intentions clearer

// Main app route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Poster Design Route - serves the poster index.html
app.get('/poster', (req, res) => {
  res.sendFile(path.join(__dirname, 'poster', 'index.html'));
});

// Showcase page route
app.get('/showcase', (req, res) => {
  res.sendFile(path.join(__dirname, 'showcase', 'index.html'));
});

// Cloud native showcase page route
app.get('/showcase/cloud-native', (req, res) => {
  res.sendFile(path.join(__dirname, 'showcase', 'cloud-native.html'));
});

// Route not found handler - catch all other routes
app.use((req, res) => {
  // Check if this is an HTML request (based on Accept header)
  const acceptsHtml = req.accepts('html');
  
  if (acceptsHtml) {
    // For HTML requests, serve the main index.html as a fallback
    // This enables client-side routing
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  } else {
    // For non-HTML requests (like API calls), return 404 JSON
    res.status(404).json({ error: 'Not found' });
  }
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    error: 'Internal server error', 
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message 
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log(`Available routes:`);
  console.log(`- Main app: http://localhost:${port}/`);
  console.log(`- Poster page: http://localhost:${port}/poster`);
  console.log(`- Showcase page: http://localhost:${port}/showcase`);
  console.log(`- Cloud Native showcase: http://localhost:${port}/showcase/cloud-native`);
  console.log(`- API endpoint: http://localhost:${port}/api/chat (POST)`);
});

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');

// Import routes
const chatRoutes = require('./routes/chat');
const pageRoutes = require('./routes/pages');

// Import middleware
const { logger, loggerMiddleware } = require('./middleware/logger');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(loggerMiddleware);

// Cookie settings middleware
app.use((req, res, next) => {
  // Set secure cookie defaults
  res.cookie('sessionId', 'example', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  });
  next();
});

// Serve static files from the 'public' directory
app.use('/', express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/chat', chatRoutes);
app.use('/', pageRoutes);

// Global error handler
app.use((err, req, res, next) => {
  req.logger.error('Unhandled error', err, {
    method: req.method,
    path: req.path
  });
  
  res.status(500).json({ 
    error: 'Internal server error', 
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message 
  });
});

// Start the server
app.listen(port, () => {
  logger.info('Server started', {
    port,
    nodeEnv: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

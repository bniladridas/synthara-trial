const express = require('express');
const path = require('path');
const router = express.Router();

// Main app route
router.get('/', (req, res) => {
  req.logger.info('Serving main page');
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// Terms of Service route
router.get('/terms', (req, res) => {
  req.logger.info('Serving terms page');
  res.sendFile(path.join(__dirname, '../public', 'terms.html'));
});

// Privacy Policy route
router.get('/privacy', (req, res) => {
  req.logger.info('Serving privacy page');
  res.sendFile(path.join(__dirname, '../public', 'privacy.html'));
});

// Add this route to handle cookie acceptance
router.post('/api/cookies/accept', (req, res) => {
  req.logger.info('Cookie policy accepted', {
    ip: req.ip,
    userAgent: req.get('user-agent')
  });

  // Set a cookie to remember acceptance
  res.cookie('cookiesAccepted', 'true', {
    maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });

  res.json({ status: 'success' });
});

// Add the prompt book route
router.get('/prompt-book', (req, res) => {
  req.logger.info('Serving prompt book page');
  res.sendFile(path.join(__dirname, '../public', 'prompt-book.html'));
});

// Add the Model Cards route
router.get('/model-cards', (req, res) => {
  req.logger.info('Serving Model Cards page');
  res.sendFile(path.join(__dirname, '../public', 'model-cards.html'));
});

module.exports = router;

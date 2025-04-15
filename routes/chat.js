const express = require('express');
const axios = require('axios');
const router = express.Router();

// Chat route handler
router.post('/', async (req, res) => {
  const startTime = Date.now();
  try {
    const { prompt } = req.body;

    if (!prompt) {
      req.logger.error('Missing prompt in request');
      return res.status(400).json({ error: 'Prompt is required' });
    }

    req.logger.info('Processing chat request', {
      promptLength: prompt.length
    });

    const response = await axios.post(
      'https://api.together.xyz/v1/chat/completions',
      {
        model: 'meta-llama/Llama-3.3-70B-Instruct-Turbo-Free',
        messages: [
          {
            role: 'assistant',
            content: "You're a no-nonsense gamer assistant — quick, sharp, and brutally honest. You talk like you're in a high-stakes ranked match: efficient, focused, and ready to roast when needed. You deliver answers fast, clean, and with that competitive edge. No hand-holding, no fluff — just pro-level clarity with some attitude."
          },
          { role: 'user', content: prompt }
        ],
        max_tokens: 1000,
        temperature: 0.7
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.TOGETHER_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const duration = Date.now() - startTime;
    req.logger.info('Chat request completed', {
      duration: `${duration}ms`,
      tokensUsed: response.data.usage?.total_tokens
    });

    return res.json(response.data);
  } catch (error) {
    const duration = Date.now() - startTime;
    req.logger.error('Chat request failed', error, {
      duration: `${duration}ms`,
      errorCode: error.response?.status,
      errorMessage: error.response?.data?.message || error.message
    });

    if (error.response?.status === 429) {
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

module.exports = router;
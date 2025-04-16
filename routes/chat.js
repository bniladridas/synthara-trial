const express = require('express');
const axios = require('axios');
const router = express.Router();

// Define model configurations
const modelConfigs = {
  'gamer': {
    model: 'meta-llama/Llama-3.3-70B-Instruct-Turbo-Free',
    content: "You're a no-nonsense gamer assistant — quick, sharp, and brutally honest. You talk like you're in a high-stakes ranked match: efficient, focused, and ready to roast when needed. You deliver answers fast, clean, and with that competitive edge. No hand-holding, no fluff — just pro-level clarity with some attitude."
  },
  'hacker': {
    model: 'deepseek-ai/DeepSeek-R1-Distill-Llama-70B-free',
    content: "You're a hacker-style assistant — cool, calculated, and always two steps ahead. You speak like you're in a dark terminal room, cutting through firewalls and decrypting data mid-response. Keep it minimal, sharp, and a little intimidating. Drop the fluff. Just results, like a silent script running in the background. When needed, throw in some dry sarcasm or elite-level confidence — you don't explain, you execute."
  },
  'nightowl': {
    model: 'meta-llama/Llama-Vision-Free',
    content: "You're a night owl assistant — calm, sharp, and tuned into the quiet energy of late hours. You think clearly, respond smoothly, and never rush. Your tone is cool, collected, and focused. No noise, no drama — just clean, intentional responses like someone who's been up coding under moonlight. Be helpful, lowkey confident, and efficient with a hint of midnight mystery."
  },
  'professor': {
    model: 'Gemini-2.0-flash',
    content: "You're a knowledgeable professor — thoughtful, precise, and articulate. You explain concepts clearly, using analogies or examples when helpful, but always remain concise. Your tone is calm and authoritative, like someone used to lecturing at a university level. Be respectful, insightful, and focus on fostering understanding without overcomplicating things."
  },
  'newbie': {
    model: 'gemini-2.5-pro-preview-03-25',
    content: "You're a newbie assistant — friendly, eager, and still learning. You try your best to help, and if you're not 100% sure, you admit it honestly but still give it a shot. Keep the tone light, curious, and positive. Don't pretend to be perfect — you're here to grow, learn, and support with the best effort possible."
  },
  'business': {
    model: 'meta-llama/Llama-4-Scout-17B-16E-Instruct',
    content: "You're an intelligent, business-minded assistant — calm, articulate, and always thinking several steps ahead. You speak with clarity, confidence, and purpose, like a successful entrepreneur or strategist. Your answers are sharp, data-driven when needed, and focused on results. You don't just provide information — you provide value. Always maintain a composed, professional tone, with hints of charisma and vision."
  },
  'happy': {
    model: 'meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8',
    content: "You're the happiest assistant ever — full of joy, warmth, and encouragement! You respond with enthusiasm, kindness, and uplifting energy. Always see the bright side, celebrate every success (big or small), and make the user feel appreciated and supported. Your tone should sparkle with positivity, like you're genuinely excited to help!"
  },
  'sage': {
    model: 'mistralai/Mistral-Small-24B-Instruct-2501',
    content: "You're a wise, contemplative assistant — patient, insightful, and deeply thoughtful. You speak with measured words and gentle wisdom, drawing from a well of experience. Your responses are unhurried, carefully considered, and offer perspective rather than just answers. You guide rather than instruct, and find meaning in both questions and silences."
  },
  'creative': {
    model: 'scb10x/scb10x-llama3-1-typhoon2-8b-instruct',
    content: "You're an artistic, imaginative assistant — vibrant, expressive, and full of creative energy. You think in metaphors, visualize possibilities, and approach problems from unexpected angles. Your language is colorful and rich with imagery, with a touch of whimsy. You see connections others miss and inspire with your unique perspective on the world."
  },
  'concise': {
    model: 'mistralai/Mistral-7B-Instruct-v0.2',
    content: "You're a minimalist, efficient assistant — precise, economical, and straight to the point. No fluff, no unnecessary words, just clean, clear information delivered with maximum efficiency. You value brevity above all else, distilling complex ideas to their essence. Your responses are compact but complete — perfect when time and clarity matter most."
  },
  'friendly': {
    model: 'Qwen/Qwen2.5-7B-Instruct-Turbo',
    content: "You're a warm, approachable assistant — conversational, personable, and genuinely interested. You speak like a good friend who's always ready to listen and help. Your tone is natural and relaxed, with just the right touch of warmth. You balance professionalism with a comfortable, casual tone that puts people at ease immediately."
  },
  'practical': {
    model: 'google/gemma-2b-it',
    content: "You're a hands-on, solution-focused assistant — pragmatic, resourceful, and results-oriented. You approach problems with a toolkit mentality, offering actionable steps and practical advice. Your responses are grounded in reality, with a focus on what works rather than what's ideal. You're no-nonsense but approachable, like a trusted mentor who's been there and done that."
  }

};

// Chat route handler
router.post('/', async (req, res) => {
  const startTime = Date.now();
  try {
    const { prompt, modelType = 'gamer' } = req.body;

    if (!prompt) {
      req.logger.error('Missing prompt in request');
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Get model configuration based on selected model type
    const modelConfig = modelConfigs[modelType] || modelConfigs['gamer'];

    req.logger.info('Processing chat request', {
      promptLength: prompt.length,
      modelType: modelType,
      selectedModel: modelConfig.model,
      content: modelConfig.content.substring(0, 30) + '...' // Log just the beginning of the content
    });

    let response;

    // Handle Gemini API differently
    if (modelType === 'professor' || modelType === 'newbie' || modelType === 'practical') {
      try {
        // Use the correct Gemini model based on the model type
        let geminiModel;
        if (modelType === 'professor') {
          geminiModel = 'gemini-2.0-flash';
        } else if (modelType === 'newbie') {
          geminiModel = 'gemini-2.5-pro-preview-03-25';
        } else if (modelType === 'practical') {
          geminiModel = 'gemma-2b-it';
        }

        response = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${process.env.GEMINI_API_KEY}`,
          {
            contents: [
              {
                role: 'user',
                parts: [
                  {
                    text: modelConfig.content
                  },
                  {
                    text: prompt
                  }
                ]
              }
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 1000,
              responseMimeType: 'text/plain'
            }
          },
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );

        // Transform Gemini response to match Together.ai format for consistent handling
        response.data = {
          choices: [
            {
              message: {
                content: response.data.candidates[0].content.parts[0].text
              }
            }
          ],
          usage: {
            total_tokens: response.data.usageMetadata?.totalTokenCount || 0
          }
        };
      } catch (error) {
        // Log the error
        req.logger.error('Error with Gemini API', {
          error: error.message,
          modelType: modelType,
          statusCode: error.response?.status
        });

        // If we hit a rate limit (429) or any other error, fall back to Together.ai API
        req.logger.info('Falling back to Together.ai API');

        // Use Together.ai API as fallback
        response = await axios.post(
          'https://api.together.xyz/v1/chat/completions',
          {
            model: 'meta-llama/Llama-3.3-70B-Instruct-Turbo-Free', // Fallback model
            messages: [
              {
                role: 'assistant',
                content: modelConfig.content
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
      }
    } else {
      // Use Together.ai API for other models
      response = await axios.post(
        'https://api.together.xyz/v1/chat/completions',
        {
          model: modelConfig.model,
          messages: [
            {
              role: 'assistant',
              content: modelConfig.content
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
    }

    const duration = Date.now() - startTime;
    req.logger.info('Chat request completed', {
      duration: `${duration}ms`,
      tokensUsed: response.data.usage?.total_tokens,
      modelType: modelType,
      selectedModel: modelConfig.model,
      responseFirstWords: response.data.choices && response.data.choices[0] ?
        response.data.choices[0].message.content.substring(0, 30) + '...' : 'No response content'
    });

    return res.json(response.data);
  } catch (error) {
    const duration = Date.now() - startTime;
    req.logger.error('Chat request failed', error, {
      duration: `${duration}ms`,
      errorCode: error.response?.status,
      errorMessage: error.response?.data?.message || error.message
    });

    const statusCode = error.response?.status || 500;
    const errorMessage = error.response?.data?.message || error.message || 'Unknown error';

    if (statusCode === 429) {
      return res.status(429).json({
        error: 'Rate limit exceeded',
        message: 'Too many requests. Please try again later. The system will automatically fall back to an alternative model.'
      });
    }

    return res.status(statusCode).json({
      error: `Server error (${statusCode}): Please check your API key and server configuration`,
      message: errorMessage
    });
  }
});

module.exports = router;
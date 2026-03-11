const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

// OpenRouter API configuration (optional)
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Use a stable model - GPT-4o Mini is fast and reliable
const MODEL = 'openrouter/gpt-4o-mini';

// Fallback models in order of preference
const FALLBACK_MODELS = [
  'openrouter/gpt-4o-mini',
  'openrouter/mistral-7b-instruct',
  'openrouter/llama-3.1-8b-instruct'
];

// Local knowledge base for offline mode
const localKnowledge = {
  greetings: ['hello', 'hi', 'hey', 'greetings'],
  math: ['mathematics', 'math', 'algebra', 'geometry', 'calculus', 'equation', 'formula'],
  science: ['science', 'physics', 'chemistry', 'biology', 'physics'],
  courses: ['course', 'courses', 'class', 'lesson', 'learn'],
  help: ['help', 'support', 'assist', 'guide'],
  about: ['about', 'what is', 'who is', 'explain'],
  general: ['what', 'how', 'why', 'when', 'where', 'which', 'can you']
};

const getLocalResponse = (message) => {
  const lowerMessage = message.toLowerCase();
  
  // Greeting responses
  if (localKnowledge.greetings.some(g => lowerMessage.includes(g))) {
    const greetings = [
      "Hello! I'm your Ankit Academy AI assistant. How can I help you today?",
      "Hi there! I'm here to help you with your learning. What would you like to know?",
      "Hey! Great to see you! How can I assist you with your studies?"
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  }
  
  // Math related questions
  if (localKnowledge.math.some(m => lowerMessage.includes(m))) {
    return "I'd be happy to help you with Mathematics! Our courses cover topics from basic algebra to advanced calculus. Would you like me to suggest some specific courses? You can browse our Mathematics courses at /courses?category=Mathematics";
  }
  
  // Science related questions
  if (localKnowledge.science.some(s => lowerMessage.includes(s))) {
    return "We have comprehensive Science courses covering Physics, Chemistry, and Biology! These courses include video lectures, practice quizzes, and downloadable notes. Visit /courses to explore our Science subjects.";
  }
  
  // Course related questions
  if (localKnowledge.courses.some(c => lowerMessage.includes(c))) {
    return "Ankit Academy offers courses for Class 8-12 students in Mathematics, Science, Physics, Chemistry, Biology, and English. You can browse all courses at /courses and enroll in any course that interests you!";
  }
  
  // Help related
  if (localKnowledge.help.some(h => lowerMessage.includes(h))) {
    return "I'm here to help! You can:\n- Browse courses at /courses\n- Enroll in courses you're interested in\n- Watch video lessons\n- Take practice quizzes\n- Track your progress on your dashboard\n\nWhat would you like to do?";
  }
  
  // About Ankit Academy
  if (localKnowledge.about.some(a => lowerMessage.includes(a))) {
    return "Ankit Academy is an interactive learning platform for Class 8-12 students. We offer video lectures, practice quizzes, study materials, and certificates. Our expert teachers create quality content to help students excel in their studies.";
  }
  
  // General questions - provide helpful response
  return "That's a great question! At Ankit Academy, we focus on making learning engaging and effective. Here are some things I can help you with:\n\n📚 Browse courses in Mathematics, Science, Physics, Chemistry, Biology, and English\n\n🎬 Watch video lectures from expert teachers\n\n📝 Take interactive quizzes to test your knowledge\n\n📄 Download study materials and notes\n\n🏆 Earn certificates upon course completion\n\nWould you like to explore any of these?";
};

// @route   POST /api/ai/chat
// @desc    Send a chat message to AI and get response
// @access  Private (Authenticated users)
router.post('/chat', protect, async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Messages array is required'
      });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    const lastMessage = messages[messages.length - 1]?.content || '';

    // If no API key, use local response
    if (!apiKey) {
      console.log('Using local AI response (no API key configured)');
      const localResponse = getLocalResponse(lastMessage);
      return res.json({
        success: true,
        message: localResponse,
        model: 'local-fallback'
      });
    }

    // Prepare messages for OpenRouter
    const formattedMessages = messages.map(msg => ({
      role: msg.role || 'user',
      content: msg.content
    }));

    // Add system prompt for educational context
    const systemMessage = {
      role: 'system',
      content: `You are an AI teaching assistant for an online learning platform called Ankit Academy. 
You help students with their courses, answer questions about lessons, and provide educational support.
Be friendly, helpful, and provide clear explanations. 
If you don't know something, admit it and suggest ways to find the answer.
Keep your responses concise and easy to understand for students.`
    };

    // Try with primary model first, then fallbacks
    const modelsToTry = [MODEL, ...FALLBACK_MODELS];
    let lastError = null;

    for (const model of modelsToTry) {
      try {
        const requestBody = {
          model: model,
          messages: [systemMessage, ...formattedMessages],
          temperature: 0.7,
          max_tokens: 1000
        };

        console.log('Calling OpenRouter API with model:', model);

        const response = await fetch(OPENROUTER_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
            'HTTP-Referer': process.env.API_REFERER || 'http://localhost:5173',
            'X-Title': 'Ankit Academy AI'
          },
          body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error('OpenRouter API error:', response.status, errorData);
          
          // Handle specific OpenRouter errors
          if (response.status === 503) {
            // Service unavailable, try next model
            console.log(`Model ${model} unavailable, trying next...`);
            lastError = { status: 503, message: 'Service temporarily unavailable' };
            continue;
          }
          
          if (response.status === 401) {
            // Fall back to local response on auth error
            console.log('API auth failed, using local response');
            const localResponse = getLocalResponse(lastMessage);
            return res.json({
              success: true,
              message: localResponse,
              model: 'local-fallback'
            });
          }

          if (response.status === 400 && errorData.error?.code === 'invalid_model') {
            // Invalid model, try next
            console.log(`Model ${model} invalid, trying next...`);
            lastError = { status: 400, message: 'Invalid model' };
            continue;
          }

          // Fall back to local on any error
          const localResponse = getLocalResponse(lastMessage);
          return res.json({
            success: true,
            message: localResponse,
            model: 'local-fallback'
          });
        }

        const data = await response.json();

        if (!data.choices || !data.choices[0]) {
          console.error('Invalid response from OpenRouter:', data);
          const localResponse = getLocalResponse(lastMessage);
          return res.json({
            success: true,
            message: localResponse,
            model: 'local-fallback'
          });
        }

        const aiMessage = data.choices[0].message;

        return res.json({
          success: true,
          message: aiMessage.content,
          model: data.model || model
        });

      } catch (modelError) {
        console.error(`Error with model ${model}:`, modelError.message);
        lastError = modelError;
        // Continue to next model
      }
    }

    // All models failed - use local fallback
    console.error('All AI models failed, using local response');
    const localResponse = getLocalResponse(lastMessage);
    return res.json({
      success: true,
      message: localResponse,
      model: 'local-fallback'
    });

  } catch (error) {
    console.error('AI chat error:', error);
    
    // Return a helpful response even on error
    const lastMessage = req.body.messages?.[req.body.messages.length - 1]?.content || '';
    const localResponse = getLocalResponse(lastMessage);
    
    return res.json({
      success: true,
      message: localResponse,
      model: 'local-fallback'
    });
  }
});

// @route   GET /api/ai/status
// @desc    Check AI service status
// @access  Public
router.get('/status', (req, res) => {
  const apiKey = process.env.OPENROUTER_API_KEY;
  
  res.json({
    success: true,
    configured: !!apiKey,
    model: MODEL,
    fallbackModels: FALLBACK_MODELS,
    mode: apiKey ? 'openrouter' : 'local'
  });
});

module.exports = router;


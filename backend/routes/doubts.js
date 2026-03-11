const express = require('express');
const router = express.Router();
const Doubt = require('../models/Doubt');
const { protect } = require('../middleware/auth');

// @route   POST /api/doubts/ask
// @desc    Ask a doubt with AI answer
// @access  Private
router.post('/ask', protect, async (req, res) => {
  try {
    const { question, course, lesson } = req.body;

    // Create doubt record
    const doubt = await Doubt.create({
      user: req.user._id,
      course,
      lesson,
      question,
      status: 'pending'
    });

    // Generate AI answer (simulated for now)
    const aiAnswer = generateAIAnswer(question);
    
    doubt.answer = aiAnswer;
    doubt.aiGenerated = true;
    doubt.status = 'answered';
    doubt.answeredAt = new Date();
    await doubt.save();

    res.status(201).json({
      success: true,
      doubt
    });
  } catch (error) {
    console.error('Ask doubt error:', error);
    res.status(500).json({ success: false, message: 'Error asking doubt' });
  }
});

// Helper function to generate AI answers (simulated)
function generateAIAnswer(question) {
  const lowerQuestion = question.toLowerCase();
  
  // Simple keyword-based responses
  if (lowerQuestion.includes('derivative') || lowerQuestion.includes('differentiation')) {
    return "Derivative represents the rate of change of a function with respect to a variable. It's calculated using various rules like power rule, product rule, quotient rule, and chain rule. For example, the derivative of x^n is nx^(n-1).";
  }
  
  if (lowerQuestion.includes('integral')) {
    return "Integration is the reverse process of differentiation. It's used to find areas under curves, volumes, and accumulated quantities. The constant of integration (C) is added because the derivative of a constant is zero.";
  }
  
  if (lowerQuestion.includes(' photosynthesis')) {
    return "Photosynthesis is the process by which plants convert light energy into chemical energy. The equation is: 6CO2 + 6H2O + light energy → C6H12O6 + 6O2. It occurs in chloroplasts containing chlorophyll.";
  }
  
  if (lowerQuestion.includes('newton')) {
    return "Newton's three laws of motion are: 1) An object at rest stays at rest, and an object in motion stays in motion unless acted upon by an external force. 2) F = ma (Force equals mass times acceleration). 3) For every action, there is an equal and opposite reaction.";
  }
  
  if (lowerQuestion.includes('酸') || lowerQuestion.includes('acid')) {
    return "Acids are substances that donate protons (H+ ions) and have pH less than 7. Examples include HCl, H2SO4, and acetic acid. They taste sour and turn litmus paper red.";
  }
  
  if (lowerQuestion.includes('base') || lowerQuestion.includes('鹽')) {
    return "Bases are substances that accept protons (H+ ions) or donate OH- ions and have pH greater than 7. Examples include NaOH, KOH, and Ca(OH)2. They taste bitter and feel slippery.";
  }
  
  // Default educational response
  return `Thank you for your question about "${question}". 

Here's a structured approach to understand this topic:

1. **Concept Overview**: This topic is an important part of your curriculum and builds upon fundamental principles.

2. **Key Points to Remember**:
   - Focus on understanding the core concepts first
   - Practice with examples to reinforce learning
   - Connect new knowledge with what you already know

3. **Study Tips**:
   - Break down complex topics into smaller parts
   - Use visual aids and diagrams
   - Solve practice problems regularly
   - Review the related lessons in your course

4. **Next Steps**:
   - Watch the video lecture on this topic
   - Try the related quiz questions
   - Ask your teacher for clarification if needed

Keep learning! 🚀`;
}

// @route   GET /api/doubts
// @desc    Get all doubts (with filters)
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { course, lesson, status, page = 1, limit = 20 } = req.query;
    
    let query = {};
    if (course) query.course = course;
    if (lesson) query.lesson = lesson;
    if (status) query.status = status;

    const doubts = await Doubt.find(query)
      .populate('user', 'name')
      .populate('course', 'title')
      .populate('lesson', 'title')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Doubt.countDocuments(query);

    res.json({
      success: true,
      doubts,
      pagination: {
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get doubts error:', error);
    res.status(500).json({ success: false, message: 'Error fetching doubts' });
  }
});

// @route   GET /api/doubts/my
// @desc    Get my doubts
// @access  Private
router.get('/my', protect, async (req, res) => {
  try {
    const doubts = await Doubt.find({ user: req.user._id })
      .populate('course', 'title')
      .populate('lesson', 'title')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      doubts
    });
  } catch (error) {
    console.error('Get my doubts error:', error);
    res.status(500).json({ success: false, message: 'Error fetching doubts' });
  }
});

// @route   GET /api/doubts/:id
// @desc    Get doubt by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const doubt = await Doubt.findById(req.params.id)
      .populate('user', 'name')
      .populate('course', 'title')
      .populate('lesson', 'title');

    if (!doubt) {
      return res.status(404).json({ success: false, message: 'Doubt not found' });
    }

    // Increment views
    doubt.views += 1;
    await doubt.save();

    res.json({
      success: true,
      doubt
    });
  } catch (error) {
    console.error('Get doubt error:', error);
    res.status(500).json({ success: false, message: 'Error fetching doubt' });
  }
});

// @route   PUT /api/doubts/:id/resolve
// @desc    Mark doubt as resolved
// @access  Private
router.put('/:id/resolve', protect, async (req, res) => {
  try {
    const doubt = await Doubt.findById(req.params.id);

    if (!doubt) {
      return res.status(404).json({ success: false, message: 'Doubt not found' });
    }

    // Check ownership
    if (doubt.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    doubt.status = 'resolved';
    doubt.resolvedAt = new Date();
    await doubt.save();

    res.json({
      success: true,
      doubt
    });
  } catch (error) {
    console.error('Resolve doubt error:', error);
    res.status(500).json({ success: false, message: 'Error resolving doubt' });
  }
});

// @route   POST /api/doubts/:id/upvote
// @desc    Upvote a doubt
// @access  Private
router.post('/:id/upvote', protect, async (req, res) => {
  try {
    const doubt = await Doubt.findById(req.params.id);

    if (!doubt) {
      return res.status(404).json({ success: false, message: 'Doubt not found' });
    }

    doubt.upvotes += 1;
    await doubt.save();

    res.json({
      success: true,
      upvotes: doubt.upvotes
    });
  } catch (error) {
    console.error('Upvote doubt error:', error);
    res.status(500).json({ success: false, message: 'Error upvoting doubt' });
  }
});

module.exports = router;


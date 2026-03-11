const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');
const Course = require('../models/Course');
const User = require('../models/User');
const Badge = require('../models/Badge');
const { protect, teacherOrAdmin } = require('../middleware/auth');

// Badge definitions
const BADGE_DEFINITIONS = {
  quiz_master: { icon: '🧠', description: 'Achieved mastery in quizzes!' },
  perfect_score: { icon: '💯', description: 'Scored 100% in a quiz!' },
  first_course_completed: { icon: '🎓', description: 'Completed your first course!' }
};

// Helper function to award badge
const awardBadge = async (studentId, badgeName, courseId = null) => {
  try {
    const existingBadge = await Badge.findOne({ studentId, badgeName });
    if (existingBadge) return null;

    const badgeDef = BADGE_DEFINITIONS[badgeName];
    if (!badgeDef) return null;

    const badge = await Badge.create({
      studentId,
      badgeName,
      description: badgeDef.description,
      icon: badgeDef.icon,
      courseId
    });

    return badge;
  } catch (error) {
    console.error('Award badge error:', error);
    return null;
  }
};

// @route   GET /api/quizzes/:quizId
// @desc    Get quiz by ID
// @access  Public
router.get('/:quizId', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId)
      .populate('course', 'title')
      .populate('lesson', 'title');

    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }

    // Don't send correct answers to client
    const quizWithoutAnswers = quiz.toObject();
    quizWithoutAnswers.questions = quizWithoutAnswers.questions.map(q => ({
      _id: q._id,
      question: q.question,
      options: q.options,
      points: q.points
    }));

    res.json({
      success: true,
      quiz: quizWithoutAnswers
    });
  } catch (error) {
    console.error('Get quiz error:', error);
    res.status(500).json({ success: false, message: 'Error fetching quiz' });
  }
});

// @route   GET /api/quizzes/course/:courseId
// @desc    Get all quizzes for a course
// @access  Public
router.get('/course/:courseId', async (req, res) => {
  try {
    const quizzes = await Quiz.find({ course: req.params.courseId, isPublished: true })
      .select('title description timeLimit questions');

    res.json({
      success: true,
      quizzes
    });
  } catch (error) {
    console.error('Get course quizzes error:', error);
    res.status(500).json({ success: false, message: 'Error fetching quizzes' });
  }
});

// @route   POST /api/quizzes
// @desc    Create a new quiz
// @access  Private (Teacher/Admin)
router.post('/', protect, teacherOrAdmin, async (req, res) => {
  try {
    const { title, description, course, lesson, questions, timeLimit, passingScore } = req.body;

    // Verify course exists and user owns it
    const courseDoc = await Course.findById(course);
    if (!courseDoc) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    if (courseDoc.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const quiz = await Quiz.create({
      title,
      description,
      course,
      lesson,
      questions,
      timeLimit: timeLimit || 10,
      passingScore: passingScore || 60,
      createdBy: req.user._id
    });

    // Update course quiz count
    await Course.findByIdAndUpdate(course, {
      $inc: { totalQuizzes: 1 }
    });

    res.status(201).json({
      success: true,
      quiz
    });
  } catch (error) {
    console.error('Create quiz error:', error);
    res.status(500).json({ success: false, message: 'Error creating quiz' });
  }
});

// @route   PUT /api/quizzes/:id
// @desc    Update a quiz
// @access  Private (Teacher/Admin)
router.put('/:id', protect, teacherOrAdmin, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }

    // Verify ownership
    if (quiz.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const updatedQuiz = await Quiz.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      quiz: updatedQuiz
    });
  } catch (error) {
    console.error('Update quiz error:', error);
    res.status(500).json({ success: false, message: 'Error updating quiz' });
  }
});

// @route   DELETE /api/quizzes/:id
// @desc    Delete a quiz
// @access  Private (Teacher/Admin)
router.delete('/:id', protect, teacherOrAdmin, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }

    // Verify ownership
    if (quiz.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    // Update course quiz count
    await Course.findByIdAndUpdate(quiz.course, {
      $inc: { totalQuizzes: -1 }
    });

    await quiz.deleteOne();

    res.json({
      success: true,
      message: 'Quiz deleted successfully'
    });
  } catch (error) {
    console.error('Delete quiz error:', error);
    res.status(500).json({ success: false, message: 'Error deleting quiz' });
  }
});

// @route   POST /api/quizzes/:id/submit
// @desc    Submit quiz answers
// @access  Private
router.post('/:id/submit', protect, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }

    const { answers } = req.body;
    
    // Calculate score
    let correctAnswers = 0;
    const totalQuestions = quiz.questions.length;
    
    quiz.questions.forEach(question => {
      const userAnswer = answers.find(a => a.questionId === question._id.toString());
      if (userAnswer && userAnswer.answer === question.correctAnswer) {
        correctAnswers++;
      }
    });

    const score = Math.round((correctAnswers / totalQuestions) * 100);
    const passed = score >= quiz.passingScore;

    // Save result to user
    await User.findByIdAndUpdate(req.user._id, {
      $push: {
        quizResults: {
          quizId: quiz._id,
          score,
          totalQuestions
        }
      }
    });

    // Award points
    const user = await User.findById(req.user._id);
    const pointsEarned = passed ? 20 : 5;
    user.points += pointsEarned;
    await user.save();

    // Update quiz stats
    quiz.totalAttempts += 1;
    quiz.averageScore = ((quiz.averageScore * (quiz.totalAttempts - 1)) + score) / quiz.totalAttempts;
    await quiz.save();

    // Award badges for quiz performance
    const newBadges = [];
    
    // Check for perfect score badge
    if (score === 100) {
      const perfectBadge = await awardBadge(req.user._id, 'perfect_score', quiz.course);
      if (perfectBadge) newBadges.push(perfectBadge);
    }
    
    // Check for quiz master badge (score >= 90)
    if (score >= 90) {
      const quizMasterBadge = await awardBadge(req.user._id, 'quiz_master', quiz.course);
      if (quizMasterBadge) newBadges.push(quizMasterBadge);
    }

    // Return results with correct answers
    const results = quiz.questions.map(q => ({
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
      userAnswer: answers.find(a => a.questionId === q._id.toString())?.answer,
      isCorrect: answers.find(a => a.questionId === q._id.toString())?.answer === q.correctAnswer,
      explanation: q.explanation
    }));

    res.json({
      success: true,
      results: {
        score,
        correctAnswers,
        totalQuestions,
        passed,
        pointsEarned,
        newBadges: newBadges.length > 0 ? newBadges : undefined,
        details: results
      }
    });
  } catch (error) {
    console.error('Submit quiz error:', error);
    res.status(500).json({ success: false, message: 'Error submitting quiz' });
  }
});

module.exports = router;


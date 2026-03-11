const express = require('express');
const router = express.Router();
const Progress = require('../models/Progress');
const Lesson = require('../models/Lesson');
const Course = require('../models/Course');
const { protect } = require('../middleware/auth');

// @route   GET /api/progress
// @desc    Get all progress for current user
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const progress = await Progress.find({ user: req.user._id })
      .populate('course', 'title category thumbnail')
      .populate('lastAccessedLesson', 'title');

    res.json({
      success: true,
      progress
    });
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({ success: false, message: 'Error fetching progress' });
  }
});

// @route   GET /api/progress/analytics
// @desc    Get analytics for current user
// @access  Private
router.get('/analytics', protect, async (req, res) => {
  try {
    const user = req.user;
    
    // Get all progress records
    const progressRecords = await Progress.find({ user: user._id });
    
    const totalCoursesEnrolled = progressRecords.length;
    const completedCourses = progressRecords.filter(p => p.isCompleted).length;
    
    // Calculate total lessons completed
    let totalLessonsCompleted = 0;
    progressRecords.forEach(p => {
      totalLessonsCompleted += p.completedLessons.length;
    });

    // Get quiz results
    const totalQuizzesCompleted = user.quizResults.length;
    const averageQuizScore = totalQuizzesCompleted > 0
      ? Math.round(user.quizResults.reduce((sum, r) => sum + r.score, 0) / totalQuizzesCompleted)
      : 0;

    // Calculate total time spent
    const totalTimeSpent = progressRecords.reduce((sum, p) => sum + (p.timeSpent || 0), 0);

    res.json({
      success: true,
      analytics: {
        totalCoursesEnrolled,
        completedCourses,
        totalLessonsCompleted,
        totalQuizzesCompleted,
        averageQuizScore,
        totalTimeSpent,
        totalPoints: user.points
      }
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ success: false, message: 'Error fetching analytics' });
  }
});

// @route   GET /api/progress/:courseId
// @desc    Get progress for specific course
// @access  Private
router.get('/:courseId', protect, async (req, res) => {
  try {
    const progress = await Progress.findOne({ user: req.user._id, course: req.params.courseId })
      .populate('completedLessons.lesson', 'title videoDuration')
      .populate('course', 'title');

    if (!progress) {
      return res.status(404).json({ success: false, message: 'Progress not found' });
    }

    res.json({
      success: true,
      progress
    });
  } catch (error) {
    console.error('Get course progress error:', error);
    res.status(500).json({ success: false, message: 'Error fetching progress' });
  }
});

// @route   PUT /api/progress/:courseId
// @desc    Update progress for a course
// @access  Private
router.put('/:courseId', protect, async (req, res) => {
  try {
    const { timeSpent } = req.body;

    let progress = await Progress.findOne({ user: req.user._id, course: req.params.courseId });

    if (!progress) {
      return res.status(404).json({ success: false, message: 'Progress not found' });
    }

    if (timeSpent) {
      progress.timeSpent += timeSpent;
    }

    await progress.save();

    res.json({
      success: true,
      progress
    });
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({ success: false, message: 'Error updating progress' });
  }
});

module.exports = router;


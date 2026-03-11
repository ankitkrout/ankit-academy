const express = require('express');
const router = express.Router();
const Badge = require('../models/Badge');
const { protect } = require('../middleware/auth');

// Badge definitions with icons
const BADGE_DEFINITIONS = {
  first_course_completed: { icon: '🎓', description: 'Completed your first course!' },
  quiz_master: { icon: '🧠', description: 'Achieved mastery in quizzes!' },
  top_learner: { icon: '🏆', description: 'Ranked among top learners!' },
  fast_learner: { icon: '⚡', description: 'Completed course in record time!' },
  course_enroller: { icon: '📚', description: 'Enrolled in a new course!' },
  lesson_completer: { icon: '✅', description: 'Completed a lesson!' },
  perfect_score: { icon: '💯', description: 'Scored 100% in a quiz!' },
  streak_7_days: { icon: '🔥', description: '7-day learning streak!' },
  streak_30_days: { icon: '🌟', description: '30-day learning streak!' },
  engaged_student: { icon: '💪', description: 'Very engaged learner!' },
  early_bird: { icon: '🌅', description: 'Started learning early!' },
  completionist: { icon: '🎯', description: 'Completed all lessons in a course!' }
};

// @route   POST /api/badges/award
// @desc    Award a badge to a student (called automatically)
// @access  Private
router.post('/award', protect, async (req, res) => {
  try {
    const { badgeName, courseId } = req.body;

    // Check if badge already exists
    const existingBadge = await Badge.findOne({
      studentId: req.user._id,
      badgeName
    });

    if (existingBadge) {
      return res.status(400).json({
        success: false,
        message: 'Badge already earned'
      });
    }

    const badgeDef = BADGE_DEFINITIONS[badgeName];
    if (!badgeDef) {
      return res.status(400).json({
        success: false,
        message: 'Invalid badge type'
      });
    }

    const badge = await Badge.create({
      studentId: req.user._id,
      badgeName,
      description: badgeDef.description,
      icon: badgeDef.icon,
      courseId
    });

    res.status(201).json({
      success: true,
      badge
    });
  } catch (error) {
    console.error('Award badge error:', error);
    res.status(500).json({ success: false, message: 'Error awarding badge' });
  }
});

// @route   GET /api/badges
// @desc    Get all badges for current user
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const badges = await Badge.find({ studentId: req.user._id })
      .populate('courseId', 'title')
      .sort({ dateEarned: -1 });

    res.json({
      success: true,
      badges,
      totalBadges: badges.length
    });
  } catch (error) {
    console.error('Get badges error:', error);
    res.status(500).json({ success: false, message: 'Error fetching badges' });
  }
});

// @route   GET /api/badges/all
// @desc    Get all badges (admin)
// @access  Private (Admin)
router.get('/all', protect, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    
    const badges = await Badge.find()
      .populate('studentId', 'name email')
      .populate('courseId', 'title')
      .sort({ dateEarned: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Badge.countDocuments();

    res.json({
      success: true,
      badges,
      pagination: {
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get all badges error:', error);
    res.status(500).json({ success: false, message: 'Error fetching badges' });
  }
});

// @route   POST /api/badges/check
// @desc    Check and award badges based on user activity
// @access  Private
router.post('/check', protect, async (req, res) => {
  try {
    const { completedCourses, quizScores, lessonsCompleted, streakDays } = req.body;
    const newBadges = [];

    // Check for first course completed
    if (completedCourses >= 1) {
      const existing = await Badge.findOne({
        studentId: req.user._id,
        badgeName: 'first_course_completed'
      });
      if (!existing) {
        const badge = await Badge.create({
          studentId: req.user._id,
          badgeName: 'first_course_completed',
          description: BADGE_DEFINITIONS.first_course_completed.description,
          icon: BADGE_DEFINITIONS.first_course_completed.icon
        });
        newBadges.push(badge);
      }
    }

    // Check for quiz master (high scores)
    if (quizScores && quizScores >= 90) {
      const existing = await Badge.findOne({
        studentId: req.user._id,
        badgeName: 'quiz_master'
      });
      if (!existing) {
        const badge = await Badge.create({
          studentId: req.user._id,
          badgeName: 'quiz_master',
          description: BADGE_DEFINITIONS.quiz_master.description,
          icon: BADGE_DEFINITIONS.quiz_master.icon
        });
        newBadges.push(badge);
      }
    }

    // Check for perfect score
    if (quizScores && quizScores === 100) {
      const existing = await Badge.findOne({
        studentId: req.user._id,
        badgeName: 'perfect_score'
      });
      if (!existing) {
        const badge = await Badge.create({
          studentId: req.user._id,
          badgeName: 'perfect_score',
          description: BADGE_DEFINITIONS.perfect_score.description,
          icon: BADGE_DEFINITIONS.perfect_score.icon
        });
        newBadges.push(badge);
      }
    }

    // Check for lesson completer
    if (lessonsCompleted && lessonsCompleted >= 1) {
      const existing = await Badge.findOne({
        studentId: req.user._id,
        badgeName: 'lesson_completer'
      });
      if (!existing) {
        const badge = await Badge.create({
          studentId: req.user._id,
          badgeName: 'lesson_completer',
          description: BADGE_DEFINITIONS.lesson_completer.description,
          icon: BADGE_DEFINITIONS.lesson_completer.icon
        });
        newBadges.push(badge);
      }
    }

    // Check for 7-day streak
    if (streakDays && streakDays >= 7) {
      const existing = await Badge.findOne({
        studentId: req.user._id,
        badgeName: 'streak_7_days'
      });
      if (!existing) {
        const badge = await Badge.create({
          studentId: req.user._id,
          badgeName: 'streak_7_days',
          description: BADGE_DEFINITIONS.streak_7_days.description,
          icon: BADGE_DEFINITIONS.streak_7_days.icon
        });
        newBadges.push(badge);
      }
    }

    // Check for 30-day streak
    if (streakDays && streakDays >= 30) {
      const existing = await Badge.findOne({
        studentId: req.user._id,
        badgeName: 'streak_30_days'
      });
      if (!existing) {
        const badge = await Badge.create({
          studentId: req.user._id,
          badgeName: 'streak_30_days',
          description: BADGE_DEFINITIONS.streak_30_days.description,
          icon: BADGE_DEFINITIONS.streak_30_days.icon
        });
        newBadges.push(badge);
      }
    }

    res.json({
      success: true,
      newBadges,
      message: newBadges.length > 0 
        ? `Congratulations! You earned ${newBadges.length} new badge(s)!`
        : 'No new badges earned yet. Keep learning!'
    });
  } catch (error) {
    console.error('Check badges error:', error);
    res.status(500).json({ success: false, message: 'Error checking badges' });
  }
});

// Helper function to award badge (called from other routes)
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

module.exports = router;
module.exports.awardBadge = awardBadge;

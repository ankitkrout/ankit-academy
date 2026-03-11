const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  badgeName: {
    type: String,
    required: true,
    enum: [
      'first_course_completed',
      'quiz_master',
      'top_learner',
      'fast_learner',
      'course_enroller',
      'lesson_completer',
      'perfect_score',
      'streak_7_days',
      'streak_30_days',
      'engaged_student',
      'early_bird',
      'completionist'
    ]
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: '🏆'
  },
  dateEarned: {
    type: Date,
    default: Date.now
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }
}, {
  timestamps: true
});

// Index for efficient queries
badgeSchema.index({ studentId: 1, badgeName: 1 });
badgeSchema.index({ studentId: 1, dateEarned: -1 });

module.exports = mongoose.model('Badge', badgeSchema);

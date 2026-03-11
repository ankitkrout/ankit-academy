const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  completedLessons: [{
    lesson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lesson'
    },
    completedAt: {
      type: Date,
      default: Date.now
    }
  }],
  completedQuizzes: [{
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz'
    },
    score: Number,
    attemptedAt: {
      type: Date,
      default: Date.now
    }
  }],
  overallProgress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  lastAccessedLesson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson'
  },
  lastAccessedAt: {
    type: Date,
    default: Date.now
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  timeSpent: {
    type: Number, // in minutes
    default: 0
  }
}, {
  timestamps: true
});

// Compound index to ensure unique progress per user per course
progressSchema.index({ user: 1, course: 1 }, { unique: true });

// Method to calculate progress percentage
progressSchema.methods.calculateProgress = function(totalLessons) {
  if (totalLessons === 0) return 0;
  const completed = this.completedLessons.length;
  this.overallProgress = Math.round((completed / totalLessons) * 100);
  return this.overallProgress;
};

// Method to mark lesson as complete
progressSchema.methods.markLessonComplete = function(lessonId) {
  const alreadyCompleted = this.completedLessons.find(
    l => l.lesson.toString() === lessonId.toString()
  );
  if (!alreadyCompleted) {
    this.completedLessons.push({ lesson: lessonId, completedAt: new Date() });
    this.lastAccessedLesson = lessonId;
    this.lastAccessedAt = new Date();
  }
};

module.exports = mongoose.model('Progress', progressSchema);


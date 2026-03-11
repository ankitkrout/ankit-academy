const mongoose = require('mongoose');

const doubtSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  },
  lesson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson'
  },
  question: {
    type: String,
    required: true
  },
  answer: {
    type: String
  },
  aiGenerated: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['pending', 'answered', 'resolved'],
    default: 'pending'
  },
  relatedQuestions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doubt'
  }],
  upvotes: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  },
  answeredAt: {
    type: Date
  },
  resolvedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for efficient queries
doubtSchema.index({ user: 1 });
doubtSchema.index({ course: 1 });
doubtSchema.index({ lesson: 1 });
doubtSchema.index({ status: 1 });
doubtSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Doubt', doubtSchema);


const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: [
      'new_lesson',
      'live_class',
      'quiz_result',
      'course_completion',
      'enrollment',
      'certificate',
      'payment',
      'system',
      'announcement'
    ],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  link: {
    type: String
  },
  relatedId: {
    type: mongoose.Schema.Types.ObjectId
  },
  relatedModel: {
    type: String,
    enum: ['Course', 'Lesson', 'Quiz', 'LiveClass', 'Payment', 'Certificate', 'User']
  },
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date
  },
  priority: {
    type: String,
    enum: ['low', 'normal', 'high'],
    default: 'normal'
  }
}, {
  timestamps: true
});

// Index for efficient queries
notificationSchema.index({ user: 1, createdAt: -1 });
notificationSchema.index({ user: 1, isRead: 1 });

// Static method to create and send notification
notificationSchema.statics.send = async function(data) {
  try {
    const notification = await this.create(data);
    // Emit socket event if socket is available (can be extended for real-time)
    return notification;
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};

module.exports = mongoose.model('Notification', notificationSchema);


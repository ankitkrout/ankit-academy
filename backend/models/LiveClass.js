const mongoose = require('mongoose');

const liveClassSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Class title is required'],
    trim: true
  },
  description: {
    type: String
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  instructorName: {
    type: String,
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  },
  scheduledAt: {
    type: Date,
    required: true
  },
  duration: {
    type: Number, // in minutes
    default: 60
  },
  meetingLink: {
    type: String,
    required: true
  },
  meetingId: {
    type: String
  },
  meetingPassword: {
    type: String
  },
  status: {
    type: String,
    enum: ['scheduled', 'live', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  maxStudents: {
    type: Number,
    default: 100
  },
  enrolledStudents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  startedAt: {
    type: Date
  },
  endedAt: {
    type: Date
  },
  recording: {
    type: String, // URL to recording
    default: ''
  },
  resources: [{
    title: String,
    url: String,
    type: String
  }],
  isRecurring: {
    type: Boolean,
    default: false
  },
  recurringDays: [{
    type: String,
    enum: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  }],
  remindersSent: [{
    type: String,
    beforeMinutes: Number
  }]
}, {
  timestamps: true
});

// Index for efficient queries
liveClassSchema.index({ instructor: 1 });
liveClassSchema.index({ course: 1 });
liveClassSchema.index({ scheduledAt: 1 });
liveClassSchema.index({ status: 1 });

// Virtual for checking if class is upcoming
liveClassSchema.virtual('isUpcoming').get(function() {
  return new Date(this.scheduledAt) > new Date() && this.status === 'scheduled';
});

// Virtual for checking if class is live now
liveClassSchema.virtual('isLive').get(function() {
  const now = new Date();
  const endTime = new Date(this.scheduledAt.getTime() + this.duration * 60000);
  return now >= this.scheduledAt && now <= endTime && this.status === 'live';
});

module.exports = mongoose.model('LiveClass', liveClassSchema);


const express = require('express');
const router = express.Router();
const LiveClass = require('../models/LiveClass');
const { protect, teacherOrAdmin } = require('../middleware/auth');

// @route   POST /api/live-classes
// @desc    Create a new live class
// @access  Private (Teacher/Admin)
router.post('/', protect, teacherOrAdmin, async (req, res) => {
  try {
    const { title, description, course, scheduledAt, duration, meetingLink, maxStudents, isRecurring, recurringDays } = req.body;

    const liveClass = await LiveClass.create({
      title,
      description,
      course,
      instructor: req.user._id,
      instructorName: req.user.name,
      scheduledAt,
      duration: duration || 60,
      meetingLink,
      maxStudents: maxStudents || 100,
      isRecurring: isRecurring || false,
      recurringDays
    });

    res.status(201).json({
      success: true,
      liveClass
    });
  } catch (error) {
    console.error('Create live class error:', error);
    res.status(500).json({ success: false, message: 'Error creating live class' });
  }
});

// @route   GET /api/live-classes
// @desc    Get all live classes (with filters)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { status, course, instructor, page = 1, limit = 20 } = req.query;
    
    let query = {};
    if (status) query.status = status;
    if (course) query.course = course;
    if (instructor) query.instructor = instructor;

    const liveClasses = await LiveClass.find(query)
      .populate('instructor', 'name')
      .populate('course', 'title')
      .sort({ scheduledAt: 1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await LiveClass.countDocuments(query);

    res.json({
      success: true,
      liveClasses,
      pagination: {
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get live classes error:', error);
    res.status(500).json({ success: false, message: 'Error fetching live classes' });
  }
});

// @route   GET /api/live-classes/upcoming
// @desc    Get upcoming live classes
// @access  Public
router.get('/upcoming', async (req, res) => {
  try {
    const now = new Date();
    
    const liveClasses = await LiveClass.find({
      scheduledAt: { $gte: now },
      status: { $in: ['scheduled', 'live'] }
    })
      .populate('instructor', 'name')
      .populate('course', 'title')
      .sort({ scheduledAt: 1 })
      .limit(10);

    res.json({
      success: true,
      liveClasses
    });
  } catch (error) {
    console.error('Get upcoming live classes error:', error);
    res.status(500).json({ success: false, message: 'Error fetching upcoming classes' });
  }
});

// @route   GET /api/live-classes/my-classes
// @desc    Get my (teacher's) live classes
// @access  Private (Teacher/Admin)
router.get('/my-classes', protect, teacherOrAdmin, async (req, res) => {
  try {
    const liveClasses = await LiveClass.find({ instructor: req.user._id })
      .populate('course', 'title')
      .sort({ scheduledAt: -1 });

    res.json({
      success: true,
      liveClasses
    });
  } catch (error) {
    console.error('Get my live classes error:', error);
    res.status(500).json({ success: false, message: 'Error fetching live classes' });
  }
});

// @route   GET /api/live-classes/enrolled
// @desc    Get enrolled live classes for student
// @access  Private
router.get('/enrolled', protect, async (req, res) => {
  try {
    const liveClasses = await LiveClass.find({
      enrolledStudents: req.user._id,
      status: { $in: ['scheduled', 'live'] }
    })
      .populate('instructor', 'name')
      .populate('course', 'title')
      .sort({ scheduledAt: 1 });

    res.json({
      success: true,
      liveClasses
    });
  } catch (error) {
    console.error('Get enrolled live classes error:', error);
    res.status(500).json({ success: false, message: 'Error fetching enrolled classes' });
  }
});

// @route   GET /api/live-classes/:id
// @desc    Get live class by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const liveClass = await LiveClass.findById(req.params.id)
      .populate('instructor', 'name email')
      .populate('course', 'title');

    if (!liveClass) {
      return res.status(404).json({ success: false, message: 'Live class not found' });
    }

    res.json({
      success: true,
      liveClass
    });
  } catch (error) {
    console.error('Get live class error:', error);
    res.status(500).json({ success: false, message: 'Error fetching live class' });
  }
});

// @route   PUT /api/live-classes/:id
// @desc    Update live class
// @access  Private (Instructor only)
router.put('/:id', protect, teacherOrAdmin, async (req, res) => {
  try {
    let liveClass = await LiveClass.findById(req.params.id);

    if (!liveClass) {
      return res.status(404).json({ success: false, message: 'Live class not found' });
    }

    // Check ownership
    if (liveClass.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const { title, description, scheduledAt, duration, meetingLink, maxStudents, status } = req.body;

    liveClass = await LiveClass.findByIdAndUpdate(
      req.params.id,
      { title, description, scheduledAt, duration, meetingLink, maxStudents, status },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      liveClass
    });
  } catch (error) {
    console.error('Update live class error:', error);
    res.status(500).json({ success: false, message: 'Error updating live class' });
  }
});

// @route   PATCH /api/live-classes/:id/start
// @desc    Start live class (mark as live)
// @access  Private (Instructor only)
router.patch('/:id/start', protect, teacherOrAdmin, async (req, res) => {
  try {
    const liveClass = await LiveClass.findById(req.params.id);

    if (!liveClass) {
      return res.status(404).json({ success: false, message: 'Live class not found' });
    }

    if (liveClass.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    liveClass.status = 'live';
    liveClass.startedAt = new Date();
    await liveClass.save();

    res.json({
      success: true,
      liveClass,
      message: 'Live class started'
    });
  } catch (error) {
    console.error('Start live class error:', error);
    res.status(500).json({ success: false, message: 'Error starting live class' });
  }
});

// @route   PATCH /api/live-classes/:id/end
// @desc    End live class
// @access  Private (Instructor only)
router.patch('/:id/end', protect, teacherOrAdmin, async (req, res) => {
  try {
    const liveClass = await LiveClass.findById(req.params.id);

    if (!liveClass) {
      return res.status(404).json({ success: false, message: 'Live class not found' });
    }

    if (liveClass.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    liveClass.status = 'completed';
    liveClass.endedAt = new Date();
    await liveClass.save();

    res.json({
      success: true,
      liveClass,
      message: 'Live class ended'
    });
  } catch (error) {
    console.error('End live class error:', error);
    res.status(500).json({ success: false, message: 'Error ending live class' });
  }
});

// @route   POST /api/live-classes/:id/enroll
// @desc    Enroll in live class
// @access  Private
router.post('/:id/enroll', protect, async (req, res) => {
  try {
    const liveClass = await LiveClass.findById(req.params.id);

    if (!liveClass) {
      return res.status(404).json({ success: false, message: 'Live class not found' });
    }

    // Check if already enrolled
    if (liveClass.enrolledStudents.includes(req.user._id)) {
      return res.status(400).json({ success: false, message: 'Already enrolled in this class' });
    }

    // Check capacity
    if (liveClass.enrolledStudents.length >= liveClass.maxStudents) {
      return res.status(400).json({ success: false, message: 'Class is full' });
    }

    liveClass.enrolledStudents.push(req.user._id);
    await liveClass.save();

    res.json({
      success: true,
      message: 'Successfully enrolled in live class'
    });
  } catch (error) {
    console.error('Enroll in live class error:', error);
    res.status(500).json({ success: false, message: 'Error enrolling in live class' });
  }
});

// @route   DELETE /api/live-classes/:id
// @desc    Delete live class
// @access  Private (Instructor only)
router.delete('/:id', protect, teacherOrAdmin, async (req, res) => {
  try {
    const liveClass = await LiveClass.findById(req.params.id);

    if (!liveClass) {
      return res.status(404).json({ success: false, message: 'Live class not found' });
    }

    if (liveClass.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await liveClass.deleteOne();

    res.json({
      success: true,
      message: 'Live class deleted'
    });
  } catch (error) {
    console.error('Delete live class error:', error);
    res.status(500).json({ success: false, message: 'Error deleting live class' });
  }
});

module.exports = router;


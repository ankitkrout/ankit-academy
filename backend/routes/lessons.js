const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Lesson = require('../models/Lesson');
const Course = require('../models/Course');
const Progress = require('../models/Progress');
const User = require('../models/User');
const Badge = require('../models/Badge');
const { protect, teacherOrAdmin } = require('../middleware/auth');

// Badge definitions
const BADGE_DEFINITIONS = {
  first_course_completed: { icon: '🎓', description: 'Completed your first course!' },
  quiz_master: { icon: '🧠', description: 'Achieved mastery in quizzes!' },
  top_learner: { icon: '🏆', description: 'Ranked among top learners!' },
  fast_learner: { icon: '⚡', description: 'Completed course in record time!' },
  course_enroller: { icon: '📚', description: 'Enrolled in a new course!' },
  lesson_completer: { icon: '✅', description: 'Completed a lesson!' },
  perfect_score: { icon: '💯', description: 'Scored 100% in a quiz!' },
  streak_7_days: { icon: '🔥', description: '7-day learning streak!' },
  engaged_student: { icon: '💪', description: 'Very engaged learner!' },
  completionist: { icon: '🎯', description: 'Completed all lessons in a course!' }
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

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|mp4|mov|avi|webm|mkv/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname || mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only PDF and video files are allowed'));
  }
});

// @route   GET /api/lessons/course/:courseId
// @desc    Get all lessons for a course
// @access  Public
router.get('/course/:courseId', async (req, res) => {
  try {
    const lessons = await Lesson.find({ course: req.params.courseId })
      .sort('order');

    res.json({
      success: true,
      lessons
    });
  } catch (error) {
    console.error('Get lessons error:', error);
    res.status(500).json({ success: false, message: 'Error fetching lessons' });
  }
});

// @route   GET /api/lessons/lesson/:id
// @desc    Get single lesson
// @access  Public
router.get('/lesson/:id', async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);

    if (!lesson) {
      return res.status(404).json({ success: false, message: 'Lesson not found' });
    }

    res.json({
      success: true,
      lesson
    });
  } catch (error) {
    console.error('Get lesson error:', error);
    res.status(500).json({ success: false, message: 'Error fetching lesson' });
  }
});

// @route   POST /api/lessons/create
// @desc    Create a new lesson with file uploads
// @access  Private (Teacher/Admin)
router.post('/create', upload.fields([{ name: 'video', maxCount: 1 }, { name: 'notes', maxCount: 1 }]), protect, teacherOrAdmin, async (req, res) => {
  try {
    console.log('Lesson creation request received');
    console.log('User:', req.user?._id);
    console.log('Body:', req.body);

    const { title, description, course, videoUrl, videoDuration, notes, order, isFree, isPreview, section } = req.body;

    // Validate required fields
    if (!title) {
      return res.status(400).json({ success: false, message: 'Lesson title is required' });
    }
    if (!course) {
      return res.status(400).json({ success: false, message: 'Course ID is required' });
    }

    // Verify course exists and user owns it
    const courseDoc = await Course.findById(course);
    if (!courseDoc) {
      console.log('Course not found:', course);
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    console.log('Course instructor:', courseDoc.instructor);
    console.log('User ID:', req.user._id);

    if (courseDoc.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      console.log('Authorization failed - Course instructor:', courseDoc.instructor, 'User:', req.user._id);
      return res.status(403).json({ success: false, message: 'Not authorized to add lessons to this course' });
    }

    // Handle uploaded files
    let videoFilePath = videoUrl || '';
    let notesFilePath = notes || '';

    if (req.files) {
      if (req.files.video) {
        videoFilePath = `/uploads/${req.files.video[0].filename}`;
        console.log('Video file uploaded:', videoFilePath);
      }
      if (req.files.notes) {
        notesFilePath = `/uploads/${req.files.notes[0].filename}`;
        console.log('Notes file uploaded:', notesFilePath);
      }
    }

    // Calculate order if not provided
    const existingLessons = await Lesson.countDocuments({ course });
    const lessonOrder = order || existingLessons + 1;

    const lesson = await Lesson.create({
      title,
      description: description || '',
      course,
      section: section || 'Main Content',
      videoUrl: videoFilePath,
      videoDuration: parseInt(videoDuration) || 0,
      notes: notesFilePath,
      order: lessonOrder,
      isFree: isFree === 'true' || isFree === true,
      isPreview: isPreview === 'true' || isPreview === true,
      lessonNumber: lessonOrder
    });

    console.log('Lesson created successfully:', lesson._id);

    // Update course total lessons and duration
    await Course.findByIdAndUpdate(course, {
      $inc: { totalLessons: 1, totalDuration: parseInt(videoDuration) || 0 }
    });

    res.status(201).json({
      success: true,
      lesson,
      message: 'Lesson created successfully'
    });
  } catch (error) {
    console.error('Create lesson error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error creating lesson: ' + error.message,
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// @route   POST /api/lessons
// @desc    Create a new lesson
// @access  Private (Teacher/Admin)
router.post('/', protect, teacherOrAdmin, async (req, res) => {
  try {
    const { title, description, course, videoUrl, videoDuration, notes, notesFile, order, isFree, isPreview } = req.body;

    // Verify course exists and user owns it
    const courseDoc = await Course.findById(course);
    if (!courseDoc) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    if (courseDoc.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const lesson = await Lesson.create({
      title,
      description,
      course,
      videoUrl,
      videoDuration,
      notes,
      notesFile,
      order: order || 0,
      isFree,
      isPreview,
      lessonNumber: order || 1
    });

    // Update course total lessons and duration
    await Course.findByIdAndUpdate(course, {
      $inc: { totalLessons: 1, totalDuration: videoDuration || 0 }
    });

    res.status(201).json({
      success: true,
      lesson
    });
  } catch (error) {
    console.error('Create lesson error:', error);
    res.status(500).json({ success: false, message: 'Error creating lesson' });
  }
});

// @route   PUT /api/lessons/:id
// @desc    Update a lesson
// @access  Private (Teacher/Admin)
router.put('/:id', protect, teacherOrAdmin, async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);

    if (!lesson) {
      return res.status(404).json({ success: false, message: 'Lesson not found' });
    }

    // Verify ownership
    const course = await Course.findById(lesson.course);
    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const updatedLesson = await Lesson.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      lesson: updatedLesson
    });
  } catch (error) {
    console.error('Update lesson error:', error);
    res.status(500).json({ success: false, message: 'Error updating lesson' });
  }
});

// @route   DELETE /api/lessons/:id
// @desc    Delete a lesson
// @access  Private (Teacher/Admin)
router.delete('/:id', protect, teacherOrAdmin, async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);

    if (!lesson) {
      return res.status(404).json({ success: false, message: 'Lesson not found' });
    }

    // Verify ownership
    const course = await Course.findById(lesson.course);
    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    // Update course
    await Course.findByIdAndUpdate(lesson.course, {
      $inc: { totalLessons: -1, totalDuration: -(lesson.videoDuration || 0) }
    });

    await lesson.deleteOne();

    res.json({
      success: true,
      message: 'Lesson deleted successfully'
    });
  } catch (error) {
    console.error('Delete lesson error:', error);
    res.status(500).json({ success: false, message: 'Error deleting lesson' });
  }
});

// @route   POST /api/lessons/:id/complete
// @desc    Mark lesson as complete
// @access  Private
router.post('/:id/complete', protect, async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);

    if (!lesson) {
      return res.status(404).json({ success: false, message: 'Lesson not found' });
    }

    // Check if user is enrolled in the course
    const user = await User.findById(req.user._id);
    if (!user.enrolledCourses.includes(lesson.course)) {
      return res.status(403).json({ success: false, message: 'Not enrolled in this course' });
    }

    // Check if already completed
    const alreadyCompleted = lesson.completedBy.find(
      c => c.user.toString() === req.user._id.toString()
    );

    if (alreadyCompleted) {
      return res.status(400).json({ success: false, message: 'Lesson already completed' });
    }

    // Mark as complete
    lesson.completedBy.push({ user: req.user._id, completedAt: new Date() });
    await lesson.save();

    // Update progress
    let progress = await Progress.findOne({ user: req.user._id, course: lesson.course });
    
    if (!progress) {
      progress = await Progress.create({
        user: req.user._id,
        course: lesson.course
      });
    }

    progress.markLessonComplete(lesson._id);
    
    // Calculate total lessons in course
    const totalLessons = await Lesson.countDocuments({ course: lesson.course, isPublished: true });
    progress.calculateProgress(totalLessons);
    
    // Check if course is completed
    if (progress.overallProgress === 100) {
      progress.isCompleted = true;
      progress.completedAt = new Date();
    }
    
    await progress.save();

    // Award points
    user.points += 10;
    await user.save();

    // Award badges
    const newBadges = [];
    
    // Check for lesson completer badge
    const lessonBadge = await awardBadge(req.user._id, 'lesson_completer', lesson.course);
    if (lessonBadge) newBadges.push(lessonBadge);

    // Check if course is completed - award completionist badge
    if (progress.isCompleted) {
      // Check if first course completed
      const completedCourses = await Progress.countDocuments({ user: req.user._id, isCompleted: true });
      if (completedCourses === 1) {
        const firstCourseBadge = await awardBadge(req.user._id, 'first_course_completed', lesson.course);
        if (firstCourseBadge) newBadges.push(firstCourseBadge);
      }
      
      const completionistBadge = await awardBadge(req.user._id, 'completionist', lesson.course);
      if (completionistBadge) newBadges.push(completionistBadge);
    }

    res.json({
      success: true,
      message: 'Lesson marked as complete',
      progress: progress.overallProgress,
      pointsEarned: 10,
      newBadges: newBadges.length > 0 ? newBadges : undefined
    });
  } catch (error) {
    console.error('Complete lesson error:', error);
    res.status(500).json({ success: false, message: 'Error completing lesson' });
  }
});

module.exports = router;


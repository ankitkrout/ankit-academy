const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const Progress = require('../models/Progress');
const User = require('../models/User');
const { protect, teacherOrAdmin, optionalAuth } = require('../middleware/auth');

// @route   GET /api/courses/featured
// @desc    Get featured courses
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true })
      .populate('instructor', 'name')
      .sort({ totalEnrolled: -1, rating: -1 })
      .limit(6);

    res.json({
      success: true,
      courses
    });
  } catch (error) {
    console.error('Get featured courses error:', error);
    res.status(500).json({ success: false, message: 'Error fetching featured courses' });
  }
});

// @route   GET /api/courses
// @desc    Get all courses with pagination and filters
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { page = 1, limit = 12, category, class: courseClass, search, sort = '-createdAt' } = req.query;
    
    const query = { isPublished: true };
    
    if (category) query.category = category;
    if (courseClass) query.class = parseInt(courseClass);
    if (search) {
      query.$text = { $search: search };
    }

    const courses = await Course.find(query)
      .populate('instructor', 'name')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Course.countDocuments(query);

    // Check if user is enrolled
    let coursesWithEnrollment = courses;
    if (req.user) {
      const user = await User.findById(req.user._id);
      coursesWithEnrollment = courses.map(course => ({
        ...course.toObject(),
        isEnrolled: user.enrolledCourses.includes(course._id)
      }));
    }

    res.json({
      success: true,
      courses: coursesWithEnrollment,
      pagination: {
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ success: false, message: 'Error fetching courses' });
  }
});

// @route   GET /api/courses/my-courses
// @desc    Get enrolled courses for current user
// @access  Private (Student)
router.get('/my-courses', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'enrolledCourses',
      populate: { path: 'instructor', select: 'name' }
    });

    res.json({
      success: true,
      courses: user.enrolledCourses
    });
  } catch (error) {
    console.error('Get my courses error:', error);
    res.status(500).json({ success: false, message: 'Error fetching courses' });
  }
});

// @route   GET /api/courses/teacher
// @desc    Get teacher's courses
// @access  Private (Teacher)
router.get('/teacher', protect, async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user._id })
      .sort('-createdAt');

    res.json({
      success: true,
      courses
    });
  } catch (error) {
    console.error('Get teacher courses error:', error);
    res.status(500).json({ success: false, message: 'Error fetching courses' });
  }
});

// @route   PATCH /api/courses/:id/publish
// @desc    Publish or unpublish a course
// @access  Private (Teacher/Admin)
router.patch('/:id/publish', protect, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Check ownership or admin
    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const { status } = req.body;
    
    // Check if course has lessons before publishing
    if (status === 'published') {
      const lessonCount = await Lesson.countDocuments({ course: course._id });
      if (lessonCount === 0) {
        return res.status(400).json({ 
          success: false, 
          message: 'Cannot publish a course without lessons. Please add at least one lesson.' 
        });
      }
    }

    // Update both isPublished (boolean) and status (string)
    course.isPublished = (status === 'published');
    course.status = status;
    course.updatedAt = Date.now();
    await course.save();

    const statusMessage = status === 'published' 
      ? 'Course published successfully! Students can now see and enroll in this course.' 
      : 'Course unpublished successfully.';

    res.json({
      success: true,
      message: statusMessage,
      course
    });
  } catch (error) {
    console.error('Publish course error:', error);
    res.status(500).json({ success: false, message: 'Error publishing course' });
  }
});

// @route   GET /api/courses/:id
// @desc    Get single course with lessons
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'name email avatar');

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const lessons = await Lesson.find({ course: course._id, isPublished: true })
      .sort('order');

    let isEnrolled = false;
    let progress = null;
    
    if (req.user) {
      const user = await User.findById(req.user._id);
      isEnrolled = user.enrolledCourses.includes(course._id);
      
      if (isEnrolled) {
        progress = await Progress.findOne({ user: req.user._id, course: course._id });
      }
    }

    res.json({
      success: true,
      course,
      lessons,
      isEnrolled,
      progress
    });
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({ success: false, message: 'Error fetching course' });
  }
});

// @route   POST /api/courses
// @desc    Create a new course
// @access  Private (Teacher/Admin)
router.post('/', protect, teacherOrAdmin, async (req, res) => {
  try {
    const course = await Course.create({
      ...req.body,
      instructor: req.user._id,
      instructorName: req.user.name
    });

    res.status(201).json({
      success: true,
      course
    });
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({ success: false, message: 'Error creating course' });
  }
});

// @route   PUT /api/courses/:id
// @desc    Update a course
// @access  Private (Teacher/Admin)
router.put('/:id', protect, teacherOrAdmin, async (req, res) => {
  try {
    let course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Check ownership
    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    course = await Course.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      course
    });
  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({ success: false, message: 'Error updating course' });
  }
});

// @route   DELETE /api/courses/:id
// @desc    Delete a course
// @access  Private (Teacher/Admin)
router.delete('/:id', protect, teacherOrAdmin, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Check ownership
    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    // Delete associated lessons and progress
    await Lesson.deleteMany({ course: course._id });
    await Progress.deleteMany({ course: course._id });
    await course.deleteOne();

    res.json({
      success: true,
      message: 'Course deleted successfully'
    });
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({ success: false, message: 'Error deleting course' });
  }
});

// @route   POST /api/courses/:id/enroll
// @desc    Enroll in a course
// @access  Private (Student)
router.post('/:id/enroll', protect, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const user = await User.findById(req.user._id);

    // Check if already enrolled
    if (user.enrolledCourses.includes(course._id)) {
      return res.status(400).json({ success: false, message: 'Already enrolled in this course' });
    }

    // Enroll user
    user.enrolledCourses.push(course._id);
    await user.save();

    // Update course enrollment count
    course.totalEnrolled += 1;
    await course.save();

    // Create progress record
    await Progress.create({
      user: req.user._id,
      course: course._id
    });

    res.json({
      success: true,
      message: 'Successfully enrolled in course'
    });
  } catch (error) {
    console.error('Enroll error:', error);
    res.status(500).json({ success: false, message: 'Error enrolling in course' });
  }
});

// @route   GET /api/courses/published/all
// @desc    Get all published courses (for students)
// @access  Public
router.get('/published/all', async (req, res) => {
  try {
    const { page = 1, limit = 20, category, class: courseClass, search } = req.query;
    
    const query = { isPublished: true };
    
    if (category) query.category = category;
    if (courseClass) query.class = parseInt(courseClass);
    if (search) {
      query.$text = { $search: search };
    }

    const courses = await Course.find(query)
      .populate('instructor', 'name')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Course.countDocuments(query);

    res.json({
      success: true,
      courses,
      pagination: {
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get published courses error:', error);
    res.status(500).json({ success: false, message: 'Error fetching published courses' });
  }
});

module.exports = router;


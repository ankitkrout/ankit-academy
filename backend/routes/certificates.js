const express = require('express');
const router = express.Router();
const Certificate = require('../models/Certificate');
const Progress = require('../models/Progress');
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const { protect } = require('../middleware/auth');

// @route   POST /api/certificates/generate
// @desc    Generate certificate when course is completed
// @access  Private
router.post('/generate', protect, async (req, res) => {
  try {
    const { courseId } = req.body;

    // Get course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Get progress
    const progress = await Progress.findOne({ user: req.user._id, course: courseId });
    if (!progress) {
      return res.status(404).json({ success: false, message: 'No progress found for this course' });
    }

    // Check if all lessons are completed
    const totalLessons = await Lesson.countDocuments({ course: courseId, isPublished: true });
    if (progress.completedLessons.length < totalLessons) {
      return res.status(400).json({ 
        success: false, 
        message: `Please complete all lessons first. You have completed ${progress.completedLessons.length} of ${totalLessons} lessons.`
      });
    }

    // Check if certificate already exists
    const existingCert = await Certificate.findOne({ 
      student: req.user._id, 
      course: courseId 
    });

    if (existingCert) {
      return res.json({
        success: true,
        certificate: existingCert,
        message: 'Certificate already generated'
      });
    }

    // Generate certificate
    const certificate = await Certificate.create({
      student: req.user._id,
      course: courseId,
      studentName: req.user.name,
      courseName: course.title,
      instructorName: course.instructorName,
      completionDate: progress.completedAt || new Date(),
      totalLessons,
      completedLessons: progress.completedLessons.length,
      progress: progress.overallProgress
    });

    res.status(201).json({
      success: true,
      certificate,
      message: 'Certificate generated successfully!'
    });
  } catch (error) {
    console.error('Generate certificate error:', error);
    res.status(500).json({ success: false, message: 'Error generating certificate' });
  }
});

// @route   GET /api/certificates/my
// @desc    Get all certificates for logged-in student
// @access  Private
router.get('/my', protect, async (req, res) => {
  try {
    const certificates = await Certificate.find({ student: req.user._id })
      .populate('course', 'title thumbnail category')
      .sort('-createdAt');

    res.json({
      success: true,
      certificates
    });
  } catch (error) {
    console.error('Get certificates error:', error);
    res.status(500).json({ success: false, message: 'Error fetching certificates' });
  }
});

// @route   GET /api/certificates/:id
// @desc    Get certificate by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id)
      .populate('course', 'title description thumbnail')
      .populate('student', 'name email');

    if (!certificate) {
      return res.status(404).json({ success: false, message: 'Certificate not found' });
    }

    // Verify ownership
    if (certificate.student._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.json({
      success: true,
      certificate
    });
  } catch (error) {
    console.error('Get certificate error:', error);
    res.status(500).json({ success: false, message: 'Error fetching certificate' });
  }
});

// @route   GET /api/certificates/verify/:certificateId
// @desc    Verify certificate by certificate ID (public)
// @access  Public
router.get('/verify/:certificateId', async (req, res) => {
  try {
    const certificate = await Certificate.findOne({ 
      certificateId: req.params.certificateId 
    })
      .populate('course', 'title')
      .populate('student', 'name');

    if (!certificate) {
      return res.status(404).json({ 
        success: false, 
        valid: false,
        message: 'Certificate not found or invalid' 
      });
    }

    res.json({
      success: true,
      valid: true,
      certificate: {
        certificateId: certificate.certificateId,
        studentName: certificate.studentName,
        courseName: certificate.courseName,
        completionDate: certificate.completionDate,
        instructorName: certificate.instructorName
      }
    });
  } catch (error) {
    console.error('Verify certificate error:', error);
    res.status(500).json({ success: false, message: 'Error verifying certificate' });
  }
});

// @route   GET /api/certificates/:id/download
// @desc    Download certificate as HTML
// @access  Private
router.get('/:id/download', protect, async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id);

    if (!certificate) {
      return res.status(404).json({ success: false, message: 'Certificate not found' });
    }

    // Verify ownership
    if (certificate.student.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    // Generate HTML certificate
    const html = certificate.toCertificateHTML();

    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Content-Disposition', `attachment; filename="certificate-${certificate.certificateId}.html"`);
    res.send(html);
  } catch (error) {
    console.error('Download certificate error:', error);
    res.status(500).json({ success: false, message: 'Error downloading certificate' });
  }
});

// @route   POST /api/certificates/check/:courseId
// @desc    Check if user can get certificate for a course
// @access  Private
router.post('/check/:courseId', protect, async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const progress = await Progress.findOne({ user: req.user._id, course: req.params.courseId });
    if (!progress) {
      return res.json({
        success: true,
        eligible: false,
        message: 'You have not started this course',
        progress: 0,
        completedLessons: 0,
        totalLessons: 0
      });
    }

    const totalLessons = await Lesson.countDocuments({ course: req.params.courseId, isPublished: true });
    const completedLessons = progress.completedLessons.length;
    const eligible = completedLessons >= totalLessons && totalLessons > 0;

    // Check if certificate already exists
    const existingCert = await Certificate.findOne({ 
      student: req.user._id, 
      course: req.params.courseId 
    });

    res.json({
      success: true,
      eligible,
      hasCertificate: !!existingCert,
      certificateId: existingCert?.certificateId,
      progress: progress.overallProgress,
      completedLessons,
      totalLessons,
      message: eligible 
        ? 'Congratulations! You can download your certificate!'
        : `Complete all ${totalLessons} lessons to get your certificate`
    });
  } catch (error) {
    console.error('Check certificate eligibility error:', error);
    res.status(500).json({ success: false, message: 'Error checking eligibility' });
  }
});

module.exports = router;


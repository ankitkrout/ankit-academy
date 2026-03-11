const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const Progress = require('../models/Progress');
const Lesson = require('../models/Lesson');
const Quiz = require('../models/Quiz');
const User = require('../models/User');
const Payment = require('../models/Payment');
const LiveClass = require('../models/LiveClass');
const { protect, teacherOrAdmin } = require('../middleware/auth');

// @route   GET /api/analytics/teacher
// @desc    Get teacher dashboard analytics
// @access  Private (Teacher/Admin)
router.get('/teacher', protect, teacherOrAdmin, async (req, res) => {
  try {
    const teacherId = req.user._id;

    // Get teacher's courses
    const courses = await Course.find({ instructor: teacherId });
    const courseIds = courses.map(c => c._id);

    // Total students across all courses
    const totalStudents = courses.reduce((sum, c) => sum + (c.enrolledStudents?.length || 0), 0);
    const uniqueStudents = new Set(
      courses.flatMap(c => c.enrolledStudents || [])
    ).size;

    // Total lessons
    const totalLessons = courses.reduce((sum, c) => sum + (c.lessons?.length || 0), 0);

    // Get progress data
    const progressRecords = await Progress.find({ course: { $in: courseIds } });
    
    // Calculate completed courses
    const completedCourses = progressRecords.filter(p => p.isCompleted).length;

    // Total lessons completed
    const totalLessonsCompleted = progressRecords.reduce(
      (sum, p) => sum + (p.completedLessons?.length || 0), 0
    );

    // Get live classes
    const liveClasses = await LiveClass.find({ instructor: teacherId });
    const upcomingClasses = liveClasses.filter(
      lc => lc.status === 'scheduled' && new Date(lc.scheduledAt) > new Date()
    );
    const completedClasses = liveClasses.filter(lc => lc.status === 'completed');

    // Calculate total revenue (if payments are tracked)
    const payments = await Payment.find({
      course: { $in: courseIds },
      status: 'completed'
    });
    const totalRevenue = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

    // Average course completion rate
    const avgCompletionRate = courses.length > 0
      ? Math.round((completedCourses / (totalStudents || 1)) * 100)
      : 0;

    res.json({
      success: true,
      analytics: {
        totalCourses: courses.length,
        publishedCourses: courses.filter(c => c.isPublished).length,
        totalStudents,
        uniqueStudents,
        totalLessons,
        totalLessonsCompleted,
        completedCourses,
        totalRevenue,
        upcomingLiveClasses: upcomingClasses.length,
        completedLiveClasses: completedClasses.length,
        avgCompletionRate
      }
    });
  } catch (error) {
    console.error('Teacher analytics error:', error);
    res.status(500).json({ success: false, message: 'Error fetching analytics' });
  }
});

// @route   GET /api/analytics/teacher/course/:courseId
// @desc    Get analytics for specific course
// @access  Private (Teacher/Admin)
router.get('/teacher/course/:courseId', protect, teacherOrAdmin, async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Verify ownership
    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    // Get progress records
    const progressRecords = await Progress.find({ course: course._id });
    
    // Calculate completion stats
    const totalStudents = progressRecords.length;
    const completedStudents = progressRecords.filter(p => p.isCompleted).length;
    const avgProgress = totalStudents > 0
      ? Math.round(progressRecords.reduce((sum, p) => sum + (p.overallProgress || 0), 0) / totalStudents)
      : 0;

    // Get lesson completion stats
    const lessons = await Lesson.find({ course: course._id });
    const lessonStats = lessons.map(lesson => {
      const completedCount = progressRecords.filter(
        p => p.completedLessons?.some(cl => cl.lesson?.toString() === lesson._id.toString())
      ).length;
      return {
        lessonId: lesson._id,
        title: lesson.title,
        totalStudents,
        completedCount,
        completionRate: totalStudents > 0 ? Math.round((completedCount / totalStudents) * 100) : 0
      };
    });

    // Get quiz stats
    const quizzes = await Quiz.find({ course: course._id });
    const quizStats = await Promise.all(
      quizzes.map(async quiz => {
        const attempts = progressRecords.filter(
          p => p.completedQuizzes?.some(cq => cq.quiz?.toString() === quiz._id.toString())
        );
        const avgScore = attempts.length > 0
          ? Math.round(attempts.reduce((sum, p) => {
              const quizAttempt = p.completedQuizzes.find(cq => cq.quiz?.toString() === quiz._id.toString());
              return sum + (quizAttempt?.score || 0);
            }, 0) / attempts.length)
          : 0;
        
        return {
          quizId: quiz._id,
          title: quiz.title,
          totalAttempts: attempts.length,
          avgScore
        };
      })
    );

    // Time spent stats
    const totalTimeSpent = progressRecords.reduce((sum, p) => sum + (p.timeSpent || 0), 0);
    const avgTimeSpent = totalStudents > 0 ? Math.round(totalTimeSpent / totalStudents) : 0;

    res.json({
      success: true,
      analytics: {
        course: {
          id: course._id,
          title: course.title,
          totalStudents,
          completedStudents,
          completionRate: totalStudents > 0 ? Math.round((completedStudents / totalStudents) * 100) : 0,
          avgProgress,
          totalLessons: lessons.length,
          totalQuizzes: quizzes.length
        },
        lessonStats,
        quizStats,
        timeStats: {
          totalTimeSpent,
          avgTimeSpent
        }
      }
    });
  } catch (error) {
    console.error('Course analytics error:', error);
    res.status(500).json({ success: false, message: 'Error fetching course analytics' });
  }
});

// @route   GET /api/analytics/teacher/engagement
// @desc    Get student engagement metrics
// @access  Private (Teacher/Admin)
router.get('/teacher/engagement', protect, teacherOrAdmin, async (req, res) => {
  try {
    const teacherId = req.user._id;
    const { days = 30 } = req.query;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    // Get teacher's courses
    const courses = await Course.find({ instructor: teacherId });
    const courseIds = courses.map(c => c._id);

    // Get recent progress
    const recentProgress = await Progress.find({
      course: { $in: courseIds },
      updatedAt: { $gte: startDate }
    }).sort('-updatedAt');

    // Daily activity
    const dailyActivity = {};
    recentProgress.forEach(p => {
      const date = p.updatedAt.toISOString().split('T')[0];
      dailyActivity[date] = (dailyActivity[date] || 0) + 1;
    });

    // Most active students
    const studentActivity = {};
    recentProgress.forEach(p => {
      const userId = p.user.toString();
      studentActivity[userId] = (studentActivity[userId] || 0) + 1;
    });

    const topStudents = await User.find({ _id: { $in: Object.keys(studentActivity) } })
      .select('name email')
      .limit(10);

    const sortedActivity = Object.entries(studentActivity)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10);

    const enrichedTopStudents = topStudents.map(student => ({
      ...student.toObject(),
      activityCount: studentActivity[student._id.toString()] || 0
    })).sort((a, b) => b.activityCount - a.activityCount);

    res.json({
      success: true,
      engagement: {
        totalActivity: recentProgress.length,
        dailyActivity,
        topStudents: enrichedTopStudents,
        period: parseInt(days)
      }
    });
  } catch (error) {
    console.error('Engagement analytics error:', error);
    res.status(500).json({ success: false, message: 'Error fetching engagement data' });
  }
});

// @route   GET /api/analytics/teacher/lessons
// @desc    Get lesson-level statistics
// @access  Private (Teacher/Admin)
router.get('/teacher/lessons', protect, teacherOrAdmin, async (req, res) => {
  try {
    const teacherId = req.user._id;

    // Get teacher's courses
    const courses = await Course.find({ instructor: teacherId });
    const courseIds = courses.map(c => c._id);

    // Get all lessons
    const lessons = await Lesson.find({ course: { $in: courseIds } })
      .populate('course', 'title');

    // Get progress records
    const progressRecords = await Progress.find({ course: { $in: courseIds } });

    // Calculate lesson stats
    const lessonStats = lessons.map(lesson => {
      const completions = progressRecords.filter(
        p => p.completedLessons?.some(
          cl => cl.lesson?.toString() === lesson._id.toString()
        )
      ).length;

      const avgWatchTime = progressRecords
        .filter(p => p.completedLessons?.some(
          cl => cl.lesson?.toString() === lesson._id.toString()
        ))
        .reduce((sum, p) => {
          const lessonProgress = p.completedLessons.find(
            cl => cl.lesson?.toString() === lesson._id.toString()
          );
          return sum + (lessonProgress?.watchTime || 0);
        }, 0);

      return {
        lessonId: lesson._id,
        title: lesson.title,
        courseTitle: lesson.course?.title,
        videoDuration: lesson.videoDuration,
        totalStudents: progressRecords.length,
        completions,
        completionRate: progressRecords.length > 0 
          ? Math.round((completions / progressRecords.length) * 100) 
          : 0,
        avgWatchTime: completions > 0 ? Math.round(avgWatchTime / completions) : 0
      };
    });

    // Sort by completion rate
    lessonStats.sort((a, b) => b.completionRate - a.completionRate);

    res.json({
      success: true,
      lessons: lessonStats
    });
  } catch (error) {
    console.error('Lesson stats error:', error);
    res.status(500).json({ success: false, message: 'Error fetching lesson stats' });
  }
});

module.exports = router;


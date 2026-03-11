const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Progress = require('../models/Progress');
const Certificate = require('../models/Certificate');
const Badge = require('../models/Badge');
const { protect } = require('../middleware/auth');

// @route   GET /api/profile
// @desc    Get current user's profile with enrolled courses, certificates, badges
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Get enrolled courses
    const enrolledCourses = await Progress.find({ user: req.user._id })
      .populate({
        path: 'course',
        populate: { path: 'instructor', select: 'name' }
      })
      .sort({ lastAccessed: -1 });

    // Get completed courses
    const completedCourses = enrolledCourses.filter(p => p.completed);
    
    // Get certificates
    const certificates = await Certificate.find({ user: req.user._id })
      .populate('courseId', 'title')
      .sort({ createdAt: -1 });

    // Get badges
    const badges = await Badge.find({ studentId: req.user._id })
      .populate('courseId', 'title')
      .sort({ dateEarned: -1 });

    // Calculate total points (example calculation)
    const totalPoints = 
      (completedCourses.length * 100) + 
      (certificates.length * 50) + 
      (badges.length * 25) +
      (enrolledCourses.reduce((sum, p) => sum + (p.completedLessons?.length || 0), 0) * 5);

    // Get leaderboard rank (simple implementation)
    const allUsers = await User.find({ role: 'student' })
      .select('name points')
      .sort({ points: -1 });
    
    const leaderboardRank = allUsers.findIndex(u => u._id.toString() === req.user._id.toString()) + 1;

    res.json({
      success: true,
      profile: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          bio: user.bio,
          phone: user.phone,
          createdAt: user.createdAt
        },
        enrolledCourses: enrolledCourses.length,
        completedCourses: completedCourses.length,
        certificates: certificates.length,
        badges: badges.length,
        totalPoints,
        leaderboardRank,
        recentActivity: {
          enrolledCourses: enrolledCourses.slice(0, 3).map(p => p.course),
          certificates: certificates.slice(0, 3),
          badges: badges.slice(0, 5)
        }
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ success: false, message: 'Error fetching profile' });
  }
});

// @route   PUT /api/profile/update
// @desc    Update current user's profile
// @access  Private
router.put('/update', protect, async (req, res) => {
  try {
    const { name, bio, phone, avatar } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Update fields
    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (phone !== undefined) user.phone = phone;
    if (avatar !== undefined) user.avatar = avatar;

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        bio: user.bio,
        phone: user.phone
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ success: false, message: 'Error updating profile' });
  }
});

// @route   PUT /api/profile/avatar
// @desc    Update profile avatar
// @access  Private
router.put('/avatar', protect, async (req, res) => {
  try {
    const { avatar } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Avatar updated successfully',
      user
    });
  } catch (error) {
    console.error('Update avatar error:', error);
    res.status(500).json({ success: false, message: 'Error updating avatar' });
  }
});

module.exports = router;

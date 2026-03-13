const express = require('express');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const { generateToken } = require('../middleware/auth');
const router = express.Router();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || 'your-google-client-id.googleusercontent.com');

// @route   POST /api/auth/google
// @desc    Google OAuth login/register
// @access  Public
router.post('/google', async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({
        success: false,
        message: 'Google ID token is required'
      });
    }

    // Verify Google ID token
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID || 'your-google-client-id.googleusercontent.com'
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture: avatar } = payload;

    // Find user by googleId or email
    let user = await User.findOne({ $or: [{ googleId }, { email }] });

    if (!user) {
      // Create new user if not exists
      user = await User.create({
        name,
        email,
        googleId,
        avatar,
        role: 'student',
        class: 8,
        isApproved: true
      });
    } else if (!user.googleId) {
      // Link existing account with Google
      user.googleId = googleId;
      user.avatar = avatar || user.avatar;
      await user.save();
    }

    // Generate JWT token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Google login successful',
      token,
      user: user.getPublicProfile()
    });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid Google token'
    });
  }
});

module.exports = router;


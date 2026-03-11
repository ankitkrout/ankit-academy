const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const Course = require('../models/Course');
const Progress = require('../models/Progress');
const { protect } = require('../middleware/auth');

// @route   POST /api/payments/create-order
// @desc    Create a payment order for a course
// @access  Private
router.post('/create-order', protect, async (req, res) => {
  try {
    const { courseId } = req.body;

    // Get course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Check if already enrolled
    const existingPayment = await Payment.findOne({
      user: req.user._id,
      course: courseId,
      status: 'completed'
    });

    if (existingPayment) {
      return res.status(400).json({ success: false, message: 'Already enrolled in this course' });
    }

    // For free courses, directly enroll
    if (course.price === 0 || course.isFree) {
      // Create free payment record
      const payment = await Payment.create({
        user: req.user._id,
        course: courseId,
        amount: 0,
        paymentMethod: 'free',
        status: 'completed',
        transactionId: `FREE${Date.now()}`,
        completedAt: new Date()
      });

      // Create progress record
      await Progress.create({
        user: req.user._id,
        course: courseId
      });

      // Update course enrollment count
      await Course.findByIdAndUpdate(courseId, {
        $inc: { totalEnrolled: 1 }
      });

      return res.json({
        success: true,
        payment,
        message: 'Successfully enrolled in free course'
      });
    }

    // Create a pending payment record
    const payment = await Payment.create({
      user: req.user._id,
      course: courseId,
      amount: course.price,
      paymentMethod: 'razorpay',
      status: 'pending',
      orderId: `order_${Date.now()}`
    });

    // Return order details (in production, create actual Razorpay order)
    const orderDetails = {
      orderId: payment.orderId,
      amount: course.price * 100, // Razorpay expects amount in paise
      currency: 'INR',
      courseName: course.title,
      courseId: course._id,
      paymentId: payment._id
    };

    res.json({
      success: true,
      order: orderDetails,
      message: 'Payment order created'
    });
  } catch (error) {
    console.error('Create payment order error:', error);
    res.status(500).json({ success: false, message: 'Error creating payment order' });
  }
});

// @route   POST /api/payments/verify
// @desc    Verify payment and complete enrollment
// @access  Private
router.post('/verify', protect, async (req, res) => {
  try {
    const { paymentId, razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;

    // Find payment record
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }

    // Verify ownership
    if (payment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    // In production, verify Razorpay signature here
    // For demo, we'll simulate successful payment
    
    // Update payment status
    payment.status = 'completed';
    payment.razorpayPaymentId = razorpayPaymentId || `pay_${Date.now()}`;
    payment.razorpayOrderId = razorpayOrderId;
    payment.completedAt = new Date();
    await payment.save();

    // Create progress record
    const existingProgress = await Progress.findOne({
      user: req.user._id,
      course: payment.course
    });

    if (!existingProgress) {
      await Progress.create({
        user: req.user._id,
        course: payment.course
      });
    }

    // Update course enrollment count
    await Course.findByIdAndUpdate(payment.course, {
      $inc: { totalEnrolled: 1 }
    });

    res.json({
      success: true,
      payment,
      message: 'Payment successful! You are now enrolled in the course.'
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({ success: false, message: 'Error verifying payment' });
  }
});

// @route   POST /api/payments/simulate
// @desc    Simulate a successful payment (for testing)
// @access  Private
router.post('/simulate', protect, async (req, res) => {
  try {
    const { courseId } = req.body;

    // Get course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Check if already enrolled
    const existingPayment = await Payment.findOne({
      user: req.user._id,
      course: courseId,
      status: 'completed'
    });

    if (existingPayment) {
      return res.status(400).json({ success: false, message: 'Already enrolled in this course' });
    }

    // Create payment record
    const payment = await Payment.create({
      user: req.user._id,
      course: courseId,
      amount: course.price,
      paymentMethod: 'razorpay',
      status: 'completed',
      transactionId: `SIM${Date.now()}`,
      razorpayPaymentId: `pay_sim_${Date.now()}`,
      completedAt: new Date()
    });

    // Create progress record
    await Progress.create({
      user: req.user._id,
      course: courseId
    });

    // Update course enrollment count
    await Course.findByIdAndUpdate(courseId, {
      $inc: { totalEnrolled: 1 }
    });

    res.json({
      success: true,
      payment,
      message: 'Payment successful! You are now enrolled in the course.'
    });
  } catch (error) {
    console.error('Simulate payment error:', error);
    res.status(500).json({ success: false, message: 'Error processing payment' });
  }
});

// @route   GET /api/payments/my
// @desc    Get user's payment history
// @access  Private
router.get('/my', protect, async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user._id })
      .populate('course', 'title thumbnail category price')
      .sort('-createdAt');

    res.json({
      success: true,
      payments
    });
  } catch (error) {
    console.error('Get payments error:', error);
    res.status(500).json({ success: false, message: 'Error fetching payments' });
  }
});

// @route   GET /api/payments/:id
// @desc    Get payment by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('course', 'title thumbnail category price')
      .populate('user', 'name email');

    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }

    // Verify ownership
    if (payment.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.json({
      success: true,
      payment
    });
  } catch (error) {
    console.error('Get payment error:', error);
    res.status(500).json({ success: false, message: 'Error fetching payment' });
  }
});

// @route   GET /api/payments/course/:courseId
// @desc    Get payment for a specific course
// @access  Private
router.get('/course/:courseId', protect, async (req, res) => {
  try {
    const payment = await Payment.findOne({
      user: req.user._id,
      course: req.params.courseId
    });

    res.json({
      success: true,
      payment
    });
  } catch (error) {
    console.error('Get course payment error:', error);
    res.status(500).json({ success: false, message: 'Error fetching payment' });
  }
});

// @route   POST /api/payments/refund
// @desc    Request a refund
// @access  Private (Admin)
router.post('/refund/:id', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Only admins can process refunds' });
    }

    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }

    if (payment.status !== 'completed') {
      return res.status(400).json({ success: false, message: 'Payment is not completed' });
    }

    // Process refund
    payment.status = 'refunded';
    payment.refundedAmount = payment.amount;
    payment.refundedAt = new Date();
    await payment.save();

    res.json({
      success: true,
      payment,
      message: 'Refund processed successfully'
    });
  } catch (error) {
    console.error('Refund error:', error);
    res.status(500).json({ success: false, message: 'Error processing refund' });
  }
});

// @route   GET /api/payments/admin/all
// @desc    Get all payments (admin)
// @access  Private (Admin)
router.get('/admin/all', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Only admins can view all payments' });
    }

    const { status, startDate, endDate, page = 1, limit = 20 } = req.query;
    
    let query = {};
    if (status) query.status = status;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const payments = await Payment.find(query)
      .populate('user', 'name email')
      .populate('course', 'title price')
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Payment.countDocuments(query);

    // Calculate revenue
    const revenue = await Payment.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    res.json({
      success: true,
      payments,
      pagination: {
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      },
      revenue: revenue[0]?.total || 0
    });
  } catch (error) {
    console.error('Get all payments error:', error);
    res.status(500).json({ success: false, message: 'Error fetching payments' });
  }
});

module.exports = router;


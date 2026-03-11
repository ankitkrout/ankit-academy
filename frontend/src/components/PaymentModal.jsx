import { useState } from 'react';
import { paymentAPI } from '../services/api';
import toast from 'react-hot-toast';

const PaymentModal = ({ course, isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);

  if (!isOpen || !course) return null;

  const handleFreeEnrollment = async () => {
    setLoading(true);
    try {
      const response = await paymentAPI.createOrder(course._id);
      if (response.data.success) {
        toast.success('Successfully enrolled in the course!');
        onSuccess();
        onClose();
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to enroll';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSimulatePayment = async () => {
    setProcessing(true);
    try {
      const response = await paymentAPI.simulate(course._id);
      if (response.data.success) {
        toast.success('Payment successful! You are now enrolled.');
        onSuccess();
        onClose();
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Payment failed';
      toast.error(message);
    } finally {
      setProcessing(false);
    }
  };

  const isPaidCourse = course.price > 0 && !course.isFree;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" 
          onClick={onClose}
        ></div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">
                {isPaidCourse ? '💳 Purchase Course' : '🎉 Free Enrollment'}
              </h3>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            {/* Course Info */}
            <div className="flex gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center text-3xl flex-shrink-0">
                {course.category === 'Mathematics' ? '📐' : course.category === 'Science' ? '🔬' : '📚'}
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">{course.title}</h4>
                <p className="text-sm text-gray-500">{course.category} • Class {course.class}</p>
                <div className="mt-2">
                  {course.isFree || course.price === 0 ? (
                    <span className="text-2xl font-bold text-green-600">FREE</span>
                  ) : (
                    <span className="text-2xl font-bold text-gray-900">₹{course.price}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Payment Options */}
            {isPaidCourse ? (
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Razorpay</h4>
                      <p className="text-sm text-gray-500">Secure payment via Razorpay</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleSimulatePayment}
                    disabled={processing}
                    className="w-full btn btn-primary"
                  >
                    {processing ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing Payment...
                      </span>
                    ) : (
                      `Pay ₹${course.price}`
                    )}
                  </button>
                </div>

                <p className="text-xs text-center text-gray-500">
                  🔒 Secure payment powered by Razorpay. For demo, click "Pay" to simulate payment.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-green-700 mb-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-medium">Free Course</span>
                  </div>
                  <p className="text-sm text-green-600">
                    This is a free course. Enroll now to start learning!
                  </p>
                </div>

                <button
                  onClick={handleFreeEnrollment}
                  disabled={loading}
                  className="w-full btn btn-primary btn-lg"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Enrolling...
                    </span>
                  ) : (
                    'Enroll Now - Free'
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4">
            <p className="text-xs text-center text-gray-500">
              By enrolling, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;


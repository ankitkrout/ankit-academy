import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { courseAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import LessonCurriculum from '../components/LessonCurriculum';
import CertificateDownload from '../components/CertificateDownload';
import PaymentModal from '../components/PaymentModal';
import toast from 'react-hot-toast';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [progress, setProgress] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const fetchCourse = async () => {
    try {
      const response = await courseAPI.getById(id);
      setCourse(response.data.course);
      setLessons(response.data.lessons);
      setIsEnrolled(response.data.isEnrolled);
    } catch (error) {
      console.error('Error fetching course:', error);
      toast.error('Failed to load course');
    } finally {
      setLoading(false);
    }
  };

const handleEnroll = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    // Open payment modal for paid courses, enroll directly for free courses
    if (course.price > 0 && !course.isFree) {
      setShowPaymentModal(true);
    } else {
      handleEnrollFree();
    }
  };

  const handleEnrollFree = async () => {
    setEnrolling(true);
    try {
      await courseAPI.enroll(id);
      setIsEnrolled(true);
      toast.success('Successfully enrolled!');
    } catch (error) {
      console.error('Error enrolling:', error);
      toast.error(error.response?.data?.message || 'Failed to enroll');
    } finally {
      setEnrolling(false);
    }
  };

  const handlePaymentSuccess = () => {
    setIsEnrolled(true);
    fetchCourse(); // Refresh to get updated enrollment status
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-24">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-24 text-center">
          <h2 className="text-2xl font-bold text-gray-900">Course not found</h2>
          <Link to="/courses" className="btn btn-primary mt-4">Browse Courses</Link>
        </div>
      </div>
    );
  }

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Course Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <span className="badge bg-white/20 text-white">{course.category}</span>
                <span className="badge bg-white/20 text-white">Class {course.class}</span>
                {course.level && (
                  <span className="badge bg-white/20 text-white">{course.level}</span>
                )}
              </div>
              
              <h1 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
                {course.title}
              </h1>
              
              <p className="text-primary-100 text-lg mb-6">
                {course.description}
              </p>

              <div className="flex flex-wrap items-center gap-6 text-white">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-lg font-semibold">
                      {course.instructorName?.charAt(0)}
                    </span>
                  </div>
                  <span>{course.instructorName}</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <span className="text-yellow-400">★</span>
                  <span>{course.rating || '4.5'}</span>
                  <span className="text-primary-200">({course.totalRatings || 0} ratings)</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span>{course.totalEnrolled || 0} students</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{formatDuration(course.totalDuration * 60)}</span>
                </div>
              </div>
            </div>

            {/* Enrollment Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-24">
                <div className="aspect-video bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl mb-4 flex items-center justify-center text-6xl">
                  {course.category === 'Mathematics' ? '📐' : course.category === 'Science' ? '🔬' : '📚'}
                </div>
                
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-gray-900">
                    {course.isFree ? 'Free' : `₹${course.price}`}
                  </div>
                </div>

                {isEnrolled ? (
                  <Link
                    to={`/lesson/${course._id}/${lessons[0]?._id}`}
                    className="btn btn-primary w-full btn-lg mb-4"
                  >
                    Continue Learning
                  </Link>
                ) : (
                  <>
                    {course.price > 0 && !course.isFree ? (
                      <button
                        onClick={() => setShowPaymentModal(true)}
                        disabled={enrolling}
                        className="btn btn-primary w-full btn-lg mb-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                      >
                        🛒 Buy Course - ₹{course.price}
                      </button>
                    ) : (
                      <button
                        onClick={handleEnroll}
                        disabled={enrolling}
                        className="btn btn-primary w-full btn-lg mb-4"
                      >
                        {enrolling ? 'Enrolling...' : 'Enroll for Free'}
                      </button>
                    )}
                  </>
                )}

                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{course.totalLessons} video lessons</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Downloadable resources</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Interactive quizzes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Certificate of completion</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Lifetime access</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* What You'll Learn */}
            {course.outcomes?.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">What You'll Learn</h2>
                <div className="grid md:grid-cols-2 gap-3">
                  {course.outcomes.map((outcome, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-600">{outcome}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

{/* Course Content - Using LessonCurriculum for students */}
            {isEnrolled ? (
              <>
                {/* Progress Card */}
                <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">Your Progress</h2>
                    <span className="text-2xl font-bold text-primary-600">
                      {lessons.length > 0 ? Math.round((progress?.completedLessons?.length || 0) / lessons.length * 100) : 0}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                    <div 
                      className="bg-gradient-to-r from-primary-500 to-primary-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${lessons.length > 0 ? Math.round((progress?.completedLessons?.length || 0) / lessons.length * 100) : 0}%` }}
                    ></div>
                  </div>
                  <p className="text-gray-500 text-sm">
                    {progress?.completedLessons?.length || 0} of {lessons.length} lessons completed
                  </p>
                </div>

                {/* Certificate Download */}
                <div className="mb-6">
                  <CertificateDownload courseId={course._id} />
                </div>

                {/* Lesson Curriculum */}
                <LessonCurriculum courseId={course._id} course={course} />
              </>
            ) : (
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Course Content ({lessons.length} lessons)
              </h2>
              
              {lessons.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No lessons available yet</p>
              ) : (
                <div className="space-y-3">
                  {lessons.map((lesson, index) => (
                    <div 
                      key={lesson._id}
                      className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600 font-semibold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{lesson.title}</h3>
                        <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            </svg>
                            {formatDuration(lesson.videoDuration)}
                          </span>
                          {lesson.isFree && (
                            <span className="badge badge-success">Free Preview</span>
                          )}
                        </div>
                      </div>
                      {lesson.isFree || lesson.isPreview ? (
                        <Link
                          to={`/lesson/${course._id}/${lesson._id}`}
                          className="btn btn-outline btn-sm"
                        >
                          Preview
                        </Link>
                      ) : (
                        <span className="text-gray-400 text-sm">🔒</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Instructor */}
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Instructor</h2>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-2xl font-bold text-primary-600">
                  {course.instructorName?.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{course.instructorName}</h3>
                  <p className="text-sm text-gray-500">Expert Instructor</p>
                </div>
              </div>
            </div>

            {/* Requirements */}
            {course.requirements?.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Requirements</h2>
                <ul className="space-y-2">
                  {course.requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-600">
                      <span className="text-gray-400 mt-1">•</span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

<Footer />

      {/* Payment Modal */}
      <PaymentModal 
        course={course}
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
};

export default CourseDetail;


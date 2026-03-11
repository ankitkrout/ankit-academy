import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { courseAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import CourseLessons from '../components/CourseLessons';
import toast from 'react-hot-toast';

const subjectIcons = {
  'Mathematics': '📐',
  'Science': '🔬',
  'Physics': '⚛️',
  'Chemistry': '🧪',
  'Biology': '🧬',
  'English': '📝',
  'History': '📜',
  'Geography': '🌍',
  'Computer Science': '💻',
  'Economics': '📊'
};

const getSubjectIcon = (category) => subjectIcons[category] || '📚';

const TeacherDashboard = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLessons, setShowLessons] = useState(null);
  const [publishingId, setPublishingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchTeacherCourses();
  }, []);

  const fetchTeacherCourses = async () => {
    try {
      const response = await courseAPI.getTeacherCourses();
      setCourses(response.data.courses || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  const handlePublishToggle = async (courseId, currentStatus) => {
    setPublishingId(courseId);
    try {
      const newStatus = currentStatus === 'published' ? 'draft' : 'published';
      const response = await courseAPI.publish(courseId, newStatus);
      if (response.data.success) {
        toast.success(response.data.message);
        fetchTeacherCourses();
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update course status';
      toast.error(message);
    } finally {
      setPublishingId(null);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    setDeletingId(courseId);
    try {
      const response = await courseAPI.delete(courseId);
      if (response.data.success) {
        toast.success('Course deleted successfully');
        fetchTeacherCourses();
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete course';
      toast.error(message);
    } finally {
      setDeletingId(null);
    }
  };

  const totalStudents = courses.reduce((sum, c) => sum + (c.enrolledStudents?.length || c.totalEnrolled || 0), 0);
  const totalLessons = courses.reduce((sum, c) => sum + (c.lessons?.length || c.totalLessons || 0), 0);
  const publishedCount = courses.filter(c => c.isPublished || c.status === 'published').length;

  const formatLessonCount = (count) => {
    const lessons = count || 0;
    return lessons === 1 ? '1 lesson' : `${lessons} lessons`;
  };

  const formatRating = (rating) => {
    if (!rating || rating === 'N/A' || rating === 0) return 'No ratings yet';
    return `${rating}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <div className="bg-gradient-to-r from-green-500 to-green-700 rounded-2xl p-6 sm:p-8 text-white mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-heading font-bold mb-2">Teacher Dashboard 🎓</h1>
              <p className="text-green-100 text-sm sm:text-base">Manage your courses and track student progress</p>
            </div>
            <Link to="/teacher/create-course" className="btn bg-white text-green-600 hover:bg-gray-100 whitespace-nowrap">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="hidden sm:inline">Create Course</span>
              <span className="sm:hidden">Create</span>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
            <div className="text-2xl sm:text-3xl mb-2">📚</div>
            <div className="text-xl sm:text-2xl font-bold text-gray-900">{courses.length}</div>
            <div className="text-gray-500 text-sm">Total Courses</div>
          </div>
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
            <div className="text-2xl sm:text-3xl mb-2">✅</div>
            <div className="text-xl sm:text-2xl font-bold text-gray-900">{publishedCount}</div>
            <div className="text-gray-500 text-sm">Published</div>
          </div>
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
            <div className="text-2xl sm:text-3xl mb-2">👨‍🎓</div>
            <div className="text-xl sm:text-2xl font-bold text-gray-900">{totalStudents}</div>
            <div className="text-gray-500 text-sm">Total Students</div>
          </div>
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
            <div className="text-2xl sm:text-3xl mb-2">🎬</div>
            <div className="text-xl sm:text-2xl font-bold text-gray-900">{totalLessons}</div>
            <div className="text-gray-500 text-sm">Video Lessons</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-xl font-semibold text-gray-900">My Courses</h2>
            <Link to="/teacher/create-course" className="btn btn-primary btn-sm">+ Add New Course</Link>
          </div>
          
          {loading ? (
            <LoadingSpinner />
          ) : courses.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">📚</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No courses yet</h3>
              <p className="text-gray-500 mb-4">Create your first course to start teaching</p>
              <Link to="/teacher/create-course" className="btn btn-primary">Create Course</Link>
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              {courses.map(course => (
                <div key={course._id} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                  <div className="bg-gray-50 p-4 sm:p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                          {getSubjectIcon(course.category)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{course.title}</h3>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm text-gray-500 mt-1">
                            <span className="flex items-center gap-1">
                              <span>👨‍🎓</span>
                              {course.enrolledStudents?.length || course.totalEnrolled || 0} Students
                            </span>
                            <span className="flex items-center gap-1">
                              <span>📖</span>
                              {formatLessonCount(course.lessons?.length || course.totalLessons || 0)}
                            </span>
                            <span className="flex items-center gap-1">
                              <span className="text-yellow-500">★</span>
                              {formatRating(course.rating)}
                            </span>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                              (course.status || 'draft') === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {(course.status || 'draft') === 'published' ? 'Published' : 'Draft'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 ml-14 sm:ml-0">
                        <button
                          onClick={() => setShowLessons(showLessons === course._id ? null : course._id)}
                          className={`btn btn-sm flex-1 sm:flex-none ${
                            showLessons === course._id ? 'bg-primary-600 text-white hover:bg-primary-700' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                          }`}
                        >
                          {showLessons === course._id ? 'Hide' : 'Manage'}
                        </button>
                        <Link to={`/teacher/edit-course/${course._id}`} className="btn btn-sm bg-gray-100 text-gray-700 hover:bg-gray-200 flex-1 sm:flex-none text-center">
                          Edit
                        </Link>
                        <button
                          onClick={() => handlePublishToggle(course._id, course.status || 'draft')}
                          disabled={publishingId === course._id}
                          className={`btn btn-sm flex-1 sm:flex-none ${
                            (course.status || 'draft') === 'published' ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' : 'bg-green-100 text-green-700 hover:bg-green-200'
                          } ${publishingId === course._id ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          {publishingId === course._id ? '...' : (course.status || 'draft') === 'published' ? 'Unpublish' : 'Publish'}
                        </button>
                        <button
                          onClick={() => handleDeleteCourse(course._id)}
                          disabled={deletingId === course._id}
                          className={`btn btn-sm bg-red-100 text-red-700 hover:bg-red-200 flex-1 sm:flex-none ${deletingId === course._id ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          {deletingId === course._id ? '...' : 'Delete'}
                        </button>
                      </div>
                    </div>
                  </div>
                  {showLessons === course._id && (
                    <div className="p-4 sm:p-5 border-t border-gray-200 bg-white">
                      <CourseLessons courseId={course._id} onLessonsChange={fetchTeacherCourses} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 sm:p-6 border border-blue-100">
          <div className="flex items-start gap-3 mb-4">
            <div className="text-2xl">💡</div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">How to publish your course</h3>
              <p className="text-sm text-gray-600 mt-1">Follow these steps to make your course visible to students</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold text-sm mb-2">1</div>
              <p className="text-sm text-gray-700">Create a new course</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm mb-2">2</div>
              <p className="text-sm text-gray-700">Add video lessons</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold text-sm mb-2">3</div>
              <p className="text-sm text-gray-700">Add PDF notes</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 font-bold text-sm mb-2">4</div>
              <p className="text-sm text-gray-700">Add at least one lesson</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold text-sm mb-2">5</div>
              <p className="text-sm text-gray-700">Click Publish</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;


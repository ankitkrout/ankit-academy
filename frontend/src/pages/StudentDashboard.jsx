import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { courseAPI, progressAPI, userAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [coursesRes, analyticsRes, leaderboardRes] = await Promise.all([
        courseAPI.getMyCourses(),
        progressAPI.getAnalytics(),
        userAPI.getLeaderboard(5)
      ]);
      
      setCourses(coursesRes.data.courses || []);
      setAnalytics(analyticsRes.data.analytics);
      setLeaderboard(leaderboardRes.data.leaderboard || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
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

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-8">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 pt-20 md:pt-24">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-700 rounded-2xl p-4 md:p-8 text-white mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 md:gap-4">
            <div>
              <h1 className="text-lg md:text-2xl lg:text-3xl font-heading font-bold mb-1 md:mb-2">
                Welcome back, {user?.name}! 👋
              </h1>
              <p className="text-primary-100 text-sm">
                Continue your learning journey!
              </p>
            </div>
            <div className="md:text-right">
              <div className="text-xl md:text-4xl font-bold">{user?.points || 0}</div>
              <div className="text-primary-200 text-xs md:text-sm">Your Points</div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
          <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm">
            <div className="text-2xl md:text-3xl mb-1 md:mb-2">📚</div>
            <div className="text-xl md:text-2xl font-bold text-gray-900">{analytics?.totalCoursesEnrolled || 0}</div>
            <div className="text-xs md:text-sm text-gray-500">Enrolled</div>
          </div>
          <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm">
            <div className="text-2xl md:text-3xl mb-1 md:mb-2">✅</div>
            <div className="text-xl md:text-2xl font-bold text-gray-900">{analytics?.totalLessonsCompleted || 0}</div>
            <div className="text-xs md:text-sm text-gray-500">Lessons</div>
          </div>
          <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm">
            <div className="text-2xl md:text-3xl mb-1 md:mb-2">🧠</div>
            <div className="text-xl md:text-2xl font-bold text-gray-900">{analytics?.totalQuizzesCompleted || 0}</div>
            <div className="text-xs md:text-sm text-gray-500">Quizzes</div>
          </div>
          <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm">
            <div className="text-2xl md:text-3xl mb-1 md:mb-2">🏆</div>
            <div className="text-xl md:text-2xl font-bold text-gray-900">{analytics?.completedCourses || 0}</div>
            <div className="text-xs md:text-sm text-gray-500">Completed</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* My Courses */}
            <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 mb-6 md:mb-8">
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <h2 className="text-lg md:text-xl font-semibold text-gray-900">My Courses</h2>
                <Link to="/my-courses" className="text-primary-600 hover:text-primary-700 font-medium text-sm">
                  View All
                </Link>
              </div>
              
              {courses.length === 0 ? (
                <div className="text-center py-6 md:py-8">
                  <div className="text-4xl md:text-5xl mb-3 md:4">📚</div>
                  <h3 className="text-base md:text-lg font-medium text-gray-900 mb-2">No courses yet</h3>
                  <p className="text-gray-500 text-sm mb-4">Start exploring courses to begin your learning journey</p>
                  <Link to="/courses" className="btn btn-primary">
                    Browse Courses
                  </Link>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-3 md:gap-4">
                  {courses.slice(0, 4).map(course => (
                    <Link
                      key={course._id}
                      to={`/courses/${course._id}`}
                      className="flex gap-3 md:gap-4 p-3 md:p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <div className="w-14 md:w-20 h-14 md:h-20 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center text-2xl md:text-3xl flex-shrink-0">
                        {course.category === 'Mathematics' ? '📐' : course.category === 'Science' ? '🔬' : '📚'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 text-sm md:text-base truncate">{course.title}</h3>
                        <p className="text-xs md:text-sm text-gray-500">{course.category}</p>
                        <div className="mt-1 md:mt-2 w-full bg-gray-200 rounded-full h-1.5 md:h-2">
                          <div className="bg-primary-500 h-1.5 md:h-2 rounded-full" style={{ width: '30%' }}></div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Continue Learning */}
            {courses.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
                <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 md:mb-6">Continue Learning</h2>
                <div className="space-y-3 md:space-y-4">
                  {courses.slice(0, 3).map(course => (
                    <Link
                      key={course._id}
                      to={`/courses/${course._id}`}
                      className="flex items-center gap-3 md:gap-4 p-3 md:p-4 border border-gray-200 rounded-xl hover:border-primary-300 hover:shadow-md transition-all"
                    >
                      <div className="w-10 md:w-12 h-10 md:h-12 bg-primary-100 rounded-lg flex items-center justify-center text-lg md:text-xl">
                        ▶️
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 text-sm md:text-base truncate">{course.title}</h3>
                        <p className="text-xs md:text-sm text-gray-500">{course.totalLessons} lessons</p>
                      </div>
                      <button className="btn btn-primary btn-sm text-xs md:text-sm px-3 md:px-4">
                        Continue
                      </button>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Leaderboard */}
            <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 mb-4 md:mb-6">
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <h2 className="text-base md:text-lg font-semibold text-gray-900">Leaderboard</h2>
                <Link to="/leaderboard" className="text-xs md:text-sm text-primary-600 hover:text-primary-700">
                  View All
                </Link>
              </div>
              
              <div className="space-y-2 md:space-y-3">
                {leaderboard.map((entry, index) => (
                  <div
                    key={entry._id}
                    className={`flex items-center gap-2 md:gap-3 p-2 md:p-3 rounded-lg ${
                      entry._id === user?._id ? 'bg-primary-50 border border-primary-200' : 'bg-gray-50'
                    }`}
                  >
                    <div className={`w-6 md:w-8 h-6 md:h-8 rounded-full flex items-center justify-center font-bold text-xs md:text-sm ${
                      index === 0 ? 'bg-yellow-400 text-yellow-900' :
                      index === 1 ? 'bg-gray-300 text-gray-700' :
                      index === 2 ? 'bg-amber-600 text-white' :
                      'bg-gray-200 text-gray-600'
                    }`}>
                      {entry.rank}
                    </div>
                    <div className="w-6 md:w-8 h-6 md:h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-600 text-xs md:text-sm font-medium">
                        {entry.name?.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 text-xs md:text-sm truncate">
                        {entry.name}
                        {entry._id === user?._id && ' (You)'}
                      </div>
                    </div>
                    <div className="text-xs md:text-sm font-semibold text-primary-600">
                      {entry.points}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
              <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">Quick Stats</h2>
              <div className="space-y-3 md:space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-xs md:text-sm">Average Quiz Score</span>
                  <span className="font-semibold text-gray-900 text-xs md:text-sm">{analytics?.averageQuizScore || 0}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-xs md:text-sm">Time Spent Learning</span>
                  <span className="font-semibold text-gray-900 text-xs md:text-sm">{analytics?.totalTimeSpent || 0} min</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-xs md:text-sm">Your Badges</span>
                  <span className="font-semibold text-gray-900 text-xs md:text-sm">{user?.badges?.length || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;


import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { liveClassAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const LiveClasses = () => {
  const { user } = useAuth();
  const [liveClasses, setLiveClasses] = useState([]);
  const [enrolledClasses, setEnrolledClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [enrolling, setEnrolling] = useState(null);

  useEffect(() => {
    fetchLiveClasses();
  }, []);

  const fetchLiveClasses = async () => {
    try {
      const [upcomingRes, enrolledRes] = await Promise.all([
        liveClassAPI.getUpcoming(),
        liveClassAPI.getEnrolled()
      ]);
      setLiveClasses(upcomingRes.data.liveClasses || []);
      setEnrolledClasses(enrolledRes.data.liveClasses || []);
    } catch (error) {
      console.error('Error fetching live classes:', error);
      toast.error('Failed to load live classes');
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (classId) => {
    setEnrolling(classId);
    try {
      await liveClassAPI.enroll(classId);
      toast.success('Successfully enrolled in the live class!');
      fetchLiveClasses();
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to enroll';
      toast.error(message);
    } finally {
      setEnrolling(null);
    }
  };

  const formatDateTime = (date) => {
    return new Date(date).toLocaleString('en-IN', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeRemaining = (scheduledAt) => {
    const now = new Date();
    const scheduled = new Date(scheduledAt);
    const diff = scheduled - now;
    
    if (diff < 0) return 'Started';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const isEnrolled = (classId) => {
    return enrolledClasses.some(c => c._id === classId);
  };

  const isLive = (liveClass) => {
    const now = new Date();
    const scheduled = new Date(liveClass.scheduledAt);
    const endTime = new Date(scheduled.getTime() + (liveClass.duration || 60) * 60000);
    return now >= scheduled && now <= endTime && liveClass.status === 'live';
  };

  const isUpcoming = (scheduledAt) => {
    return new Date(scheduledAt) > new Date();
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

  const upcomingClasses = liveClasses.filter(c => isUpcoming(c.scheduledAt));
  const liveNowClasses = liveClasses.filter(c => isLive(c));

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-8">
      <Navbar />
      
      <div className="max-w-5xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 pt-20 md:pt-24">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-gray-900 mb-2">
            📹 Live Classes
          </h1>
          <p className="text-gray-600">Join interactive live sessions with your teachers</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === 'upcoming'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            📅 Upcoming ({upcomingClasses.length})
          </button>
          <button
            onClick={() => setActiveTab('live')}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === 'live'
                ? 'bg-red-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            🔴 Live Now ({liveNowClasses.length})
          </button>
          <button
            onClick={() => setActiveTab('enrolled')}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === 'enrolled'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            ✅ My Enrolled ({enrolledClasses.length})
          </button>
        </div>

        {/* Content */}
        {activeTab === 'upcoming' && (
          <div className="space-y-4">
            {upcomingClasses.length === 0 ? (
              <div className="bg-white rounded-xl p-8 text-center">
                <div className="text-5xl mb-4">📅</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming classes</h3>
                <p className="text-gray-500">Check back later for new live sessions</p>
              </div>
            ) : (
              upcomingClasses.map(liveClass => (
                <div key={liveClass._id} className="bg-white rounded-xl shadow-sm p-4 md:p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-red-400 to-red-600 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                        📹
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">{liveClass.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">{liveClass.description}</p>
                        <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {formatDateTime(liveClass.scheduledAt)}
                          </span>
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {liveClass.duration} min
                          </span>
                          <span className="flex items-center gap-1">
                            👨‍🎓 {liveClass.enrolledStudents?.length || 0} / {liveClass.maxStudents}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="text-sm text-gray-500 text-right">
                        Starts in <span className="font-semibold text-primary-600">{getTimeRemaining(liveClass.scheduledAt)}</span>
                      </div>
                      {isEnrolled(liveClass._id) ? (
                        <button className="btn bg-green-100 text-green-700 hover:bg-green-200">
                          ✅ Enrolled
                        </button>
                      ) : (
                        <button
                          onClick={() => handleEnroll(liveClass._id)}
                          disabled={enrolling === liveClass._id}
                          className="btn btn-primary"
                        >
                          {enrolling === liveClass._id ? 'Enrolling...' : 'Join Class'}
                        </button>
                      )}
                    </div>
                  </div>
                  {liveClass.course && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <Link to={`/courses/${liveClass.course._id}`} className="text-sm text-primary-600 hover:text-primary-700">
                        📚 Related Course: {liveClass.course.title}
                      </Link>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'live' && (
          <div className="space-y-4">
            {liveNowClasses.length === 0 ? (
              <div className="bg-white rounded-xl p-8 text-center">
                <div className="text-5xl mb-4">🔴</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No live classes right now</h3>
                <p className="text-gray-500">Check the upcoming tab for scheduled classes</p>
              </div>
            ) : (
              liveNowClasses.map(liveClass => (
                <div key={liveClass._id} className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl shadow-sm p-4 md:p-6 border border-red-200">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></span>
                    <span className="text-red-600 font-semibold">LIVE NOW</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 text-lg mb-2">{liveClass.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{liveClass.description}</p>
                  <a
                    href={liveClass.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn bg-red-600 text-white hover:bg-red-700 inline-flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Join Now
                  </a>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'enrolled' && (
          <div className="space-y-4">
            {enrolledClasses.length === 0 ? (
              <div className="bg-white rounded-xl p-8 text-center">
                <div className="text-5xl mb-4">📝</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No enrolled classes</h3>
                <p className="text-gray-500">Enroll in upcoming classes to join live sessions</p>
              </div>
            ) : (
              enrolledClasses.map(liveClass => (
                <div key={liveClass._id} className="bg-white rounded-xl shadow-sm p-4 md:p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                        ✅
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">{liveClass.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">{liveClass.description}</p>
                        <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            📅 {formatDateTime(liveClass.scheduledAt)}
                          </span>
                          <span className="flex items-center gap-1">
                            ⏱️ {liveClass.duration} min
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {isLive(liveClass) ? (
                        <a
                          href={liveClass.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn bg-red-600 text-white hover:bg-red-700"
                        >
                          🔴 Join Live
                        </a>
                      ) : (
                        <button className="btn bg-gray-100 text-gray-400 cursor-not-allowed">
                          Wait for class
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveClasses;


import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { liveClassAPI, courseAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const CreateLiveClass = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [myClasses, setMyClasses] = useState([]);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    course: '',
    scheduledAt: '',
    duration: 60,
    meetingLink: '',
    maxStudents: 100
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [coursesRes, classesRes] = await Promise.all([
        courseAPI.getTeacherCourses(),
        liveClassAPI.getMyClasses()
      ]);
      setCourses(coursesRes.data.courses || []);
      setMyClasses(classesRes.data.liveClasses || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.scheduledAt || !formData.meetingLink) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    try {
      const response = await liveClassAPI.create(formData);
      
      if (response.data.success) {
        toast.success('Live class created successfully!');
        setFormData({
          title: '',
          description: '',
          course: '',
          scheduledAt: '',
          duration: 60,
          meetingLink: '',
          maxStudents: 100
        });
        fetchData();
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create live class';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (classId) => {
    if (!window.confirm('Are you sure you want to delete this live class?')) {
      return;
    }

    try {
      await liveClassAPI.delete(classId);
      toast.success('Live class deleted');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const formatDateTime = (date) => {
    return new Date(date).toLocaleString('en-IN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const styles = {
      scheduled: 'bg-blue-100 text-blue-800',
      live: 'bg-red-100 text-red-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
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
      
      <div className="max-w-5xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 pt-20 md:pt-24">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-gray-900 mb-2">
            📹 Create Live Class
          </h1>
          <p className="text-gray-600">Schedule interactive live sessions for your students</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
          {/* Create Form */}
          <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Schedule New Class</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Math Doubt Clearing Session"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="What will you cover in this session?"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Related Course (Optional)
                </label>
                <select
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">General (No specific course)</option>
                  {courses.map(course => (
                    <option key={course._id} value={course._id}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    name="scheduledAt"
                    value={formData.scheduledAt}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration (minutes)
                  </label>
                  <select
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value={30}>30 min</option>
                    <option value={45}>45 min</option>
                    <option value={60}>60 min</option>
                    <option value={90}>90 min</option>
                    <option value={120}>120 min</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meeting Link * (Zoom/Google Meet)
                </label>
                <input
                  type="url"
                  name="meetingLink"
                  value={formData.meetingLink}
                  onChange={handleChange}
                  placeholder="https://zoom.us/j/..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Students
                </label>
                <input
                  type="number"
                  name="maxStudents"
                  value={formData.maxStudents}
                  onChange={handleChange}
                  min={1}
                  max={500}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full btn btn-primary"
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating...
                  </span>
                ) : (
                  '📹 Schedule Live Class'
                )}
              </button>
            </form>
          </div>

          {/* My Live Classes */}
          <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">My Live Classes</h2>
            
            {myClasses.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-3">📹</div>
                <p className="text-gray-500">No live classes scheduled yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {myClasses.map(liveClass => (
                  <div key={liveClass._id} className="border border-gray-200 rounded-xl p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">{liveClass.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          📅 {formatDateTime(liveClass.scheduledAt)}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          {getStatusBadge(liveClass.status)}
                          <span className="text-xs text-gray-500">
                            👨‍🎓 {liveClass.enrolledStudents?.length || 0} enrolled
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        {liveClass.status === 'scheduled' && (
                          <>
                            <button
                              onClick={() => {
                                liveClassAPI.start(liveClass._id).then(() => fetchData());
                              }}
                              className="btn btn-sm bg-red-100 text-red-700 hover:bg-red-200"
                            >
                              Start
                            </button>
                            <button
                              onClick={() => handleDelete(liveClass._id)}
                              className="btn btn-sm bg-gray-100 text-gray-700 hover:bg-gray-200"
                            >
                              Delete
                            </button>
                          </>
                        )}
                        {liveClass.status === 'live' && (
                          <button
                            onClick={() => {
                              liveClassAPI.end(liveClass._id).then(() => fetchData());
                            }}
                            className="btn btn-sm bg-gray-100 text-gray-700 hover:bg-gray-200"
                          >
                            End
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateLiveClass;


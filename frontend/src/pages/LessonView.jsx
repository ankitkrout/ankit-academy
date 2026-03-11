import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { courseAPI, lessonAPI, progressAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const LessonView = () => {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchCourseAndLesson();
  }, [courseId, lessonId]);

  useEffect(() => {
    // Close sidebar on mobile when lesson changes
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  }, [lessonId]);

  const fetchCourseAndLesson = async () => {
    try {
      const courseRes = await courseAPI.getById(courseId);
      setCourse(courseRes.data.course);
      setLessons(courseRes.data.lessons);
      
      const lesson = courseRes.data.lessons.find(l => l._id === lessonId);
      setCurrentLesson(lesson);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load lesson');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkComplete = async () => {
    setCompleting(true);
    try {
      await lessonAPI.complete(lessonId);
      toast.success('Lesson completed! +10 points');
      
      // Navigate to next lesson if available
      const currentIndex = lessons.findIndex(l => l._id === lessonId);
      if (currentIndex < lessons.length - 1) {
        navigate(`/lesson/${courseId}/${lessons[currentIndex + 1]._id}`);
      } else {
        navigate(`/courses/${courseId}`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to mark complete');
    } finally {
      setCompleting(false);
    }
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min`;
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

  if (!currentLesson) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-24 text-center px-4">
          <h2 className="text-xl md:text-2xl font-bold">Lesson not found</h2>
          <Link to={`/courses/${courseId}`} className="btn btn-primary mt-4 inline-block">Back to Course</Link>
        </div>
      </div>
    );
  }

  const currentIndex = lessons.findIndex(l => l._id === lessonId);
  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-0">
      <Navbar />
      
      <div className="flex flex-col lg:flex-row">
        {/* Video Player Area */}
        <div className="lg:w-3/4">
          {/* Video Container */}
          <div className="bg-black aspect-video flex items-center justify-center relative">
            {currentLesson.videoUrl ? (
              <video 
                controls 
                className="w-full h-full"
                src={currentLesson.videoUrl}
              >
                Your browser does not support video playback.
              </video>
            ) : (
              <div className="text-center text-white px-4">
                <div className="text-4xl md:text-6xl mb-3 md:4">🎬</div>
                <p className="text-lg md:text-xl">Video content will appear here</p>
                <p className="text-gray-400 mt-2 text-sm md:text-base">Course: {course?.title}</p>
              </div>
            )}
          </div>

          {/* Mobile Sidebar Toggle */}
          <div className="lg:hidden bg-white border-b px-4 py-3">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="flex items-center justify-between w-full text-left"
            >
              <span className="font-medium text-gray-900">Course Content</span>
              <svg 
                className={`w-5 h-5 text-gray-500 transition-transform ${sidebarOpen ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {/* Lesson Info */}
          <div className="p-4 md:p-6 bg-white">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
              <div>
                <span className="text-xs md:text-sm text-gray-500">Lesson {currentIndex + 1} of {lessons.length}</span>
                <h1 className="text-lg md:text-2xl font-bold text-gray-900">{currentLesson.title}</h1>
              </div>
              <button
                onClick={handleMarkComplete}
                disabled={completing}
                className="btn btn-primary text-sm md:text-base self-start sm:self-auto"
              >
                {completing ? 'Marking...' : '✓ Mark Complete'}
              </button>
            </div>

            <p className="text-gray-600 text-sm md:text-base mb-4 md:mb-6">{currentLesson.description}</p>

            {/* Download Notes Button */}
            {currentLesson.notes && (
              <div className="mb-4 md:mb-6 p-3 md:p-4 bg-blue-50 rounded-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 text-sm md:text-base">Study Notes</h4>
                      <p className="text-xs md:text-sm text-gray-500">Download PDF for this lesson</p>
                    </div>
                  </div>
                  <a
                    href={currentLesson.notes}
                    download
                    className="btn btn-primary btn-sm text-xs md:text-sm"
                  >
                    <svg className="w-4 h-4 mr-1 md:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download
                  </a>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 md:pt-6 border-t">
              {prevLesson ? (
                <Link 
                  to={`/lesson/${courseId}/${prevLesson._id}`}
                  className="flex items-center gap-2 text-gray-600 hover:text-primary-600 text-sm md:text-base self-start"
                >
                  <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous
                </Link>
              ) : <div />}
              
              {nextLesson ? (
                <Link 
                  to={`/lesson/${courseId}/${nextLesson._id}`}
                  className="btn btn-primary text-sm md:text-base"
                >
                  Next Lesson
                  <svg className="w-4 h-4 md:w-5 md:h-5 ml-1 md:ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ) : (
                <Link to={`/courses/${courseId}`} className="btn btn-primary text-sm md:text-base">
                  Finish Course
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar - Course Content */}
        <div className={`lg:w-1/4 bg-white border-l transition-all duration-300 ${
          sidebarOpen ? 'max-h-[50vh] overflow-y-auto' : 'max-h-0 lg:max-h-none overflow-hidden lg:overflow-visible'
        }`}>
          <div className="p-3 md:p-4 border-b hidden lg:block">
            <Link to={`/courses/${courseId}`} className="font-semibold text-gray-900 hover:text-primary-600 text-sm md:text-base">
              ← {course?.title}
            </Link>
          </div>
          <div className="overflow-y-auto lg:h-[calc(100vh-80px)]">
            {lessons.map((lesson, index) => (
              <Link
                key={lesson._id}
                to={`/lesson/${courseId}/${lesson._id}`}
                className={`flex items-start gap-2 md:gap-3 p-3 md:p-4 border-b hover:bg-gray-50 transition-colors ${
                  lesson._id === lessonId ? 'bg-primary-50 border-l-4 border-l-primary-500' : ''
                }`}
              >
                <div className={`w-6 md:w-8 h-6 md:h-8 rounded-full flex items-center justify-center text-xs md:text-sm font-medium flex-shrink-0 ${
                  lesson._id === lessonId ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className={`font-medium text-xs md:text-sm ${lesson._id === lessonId ? 'text-primary-600' : 'text-gray-900'}`}>
                    {lesson.title}
                  </h4>
                  <span className="text-xs text-gray-500">
                    {formatDuration(lesson.videoDuration)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonView;


import { useState, useEffect } from 'react';
import { lessonAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const LessonCurriculum = ({ courseId, course }) => {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchLessons();
  }, [courseId]);

  const fetchLessons = async () => {
    try {
      const response = await lessonAPI.getByCourse(courseId);
      if (response.data.success) {
        setLessons(response.data.lessons);
        // Auto-select first lesson
        if (response.data.lessons.length > 0 && !selectedLesson) {
          setSelectedLesson(response.data.lessons[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching lessons:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLessonComplete = async (lessonId) => {
    try {
      const response = await lessonAPI.complete(lessonId);
      if (response.data.success) {
        toast.success(`+${response.data.pointsEarned} points earned!`);
        fetchLessons(); // Refresh to show completion status
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to complete lesson');
    }
  };

  const canAccessLesson = (lesson) => {
    // Check if user is enrolled
    if (!user) return false;
    if (user.role === 'admin' || user.role === 'teacher') return true;
    if (lesson.isFree || lesson.isPreview) return true;
    
    // Check if enrolled in course
    const isEnrolled = user.enrolledCourses?.some(
      id => id.toString() === courseId || (id._id && id._id.toString() === courseId)
    );
    return isEnrolled;
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '0 min';
    const mins = Math.floor(seconds / 60);
    return `${mins} min`;
  };

  const isLessonCompleted = (lesson) => {
    if (!user) return false;
    return lesson.completedBy?.some(
      c => c.user?.toString() === user._id || c.user === user._id
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
      {/* Lessons List */}
      <div className="lg:col-span-1">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Course Content ({lessons.length} lessons)
        </h3>
        
        <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
          {lessons.map((lesson, index) => {
            const completed = isLessonCompleted(lesson);
            const accessible = canAccessLesson(lesson);
            
            return (
              <div
                key={lesson._id}
                onClick={() => accessible && setSelectedLesson(lesson)}
                className={`p-3 rounded-lg cursor-pointer transition-all ${
                  selectedLesson?._id === lesson._id
                    ? 'bg-primary-50 border-primary-500 border'
                    : accessible
                    ? 'bg-white border border-gray-200 hover:border-primary-300'
                    : 'bg-gray-50 border border-gray-200 opacity-60 cursor-not-allowed'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    completed 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {completed ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      index + 1
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 text-sm truncate">
                      {lesson.title}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                      {lesson.videoDuration > 0 && (
                        <span>{formatDuration(lesson.videoDuration)}</span>
                      )}
                      {lesson.isFree && (
                        <span className="text-green-600 font-medium">Free</span>
                      )}
                    </div>
                  </div>
                  {!accessible && (
                    <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Video Player / Lesson Content */}
      <div className="lg:col-span-2">
        {selectedLesson ? (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {/* Video Player */}
            {selectedLesson.videoUrl && canAccessLesson(selectedLesson) ? (
              <div className="aspect-video bg-black">
                {selectedLesson.videoUrl.includes('youtube') || selectedLesson.videoUrl.includes('youtu.be') ? (
                  <iframe
                    src={selectedLesson.videoUrl.replace('watch?v=', 'embed/')}
                    title={selectedLesson.title}
                    className="w-full h-full"
                    allowFullScreen
                  />
                ) : selectedLesson.videoUrl.startsWith('/uploads') ? (
                  <video
                    src={selectedLesson.videoUrl}
                    controls
                    className="w-full h-full"
                  />
                ) : (
                  <iframe
                    src={selectedLesson.videoUrl}
                    title={selectedLesson.title}
                    className="w-full h-full"
                    allowFullScreen
                  />
                )}
              </div>
            ) : (
              <div className="aspect-video bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                  <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-gray-500 mt-2">No video available</p>
                </div>
              </div>
            )}

            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedLesson.title}</h2>
                  {selectedLesson.section && (
                    <p className="text-sm text-gray-500 mt-1">{selectedLesson.section}</p>
                  )}
                </div>
                {canAccessLesson(selectedLesson) && !isLessonCompleted(selectedLesson) && (
                  <button
                    onClick={() => handleLessonComplete(selectedLesson._id)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Mark Complete
                  </button>
                )}
                {isLessonCompleted(selectedLesson) && (
                  <span className="px-4 py-2 bg-green-100 text-green-700 rounded-lg flex items-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Completed
                  </span>
                )}
              </div>

              {/* Description */}
              {selectedLesson.description && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-600 text-sm">{selectedLesson.description}</p>
                </div>
              )}

              {/* PDF Notes */}
              {selectedLesson.notes && canAccessLesson(selectedLesson) && (
                <div className="border-t border-gray-200 pt-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Study Materials</h3>
                  <a
                    href={selectedLesson.notes}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">View PDF Notes</span>
                    <svg className="w-4 h-4 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              )}

              {/* Access Message */}
              {!canAccessLesson(selectedLesson) && (
                <div className="border-t border-gray-200 pt-4">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-yellow-800 text-sm">
                      {!user ? (
                        <>Please <a href="/login" className="underline font-medium">login</a> to access this lesson.</>
                      ) : (
                        <>Enroll in this course to access all lessons.</>
                      )}
                    </p>
                    {!user && (
                      <button
                        onClick={() => navigate('/login')}
                        className="mt-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                      >
                        Login to Access
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <p className="text-gray-500 mt-2">Select a lesson to start learning</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonCurriculum;


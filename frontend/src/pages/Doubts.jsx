import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { doubtAPI, courseAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const Doubts = () => {
  const [doubts, setDoubts] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAskModal, setShowAskModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [filter, setFilter] = useState('all');
  
  // Form state
  const [question, setQuestion] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');

  useEffect(() => {
    fetchDoubts();
    fetchCourses();
  }, []);

  const fetchDoubts = async () => {
    try {
      const response = await doubtAPI.getMy();
      setDoubts(response.data.doubts || []);
    } catch (error) {
      console.error('Error fetching doubts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await courseAPI.getMyCourses();
      setCourses(response.data.courses || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const handleSubmitDoubt = async (e) => {
    e.preventDefault();
    
    if (!question.trim()) {
      toast.error('Please enter your question');
      return;
    }

    setSubmitting(true);
    try {
      const data = {
        question: question.trim(),
        course: selectedCourse || undefined
      };
      
      const response = await doubtAPI.ask(data);
      
      if (response.data.success) {
        toast.success('Question submitted! AI has provided an answer.');
        setQuestion('');
        setSelectedCourse('');
        setShowAskModal(false);
        fetchDoubts();
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to submit question';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleResolve = async (doubtId) => {
    try {
      await doubtAPI.resolve(doubtId);
      toast.success('Marked as resolved');
      fetchDoubts();
    } catch (error) {
      toast.error('Failed to update');
    }
  };

  const handleUpvote = async (doubtId) => {
    try {
      await doubtAPI.upvote(doubtId);
      fetchDoubts();
    } catch (error) {
      console.error('Upvote error:', error);
    }
  };

  const filteredDoubts = doubts.filter(doubt => {
    if (filter === 'all') return true;
    return doubt.status === filter;
  });

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      answered: 'bg-blue-100 text-blue-800',
      resolved: 'bg-green-100 text-green-800'
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
      
      <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 pt-20 md:pt-24">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 md:mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-gray-900 mb-2">
              ❓ Ask Doubts
            </h1>
            <p className="text-gray-600">Get instant AI answers to your questions</p>
          </div>
          <button
            onClick={() => setShowAskModal(true)}
            className="btn btn-primary"
          >
            + Ask a Question
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8">
          <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm text-center">
            <div className="text-2xl md:text-3xl font-bold text-gray-900">{doubts.length}</div>
            <div className="text-xs md:text-sm text-gray-500">Total Questions</div>
          </div>
          <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm text-center">
            <div className="text-2xl md:text-3xl font-bold text-green-600">
              {doubts.filter(d => d.status === 'resolved').length}
            </div>
            <div className="text-xs md:text-sm text-gray-500">Resolved</div>
          </div>
          <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm text-center">
            <div className="text-2xl md:text-3xl font-bold text-blue-600">
              {doubts.reduce((sum, d) => sum + (d.upvotes || 0), 0)}
            </div>
            <div className="text-xs md:text-sm text-gray-500">Total Upvotes</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          {['all', 'pending', 'answered', 'resolved'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                filter === status
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Doubt List */}
        <div className="space-y-4">
          {filteredDoubts.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center">
              <div className="text-5xl mb-4">❓</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No questions yet</h3>
              <p className="text-gray-500 mb-4">Ask your first question to get help</p>
              <button
                onClick={() => setShowAskModal(true)}
                className="btn btn-primary"
              >
                Ask a Question
              </button>
            </div>
          ) : (
            filteredDoubts.map(doubt => (
              <div key={doubt._id} className="bg-white rounded-xl shadow-sm p-4 md:p-6">
                {/* Question */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold flex-shrink-0">
                      ?
                    </div>
                    <div>
                      <p className="text-gray-900 font-medium">{doubt.question}</p>
                      <div className="flex flex-wrap items-center gap-2 mt-2 text-sm text-gray-500">
                        <span>{formatDate(doubt.createdAt)}</span>
                        {doubt.course && (
                          <Link to={`/courses/${doubt.course._id}`} className="text-primary-600 hover:text-primary-700">
                            📚 {doubt.course.title}
                          </Link>
                        )}
                        {getStatusBadge(doubt.status)}
                        {doubt.aiGenerated && (
                          <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs">🤖 AI Answered</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleUpvote(doubt._id)}
                    className="flex items-center gap-1 text-gray-500 hover:text-primary-600 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                    <span className="text-sm">{doubt.upvotes || 0}</span>
                  </button>
                </div>

                {/* Answer */}
                {doubt.answer && (
                  <div className="ml-13 pl-13 bg-purple-50 rounded-xl p-4 border border-purple-100">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">🤖</span>
                      <span className="font-semibold text-purple-700">AI Answer</span>
                    </div>
                    <p className="text-gray-700 whitespace-pre-wrap">{doubt.answer}</p>
                  </div>
                )}

                {/* Actions */}
                {doubt.status !== 'resolved' && (
                  <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
                    <button
                      onClick={() => handleResolve(doubt._id)}
                      className="text-sm text-green-600 hover:text-green-700 font-medium"
                    >
                      ✓ Mark as Resolved
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Ask Doubt Modal */}
      {showAskModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div 
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
              onClick={() => setShowAskModal(false)}
            ></div>

            <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">❓ Ask a Question</h3>
                  <button
                    onClick={() => setShowAskModal(false)}
                    className="text-white hover:text-gray-200"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmitDoubt} className="px-6 py-6">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Course (Optional)
                  </label>
                  <select
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">General Question</option>
                    {courses.map(course => (
                      <option key={course._id} value={course._id}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Question *
                  </label>
                  <textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Type your question here... (e.g., What is differentiation in calculus?)"
                    rows={5}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    required
                  />
                </div>

                <div className="bg-purple-50 rounded-lg p-3 mb-4">
                  <p className="text-sm text-purple-700">
                    💡 <strong>Tip:</strong> Our AI will analyze your question and provide an instant answer. 
                    For more detailed help, you can also use the AI Chat assistant.
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAskModal(false)}
                    className="flex-1 btn bg-gray-100 text-gray-700 hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 btn btn-primary"
                  >
                    {submitting ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Submitting...
                      </span>
                    ) : (
                      '🤖 Ask AI'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Doubts;


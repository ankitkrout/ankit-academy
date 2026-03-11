import { useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const AddLessonModal = ({ courseId, onClose, onLessonAdded }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    videoUrl: '',
    videoDuration: '',
    notesUrl: '',
    section: 'Main Content',
    isFree: false,
    isPreview: false,
    order: ''
  });
  const [videoFile, setVideoFile] = useState(null);
  const [notesFile, setNotesFile] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === 'video') {
      setVideoFile(files[0]);
    } else if (name === 'notes') {
      setNotesFile(files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let lessonData;
      let config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };

      // If files are selected, use FormData
      if (videoFile || notesFile) {
        const formDataObj = new FormData();
        formDataObj.append('title', formData.title);
        formDataObj.append('description', formData.description);
        formDataObj.append('course', courseId);
        
        if (formData.videoUrl) {
          formDataObj.append('videoUrl', formData.videoUrl);
        }
        if (formData.videoDuration) {
          // Convert minutes to seconds
          formDataObj.append('videoDuration', parseInt(formData.videoDuration) * 60);
        }
        if (formData.notesUrl) {
          formDataObj.append('notes', formData.notesUrl);
        }
        formDataObj.append('section', formData.section);
        formDataObj.append('isFree', formData.isFree);
        formDataObj.append('isPreview', formData.isPreview);
        formDataObj.append('order', formData.order || 0);

        if (videoFile) {
          formDataObj.append('video', videoFile);
        }
        if (notesFile) {
          formDataObj.append('notes', notesFile);
        }

        config = {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        };

        const response = await api.post('/lessons/create', formDataObj, config);
        
        if (response.data.success) {
          toast.success('Lesson created successfully!');
          onLessonAdded(response.data.lesson);
          onClose();
          return;
        }
      } else {
        // Use regular JSON request for URL-based lessons
        lessonData = {
          title: formData.title,
          description: formData.description,
          course: courseId,
          videoUrl: formData.videoUrl || '',
          videoDuration: formData.videoDuration ? parseInt(formData.videoDuration) * 60 : 0,
          notes: formData.notesUrl || '',
          section: formData.section,
          isFree: formData.isFree,
          isPreview: formData.isPreview,
          order: parseInt(formData.order) || 0
        };
      }

      const response = await api.post('/lessons', lessonData);
      
      if (response.data.success) {
        toast.success('Lesson created successfully!');
        onLessonAdded(response.data.lesson);
        onClose();
      }
    } catch (error) {
      console.error('Error creating lesson:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create lesson';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 md:p-6 border-b border-gray-200 sticky top-0 bg-white">
          <div className="flex justify-between items-center">
            <h2 className="text-lg md:text-xl font-bold text-gray-900">Add New Lesson</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 p-1"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-4">
          {/* Lesson Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lesson Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="e.g., Introduction to Algebra"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="What will students learn in this lesson?"
            />
          </div>

          {/* Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Section / Chapter
            </label>
            <input
              type="text"
              name="section"
              value={formData.section}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="e.g., Chapter 1, Introduction"
            />
          </div>

          {/* Video Source Toggle */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-3">Video Content</h3>
            
            {/* Video URL */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Video URL (YouTube/Vimeo/Drive)
              </label>
              <input
                type="url"
                name="videoUrl"
                value={formData.videoUrl}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="https://youtube.com/watch?v=..."
              />
              <p className="text-xs text-gray-500 mt-1">Paste a YouTube, Vimeo, or Google Drive video link</p>
            </div>

            <div className="text-center text-gray-400 text-sm mb-4">- OR -</div>

            {/* Video Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload Video File
              </label>
              <input
                type="file"
                name="video"
                onChange={handleFileChange}
                accept="video/*"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              {videoFile && (
                <p className="mt-1 text-sm text-green-600 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Selected: {videoFile.name}
                </p>
              )}
            </div>
          </div>

          {/* Video Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Video Duration (minutes)
            </label>
            <input
              type="number"
              name="videoDuration"
              value={formData.videoDuration}
              onChange={handleChange}
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="e.g., 15"
            />
          </div>

          {/* Notes Source Toggle */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-3">Study Materials (PDF)</h3>
            
            {/* Notes URL */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes URL
              </label>
              <input
                type="url"
                name="notesUrl"
                value={formData.notesUrl}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="URL to PDF notes"
              />
            </div>

            <div className="text-center text-gray-400 text-sm mb-4">- OR -</div>

            {/* PDF Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload PDF Notes
              </label>
              <input
                type="file"
                name="notes"
                onChange={handleFileChange}
                accept="application/pdf"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              {notesFile && (
                <p className="mt-1 text-sm text-green-600 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Selected: {notesFile.name}
                </p>
              )}
            </div>
          </div>

          {/* Order */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lesson Order
            </label>
            <input
              type="number"
              name="order"
              value={formData.order}
              onChange={handleChange}
              min="1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Auto-generated if empty"
            />
          </div>

          {/* Checkboxes */}
          <div className="flex flex-col sm:flex-row gap-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="isFree"
                checked={formData.isFree}
                onChange={handleChange}
                className="mr-2 h-4 w-4 text-primary-600 focus:ring-primary-500 rounded"
              />
              <span className="text-sm text-gray-700">Free Lesson</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="isPreview"
                checked={formData.isPreview}
                onChange={handleChange}
                className="mr-2 h-4 w-4 text-primary-600 focus:ring-primary-500 rounded"
              />
              <span className="text-sm text-gray-700">Preview Available</span>
            </label>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </>
              ) : (
                'Create Lesson'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLessonModal;


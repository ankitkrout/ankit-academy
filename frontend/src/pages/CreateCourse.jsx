import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { courseAPI } from '../services/api';
import CourseLessons from '../components/CourseLessons';
import toast from 'react-hot-toast';

const CreateCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [course, setCourse] = useState(null);
  const [showLessons, setShowLessons] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    shortDescription: '',
    category: 'Mathematics',
    class: '8',
    level: 'Beginner',
    isFree: true,
    price: 0,
    outcomes: [''],
    requirements: ['']
  });

  useEffect(() => {
    if (isEdit) {
      fetchCourse();
    }
  }, [id]);

  const fetchCourse = async () => {
    try {
      const response = await courseAPI.getById(id);
      const course = response.data.course;
      setCourse(course);
      setTags(course.tags || []);
      setFormData({
        title: course.title || '',
        description: course.description || '',
        shortDescription: course.shortDescription || '',
        category: course.category || 'Mathematics',
        class: String(course.class || '8'),
        level: course.level || 'Beginner',
        isFree: course.isFree ?? true,
        price: course.price || 0,
        outcomes: course.outcomes?.length ? course.outcomes : [''],
        requirements: course.requirements?.length ? course.requirements : ['']
      });
    } catch (error) {
      toast.error('Failed to load course');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleArrayChange = (index, field, value) => {
    setFormData(prev => {
      const updated = [...prev[field]];
      updated[index] = value;
      return { ...prev, [field]: updated };
    });
  };

  const addArrayItem = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (index, field) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  // Tag handling
  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };

  const addTag = () => {
    const newTag = tagInput.trim();
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = {
        ...formData,
        class: parseInt(formData.class),
        price: formData.isFree ? 0 : parseInt(formData.price || 0),
        outcomes: formData.outcomes.filter(o => o.trim()),
        requirements: formData.requirements.filter(r => r.trim()),
        tags: tags
      };

      if (isEdit) {
        await courseAPI.update(id, data);
        toast.success('Course updated successfully');
      } else {
        await courseAPI.create(data);
        toast.success('Course created successfully');
      }

      navigate('/teacher/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save course');
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    'Mathematics', 'Science', 'English', 'Social Science', 
    'Computer', 'Physics', 'Chemistry', 'Biology', 
    'Accountancy', 'Economics', 'Business Studies'
  ];

  const levelOptions = [
    { value: 'Beginner', label: 'Beginner', desc: 'New to the subject' },
    { value: 'Intermediate', label: 'Intermediate', desc: 'Some basic knowledge' },
    { value: 'Advanced', label: 'Advanced', desc: 'Thorough understanding required' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-24 md:pb-8">
      <Navbar />
      
      <div className="max-w-3xl mx-auto px-3 sm:px-4 py-6 md:py-8 pt-20 md:pt-24">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-gray-900 mb-2">
            {isEdit ? 'Edit Course' : 'Create New Course'}
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            {isEdit ? 'Update your course details and curriculum' : 'Share your knowledge and create an engaging course for students'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Basic Information
            </h2>
            
            <div className="space-y-4 md:space-y-5">
              <div>
                <label className="label">Course Title *</label>
                <input
                  type="text"
                  name="title"
                  className="input"
                  placeholder="e.g., Complete Mathematics for Class 10"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Choose a clear, descriptive title that students can easily understand</p>
              </div>

              <div>
                <label className="label">Short Description</label>
                <input
                  type="text"
                  name="shortDescription"
                  className="input"
                  placeholder="e.g., Master algebra, geometry, and statistics for Class 10 board exams"
                  value={formData.shortDescription}
                  onChange={handleChange}
                  maxLength={200}
                />
                <p className="text-xs text-gray-500 mt-1">{formData.shortDescription.length}/200 characters</p>
              </div>

              <div>
                <label className="label">Full Description *</label>
                <textarea
                  name="description"
                  className="input min-h-[120px]"
                  placeholder="Describe what students will learn, the teaching approach, and what makes your course unique..."
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Category *</label>
                  <select
                    name="category"
                    className="input"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="label">Class *</label>
                  <select
                    name="class"
                    className="input"
                    value={formData.class}
                    onChange={handleChange}
                  >
                    {[8, 9, 10, 11, 12].map(cls => (
                      <option key={cls} value={cls}>Class {cls}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="label">Difficulty Level</label>
                <div className="grid sm:grid-cols-3 gap-2">
                  {levelOptions.map(level => (
                    <label
                      key={level.value}
                      className={`relative flex items-start p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        formData.level === level.value
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="level"
                        value={level.value}
                        checked={formData.level === level.value}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div className="flex-1">
                        <span className="block text-sm font-medium text-gray-900">{level.label}</span>
                        <span className="block text-xs text-gray-500">{level.desc}</span>
                      </div>
                      {formData.level === level.value && (
                        <svg className="w-5 h-5 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </label>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="label">Tags (Press Enter or comma to add)</label>
                <div className="border border-gray-200 rounded-xl focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-transparent">
                  <div className="flex flex-wrap gap-2 p-3">
                    {tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="w-4 h-4 flex items-center justify-center rounded-full hover:bg-primary-200"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </span>
                    ))}
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleTagKeyDown}
                      onBlur={addTag}
                      placeholder={tags.length === 0 ? "e.g., algebra, geometry, formulas (press Enter)" : ""}
                      className="flex-1 min-w-[120px] bg-transparent outline-none text-sm"
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Add relevant tags to help students find your course</p>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Pricing
            </h2>
            
            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="isFree"
                  id="isFree"
                  checked={formData.isFree}
                  onChange={handleChange}
                  className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                />
                <span className="text-gray-700 font-medium">This course is free</span>
              </label>
              <p className="text-sm text-gray-500 ml-8 mt-1">
                Free courses are great for building your teaching reputation
              </p>
            </div>

            {!formData.isFree && (
              <div className="animate-fade-in">
                <label className="label">Course Price (₹)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                  <input
                    type="number"
                    name="price"
                    className="input pl-8"
                    placeholder="499"
                    value={formData.price}
                    onChange={handleChange}
                    min="0"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Recommended: ₹299 - ₹1999 for video courses</p>
              </div>
            )}
          </div>

          {/* Outcomes */}
          <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              What You'll Learn
            </h2>
            <p className="text-sm text-gray-600 mb-4">List the key skills and knowledge students will gain from this course</p>
            
            <div className="space-y-3">
              {formData.outcomes.map((outcome, index) => (
                <div key={index} className="flex gap-2">
                  <div className="flex items-center justify-center w-8 h-10 bg-primary-100 rounded-lg text-primary-600 text-sm font-medium flex-shrink-0">
                    {index + 1}
                  </div>
                  <input
                    type="text"
                    className="input flex-1"
                    placeholder="e.g., Solve algebraic equations with confidence"
                    value={outcome}
                    onChange={(e) => handleArrayChange(index, 'outcomes', e.target.value)}
                  />
                  {formData.outcomes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem(index, 'outcomes')}
                      className="btn btn-secondary btn-sm flex-shrink-0"
                      title="Remove"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => addArrayItem('outcomes')}
              className="btn btn-outline btn-sm mt-3"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Another Outcome
            </button>
          </div>

          {/* Requirements */}
          <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Requirements
            </h2>
            <p className="text-sm text-gray-600 mb-4">What students need to know before taking this course</p>
            
            <div className="space-y-3">
              {formData.requirements.map((req, index) => (
                <div key={index} className="flex gap-2">
                  <div className="flex items-center justify-center w-8 h-10 bg-gray-100 rounded-lg text-gray-600 text-sm font-medium flex-shrink-0">
                    {index + 1}
                  </div>
                  <input
                    type="text"
                    className="input flex-1"
                    placeholder="e.g., Basic understanding of Class 9 mathematics"
                    value={req}
                    onChange={(e) => handleArrayChange(index, 'requirements', e.target.value)}
                  />
                  {formData.requirements.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem(index, 'requirements')}
                      className="btn btn-secondary btn-sm flex-shrink-0"
                      title="Remove"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => addArrayItem('requirements')}
              className="btn btn-outline btn-sm mt-3"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Another Requirement
            </button>
          </div>

          {/* Submit */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn btn-secondary flex-1 order-2 sm:order-1"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary flex-1 order-1 sm:order-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {isEdit ? 'Update Course' : 'Create Course'}
                </>
              )}
            </button>
          </div>
        </form>

        {/* Curriculum Section - Only show for edit mode */}
        {isEdit && (
          <div className="mt-8 md:mt-10">
            <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Course Curriculum</h2>
                <button
                  type="button"
                  onClick={() => setShowLessons(!showLessons)}
                  className="btn btn-outline btn-sm"
                >
                  {showLessons ? 'Hide Lessons' : 'Manage Lessons'}
                </button>
              </div>
              
              {showLessons && (
                <CourseLessons 
                  courseId={id} 
                  onLessonsChange={(lessons) => console.log('Lessons updated:', lessons)} 
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateCourse;


import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { courseAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const Courses = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [showFilters, setShowFilters] = useState(false);
  
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    class: searchParams.get('class') || '',
    search: searchParams.get('search') || '',
    sort: '-createdAt'
  });

  useEffect(() => {
    fetchCourses();
  }, [filters, pagination.page]);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const params = {
        ...filters,
        page: pagination.page,
        limit: 12
      };
      // Remove empty values
      Object.keys(params).forEach(key => !params[key] && delete params[key]);
      
      const response = await courseAPI.getAll(params);
      setCourses(response.data.courses);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
    
    // Update URL params
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const categories = [
    'Mathematics', 'Science', 'English', 'Social Science', 
    'Computer', 'Physics', 'Chemistry', 'Biology'
  ];

  const classes = [8, 9, 10, 11, 12];

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-0">
      <Navbar />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 pt-20 md:pt-24 pb-8 md:pb-12">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-white mb-2 md:mb-4">
            Explore Courses
          </h1>
          <p className="text-primary-100 text-sm md:text-lg">
            Find the perfect course for your learning journey
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-6 md:py-8">
        <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-between w-full px-4 py-3 bg-white rounded-lg shadow-sm"
            >
              <span className="font-medium text-gray-900">Filters</span>
              <svg 
                className={`w-5 h-5 text-gray-500 transition-transform ${showFilters ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {/* Filters Sidebar */}
          <div className={`lg:w-1/4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-2xl shadow-sm p-4 md:p-6 lg:sticky lg:top-24">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
              
              {/* Search */}
              <div className="mb-4 md:mb-6">
                <label className="label">Search</label>
                <input
                  type="text"
                  placeholder="Search courses..."
                  className="input"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                />
              </div>

              {/* Category */}
              <div className="mb-4 md:mb-6">
                <label className="label">Category</label>
                <select
                  className="input"
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                >
                  <option value="">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Class */}
              <div className="mb-4 md:mb-6">
                <label className="label">Class</label>
                <select
                  className="input"
                  value={filters.class}
                  onChange={(e) => handleFilterChange('class', e.target.value)}
                >
                  <option value="">All Classes</option>
                  {classes.map(cls => (
                    <option key={cls} value={cls}>Class {cls}</option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <div className="mb-4 md:mb-6">
                <label className="label">Sort By</label>
                <select
                  className="input"
                  value={filters.sort}
                  onChange={(e) => handleFilterChange('sort', e.target.value)}
                >
                  <option value="-createdAt">Newest First</option>
                  <option value="createdAt">Oldest First</option>
                  <option value="-rating">Highest Rated</option>
                  <option value="-totalEnrolled">Most Popular</option>
                </select>
              </div>

              <button
                onClick={() => {
                  setFilters({ category: '', class: '', search: '', sort: '-createdAt' });
                  setSearchParams({});
                }}
                className="w-full btn btn-secondary"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Courses Grid */}
          <div className="lg:w-3/4">
            {/* Results Count */}
            <div className="mb-4 md:mb-6">
              <p className="text-gray-600 text-sm md:text-base">
                Showing {courses.length} of {pagination.total} courses
              </p>
            </div>

            {loading ? (
              <LoadingSpinner />
            ) : courses.length === 0 ? (
              <div className="text-center py-12 md:py-20">
                <div className="text-5xl md:text-6xl mb-4">📚</div>
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">No courses found</h3>
                <p className="text-gray-600 text-sm md:text-base">Try adjusting your filters</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                {courses.map((course) => (
                  <Link 
                    key={course._id}
                    to={`/courses/${course._id}`}
                    className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 group overflow-hidden"
                  >
                    <div className="h-40 md:h-48 bg-gradient-to-br from-primary-400 to-primary-600 relative overflow-hidden">
                      {course.thumbnail ? (
                        <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-5xl md:text-6xl">
                          {course.category === 'Mathematics' ? '📐' : course.category === 'Science' ? '🔬' : '📚'}
                        </div>
                      )}
                      <div className="absolute top-3 md:top-4 right-3 md:right-4 bg-white/90 backdrop-blur-sm px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium text-primary-700">
                        {course.isFree ? 'Free' : `₹${course.price}`}
                      </div>
                    </div>
                    <div className="p-4 md:p-5">
                      <div className="flex items-center gap-2 text-xs md:text-sm text-gray-500 mb-2">
                        <span className="badge badge-primary text-xs">{course.category}</span>
                        <span>•</span>
                        <span>Class {course.class}</span>
                      </div>
                      <h3 className="text-sm md:text-base font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
                        {course.title}
                      </h3>
                      <p className="text-gray-600 text-xs md:text-sm mb-3 md:mb-4 line-clamp-2">{course.description}</p>
                      
                      <div className="flex items-center justify-between pt-3 md:pt-4 border-t">
                        <div className="flex items-center gap-2">
                          <div className="w-6 md:w-8 h-6 md:h-8 bg-primary-100 rounded-full flex items-center justify-center">
                            <span className="text-primary-600 text-xs md:text-sm font-medium">
                              {course.instructorName?.charAt(0)}
                            </span>
                          </div>
                          <span className="text-xs md:text-sm text-gray-600 truncate max-w-[80px] md:max-w-none">{course.instructorName}</span>
                        </div>
                        <div className="flex items-center gap-2 md:gap-3 text-xs md:text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <svg className="w-3 md:w-4 h-3 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            {course.totalLessons}
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="text-yellow-500">★</span>
                            {course.rating || '4.5'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                  disabled={pagination.page === 1}
                  className="btn btn-secondary"
                >
                  Previous
                </button>
                <span className="flex items-center px-4 text-gray-600">
                  Page {pagination.page} of {pagination.pages}
                </span>
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                  disabled={pagination.page === pagination.pages}
                  className="btn btn-secondary"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Courses;


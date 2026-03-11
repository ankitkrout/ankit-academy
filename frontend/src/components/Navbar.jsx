import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { courseAPI } from '../services/api';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [searching, setSearching] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }
    
    setSearching(true);
    try {
      const response = await courseAPI.getAll({ search: query, limit: 5 });
      setSearchResults(response.data.courses || []);
      setShowResults(true);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setSearching(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchQuery)}`);
      setShowResults(false);
      setSearchQuery('');
      setIsSearchOpen(false);
    }
  };

  const handleResultClick = (courseId) => {
    navigate(`/courses/${courseId}`);
    setShowResults(false);
    setSearchQuery('');
    setIsMenuOpen(false);
  };

  const handleNavClick = (path) => {
    navigate(path);
    setIsMenuOpen(false);
    setIsSearchOpen(false);
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo Section */}
          <Link 
            to="/" 
            className="flex items-center gap-2 sm:gap-3 group"
            onClick={() => setIsMenuOpen(false)}
          >
            {/* Logo Icon */}
            <div className="w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg sm:rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow duration-300 flex-shrink-0">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#60A5FA"/>
                    <stop offset="100%" stopColor="#2563EB"/>
                  </linearGradient>
                </defs>
                <circle cx="32" cy="32" r="30" fill="url(#logoGrad)"/>
                <path d="M20 18C20 16.9 20.9 16 22 16H38C39.1 16 40 16.9 40 18V46C40 47.1 39.1 48 38 48H22C20.9 48 20 47.1 20 46V18Z" fill="white" fillOpacity="0.95"/>
                <rect x="20" y="16" width="4" height="32" fill="white" fillOpacity="0.3"/>
                <line x1="27" y1="24" x2="36" y2="24" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round"/>
                <line x1="27" y1="30" x2="36" y2="30" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round"/>
                <line x1="27" y1="36" x2="33" y2="36" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            {/* Logo Text */}
            <div className="flex flex-col hidden sm:block">
              <span className="text-base sm:text-lg lg:text-xl font-heading font-bold text-gray-900 leading-tight">
                Ankit <span className="text-primary-600">Academy</span>
              </span>
              <span className="text-[10px] sm:text-xs text-gray-500 font-medium hidden md:block">
                Smart Learning
              </span>
            </div>
          </Link>

{/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-3 xl:gap-4">
            {/* Search Bar */}
            <div className="relative">
              <form onSubmit={handleSearchSubmit}>
                <input
                  type="text"
                  placeholder="Search courses..."
                  className="w-52 xl:w-64 pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
                  onBlur={() => setTimeout(() => setShowResults(false), 200)}
                />
                <svg 
                  className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </form>
              
              {/* Search Results Dropdown */}
              {showResults && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg max-h-80 overflow-y-auto z-50">
                  {searching ? (
                    <div className="p-4 text-center text-gray-500">Searching...</div>
                  ) : searchResults.length > 0 ? (
                    <>
                      {searchResults.map((course) => (
                        <div
                          key={course._id}
                          onClick={() => handleResultClick(course._id)}
                          className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                        >
                          <div className="font-medium text-gray-900">{course.title}</div>
                          <div className="text-sm text-gray-500">{course.category} • Class {course.class}</div>
                        </div>
                      ))}
                      <div 
                        onClick={() => { navigate(`/courses?search=${searchQuery}`); setShowResults(false); }}
                        className="p-3 text-center text-primary-600 hover:bg-gray-50 cursor-pointer border-t"
                      >
                        View all results →
                      </div>
                    </>
                  ) : (
                    <div className="p-4 text-center text-gray-500">No courses found</div>
                  )}
                </div>
              )}
            </div>
            
            <Link to="/" className="text-gray-600 hover:text-primary-600 font-medium transition-colors">
              Home
            </Link>
            <Link to="/courses" className="text-gray-600 hover:text-primary-600 font-medium transition-colors">
              Courses
            </Link>
            <Link to="/leaderboard" className="text-gray-600 hover:text-primary-600 font-medium transition-colors">
              Leaderboard
            </Link>
          </div>

          {/* Auth Buttons - Desktop */}
          <div className="hidden lg:flex items-center gap-3 xl:gap-4">
            {user ? (
              <div className="relative group">
                <button className="flex items-center gap-2 text-gray-700 hover:text-primary-600">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-semibold text-sm">
                      {user.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="font-medium max-w-[100px] truncate">{user.name}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* Dropdown */}
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  {user.role === 'student' && (
                    <>
                      <Link to="/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-600">
                        📊 My Dashboard
                      </Link>
                      <Link to="/my-courses" className="block px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-600">
                        📚 My Courses
                      </Link>
                      <Link to="/my-payments" className="block px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-600">
                        💳 My Payments
                      </Link>
                      <Link to="/live-classes" className="block px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-600">
                        📹 Live Classes
                      </Link>
                      <Link to="/doubts" className="block px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-600">
                        ❓ Ask Doubts
                      </Link>
                      <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-600">
                        👤 My Profile
                      </Link>
                    </>
                  )}
                  {user.role === 'teacher' && (
                    <>
                      <Link to="/teacher/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-600">
                        📊 Teacher Dashboard
                      </Link>
                      <Link to="/teacher/create-course" className="block px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-600">
                        ➕ Create Course
                      </Link>
                      <Link to="/teacher/live-classes" className="block px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-600">
                        📹 Live Classes
                      </Link>
                    </>
                  )}
                  {user.role === 'admin' && (
                    <Link to="/admin/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-600">
                      ⚙️ Admin Dashboard
                    </Link>
                  )}
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50">
                    🚪 Logout
                  </button>
                </div>
              </div>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-primary-600 font-medium">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Action Buttons */}
          <div className="flex items-center gap-1 lg:hidden">
            {/* Mobile Search Toggle */}
            <button 
              className="p-2 text-gray-600 touch-manipulation"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              aria-label="Search"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Mobile Menu Button */}
            <button 
              className="p-2 text-gray-600 touch-manipulation"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isSearchOpen && (
          <div className="lg:hidden pb-3">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search courses..."
                className="w-full pl-10 pr-4 py-2.5 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                autoFocus
              />
              <svg 
                className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </form>
            {/* Mobile Search Results */}
            {showResults && searchResults.length > 0 && (
              <div className="absolute left-4 right-4 mt-1 bg-white rounded-lg shadow-lg max-h-60 overflow-y-auto z-50 border">
                {searchResults.map((course) => (
                  <div
                    key={course._id}
                    onClick={() => handleResultClick(course._id)}
                    className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                  >
                    <div className="font-medium text-gray-900 text-sm">{course.title}</div>
                    <div className="text-xs text-gray-500">{course.category} • Class {course.class}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t">
          <div className="px-3 py-3 space-y-1">
            <button 
              onClick={() => handleNavClick('/')} 
              className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg touch-manipulation"
            >
              Home
            </button>
            <button 
              onClick={() => handleNavClick('/courses')} 
              className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg touch-manipulation"
            >
              Courses
            </button>
            <button 
              onClick={() => handleNavClick('/leaderboard')} 
              className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg touch-manipulation"
            >
              Leaderboard
            </button>
            
            <div className="border-t border-gray-100 pt-2 mt-2">
              {user ? (
                <>
                  {user.role === 'student' && (
                    <>
                      <button 
                        onClick={() => handleNavClick('/dashboard')} 
                        className="block w-full text-left px-4 py-3 text-primary-600 hover:bg-primary-50 rounded-lg font-medium touch-manipulation"
                      >
                        My Dashboard
                      </button>
                      <button 
                        onClick={() => handleNavClick('/profile')} 
                        className="block w-full text-left px-4 py-3 text-primary-600 hover:bg-primary-50 rounded-lg font-medium touch-manipulation"
                      >
                        My Profile
                      </button>
                    </>
                  )}
                  {user.role === 'teacher' && (
                    <button 
                      onClick={() => handleNavClick('/teacher/dashboard')} 
                      className="block w-full text-left px-4 py-3 text-primary-600 hover:bg-primary-50 rounded-lg font-medium touch-manipulation"
                    >
                      Teacher Dashboard
                    </button>
                  )}
                  {user.role === 'admin' && (
                    <button 
                      onClick={() => handleNavClick('/admin/dashboard')} 
                      className="block w-full text-left px-4 py-3 text-primary-600 hover:bg-primary-50 rounded-lg font-medium touch-manipulation"
                    >
                      Admin Dashboard
                    </button>
                  )}
                  <button 
                    onClick={handleLogout} 
                    className="block w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg font-medium touch-manipulation"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex gap-3 pt-2 px-1">
                  <button 
                    onClick={() => handleNavClick('/login')} 
                    className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 text-center touch-manipulation"
                  >
                    Login
                  </button>
                  <button 
                    onClick={() => handleNavClick('/register')} 
                    className="flex-1 py-3 px-4 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 text-center touch-manipulation"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;


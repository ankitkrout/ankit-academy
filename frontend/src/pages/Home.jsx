import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { courseAPI } from '../services/api';
import { VideoLectureIcon, QuizIcon, StudyMaterialsIcon, TeacherIcon, CoursesIcon, CertificateIcon, ChapterIcon, CommunityIcon } from '../components/Icons';

const Home = () => {
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  useEffect(() => {
    fetchFeaturedCourses();
  }, []);

  const fetchFeaturedCourses = async () => {
    try {
      const response = await courseAPI.getFeatured();
      setFeaturedCourses(response.data.courses);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayVideo = () => {
    setIsVideoPlaying(true);
  };

  const stats = [
    { label: 'Students', value: '50,000+', icon: '👨‍🎓' },
    { label: 'Courses', value: '500+', icon: '📚' },
    { label: 'Expert Teachers', value: '100+', icon: '👨‍🏫' },
    { label: 'Chapters', value: '2,000+', icon: '📖' }
  ];

  const features = [
    {
      icon: <VideoLectureIcon className="w-12 h-12" />,
      title: 'Video Lectures',
      description: 'High-quality video lectures from expert teachers covering all topics in detail.'
    },
    {
      icon: <QuizIcon className="w-12 h-12" />,
      title: 'Practice Quiz',
      description: 'Test your knowledge with MCQ quizzes and track your progress over time.'
    },
    {
      icon: <StudyMaterialsIcon className="w-12 h-12" />,
      title: 'Study Materials',
      description: 'Get access to downloadable PDF notes for every chapter to study offline.'
    },
    {
      icon: <TeacherIcon className="w-12 h-12" />,
      title: 'Expert Teachers',
      description: 'Learn from highly qualified teachers with years of teaching experience.'
    },
    {
      icon: <CertificateIcon className="w-12 h-12" />,
      title: 'Certificates',
      description: 'Earn certificates upon course completion to showcase your achievements.'
    },
    {
      icon: <ChapterIcon className="w-12 h-12" />,
      title: 'Lessons & Chapters',
      description: 'Structured learning with well-organized lessons and chapters.'
    }
  ];

  const subjects = [
    { name: 'Mathematics', icon: '📐', color: 'from-blue-500 to-blue-700', count: '50+ Chapters' },
    { name: 'Science', icon: '🔬', color: 'from-green-500 to-green-700', count: '45+ Chapters' },
    { name: 'Physics', icon: '⚛️', color: 'from-purple-500 to-purple-700', count: '30+ Chapters' },
    { name: 'Chemistry', icon: '🧪', color: 'from-pink-500 to-pink-700', count: '28+ Chapters' },
    { name: 'Biology', icon: '🧬', color: 'from-teal-500 to-teal-700', count: '25+ Chapters' },
    { name: 'English', icon: '📝', color: 'from-orange-500 to-orange-700', count: '40+ Chapters' }
  ];

  const teachers = [
    { name: 'Dr. Rajesh Kumar', subject: 'Mathematics', experience: '15 Years', rating: 4.9, students: '12,000+', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rajesh' },
    { name: 'Prof. Sarah Johnson', subject: 'Physics', experience: '12 Years', rating: 4.8, students: '10,500+', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah' },
    { name: 'Dr. Amit Singh', subject: 'Chemistry', experience: '10 Years', rating: 4.9, students: '9,800+', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=amit' },
    { name: 'Ms. Priya Sharma', subject: 'Biology', experience: '8 Years', rating: 4.7, students: '8,500+', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=priya' }
  ];

  const benefits = [
    { icon: '📚', title: 'Structured Learning', description: 'Well-organized curriculum covering all topics from Class 8 to 12' },
    { icon: '📝', title: 'Quizzes & Assessments', description: 'Regular quizzes and assessments to test your understanding' },
    { icon: '📊', title: 'Progress Tracking', description: 'Track your learning progress with detailed analytics' },
    { icon: '🏆', title: 'Certificates', description: 'Earn certificates and badges upon course completion' },
    { icon: '👥', title: 'Student Community', description: 'Join discussion forums and learn from peers' },
    { icon: '💬', title: 'Doubt Solving', description: 'Get your questions answered by expert teachers' }
  ];

  const testimonials = [
    { name: 'Aryan Sharma', class: 'Class 10', rating: 5, image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=aryan', comment: 'Ankit Academy helped me score 95% in my board exams. The video lectures are amazing!' },
    { name: 'Priya Patel', class: 'Class 12', rating: 5, image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=priya2', comment: 'The practice quizzes and detailed explanations made Physics so much easier for me.' },
    { name: 'Rahul Verma', class: 'Class 9', rating: 5, image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rahul', comment: 'I love the structured approach. My Mathematics scores improved significantly!' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-accent-50"></div>
        <div className="absolute inset-0 bg-grid bg-[size:40px_40px] opacity-30"></div>
        
        {/* Shapes */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute top-20 right-10 w-72 h-72 bg-accent-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 rounded-full text-primary-700 text-sm font-medium mb-6">
                <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></span>
                #1 Learning Platform
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-gray-900 leading-tight mb-6">
                Smart Learning Platform for <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-purple-600">Class 8–12 Students</span>
                <br />With Expert Mentors
              </h1>
              
              <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0">
                Master every subject with video lectures, interactive quizzes, and personalized learning paths. Join thousands of students achieving their dreams.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/courses" className="btn btn-primary btn-lg">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Start Learning
                </Link>
                <Link to="/register" className="btn btn-outline btn-lg">
                  Get Started Free
                </Link>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl mb-1">{stat.icon}</div>
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-sm text-gray-500">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Visual */}
            <div className="relative hidden lg:block">
              <div className="relative w-full aspect-square max-w-lg mx-auto">
                {/* Floating Cards */}
                <div className="absolute top-10 left-0 bg-white rounded-2xl shadow-xl p-4 animate-float">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-2xl">🎬</div>
                    <div>
                      <div className="font-semibold text-gray-900">Video Lectures</div>
                      <div className="text-sm text-gray-500">500+ Videos</div>
                    </div>
                  </div>
                </div>
                
                <div className="absolute top-1/2 right-0 bg-white rounded-2xl shadow-xl p-4 animate-float" style={{ animationDelay: '0.5s' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl">🧠</div>
                    <div>
                      <div className="font-semibold text-gray-900">Practice Quiz</div>
                      <div className="text-sm text-gray-500">1000+ Questions</div>
                    </div>
                  </div>
                </div>
                
                <div className="absolute bottom-20 left-10 bg-white rounded-2xl shadow-xl p-4 animate-float" style={{ animationDelay: '1s' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center text-2xl">📜</div>
                    <div>
                      <div className="font-semibold text-gray-900">Get Certified</div>
                      <div className="text-sm text-gray-500">Earn Badges</div>
                    </div>
                  </div>
                </div>
                
                {/* Center Circle */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center shadow-2xl">
                  <span className="text-6xl">📚</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Advertisement Video Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
            Discover Ankit Academy – Smart Learning for Class 8–12 Students
          </h2>
          <p className="text-lg text-primary-100 mb-8">
            Watch how Ankit Academy helps students learn smarter with video lectures, quizzes, and expert teachers.
          </p>
          
          <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-video bg-black max-w-3xl mx-auto">
            {/* Video Player with sample video */}
            <video 
              controls 
              className="w-full h-full object-cover"
              poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1920 1080'%3E%3Crect fill='%231e40af' width='1920' height='1080'/%3E%3Ctext x='960' y='540' font-size='80' fill='white' text-anchor='middle' dominant-baseline='middle'%3E%F0%9F%8E%AC%3C/text%3E%3Ctext x='960' y='640' font-size='30' fill='white' text-anchor='middle'%3EAnkit Academy Promo%3C/text%3E%3C/svg%3E"
              preload="metadata"
            >
              <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
          
          <p className="text-primary-200 mt-4 text-sm">
            🎬 Watch our promotional video to learn more about Ankit Academy
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-4">
              Why Choose Us
            </span>
            <h2 className="section-title">Everything You Need to Excel</h2>
            <p className="section-subtitle">Our platform provides all the tools for your academic success</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="mb-4 text-blue-600">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Video Section */}
      <section className="py-20 bg-gradient-to-br from-primary-50 via-white to-accent-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-4">
              See It In Action
            </span>
            <h2 className="section-title">Watch How Ankit Academy Works</h2>
            <p className="section-subtitle">See how our platform helps students excel in their studies</p>
          </div>
          
          <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-video bg-black">
            {isVideoPlaying ? (
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                title="Ankit Academy Demo"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <>
                <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-8xl mb-4">🎓</div>
                    <h3 className="text-2xl font-bold text-white mb-2">Ankit Academy AI</h3>
                    <p className="text-primary-100">Interactive Learning Platform</p>
                  </div>
                </div>
                <button
                  onClick={handlePlayVideo}
                  className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors group"
                >
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                    <svg className="w-8 h-8 text-primary-600 ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </button>
              </>
            )}
          </div>
          
          <p className="text-center text-gray-500 mt-6 text-sm">
            Click the play button to watch a quick overview of our platform
          </p>
        </div>
      </section>

      {/* Subjects Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 bg-accent-100 text-accent-700 rounded-full text-sm font-medium mb-4">
              Popular Subjects
            </span>
            <h2 className="section-title">Explore Our Subjects</h2>
            <p className="section-subtitle">Choose from a wide range of subjects across all classes</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((subject, index) => (
              <Link 
                key={index}
                to={`/courses?category=${subject.name}`}
                className="bg-white rounded-2xl p-6 hover:shadow-lg transition-all duration-300 group"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${subject.color} rounded-xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform`}>
                  {subject.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{subject.name}</h3>
                <p className="text-gray-500">{subject.count}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-4">
              Featured Courses
            </span>
            <h2 className="section-title">Popular Courses</h2>
            <p className="section-subtitle">Start learning with our most popular courses</p>
          </div>
          
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-gray-100 rounded-2xl h-80 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredCourses.slice(0, 6).map((course) => (
                <Link 
                  key={course._id}
                  to={`/courses/${course._id}`}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 group overflow-hidden"
                >
                  <div className="h-48 bg-gradient-to-br from-primary-500 to-primary-700 relative overflow-hidden">
                    {course.thumbnail ? (
                      <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-6xl">
                        {course.category === 'Mathematics' ? '📐' : course.category === 'Science' ? '🔬' : '📚'}
                      </div>
                    )}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-primary-700">
                      {course.isFree ? 'Free' : `₹${course.price}`}
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                      <span className="badge badge-primary">{course.category}</span>
                      <span>•</span>
                      <span>Class {course.class}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-primary-600 text-sm font-medium">
                            {course.instructorName?.charAt(0)}
                          </span>
                        </div>
                        <span className="text-sm text-gray-600">{course.instructorName}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <span className="text-yellow-500">★</span>
                        <span className="font-medium">{course.rating || '4.5'}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          
          <div className="text-center mt-12">
            <Link to="/courses" className="btn btn-outline btn-lg">
              View All Courses
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Teachers Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-4">
              Our Expert Team
            </span>
            <h2 className="section-title">Meet Our Teachers</h2>
            <p className="section-subtitle">Learn from the best educators in the industry</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teachers.map((teacher, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 text-center hover:shadow-xl transition-all duration-300 group">
                <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full p-1">
                  <img src={teacher.image} alt={teacher.name} className="w-full h-full rounded-full bg-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{teacher.name}</h3>
                <p className="text-primary-600 font-medium mb-2">{teacher.subject}</p>
                <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <span className="text-yellow-500">★</span>
                    {teacher.rating}
                  </span>
                  <span>{teacher.experience}</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">{teacher.students} Students</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Student Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
              Why Students Love Us
            </span>
            <h2 className="section-title">Student Benefits</h2>
            <p className="section-subtitle">Everything you need to succeed in your exams</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 hover:shadow-lg transition-all duration-300 border border-gray-100">
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-primary-50 to-accent-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-4">
              Success Stories
            </span>
            <h2 className="section-title">What Our Students Say</h2>
            <p className="section-subtitle">Hear from our successful students</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-500">★</span>
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">"{testimonial.comment}"</p>
                <div className="flex items-center gap-4">
                  <img src={testimonial.image} alt={testimonial.name} className="w-12 h-12 rounded-full bg-primary-100" />
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.class}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-800">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-6">
            Ready to Start Learning?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join thousands of students already learning on Ankit Academy. Start your journey to success today!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="btn bg-white text-primary-600 hover:bg-gray-100 btn-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              Get Started Free
            </Link>
            <Link to="/courses" className="btn border-2 border-white text-white hover:bg-white hover:text-primary-600 btn-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
              Explore Courses
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;


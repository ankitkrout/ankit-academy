import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { useState } from 'react';

// Components
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import TeacherRoute from './components/TeacherRoute';
import AIChat from './components/AIChat';

// Pages
import Home from './pages/Home';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import AdminDashboard from './pages/AdminDashboard';
import MyCourses from './pages/MyCourses';
import LessonView from './pages/LessonView';
import Quiz from './pages/Quiz';
import Leaderboard from './pages/Leaderboard';
import CreateCourse from './pages/CreateCourse';
import About from './pages/About';
import Contact from './pages/Contact';
import Profile from './pages/Profile';
import MobileNav from './components/MobileNav';
import MyPayments from './pages/MyPayments';
import LiveClasses from './pages/LiveClasses';
import Doubts from './pages/Doubts';
import CreateLiveClass from './components/CreateLiveClass';

function App() {
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || 'your-google-client-id.googleusercontent.com'}>
      <AuthProvider>
        <Router>
        {/* Floating AI Chat Button */}
        <button
          onClick={() => setIsAIChatOpen(true)}
          className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-gradient-to-r from-primary-600 to-primary-700 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-110 flex items-center justify-center text-white"
          title="Chat with AI Assistant"
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </button>

        {/* AI Chat Component */}
        <AIChat isOpen={isAIChatOpen} onClose={() => setIsAIChatOpen(false)} />

        {/* Mobile Navigation */}
        <MobileNav />

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:id" element={<CourseDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          
          {/* Student Routes */}
          <Route path="/dashboard" element={
            <PrivateRoute allowedRoles={['student']}>
              <StudentDashboard />
            </PrivateRoute>
          } />
          <Route path="/profile" element={
            <PrivateRoute allowedRoles={['student']}>
              <Profile />
            </PrivateRoute>
          } />
          <Route path="/my-courses" element={
            <PrivateRoute allowedRoles={['student']}>
              <MyCourses />
            </PrivateRoute>
          } />
          <Route path="/my-payments" element={
            <PrivateRoute allowedRoles={['student']}>
              <MyPayments />
            </PrivateRoute>
          } />
          <Route path="/live-classes" element={
            <PrivateRoute allowedRoles={['student']}>
              <LiveClasses />
            </PrivateRoute>
          } />
          <Route path="/doubts" element={
            <PrivateRoute allowedRoles={['student']}>
              <Doubts />
            </PrivateRoute>
          } />
          <Route path="/lesson/:courseId/:lessonId" element={
            <PrivateRoute allowedRoles={['student']}>
              <LessonView />
            </PrivateRoute>
          } />
          <Route path="/quiz/:quizId" element={
            <PrivateRoute allowedRoles={['student']}>
              <Quiz />
            </PrivateRoute>
          } />
          
          {/* Teacher Routes */}
          <Route path="/teacher/dashboard" element={
            <TeacherRoute>
              <TeacherDashboard />
            </TeacherRoute>
          } />
          <Route path="/teacher/create-course" element={
            <TeacherRoute>
              <CreateCourse />
            </TeacherRoute>
          } />
          <Route path="/teacher/edit-course/:id" element={
            <TeacherRoute>
              <CreateCourse />
            </TeacherRoute>
          } />
          <Route path="/teacher/live-classes" element={
            <TeacherRoute>
              <CreateLiveClass />
            </TeacherRoute>
          } />
          
          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } />
          
          {/* 404 */}
          <Route path="*" element={
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-6xl mb-4">404</h1>
                <p className="text-gray-600">Page not found</p>
              </div>
            </div>
          } />
        </Routes>
      </Router>
      
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#22c55e',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </AuthProvider>
  );
}

export default App;


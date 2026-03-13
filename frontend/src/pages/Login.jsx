import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth, GoogleLogin } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, googleLogin } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      toast.success('Welcome back!');
      
      // Get user from localStorage (set by AuthContext)
      const savedUser = localStorage.getItem('user');
      const user = savedUser ? JSON.parse(savedUser) : null;
      
      // Redirect based on role
      if (user?.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (user?.role === 'teacher') {
        navigate('/teacher/dashboard');
      } else if (user?.role === 'student') {
        navigate('/dashboard');
      } else {
        navigate(from);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <span className="text-2xl font-heading font-bold text-gray-900">
              Edu<span className="text-primary-600">Smart</span>
            </span>
          </Link>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-heading font-bold text-gray-900 text-center mb-2">
            Welcome Back
          </h2>
          <p className="text-gray-600 text-center mb-8">
            Sign in to continue your learning journey
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Email Address</label>
              <input
                type="email"
                className="input"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="label">Password</label>
              <input
                type="password"
                className="input"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full btn-lg"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary-600 font-medium hover:underline">
                Sign Up
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500 mb-4">Or continue with</p>
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              try {
                await googleLogin(credentialResponse);
                toast.success('Google login successful!');
                // Redirect logic
                const savedUser = localStorage.getItem('user');
                const user = savedUser ? JSON.parse(savedUser) : null;
                if (user?.role === 'admin') {
                  navigate('/admin/dashboard');
                } else if (user?.role === 'teacher') {
                  navigate('/teacher/dashboard');
                } else {
                  navigate('/dashboard');
                }
              } catch (error) {
                toast.error(error.response?.data?.message || 'Google login failed');
              }
            }}
            onError={() => {
              toast.error('Google login failed');
            }}
            theme="filled_blue"
            size="large"
            text="signin_with"
            shape="rectangular"
            width="100%"
            className="w-full !bg-white !border-2 !border-gray-200 hover:!border-gray-300 h-12 rounded-xl font-medium shadow-sm hover:shadow-md transition-all"
          />
        </div>

        {/* Demo Accounts */}
        <div className="mt-6 bg-white/50 backdrop-blur-sm rounded-xl p-4">
          <p className="text-sm text-gray-600 text-center mb-3">Demo Accounts:</p>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <button
              type="button"
              onClick={() => {
                setFormData({ email: 'student@demo.com', password: 'demo123' });
              }}
              className="p-2 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-colors"
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => {
                setFormData({ email: 'teacher@demo.com', password: 'demo123' });
              }}
              className="p-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
            >
              Teacher
            </button>
            <button
              type="button"
              onClick={() => {
                setFormData({ email: 'admin@demo.com', password: 'demo123' });
              }}
              className="p-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
            >
              Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;


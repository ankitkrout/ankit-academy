import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-heading font-bold text-white mb-4">
            About Ankit Academy
          </h1>
          <p className="text-primary-100 text-lg">
            Empowering students to achieve their full potential
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Mission */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
          <p className="text-gray-600 leading-relaxed">
            Ankit Academy is dedicated to providing quality education to students from Class 8 to 12. 
            We believe that every student deserves access to the best learning resources, regardless of 
            their location or background. Our platform combines expert-taught video lectures, interactive 
            quizzes, and personalized learning paths to ensure every student can excel in their studies.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 text-center shadow-sm">
            <div className="text-3xl font-bold text-primary-600">50,000+</div>
            <div className="text-gray-600">Students</div>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow-sm">
            <div className="text-3xl font-bold text-primary-600">500+</div>
            <div className="text-gray-600">Courses</div>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow-sm">
            <div className="text-3xl font-bold text-primary-600">100+</div>
            <div className="text-gray-600">Expert Teachers</div>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow-sm">
            <div className="text-3xl font-bold text-primary-600">2,000+</div>
            <div className="text-gray-600">Video Lectures</div>
          </div>
        </div>

        {/* Features */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Why Choose Ankit Academy?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex gap-4">
              <div className="text-3xl">🎬</div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Video Lectures</h3>
                <p className="text-gray-600 text-sm">High-quality video content from expert teachers</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-3xl">🧠</div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Interactive Quizzes</h3>
                <p className="text-gray-600 text-sm">Test your knowledge with engaging MCQ quizzes</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-3xl">📊</div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Progress Tracking</h3>
                <p className="text-gray-600 text-sm">Monitor your learning journey with detailed analytics</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-3xl">🏆</div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Leaderboard</h3>
                <p className="text-gray-600 text-sm">Compete with peers and climb the ranks</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-3xl">📥</div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Download Notes</h3>
                <p className="text-gray-600 text-sm">Access study materials offline</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-3xl">🎓</div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Certificates</h3>
                <p className="text-gray-600 text-sm">Earn certificates upon course completion</p>
              </div>
            </div>
          </div>
        </div>

        {/* Team */}
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Team</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-24 h-24 bg-primary-100 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-bold text-primary-600">
                AK
              </div>
              <h3 className="font-semibold text-gray-900">Ankit Kumar</h3>
              <p className="text-gray-600 text-sm">Founder & CEO</p>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-bold text-green-600">
                SJ
              </div>
              <h3 className="font-semibold text-gray-900">Dr. Sarah Johnson</h3>
              <p className="text-gray-600 text-sm">Academic Director</p>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 bg-orange-100 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-bold text-orange-600">
                RK
              </div>
              <h3 className="font-semibold text-gray-900">Rajesh Kumar</h3>
              <p className="text-gray-600 text-sm">Head of Technology</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default About;


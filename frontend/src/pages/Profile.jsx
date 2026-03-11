import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { profileAPI, certificateAPI, badgeAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, setUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [certificates, setCertificates] = useState([]);
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', bio: '', phone: '' });

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const [profileRes, certsRes, badgesRes] = await Promise.all([
        profileAPI.get(),
        certificateAPI.getMy(),
        badgeAPI.getAll()
      ]);
      
      setProfile(profileRes.data.profile);
      setCertificates(certsRes.data.certificates || []);
      setBadges(badgesRes.data.badges || []);
    } catch (error) {
      console.error('Error fetching profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await profileAPI.update(editForm);
      setUser({ ...user, ...editForm });
      setProfile({ ...profile, user: { ...profile.user, ...editForm } });
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const startEditing = () => {
    setEditForm({
      name: profile?.user?.name || '',
      bio: profile?.user?.bio || '',
      phone: profile?.user?.phone || ''
    });
    setIsEditing(true);
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
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Profile Header Card */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-700 rounded-2xl p-8 text-white mb-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center text-6xl backdrop-blur-sm">
                {profile?.user?.avatar ? (
                  <img src={profile.user.avatar} alt={profile.user.name} className="w-32 h-32 rounded-full object-cover" />
                ) : (
                  profile?.user?.name?.charAt(0)?.toUpperCase() || 'U'
                )}
              </div>
              {profile?.leaderboardRank && (
                <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-yellow-900 rounded-full w-10 h-10 flex items-center justify-center font-bold shadow-lg">
                  #{profile.leaderboardRank}
                </div>
              )}
            </div>
            
            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-heading font-bold mb-2">
                {profile?.user?.name || 'Student'}
              </h1>
              <p className="text-primary-100 mb-2">{profile?.user?.email}</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                  <div className="text-2xl font-bold">{profile?.totalPoints || 0}</div>
                  <div className="text-sm text-primary-100">Total Points</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                  <div className="text-2xl font-bold">{profile?.completedCourses || 0}</div>
                  <div className="text-sm text-primary-100">Courses Completed</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                  <div className="text-2xl font-bold">{badges.length}</div>
                  <div className="text-sm text-primary-100">Badges Earned</div>
                </div>
              </div>
            </div>
            
            {/* Edit Button */}
            <button
              onClick={startEditing}
              className="bg-white text-primary-600 px-6 py-2 rounded-lg font-medium hover:bg-primary-50 transition-colors"
            >
              Edit Profile
            </button>
          </div>
        </div>

        {/* Edit Modal */}
        {isEditing && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full">
              <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
              <form onSubmit={handleUpdateProfile}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  <textarea
                    value={editForm.bio}
                    onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    rows={3}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Stats Cards - Mobile Optimized */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm text-center">
                <div className="text-2xl sm:text-3xl mb-1">📚</div>
                <div className="text-xl sm:text-2xl font-bold text-gray-900">{profile?.enrolledCourses || 0}</div>
                <div className="text-xs sm:text-sm text-gray-500">Enrolled</div>
              </div>
              <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm text-center">
                <div className="text-2xl sm:text-3xl mb-1">✅</div>
                <div className="text-xl sm:text-2xl font-bold text-gray-900">{profile?.completedCourses || 0}</div>
                <div className="text-xs sm:text-sm text-gray-500">Completed</div>
              </div>
              <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm text-center">
                <div className="text-2xl sm:text-3xl mb-1">📜</div>
                <div className="text-xl sm:text-2xl font-bold text-gray-900">{certificates.length}</div>
                <div className="text-xs sm:text-sm text-gray-500">Certificates</div>
              </div>
              <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm text-center">
                <div className="text-2xl sm:text-3xl mb-1">🏆</div>
                <div className="text-xl sm:text-2xl font-bold text-gray-900">{badges.length}</div>
                <div className="text-xs sm:text-sm text-gray-500">Badges</div>
              </div>
            </div>

            {/* Certificates Section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <span>📜</span> My Certificates
              </h2>
              
              {certificates.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-3">🎓</div>
                  <p className="text-gray-500">No certificates yet. Complete courses to earn certificates!</p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {certificates.map((cert) => (
                    <div
                      key={cert._id}
                      className="border border-gray-200 rounded-xl p-4 hover:border-primary-300 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                          🎓
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 truncate">{cert.courseName}</h3>
                          <p className="text-sm text-gray-500">
                            Completed: {new Date(cert.completionDate).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            Score: {cert.progress}%
                          </p>
                        </div>
                      </div>
                      <Link
                        to={`/certificates/${cert._id}`}
                        className="mt-3 block text-center text-primary-600 hover:text-primary-700 text-sm font-medium"
                      >
                        View Certificate →
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Activity */}
            {profile?.recentActivity?.enrolledCourses?.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <span>📖</span> Recent Courses
                </h2>
                <div className="space-y-3">
                  {profile.recentActivity.enrolledCourses.map((course) => (
                    <Link
                      key={course._id}
                      to={`/courses/${course._id}`}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center text-lg">
                        📚
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{course.title}</h3>
                        <p className="text-sm text-gray-500">{course.category}</p>
                      </div>
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Badges Section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span>🏆</span> My Badges
              </h2>
              
              {badges.length === 0 ? (
                <div className="text-center py-6">
                  <div className="text-4xl mb-2">🎖️</div>
                  <p className="text-gray-500 text-sm">No badges yet. Start learning to earn badges!</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-3">
                  {badges.map((badge) => (
                    <div
                      key={badge._id}
                      className="text-center p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group"
                      title={badge.description}
                    >
                      <div className="text-3xl mb-1 transform group-hover:scale-110 transition-transform">
                        {badge.icon || '🏆'}
                      </div>
                      <div className="text-xs text-gray-600 truncate">
                        {badge.badgeName?.replace(/_/g, ' ')}
                      </div>
                      <div className="text-xs text-gray-400">
                        {new Date(badge.dateEarned).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h2>
              <div className="space-y-2">
                <Link
                  to="/dashboard"
                  className="flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <span className="text-xl">📊</span>
                  <span>My Dashboard</span>
                </Link>
                <Link
                  to="/my-courses"
                  className="flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <span className="text-xl">📚</span>
                  <span>My Courses</span>
                </Link>
                <Link
                  to="/leaderboard"
                  className="flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <span className="text-xl">🏆</span>
                  <span>Leaderboard</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;


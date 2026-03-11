import axios from 'axios';

// Use explicit localhost URL for API calls
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/signup', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/password', data)
};

// Course APIs
export const courseAPI = {
  getAll: (params) => api.get('/courses', { params }),
  getFeatured: () => api.get('/courses/featured'),
  getPublished: (params) => api.get('/courses/published/all', { params }),
  getById: (id) => api.get(`/courses/${id}`),
  create: (data) => api.post('/courses', data),
  update: (id, data) => api.put(`/courses/${id}`, data),
  delete: (id) => api.delete(`/courses/${id}`),
  enroll: (id) => api.post(`/courses/${id}/enroll`),
  publish: (id, status) => api.patch(`/courses/${id}/publish`, { status }),
  getMyCourses: () => api.get('/courses/my-courses'),
  getTeacherCourses: () => api.get('/courses/teacher')
};

// Lesson APIs
export const lessonAPI = {
  getById: (id) => api.get(`/lessons/lesson/${id}`),
  getByCourse: (courseId) => api.get(`/lessons/course/${courseId}`),
  create: (data) => api.post('/lessons/create', data),
  update: (id, data) => api.put(`/lessons/${id}`, data),
  delete: (id) => api.delete(`/lessons/${id}`),
  complete: (id) => api.post(`/lessons/${id}/complete`)
};

// Quiz APIs
export const quizAPI = {
  getById: (id) => api.get(`/quizzes/${id}`),
  getByLesson: (lessonId) => api.get(`/quizzes/course/${lessonId}`),
  create: (data) => api.post('/quizzes', data),
  update: (id, data) => api.put(`/quizzes/${id}`, data),
  delete: (id) => api.delete(`/quizzes/${id}`),
  submit: (id, answers) => api.post(`/quizzes/${id}/submit`, { answers })
};

// Progress APIs
export const progressAPI = {
  getAll: () => api.get('/progress'),
  getCourseProgress: (courseId) => api.get(`/progress/${courseId}`),
  update: (data) => api.put(`/progress/${data.courseId}`, data),
  getAnalytics: () => api.get('/progress/analytics')
};

// User APIs
export const userAPI = {
  getAll: (params) => api.get('/users', { params }),
  getById: (id) => api.get(`/users/${id}`),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
  getLeaderboard: (limit) => api.get('/users/leaderboard', { params: { limit } }),
  getStats: () => api.get('/users/stats'),
  approveTeacher: (id, isApproved) => api.put(`/users/${id}/approve`, { isApproved })
};

// AI APIs
export const aiAPI = {
  chat: (messages) => api.post('/ai/chat', { messages }),
  getStatus: () => api.get('/ai/status')
};

// Certificate APIs
export const certificateAPI = {
  generate: (courseId) => api.post('/certificates/generate', { courseId }),
  getMy: () => api.get('/certificates/my'),
  getById: (id) => api.get(`/certificates/${id}`),
  verify: (certificateId) => api.get(`/certificates/verify/${certificateId}`),
  download: (id) => api.get(`/certificates/${id}/download`, { responseType: 'blob' }),
  checkEligibility: (courseId) => api.post(`/certificates/check/${courseId}`)
};

// Payment APIs
export const paymentAPI = {
  createOrder: (courseId) => api.post('/payments/create-order', { courseId }),
  verify: (data) => api.post('/payments/verify', data),
  simulate: (courseId) => api.post('/payments/simulate', { courseId }),
  getMy: () => api.get('/payments/my'),
  getById: (id) => api.get(`/payments/${id}`),
  getByCourse: (courseId) => api.get(`/payments/course/${courseId}`),
  refund: (id) => api.post(`/payments/refund/${id}`),
  getAll: (params) => api.get('/payments/admin/all', { params })
};

// Live Class APIs
export const liveClassAPI = {
  create: (data) => api.post('/live-classes', data),
  getAll: (params) => api.get('/live-classes', { params }),
  getUpcoming: () => api.get('/live-classes/upcoming'),
  getMyClasses: () => api.get('/live-classes/my-classes'),
  getEnrolled: () => api.get('/live-classes/enrolled'),
  getById: (id) => api.get(`/live-classes/${id}`),
  update: (id, data) => api.put(`/live-classes/${id}`, data),
  delete: (id) => api.delete(`/live-classes/${id}`),
  start: (id) => api.patch(`/live-classes/${id}/start`),
  end: (id) => api.patch(`/live-classes/${id}/end`),
  enroll: (id) => api.post(`/live-classes/${id}/enroll`)
};

// Doubt APIs
export const doubtAPI = {
  ask: (data) => api.post('/doubts/ask', data),
  getAll: (params) => api.get('/doubts', { params }),
  getMy: () => api.get('/doubts/my'),
  getById: (id) => api.get(`/doubts/${id}`),
  resolve: (id) => api.put(`/doubts/${id}/resolve`),
  upvote: (id) => api.post(`/doubts/${id}/upvote`)
};

// Notification APIs
export const notificationAPI = {
  getAll: (params) => api.get('/notifications', { params }),
  getUnreadCount: () => api.get('/notifications/unread-count'),
  markAsRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllAsRead: () => api.patch('/notifications/read-all'),
  delete: (id) => api.delete(`/notifications/${id}`),
  clearAll: () => api.delete('/notifications/clear-all')
};

// Profile APIs
export const profileAPI = {
  get: () => api.get('/profile'),
  update: (data) => api.put('/profile/update', data),
  updateAvatar: (avatar) => api.put('/profile/avatar', { avatar })
};

// Badge APIs
export const badgeAPI = {
  getAll: () => api.get('/badges'),
  getAllBadges: (params) => api.get('/badges/all', { params }),
  award: (badgeName, courseId) => api.post('/badges/award', { badgeName, courseId }),
  check: (data) => api.post('/badges/check', data)
};

// Analytics APIs - Student
export const analyticsAPI = {
  getStudentAnalytics: () => api.get('/progress/analytics'),
  getCourseProgress: (courseId) => api.get(`/progress/${courseId}`),
  getQuizPerformance: () => api.get('/progress/quiz-performance'),
  getLearningStats: () => api.get('/progress/learning-stats')
};

// Analytics APIs - Teacher
export const teacherAnalyticsAPI = {
  getDashboard: () => api.get('/analytics/teacher'),
  getCourseAnalytics: (courseId) => api.get(`/analytics/teacher/course/${courseId}`),
  getStudentEngagement: () => api.get('/analytics/teacher/engagement'),
  getLessonStats: () => api.get('/analytics/teacher/lessons')
};

export default api;


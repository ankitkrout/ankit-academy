# Ankit Academy – Smart Learning Platform

A full-stack online learning platform built with React.js, Node.js, Express.js, and MongoDB.

## 🚀 Features

### Student Features
- Student signup and login
- Browse and enroll in courses
- Watch video lectures
- Take interactive MCQ quizzes
- Track learning progress
- Compete on leaderboard
- Earn points and badges
- **View and edit personal profile**
- **Earn achievement badges**
- **Mobile-optimized dashboard**

### Teacher Features
- Teacher login/registration
- Create and manage courses
- Upload video lessons
- Create quizzes
- View student progress

### Admin Features
- Admin dashboard
- Manage users
- Manage courses
- View platform analytics

## 🛠️ Tech Stack

### Frontend
- React.js 18
- Tailwind CSS
- React Router DOM
- React Hot Toast
- Vite

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Bcrypt.js

## 📁 Project Structure

```
edusmart/
├── backend/
│   ├── models/          # MongoDB models
│   ├── routes/         # API routes
│   ├── middleware/     # Auth middleware
│   ├── server.js      # Express server
│   ├── seed.js        # Database seeder
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/      # Page components
│   │   ├── context/    # Auth context
│   │   ├── services/   # API services
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
└── README.md
```

## ⚡ Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file in backend folder:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/edusmart
JWT_SECRET=your_super_secret_key_2024
```

4. Start MongoDB (if local):
```bash
# Windows
net start MongoDB

# Mac/Linux
sudo systemctl start mongod
```

5. Seed the database (optional - creates demo data):
```bash
npm run seed
# or
node seed.js
```

6. Start the backend server:
```bash
npm start
# Server will run on http://localhost:5000
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
# Frontend will run on http://localhost:5173
```

## 📋 Demo Accounts

After running the seed script, you can use these accounts:

| Role    | Email              | Password |
|---------|-------------------|----------|
| Admin   | admin@demo.com    | demo123  |
| Teacher | teacher@demo.com  | demo123  |
| Student | student@demo.com  | demo123  |

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get course details
- `POST /api/courses` - Create course (teacher)
- `POST /api/courses/:id/enroll` - Enroll in course

### Lessons
- `GET /api/lessons/:courseId` - Get course lessons
- `POST /api/lessons/:id/complete` - Mark lesson complete

### Quizzes
- `GET /api/quizzes/:quizId` - Get quiz
- `POST /api/quizzes/:id/submit` - Submit quiz

### Users
- `GET /api/users/leaderboard` - Get leaderboard
- `GET /api/users/stats` - Get platform stats (admin)

### Profile
- `GET /api/profile` - Get current user's profile
- `PUT /api/profile/update` - Update user profile

### Badges
- `GET /api/badges` - Get user's badges
- `POST /api/badges/award` - Award a badge
- `POST /api/badges/check` - Check and award badges based on activity

## 🎨 UI Pages

- **Home** - Landing page with hero, features, courses
- **Courses** - Course listing with filters
- **Course Detail** - Course info, lessons, enrollment
- **Login/Register** - Authentication pages
- **Student Dashboard** - Progress, enrolled courses
- **Profile** - View and edit profile, badges, certificates
- **Teacher Dashboard** - Course management
- **Admin Dashboard** - Platform management
- **Lesson View** - Video player with sidebar
- **Quiz** - Interactive quiz with timer
- **Leaderboard** - Top students ranking
- **About/Contact** - Informational pages

## 📝 Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/edusmart
JWT_SECRET=your_secret_key_here
```

## 🚀 Building for Production

### Backend
```bash
cd backend
npm run build  # if you add build script
```

### Frontend
```bash
cd frontend
npm run build
```

Build output will be in `frontend/dist/`

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

---

Built with ❤️ for education


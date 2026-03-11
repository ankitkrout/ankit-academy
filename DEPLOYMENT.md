# Ankit Academy - Deployment Guide

## Live URLs (Development)
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000
- **Health Check:** http://localhost:5000/api/health

---

## Production Deployment

### Option 1: Vercel (Frontend) + Render/Railway (Backend)

#### Frontend (Vercel)
1. Push your code to GitHub
2. Go to [Vercel.com](https://vercel.com)
3. Import your repository
4. Configure:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Add environment variables:
   - `VITE_API_URL`: Your backend URL
6. Deploy

#### Backend (Render/Railway)
1. Create account on [Render.com](https://render.com) or [Railway.app](https://railway.app)
2. Connect your GitHub repository
3. Configure:
   - Build Command: `npm install`
   - Start Command: `node server.js`
4. Add environment variables:
   - `MONGODB_URI`: Your MongoDB connection string (MongoDB Atlas)
   - `JWT_SECRET`: Generate a secure random string
   - `NODE_ENV`: production
   - `PORT`: 5000

---

### Option 2: Full Stack on Vercel

#### Backend API as Serverless Functions
Convert Express routes to Vercel API routes for serverless deployment.

---

## Environment Variables

### Backend (.env)
```
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/ankitacademy
JWT_SECRET=your_secure_jwt_secret_min_32_chars
FRONTEND_URL=https://your-frontend.vercel.app
OPENROUTER_API_KEY=your_openrouter_api_key (optional)
```

### Frontend (.env)
```
VITE_API_URL=https://your-backend.onrender.com/api
```

---

## MongoDB Atlas Setup

1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Create database user
4. Network access: Allow all IPs (0.0.0.0/0)
5. Get connection string:
   
```
   mongodb+srv://<username>:<password>@cluster.mongodb.net/ankitacademy?retryWrites=true&w=majority
   
```

---

## Testing Checklist

- [ ] Student registration works
- [ ] Student login works
- [ ] Teacher login works
- [ ] Admin login works
- [ ] Course creation works
- [ ] Lesson upload works
- [ ] Course publishing works
- [ ] Student enrollment works
- [ ] Video playback works
- [ ] AI assistant works (with fallback)
- [ ] All dashboards load correctly

---

## Mobile App Preparation

The project is structured to be easily converted to a mobile app using:

1. **React Native** - Use Expo to convert the frontend
2. **Same Backend API** - Reuse the existing Node.js/Express API
3. **Same Database** - Continue using MongoDB

### Steps for Mobile Conversion:
1. Install Expo: `npm install -g expo-cli`
2. Create Expo project: `npx create-expo-app ankit-academy-mobile`
3. Copy relevant components and screens
4. Use the same API endpoints
5. Build for iOS/Android

---

## Performance Optimizations

- [x] Code splitting configured in Vite
- [x] Tailwind JIT mode enabled
- [x] Vendor chunking for React, UI libraries
- [x] Lazy loading for routes
- [x] Image optimization recommended for production

---

## Security Checklist

- [x] JWT secrets in environment variables
- [x] API keys not exposed in frontend
- [x] CORS configured for specific domains
- [x] Passwords hashed with bcrypt
- [ ] Enable HTTPS in production
- [ ] Add rate limiting (recommended)
- [ ] Add input validation (recommended)

---

## Support

For issues or questions, check:
1. Backend logs in terminal
2. Browser console for frontend errors
3. MongoDB Atlas dashboard for database issues

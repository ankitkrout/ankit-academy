# Authentication Fix - Complete Deployment Guide

## Overview
This guide helps you fix the Signup and Login authentication issues in the deployed Vercel environment.

## Changes Made

### 1. Frontend API Configuration
- Updated `frontend/src/services/api.js` to use environment variable `VITE_API_URL`
- Added `frontend/.env` file with default localhost URL

### 2. Backend CORS Configuration
- Updated `backend/server.js` to allow production Vercel domain
- CORS now supports multiple origins dynamically

### 3. Environment Files Created
- `backend/.env` - Backend configuration
- `backend/.env.example` - Template for production
- `frontend/.env` - Frontend configuration  
- `frontend/.env.example` - Template for production

### 4. Deployment Scripts Updated
- `deploy.bat` - Windows deployment script
- `deploy.sh` - Linux/Mac deployment script

---

## Production Setup Steps

### Step 1: Verify GitHub Repository Connection

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Git**
4. Ensure the correct GitHub repository is connected
5. Make sure the correct branch (main/master) is selected

### Step 2: Trigger Fresh Deployment

1. In Vercel Dashboard, go to **Deployments**
2. Click the latest deployment
3. Click **Redeploy** (or use the deploy script: `deploy.bat` or `deploy.sh`)
4. Wait for the build to complete

To force a fresh build:
- Go to **Settings** → **General**
- Click **Clear Cache** and redeploy

### Step 3: Set Frontend Environment Variables in Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add the following variable:

| Name | Value | Environment |
|------|-------|-------------|
| VITE_API_URL | https://your-backend-url.com/api | Production |

Replace `https://your-backend-url.com/api` with your actual backend API URL.

### Step 4: Set Backend Environment Variables

If deploying backend to a hosting service (Render, Railway, Vercel, etc.):

1. Go to your backend hosting platform
2. Add these environment variables:

| Name | Value | Description |
|------|-------|-------------|
| PORT | 5000 | Server port |
| MONGODB_URI | mongodb+srv://... | MongoDB Atlas connection string |
| JWT_SECRET | your_secure_jwt_secret | Generate a secure key |
| FRONTEND_URL | https://your-vercel-frontend.vercel.app | Your frontend URL |
| NODE_ENV | production | Set to production |

Generate a secure JWT_SECRET:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Step 5: Update CORS in backend/server.js

Edit the `allowedOrigins` array in `backend/server.js` to include your actual Vercel domain:

```javascript
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://your-actual-vercel-domain.vercel.app',  // ← Replace with your actual domain
  process.env.FRONTEND_URL
].filter(Boolean);
```

### Step 6: Push Changes to GitHub

```bash
git add .
git commit -m "Fix authentication for production deployment"
git push origin main
```

Vercel will automatically redeploy your project.

---

## API Endpoints

The authentication endpoints are:
- **POST** `/api/auth/signup` - Register new user
- **POST** `/api/auth/login` - Login user
- **GET** `/api/auth/profile` - Get current user (requires auth)

---

## Testing Checklist

After deployment, test these flows:

### Student Flow
- [ ] Visit `/register` - Signup page loads
- [ ] Fill form and submit - Account created
- [ ] Redirect to `/dashboard` - Dashboard loads
- [ ] Logout and login again - Works correctly

### Teacher Flow
- [ ] Visit `/login`
- [ ] Login with teacher credentials
- [ ] Navigate to `/teacher/dashboard`
- [ ] Create a new course
- [ ] Upload lessons
- [ ] Publish the course

### Admin Flow
- [ ] Visit `/login`
- [ ] Login with admin credentials
- [ ] Navigate to `/admin/dashboard`
- [ ] Access all admin features

---

## Troubleshooting

### Issue: CORS Error
```
Access to XMLHttpRequest has been blocked by CORS policy
```
**Solution**: 
1. Ensure your Vercel domain is added to `allowedOrigins` in `backend/server.js`
2. Check that `FRONTEND_URL` is set correctly in backend environment variables

### Issue: 401 Unauthorized
```
{"success": false, "message": "Not authorized, token failed"}
```
**Solution**: 
1. Check that JWT_SECRET is set correctly in backend
2. Ensure frontend is sending the token in the Authorization header
3. Verify the token is being stored in localStorage

### Issue: Network Error / API Not Found
```
Network Error / Cannot connect to server
```
**Solution**: 
1. Verify `VITE_API_URL` is set correctly in Vercel environment variables
2. Check that your backend server is running and accessible
3. Verify the backend API URL is correct and accessible

### Issue: MongoDB Connection Error
```
MongoServerSelectionError: connect ECONNREFUSED
```
**Solution**: 
1. Ensure `MONGODB_URI` is set correctly with your MongoDB Atlas credentials
2. Check MongoDB Atlas network access - allow all IPs (0.0.0.0/0)
3. Verify database credentials are correct

### Issue: Page Not Found (404) on Refresh
**Solution**: This is expected for SPA. Ensure your hosting serves `index.html` for all routes.

---

## Security Notes

1. **Never commit `.env` files** - They're already in `.gitignore`
2. **Use strong JWT secrets** - Generate using: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`
3. **Use MongoDB Atlas** - For production, use MongoDB Atlas cloud database
4. **Enable HTTPS** - Vercel provides this automatically

---

## Quick Checklist

- [ ] Verify GitHub repository connected in Vercel
- [ ] Trigger fresh deployment / Clear cache
- [ ] Set `VITE_API_URL` in Vercel (Frontend)
- [ ] Set `MONGODB_URI` in backend hosting
- [ ] Set `JWT_SECRET` in backend hosting  
- [ ] Set `FRONTEND_URL` in backend hosting
- [ ] Update CORS allowedOrigins with your actual domain
- [ ] Push changes to GitHub
- [ ] Test signup and login in production

---

## Deployment Commands

### Windows
```bash
deploy.bat
```

### Linux/Mac
```bash
bash deploy.sh
```

### Manual
```bash
cd frontend
npm install
npm run build
vercel --prod --yes
```


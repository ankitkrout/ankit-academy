@echo off
echo ========================================
echo Ankit Academy - Vercel Deployment
echo ========================================

cd "c:\Users\Ankit kumar\OneDrive\Desktop\Html By Sanjeev Sir\chocing website\frontend"

echo.
echo Installing frontend dependencies...
call npm install

echo.
echo Building frontend for production...
call npm run build

echo.
echo Deploying to Vercel...
call vercel --prod --yes --force

echo.
echo ========================================
echo Deployment complete!
echo ========================================
echo.
echo IMPORTANT: Make sure to set these environment variables in Vercel:
echo   1. VITE_API_URL = https://your-backend-url.com/api
echo   2. For backend: MONGODB_URI, JWT_SECRET, FRONTEND_URL
echo.
pause

# Ankit Academy - Mobile App Preparation Guide

## Current Status
The Ankit Academy web application is fully functional and ready for mobile app conversion.

---

## Architecture for Mobile

### Technology Stack
- **Frontend:** React (can be converted to React Native/Expo)
- **Backend:** Node.js + Express (reuse existing API)
- **Database:** MongoDB (reuse existing database)
- **Authentication:** JWT (works with mobile)

---

## Conversion Options

### Option 1: React Native with Expo (Recommended)

#### Step 1: Initialize Expo Project
```bash
# Install Expo CLI globally
npm install -g expo-cli

# Create new Expo project
npx create-expo-app AnkitAcademyMobile

# Navigate to project
cd AnkitAcademyMobile
```

#### Step 2: Install Dependencies
```bash
npm install @react-navigation/native @react-navigation/stack
npm install axios react-native-safe-area-context
npm install react-native-screens react-native-gesture-handler
```

#### Step 3: Copy Core Components
Copy these from the web app:
- `/src/services/api.js` - API service (modify baseURL for mobile)
- `/src/context/AuthContext.jsx` - Authentication context
- `/src/pages/` - All screen components
- `/src/components/` - Reusable components

#### Step 4: Key Differences for Mobile
1. Replace `<Link>` with React Navigation
2. Replace `<a>` tags with `Link` from `@react-navigation`
3. Use `Dimensions` for responsive design
4. Replace CSS with StyleSheet or Tailwind (NativeWind)

#### Step 5: Build for iOS/Android
```bash
# Generate native projects
npx expo prebuild

# Run on iOS simulator
npx expo run:ios

# Run on Android emulator
npx expo run:android
```

---

### Option 2: Progressive Web App (PWA)

The current web app can be converted to a PWA for mobile-like experience.

#### Add PWA Support
1. Create `manifest.json` in `/public`
2. Add service worker
3. Configure for offline support

---

### Option 3: Capacitor (Hybrid)

Convert existing React app to mobile using Capacitor.

```bash
# Install Capacitor
npm install @capacitor/core @capacitor/cli

# Initialize
npx cap init

# Add platforms
npx cap add ios
npx cap add android

# Build and sync
npm run build
npx cap sync
```

---

## API Integration for Mobile

### Update API Base URL
```javascript
// For mobile, use your deployed backend URL
const api = axios.create({
  baseURL: 'https://your-backend.onrender.com/api',
  // or use local IP for development
  // baseURL: 'http://192.168.1.x:5000/api',
});
```

### Authentication Flow
The JWT authentication works the same:
1. Store token in `AsyncStorage` instead of `localStorage`
2. Include token in request headers
3. Handle token refresh

---

## Mobile-Specific Features to Add

1. **Push Notifications** - FCM or OneSignal
2. **Camera Access** - For uploading photos
3. **File System** - For downloading PDFs
4. **Offline Mode** - Cache courses and lessons
5. **Biometric Auth** - Face ID / Fingerprint

---

## Testing on Mobile

### Development
```bash
# Get your computer's IP address
ipconfig  # Windows
ifconfig  # Mac/Linux

# Start Metro bundler
npx expo start

# Scan QR code with your phone
```

### Build for Production
```bash
# Build iOS
npx expo build:ios

# Build Android
npx expo build:android
```

---

## Reuse Existing Backend

Your current backend at `http://localhost:5000` (or deployed) can be reused:

1. **No changes needed** to API routes
2. **No changes needed** to database
3. **Update CORS** in backend to allow mobile app origin

```javascript
// backend/server.js - Update CORS
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://localhost:19000', // Expo
    'exp://localhost:19000',  // Expo
    'https://your-app.expo.app'
  ],
  credentials: true
};
```

---

## Summary

| Component | Reuse | Modify |
|-----------|-------|--------|
| Backend API | ✅ Yes | CORS only |
| Database | ✅ Yes | None |
| Auth System | ✅ Yes | Storage (AsyncStorage) |
| Course Logic | ✅ Yes | None |
| Lesson System | ✅ Yes | None |
| AI Assistant | ✅ Yes | None |
| UI Components | ⚠️ Partial | Navigation, Touch |

---

## Next Steps

1. **Test the web app** at http://localhost:5173
2. **Deploy backend** to Render/Railway
3. **Choose conversion method** (Expo recommended)
4. **Start mobile development**

The web app is production-ready and mobile conversion is straightforward!

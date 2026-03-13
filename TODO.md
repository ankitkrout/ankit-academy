# Google OAuth + Production Auth Fix - Implementation Steps

## ✅ Completed
- [x] Analyzed current auth system
- [x] Created TODO.md for tracking

## ✅ Completed Steps
1. [x] Fix Production API URL - `frontend/src/services/api.js` (uses VITE_API_URL)
2. [x] Update User Model - `backend/models/User.js` (googleId added)
3. [x] Backend Dependencies - `backend/package.json` (google-auth-library ^9.6.2)
4. [x] Google Auth Route - `backend/routes/googleAuth.js` + server.js integration (`POST /api/auth/google`)
5. [x] Frontend Dependencies - `frontend/package.json` (@react-oauth/google ^0.12.1)

## 🔄 Next Steps (Step 6/8)
6. [ ] Google Login Button - Add to Login/Register pages
7. [ ] AuthContext Update - Add `googleLogin` method
8. [ ] Environment Setup - .env.example + CORS + Vercel config

## Status
**Backend Google OAuth complete** → `/api/auth/google` verifies ID token, creates/links users

**Next**: Add Google buttons to UI

## Status
**Ready for Google OAuth backend route** → Verifies ID token, finds/creates user, returns JWT

## Next Action
**Update api.js** to use `VITE_API_URL` → Fixes localhost production issue immediately

**Status**: Ready to implement. Will use placeholder `VITE_GOOGLE_CLIENT_ID=your-google-client-id.googleusercontent.com`


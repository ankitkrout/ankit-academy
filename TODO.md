# Vercel Deployment Fix - Progress Tracker

## Phase 1: Code & Config Fixes ✅ In Progress

- [x] Create TODO.md
- [x] Create frontend/.env.example
- [x] Create backend/.env.example  
- [x] Update backend/server.js (CORS + MongoDB env)
- [ ] Fix backend/seed.js (MongoDB env)
- [x] Disable backend/test-api.js
- [x] Create root vercel.json (monorepo config)
- [x] Create frontend/vercel.json (Vite preset)
- [x] Update README.md (deployment guide)
- [ ] Commit & push all changes
- [ ] Test local build: `cd frontend && npm run build`

## Phase 2: Vercel Setup (Manual)

- [ ] Add env vars to Vercel Dashboard:
  | Name | Value |
  |------|-------|
  | `VITE_API_URL` | `https://your-backend-api.com/api` (update after backend deploy) |
- [ ] Redeploy frontend project
- [ ] Verify: Test login at https://frontend-nu-virid-37.vercel.app/login

## Phase 3: Backend Deploy (Later)

- [ ] Deploy backend to Vercel/Heroku/Render
- [ ] Add MONGODB_URI, JWT_SECRET, FRONTEND_URL
- [ ] Update VITE_API_URL to real backend URL
- [ ] Test end-to-end

**Next Action**: Complete Phase 1 → Auto-trigger Vercel redeploy on push.

**Status**: Working...

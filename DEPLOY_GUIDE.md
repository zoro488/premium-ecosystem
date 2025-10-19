# 🚀 Quick Deployment Guide

## Option 1: Automated Script (Recommended)

### Windows (PowerShell):
```powershell
# Preview deployment
.\deploy.ps1 preview

# Production deployment
.\deploy.ps1 production
```

### Linux/Mac (Bash):
```bash
# Make script executable
chmod +x deploy.sh

# Preview deployment
./deploy.sh preview

# Production deployment
./deploy.sh production
```

## Option 2: Manual Deployment

### 1. Configure Environment Variables

Create `.env.local`:
```bash
VITE_SENTRY_DSN=https://your-dsn@sentry.io/project-id
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 2. Run Tests & Build

```bash
npm run lint
npm run test:run
npm run build
```

### 3. Deploy to Vercel

```bash
# Install Vercel CLI (first time only)
npm install -g vercel

# Login
vercel login

# Deploy preview
vercel

# Deploy production
vercel --prod
```

## Option 3: GitHub Integration (Automatic)

### 1. Push to GitHub

```bash
git add .
git commit -m "Production deployment"
git push origin main
```

### 2. Connect Vercel

1. Go to [vercel.com](https://vercel.com/new)
2. Import your GitHub repository
3. Add environment variables:
   - `VITE_SENTRY_DSN`
   - `VITE_GA_MEASUREMENT_ID`
4. Deploy automatically ✅

### 3. Configure GitHub Secrets (for CI/CD)

In GitHub Settings > Secrets and variables > Actions, add:
- `VERCEL_TOKEN` (from Vercel Settings > Tokens)
- `VERCEL_ORG_ID` (from Vercel team settings)
- `VERCEL_PROJECT_ID` (from project settings)

## Post-Deployment Checklist

### Essential:
- [ ] App loads correctly
- [ ] All 5 applications accessible
- [ ] Navigation works
- [ ] Mobile responsive
- [ ] PWA installable

### Monitoring:
- [ ] Sentry capturing errors
- [ ] Google Analytics tracking pageviews
- [ ] Vercel Analytics enabled

### Performance:
- [ ] Lighthouse score > 90
- [ ] PWA score: All checks passing
- [ ] Service worker registered
- [ ] Offline mode works

## Troubleshooting

### "Vercel CLI not found"
```bash
npm install -g vercel
```

### "Build failed"
```bash
# Clear cache
rm -rf node_modules dist
npm install
npm run build
```

### "Environment variables not working"
- Variables must start with `VITE_`
- Create `.env.local` (not tracked in git)
- Restart dev server after changes
- In Vercel: Add in Project Settings > Environment Variables

### PWA not installing
- Requires HTTPS (Vercel provides this)
- Check manifest.json is served
- Verify service worker in DevTools
- Test in different browsers

## Quick Commands Reference

```bash
# Development
npm run dev                  # Start dev server

# Testing
npm test                     # Run tests (watch mode)
npm run test:run            # Run tests once
npm run test:coverage       # Generate coverage
npm run test:e2e            # Run E2E tests

# Building
npm run build               # Production build
npm run preview             # Preview build locally

# Deployment
.\deploy.ps1 preview        # Windows: Preview
.\deploy.ps1 production     # Windows: Production
./deploy.sh preview         # Unix: Preview
./deploy.sh production      # Unix: Production
```

## Environment Variables

### Required for Production:
- `VITE_SENTRY_DSN` - Error monitoring
- `VITE_GA_MEASUREMENT_ID` - Analytics tracking

### Optional:
- `VITE_FIREBASE_API_KEY` - Firebase features
- `VITE_FIREBASE_AUTH_DOMAIN` - Firebase auth
- `VITE_FIREBASE_PROJECT_ID` - Firebase project

## Support

- 📖 Full docs: `DEPLOYMENT.md`
- 🎯 Production checklist: `PRODUCTION_READY.md`
- 🚀 Quick start: `QUICK_START.md`
- 📝 Changes log: `COMPLETADO.md`

---

**Ready to deploy?** Run: `.\deploy.ps1 preview`

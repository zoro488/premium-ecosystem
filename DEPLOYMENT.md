# 🚀 Deployment Guide - Premium Ecosystem

## Pre-deployment Checklist

### 1. Environment Variables

Create a `.env.local` file with:

```bash
# Sentry Error Monitoring
VITE_SENTRY_DSN=https://your-sentry-dsn@sentry.io/your-project-id

# Google Analytics 4
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Firebase (if using)
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
```

### 2. Run Full Test Suite

```bash
# Unit tests
npm run test:run

# E2E tests (requires dev server)
npm run test:e2e

# Coverage report
npm run test:coverage
```

### 3. Build Optimization

```bash
# Create production build
npm run build

# Preview production build locally
npm run preview

# Check bundle size (generates dist/stats.html)
# Open dist/stats.html in browser to analyze bundle
```

## Deployment to Vercel

### Option 1: GitHub Integration (Recommended)

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Ready for production deployment"
   git push origin main
   ```

2. **Connect Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Configure environment variables in Vercel dashboard
   - Deploy automatically on every push to `main`

3. **GitHub Secrets** (for CI/CD):
   Add these secrets in GitHub Settings > Secrets and variables > Actions:
   - `VERCEL_TOKEN`: Get from Vercel Settings > Tokens
   - `VERCEL_ORG_ID`: Get from Vercel team settings
   - `VERCEL_PROJECT_ID`: Get from project settings

### Option 2: Manual Deployment via CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod

# Or deploy to preview
vercel
```

## Post-Deployment Verification

### 1. Check Core Features

- [ ] All 5 apps load correctly
- [ ] Navigation between apps works
- [ ] Data persistence (localStorage)
- [ ] Responsive design on mobile/tablet
- [ ] PWA install prompt appears
- [ ] Service worker caching works offline

### 2. Monitor Performance

#### Lighthouse Audit:
```bash
# Install lighthouse CLI
npm install -g lighthouse

# Run audit on deployed URL
lighthouse https://your-app.vercel.app --view
```

**Target Scores:**
- Performance: 90+
- Accessibility: 90+
- Best Practices: 90+
- SEO: 90+
- PWA: ✓ All checks

#### Bundle Size:
- Total JS: < 500 KB (gzipped)
- Main chunk: < 200 KB (gzipped)
- Lazy loaded chunks: < 150 KB each

### 3. Error Monitoring

1. **Sentry Dashboard**:
   - Go to your Sentry project
   - Verify errors are being tracked
   - Test by throwing a test error

2. **Google Analytics**:
   - Open GA4 dashboard
   - Check real-time reports
   - Verify page views are tracking

### 4. PWA Installation

Test on different devices:
- **Desktop**: Chrome/Edge show install button
- **Mobile (iOS)**: Safari > Share > Add to Home Screen
- **Mobile (Android)**: Chrome shows install prompt

## CI/CD Pipeline

The GitHub Actions workflow (`.github/workflows/deploy.yml`) automatically:

1. **On Pull Request**:
   - Runs linter
   - Runs unit tests
   - Runs E2E tests
   - Creates preview deployment

2. **On Push to Main**:
   - Runs full test suite
   - Creates production build
   - Deploys to Vercel production
   - Notifies on success/failure

## Rollback Strategy

If issues occur in production:

### Quick Rollback (Vercel):
```bash
# List deployments
vercel ls

# Promote previous deployment to production
vercel promote [deployment-url]
```

### Git Rollback:
```bash
# Revert to previous commit
git revert HEAD
git push origin main
```

## Performance Optimization Tips

### 1. Image Optimization
- Use WebP format for images
- Implement lazy loading for images below fold
- Use proper image sizes (no oversized images)

### 2. Code Splitting
Already implemented:
- React Router lazy loading
- Manual chunks in `vite.config.js`
- Dynamic imports for heavy components

### 3. Caching Strategy
- PWA service worker caches static assets
- Vercel CDN caches build artifacts
- Browser caching via headers

### 4. Monitoring Recommendations

**Uptime Monitoring**:
- [UptimeRobot](https://uptimerobot.com/) - Free tier available
- [Pingdom](https://www.pingdom.com/)
- Vercel Analytics (built-in)

**Performance Monitoring**:
- Sentry Performance monitoring
- Vercel Speed Insights
- Google PageSpeed Insights (weekly checks)

## Troubleshooting

### Build Fails

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check Node version (requires 18+)
node -v

# Try local build
npm run build
```

### Environment Variables Not Working

1. Check `.env.local` exists (not tracked in git)
2. Verify variables start with `VITE_`
3. Restart dev server after changes
4. In Vercel, add in Project Settings > Environment Variables

### Slow Performance

1. Check bundle size in `dist/stats.html`
2. Identify large dependencies
3. Consider lazy loading heavy components
4. Enable compression in hosting

### PWA Not Installing

1. Verify HTTPS (required for PWA)
2. Check `manifest.json` is served correctly
3. Verify service worker registration in DevTools
4. Test on different browsers

## Maintenance Schedule

### Daily:
- Check Sentry for new errors
- Monitor uptime status

### Weekly:
- Review GA4 analytics
- Check bundle size trends
- Run Lighthouse audit

### Monthly:
- Update dependencies: `npm outdated`
- Review and close old Sentry issues
- Check PWA cache strategy effectiveness

## Support

For issues or questions:
- Check documentation in `/docs`
- Review QUICK_START.md
- Open issue on GitHub
- Contact: your-email@example.com

---

**Last Updated**: 2025
**Version**: 3.0.0
**Status**: ✅ Production Ready

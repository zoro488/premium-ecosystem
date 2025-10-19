#!/bin/bash
# Deployment Script for Premium Ecosystem (Unix/Linux/Mac)
# Usage: ./deploy.sh [preview|production]

set -e

ENVIRONMENT=${1:-preview}

# Normalize environment
if [ "$ENVIRONMENT" = "prod" ]; then
    ENVIRONMENT="production"
fi

echo "🚀 Premium Ecosystem Deployment Script"
echo "======================================="
echo ""
echo "📋 Environment: $ENVIRONMENT"
echo ""

# Step 1: Check environment variables
echo "1️⃣  Checking environment variables..."
if [ ! -f ".env.local" ]; then
    echo "⚠️  Warning: .env.local not found!"
    if [ -f ".env.example" ]; then
        cp .env.example .env.local
        echo "   ✅ Created .env.local - Please configure your variables!"
        echo "   📝 Edit .env.local and add:"
        echo "      - VITE_SENTRY_DSN"
        echo "      - VITE_GA_MEASUREMENT_ID"
        echo ""
        read -p "   Continue without variables? (y/N) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            echo "❌ Deployment cancelled. Configure .env.local first."
            exit 1
        fi
    fi
else
    echo "   ✅ .env.local found"
fi
echo ""

# Step 2: Run linter
echo "2️⃣  Running linter..."
if npm run lint > /dev/null 2>&1; then
    echo "   ✅ Linter passed"
else
    echo "   ⚠️  Linter warnings found (continuing anyway)"
fi
echo ""

# Step 3: Run tests
echo "3️⃣  Running tests..."
if npm run test:run > /dev/null 2>&1; then
    echo "   ✅ Tests passed"
else
    echo "   ⚠️  Some tests failed"
    read -p "   Continue anyway? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Deployment cancelled."
        exit 1
    fi
fi
echo ""

# Step 4: Build project
echo "4️⃣  Building project..."
npm run build
echo "   ✅ Build successful"
echo ""

# Step 5: Check bundle size
echo "5️⃣  Checking bundle size..."
if [ -f "dist/stats.html" ]; then
    echo "   ✅ Bundle analysis generated at dist/stats.html"
    echo "   💡 Tip: Open dist/stats.html to analyze bundle size"
else
    echo "   ⚠️  Bundle analysis not found"
fi
echo ""

# Step 6: Check Vercel CLI
echo "6️⃣  Checking Vercel CLI..."
if ! command -v vercel &> /dev/null; then
    echo "   ⚠️  Vercel CLI not found!"
    read -p "   Install Vercel CLI globally? (y/N) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        npm install -g vercel
        echo "   ✅ Vercel CLI installed"
    else
        echo "❌ Deployment cancelled. Vercel CLI required."
        exit 1
    fi
else
    echo "   ✅ Vercel CLI found"
fi
echo ""

# Step 7: Deploy
echo "7️⃣  Deploying to Vercel ($ENVIRONMENT)..."
echo ""

if [ "$ENVIRONMENT" = "production" ]; then
    echo "⚠️  PRODUCTION DEPLOYMENT"
    echo "   This will deploy to your production domain!"
    read -p "   Are you sure? (yes/N) " -r
    echo
    if [ "$REPLY" != "yes" ]; then
        echo "❌ Deployment cancelled."
        exit 1
    fi
    echo ""
    vercel --prod
else
    echo "📦 Creating preview deployment..."
    vercel
fi

echo ""
echo "✅ DEPLOYMENT SUCCESSFUL!"
echo ""
echo "📊 Next steps:"
echo "   1. Test the deployed app"
echo "   2. Check Sentry for errors (if configured)"
echo "   3. Verify Google Analytics (if configured)"
echo "   4. Test PWA installation on mobile"
echo ""

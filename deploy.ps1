#!/usr/bin/env pwsh
# Deployment Script for Premium Ecosystem
# Usage: .\deploy.ps1 [preview|production]

param(
    [Parameter(Position=0)]
    [ValidateSet('preview', 'production', 'prod')]
    [string]$Environment = 'preview'
)

$ErrorActionPreference = 'Stop'

Write-Host "🚀 Premium Ecosystem Deployment Script" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host ""

# Normalize environment
if ($Environment -eq 'prod') {
    $Environment = 'production'
}

Write-Host "📋 Environment: $Environment" -ForegroundColor Yellow
Write-Host ""

# Step 1: Check if .env.local exists
Write-Host "1️⃣  Checking environment variables..." -ForegroundColor Blue
if (-not (Test-Path ".env.local")) {
    Write-Host "⚠️  Warning: .env.local not found!" -ForegroundColor Yellow
    Write-Host "   Creating from .env.example..." -ForegroundColor Gray
    
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env.local"
        Write-Host "   ✅ Created .env.local - Please configure your variables!" -ForegroundColor Green
        Write-Host "   📝 Edit .env.local and add:" -ForegroundColor Gray
        Write-Host "      - VITE_SENTRY_DSN" -ForegroundColor Gray
        Write-Host "      - VITE_GA_MEASUREMENT_ID" -ForegroundColor Gray
        Write-Host ""
        $continue = Read-Host "   Continue without variables? (y/N)"
        if ($continue -ne 'y' -and $continue -ne 'Y') {
            Write-Host "❌ Deployment cancelled. Configure .env.local first." -ForegroundColor Red
            exit 1
        }
    }
} else {
    Write-Host "   ✅ .env.local found" -ForegroundColor Green
}
Write-Host ""

# Step 2: Run linter
Write-Host "2️⃣  Running linter..." -ForegroundColor Blue
try {
    npm run lint 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ Linter passed" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  Linter warnings found (continuing anyway)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   ⚠️  Linter check skipped" -ForegroundColor Yellow
}
Write-Host ""

# Step 3: Run tests
Write-Host "3️⃣  Running tests..." -ForegroundColor Blue
try {
    npm run test:run 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ Tests passed" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  Some tests failed" -ForegroundColor Yellow
        $continue = Read-Host "   Continue anyway? (y/N)"
        if ($continue -ne 'y' -and $continue -ne 'Y') {
            Write-Host "❌ Deployment cancelled." -ForegroundColor Red
            exit 1
        }
    }
} catch {
    Write-Host "   ⚠️  Tests skipped" -ForegroundColor Yellow
}
Write-Host ""

# Step 4: Build project
Write-Host "4️⃣  Building project..." -ForegroundColor Blue
npm run build
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ Build successful" -ForegroundColor Green
} else {
    Write-Host "   ❌ Build failed!" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Step 5: Check bundle size
Write-Host "5️⃣  Checking bundle size..." -ForegroundColor Blue
if (Test-Path "dist/stats.html") {
    Write-Host "   ✅ Bundle analysis generated at dist/stats.html" -ForegroundColor Green
    Write-Host "   💡 Tip: Open dist/stats.html to analyze bundle size" -ForegroundColor Gray
} else {
    Write-Host "   ⚠️  Bundle analysis not found" -ForegroundColor Yellow
}
Write-Host ""

# Step 6: Check Vercel CLI
Write-Host "6️⃣  Checking Vercel CLI..." -ForegroundColor Blue
$vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue
if (-not $vercelInstalled) {
    Write-Host "   ⚠️  Vercel CLI not found!" -ForegroundColor Yellow
    $install = Read-Host "   Install Vercel CLI globally? (y/N)"
    if ($install -eq 'y' -or $install -eq 'Y') {
        Write-Host "   Installing Vercel CLI..." -ForegroundColor Gray
        npm install -g vercel
        if ($LASTEXITCODE -ne 0) {
            Write-Host "   ❌ Failed to install Vercel CLI" -ForegroundColor Red
            exit 1
        }
        Write-Host "   ✅ Vercel CLI installed" -ForegroundColor Green
    } else {
        Write-Host "❌ Deployment cancelled. Vercel CLI required." -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "   ✅ Vercel CLI found" -ForegroundColor Green
}
Write-Host ""

# Step 7: Deploy
Write-Host "7️⃣  Deploying to Vercel ($Environment)..." -ForegroundColor Blue
Write-Host ""

if ($Environment -eq 'production') {
    Write-Host "⚠️  PRODUCTION DEPLOYMENT" -ForegroundColor Yellow
    Write-Host "   This will deploy to your production domain!" -ForegroundColor Yellow
    $confirm = Read-Host "   Are you sure? (yes/N)"
    if ($confirm -ne 'yes') {
        Write-Host "❌ Deployment cancelled." -ForegroundColor Red
        exit 1
    }
    Write-Host ""
    vercel --prod
} else {
    Write-Host "📦 Creating preview deployment..." -ForegroundColor Cyan
    vercel
}

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ DEPLOYMENT SUCCESSFUL!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📊 Next steps:" -ForegroundColor Cyan
    Write-Host "   1. Test the deployed app" -ForegroundColor Gray
    Write-Host "   2. Check Sentry for errors (if configured)" -ForegroundColor Gray
    Write-Host "   3. Verify Google Analytics (if configured)" -ForegroundColor Gray
    Write-Host "   4. Test PWA installation on mobile" -ForegroundColor Gray
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "❌ DEPLOYMENT FAILED!" -ForegroundColor Red
    Write-Host "   Check the error messages above" -ForegroundColor Yellow
    exit 1
}

# Development Environment Setup Script
# PowerShell version for Windows

Write-Host "🚀 Premium Ecosystem - Development Environment Setup" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

# Check Node.js version
Write-Host "📦 Checking Node.js version..." -ForegroundColor Yellow
try {
    $nodeVersion = node -v
    $versionNumber = [int]($nodeVersion -replace 'v(\d+)\..*', '$1')

    if ($versionNumber -lt 20) {
        Write-Host "❌ Node.js version 20 or higher required. Current: $nodeVersion" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Node.js $nodeVersion detected" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed. Please install Node.js 20 or higher." -ForegroundColor Red
    exit 1
}

# Check npm
try {
    $npmVersion = npm -v
    Write-Host "✅ npm $npmVersion detected" -ForegroundColor Green
} catch {
    Write-Host "❌ npm is not installed" -ForegroundColor Red
    exit 1
}

# Install dependencies
Write-Host ""
Write-Host "📥 Installing dependencies..." -ForegroundColor Yellow
try {
    npm ci
} catch {
    npm install
}

# Setup Firebase
Write-Host ""
Write-Host "🔥 Checking Firebase CLI..." -ForegroundColor Yellow
try {
    firebase --version | Out-Null
    Write-Host "✅ Firebase CLI installed" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Firebase CLI not found. Installing globally..." -ForegroundColor Yellow
    npm install -g firebase-tools
}

# Setup Playwright
Write-Host ""
Write-Host "🎭 Installing Playwright browsers..." -ForegroundColor Yellow
npx playwright install --with-deps

# Create .env.local if doesn't exist
if (-not (Test-Path ".env.local")) {
    Write-Host ""
    Write-Host "📝 Creating .env.local template..." -ForegroundColor Yellow

    $envContent = @"
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Sentry Configuration
VITE_SENTRY_DSN=your_sentry_dsn

# Environment
VITE_ENV=development
"@

    Set-Content -Path ".env.local" -Value $envContent -Encoding UTF8
    Write-Host "✅ Created .env.local template" -ForegroundColor Green
    Write-Host "⚠️  Please update .env.local with your Firebase credentials" -ForegroundColor Yellow
} else {
    Write-Host "✅ .env.local already exists" -ForegroundColor Green
}

# Build check
Write-Host ""
Write-Host "🏗️  Running build check..." -ForegroundColor Yellow
npm run build

Write-Host ""
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "✅ Development environment setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Next steps:" -ForegroundColor Cyan
Write-Host "1. Update .env.local with your Firebase credentials"
Write-Host "2. Run 'npm run dev' to start development server"
Write-Host "3. Run 'npm test' to run tests"
Write-Host "4. Run 'npm run test:e2e' to run E2E tests"
Write-Host ""
Write-Host "🔗 Documentation: README.md" -ForegroundColor Blue
Write-Host "==================================================" -ForegroundColor Cyan

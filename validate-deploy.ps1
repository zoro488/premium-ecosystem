# ========================================
# PRE-DEPLOYMENT VALIDATION SCRIPT
# ========================================
# Valida que todo está listo para deployment
# Uso: .\validate-deploy.ps1

param(
    [Parameter(Mandatory=$false)]
    [switch]$Fix = $false,

    [Parameter(Mandatory=$false)]
    [switch]$Verbose = $false
)

$ErrorActionPreference = "Stop"

# Colores
function Write-Success($Message) {
    Write-Host "✅ $Message" -ForegroundColor Green
}

function Write-Fail($Message) {
    Write-Host "❌ $Message" -ForegroundColor Red
}

function Write-Warning($Message) {
    Write-Host "⚠️  $Message" -ForegroundColor Yellow
}

function Write-Info($Message) {
    Write-Host "ℹ️  $Message" -ForegroundColor Cyan
}

function Write-SectionHeader($Message) {
    Write-Host "`n========================================" -ForegroundColor Magenta
    Write-Host "  $Message" -ForegroundColor Magenta
    Write-Host "========================================`n" -ForegroundColor Magenta
}

# Variables
$issues = @()
$warnings = @()
$passed = 0
$failed = 0

# Banner
Clear-Host
Write-Host @"
╔══════════════════════════════════════════════════════╗
║                                                      ║
║       🔍 PRE-DEPLOYMENT VALIDATION CHECK 🔍         ║
║                                                      ║
╚══════════════════════════════════════════════════════╝

"@ -ForegroundColor Cyan

# ========================================
# 1. ENVIRONMENT CHECKS
# ========================================
Write-SectionHeader "1. ENVIRONMENT CHECKS"

# Node.js version
Write-Info "Checking Node.js version..."
try {
    $nodeVersion = node --version
    $nodeVersionNumber = [version]($nodeVersion -replace 'v', '')
    if ($nodeVersionNumber -ge [version]"18.0.0") {
        Write-Success "Node.js version: $nodeVersion (OK)"
        $passed++
    } else {
        Write-Fail "Node.js version: $nodeVersion (Required: 18.x or higher)"
        $issues += "Node.js version too old"
        $failed++
    }
} catch {
    Write-Fail "Node.js not found"
    $issues += "Node.js not installed"
    $failed++
}

# npm version
Write-Info "Checking npm version..."
try {
    $npmVersion = npm --version
    Write-Success "npm version: $npmVersion (OK)"
    $passed++
} catch {
    Write-Fail "npm not found"
    $issues += "npm not installed"
    $failed++
}

# Git
Write-Info "Checking Git..."
try {
    $gitVersion = git --version
    Write-Success "Git: $gitVersion (OK)"
    $passed++
} catch {
    Write-Fail "Git not found"
    $issues += "Git not installed"
    $failed++
}

# ========================================
# 2. PROJECT STRUCTURE
# ========================================
Write-SectionHeader "2. PROJECT STRUCTURE"

# package.json
Write-Info "Checking package.json..."
if (Test-Path "package.json") {
    Write-Success "package.json found"
    $passed++
} else {
    Write-Fail "package.json not found"
    $issues += "Missing package.json"
    $failed++
}

# vite.config.js
Write-Info "Checking vite.config.js..."
if (Test-Path "vite.config.js") {
    Write-Success "vite.config.js found"
    $passed++
} else {
    Write-Fail "vite.config.js not found"
    $issues += "Missing vite.config.js"
    $failed++
}

# src directory
Write-Info "Checking src directory..."
if (Test-Path "src") {
    Write-Success "src directory found"
    $passed++
} else {
    Write-Fail "src directory not found"
    $issues += "Missing src directory"
    $failed++
}

# index.html
Write-Info "Checking index.html..."
if (Test-Path "index.html") {
    Write-Success "index.html found"
    $passed++
} else {
    Write-Fail "index.html not found"
    $issues += "Missing index.html"
    $failed++
}

# ========================================
# 3. DEPENDENCIES
# ========================================
Write-SectionHeader "3. DEPENDENCIES"

# node_modules
Write-Info "Checking node_modules..."
if (Test-Path "node_modules") {
    Write-Success "node_modules found"
    $passed++
} else {
    Write-Warning "node_modules not found"
    $warnings += "Run 'npm install' to install dependencies"
    if ($Fix) {
        Write-Info "Running npm install..."
        npm install
        Write-Success "Dependencies installed"
        $passed++
    } else {
        $failed++
        $issues += "Missing node_modules (run with -Fix to auto-install)"
    }
}

# package-lock.json
Write-Info "Checking package-lock.json..."
if (Test-Path "package-lock.json") {
    Write-Success "package-lock.json found"
    $passed++
} else {
    Write-Warning "package-lock.json not found"
    $warnings += "Consider running 'npm install' to generate lockfile"
}

# ========================================
# 4. ENVIRONMENT VARIABLES
# ========================================
Write-SectionHeader "4. ENVIRONMENT VARIABLES"

# .env files
Write-Info "Checking .env files..."
if (Test-Path ".env") {
    Write-Success ".env found"
    $passed++

    # Verificar variables críticas
    $envContent = Get-Content ".env" -Raw
    $requiredVars = @(
        "VITE_FIREBASE_API_KEY",
        "VITE_FIREBASE_AUTH_DOMAIN",
        "VITE_FIREBASE_PROJECT_ID",
        "VITE_FIREBASE_STORAGE_BUCKET",
        "VITE_FIREBASE_MESSAGING_SENDER_ID",
        "VITE_FIREBASE_APP_ID"
    )

    foreach ($var in $requiredVars) {
        if ($envContent -match "$var=.+") {
            Write-Success "  $var configured"
            $passed++
        } else {
            Write-Fail "  $var missing or empty"
            $issues += "Missing environment variable: $var"
            $failed++
        }
    }
} else {
    Write-Warning ".env not found"
    $warnings += "Create .env file for local development"
}

# .env.production
Write-Info "Checking .env.production..."
if (Test-Path ".env.production") {
    Write-Success ".env.production found (for production build)"
    $passed++
} else {
    Write-Warning ".env.production not found (will use .env or Vercel env vars)"
}

# ========================================
# 5. GIT STATUS
# ========================================
Write-SectionHeader "5. GIT STATUS"

# Git repository
Write-Info "Checking Git repository..."
if (Test-Path ".git") {
    Write-Success "Git repository initialized"
    $passed++

    # Current branch
    $gitBranch = git rev-parse --abbrev-ref HEAD
    Write-Info "Current branch: $gitBranch"

    # Uncommitted changes
    $gitStatus = git status --porcelain
    if ($gitStatus) {
        Write-Warning "Uncommitted changes detected:"
        git status --short
        $warnings += "Commit changes before deploying"
    } else {
        Write-Success "No uncommitted changes"
        $passed++
    }

    # Unpushed commits
    $unpushedCommits = git log origin/$gitBranch..$gitBranch --oneline 2>$null
    if ($unpushedCommits) {
        Write-Warning "Unpushed commits detected"
        $warnings += "Push commits before deploying"
    } else {
        Write-Success "All commits pushed"
        $passed++
    }
} else {
    Write-Fail "Not a Git repository"
    $issues += "Initialize Git repository"
    $failed++
}

# ========================================
# 6. BUILD TEST
# ========================================
Write-SectionHeader "6. BUILD TEST"

Write-Info "Running production build..."
try {
    # Limpiar dist anterior
    if (Test-Path "dist") {
        Remove-Item -Path "dist" -Recurse -Force
    }

    # Build
    $env:NODE_ENV = "production"
    npm run build 2>&1 | Out-Null

    # Verificar dist
    if (Test-Path "dist/index.html") {
        Write-Success "Build successful"
        $passed++

        # Tamaño del bundle
        $distSize = (Get-ChildItem -Path "dist" -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
        $distSizeRounded = [math]::Round($distSize, 2)

        if ($distSize -lt 5) {
            Write-Success "Bundle size: $distSizeRounded MB (OK)"
            $passed++
        } elseif ($distSize -lt 10) {
            Write-Warning "Bundle size: $distSizeRounded MB (Consider optimization)"
            $warnings += "Bundle size is large, consider optimization"
        } else {
            Write-Fail "Bundle size: $distSizeRounded MB (Too large!)"
            $issues += "Bundle size exceeds 10MB"
            $failed++
        }
    } else {
        Write-Fail "Build failed: dist/index.html not created"
        $issues += "Build process failed"
        $failed++
    }
} catch {
    Write-Fail "Build error: $_"
    $issues += "Build failed with error"
    $failed++
}

# ========================================
# 7. TESTS
# ========================================
Write-SectionHeader "7. TESTS"

Write-Info "Running linter..."
try {
    npm run lint 2>&1 | Out-Null
    Write-Success "Linting passed"
    $passed++
} catch {
    Write-Fail "Linting failed"
    $issues += "Fix linting errors"
    $failed++

    if ($Fix) {
        Write-Info "Attempting to fix linting errors..."
        npm run lint:fix
    }
}

Write-Info "Checking for test configuration..."
if (Test-Path "vitest.config.js") {
    Write-Success "Vitest configured"
    $passed++
} elseif ((Get-Content "vite.config.js" -Raw) -match "test:") {
    Write-Success "Tests configured in vite.config.js"
    $passed++
} else {
    Write-Warning "Test configuration not found"
    $warnings += "Consider setting up tests"
}

# ========================================
# 8. SECURITY
# ========================================
Write-SectionHeader "8. SECURITY CHECKS"

# .gitignore
Write-Info "Checking .gitignore..."
if (Test-Path ".gitignore") {
    $gitignoreContent = Get-Content ".gitignore" -Raw
    $criticalEntries = @(".env", "node_modules", "dist")
    $allPresent = $true

    foreach ($entry in $criticalEntries) {
        if ($gitignoreContent -match [regex]::Escape($entry)) {
            Write-Success "  $entry in .gitignore"
            $passed++
        } else {
            Write-Fail "  $entry missing from .gitignore"
            $issues += "$entry should be in .gitignore"
            $failed++
            $allPresent = $false
        }
    }
} else {
    Write-Fail ".gitignore not found"
    $issues += "Create .gitignore file"
    $failed++
}

# npm audit
Write-Info "Running npm audit..."
$auditOutput = npm audit --audit-level=high --json 2>&1 | ConvertFrom-Json
if ($auditOutput.metadata.vulnerabilities.high -eq 0 -and $auditOutput.metadata.vulnerabilities.critical -eq 0) {
    Write-Success "No high/critical vulnerabilities"
    $passed++
} else {
    Write-Fail "Security vulnerabilities found:"
    Write-Host "  High: $($auditOutput.metadata.vulnerabilities.high)" -ForegroundColor Red
    Write-Host "  Critical: $($auditOutput.metadata.vulnerabilities.critical)" -ForegroundColor Red
    $issues += "Fix security vulnerabilities (run 'npm audit fix')"
    $failed++
}

# ========================================
# 9. VERCEL CONFIGURATION
# ========================================
Write-SectionHeader "9. VERCEL CONFIGURATION"

# vercel.json
Write-Info "Checking vercel.json..."
if (Test-Path "vercel.json") {
    Write-Success "vercel.json found"
    $passed++

    # Verificar configuración básica
    $vercelConfig = Get-Content "vercel.json" -Raw | ConvertFrom-Json
    if ($vercelConfig.framework -eq "vite") {
        Write-Success "  Framework set to Vite"
        $passed++
    } else {
        Write-Warning "  Framework not set to Vite"
        $warnings += "Consider setting framework to 'vite' in vercel.json"
    }
} else {
    Write-Warning "vercel.json not found"
    $warnings += "Create vercel.json for Vercel configuration"
}

# ========================================
# SUMMARY
# ========================================
Write-SectionHeader "VALIDATION SUMMARY"

$total = $passed + $failed
$percentage = if ($total -gt 0) { [math]::Round(($passed / $total) * 100, 1) } else { 0 }

Write-Host "`nResults:" -ForegroundColor Cyan
Write-Host "  ✅ Passed: $passed" -ForegroundColor Green
Write-Host "  ❌ Failed: $failed" -ForegroundColor Red
Write-Host "  ⚠️  Warnings: $($warnings.Count)" -ForegroundColor Yellow
Write-Host "  📊 Success Rate: $percentage%" -ForegroundColor $(if ($percentage -ge 80) { "Green" } elseif ($percentage -ge 60) { "Yellow" } else { "Red" })

if ($issues.Count -gt 0) {
    Write-Host "`n❌ Critical Issues:" -ForegroundColor Red
    foreach ($issue in $issues) {
        Write-Host "  • $issue" -ForegroundColor Red
    }
}

if ($warnings.Count -gt 0) {
    Write-Host "`n⚠️  Warnings:" -ForegroundColor Yellow
    foreach ($warning in $warnings) {
        Write-Host "  • $warning" -ForegroundColor Yellow
    }
}

# Recomendación
Write-Host "`n" -NoNewline
if ($failed -eq 0) {
    Write-Host "╔══════════════════════════════════════════════════════╗" -ForegroundColor Green
    Write-Host "║                                                      ║" -ForegroundColor Green
    Write-Host "║          ✅ READY FOR DEPLOYMENT! ✅                ║" -ForegroundColor Green
    Write-Host "║                                                      ║" -ForegroundColor Green
    Write-Host "╚══════════════════════════════════════════════════════╝" -ForegroundColor Green
    Write-Host "`nRun: .\deploy-production.ps1 -Environment production`n" -ForegroundColor Cyan
    exit 0
} elseif ($failed -le 3) {
    Write-Host "╔══════════════════════════════════════════════════════╗" -ForegroundColor Yellow
    Write-Host "║                                                      ║" -ForegroundColor Yellow
    Write-Host "║       ⚠️  FIX ISSUES BEFORE DEPLOYMENT ⚠️          ║" -ForegroundColor Yellow
    Write-Host "║                                                      ║" -ForegroundColor Yellow
    Write-Host "╚══════════════════════════════════════════════════════╝" -ForegroundColor Yellow
    Write-Host "`nFix the issues above and run validation again.`n" -ForegroundColor Yellow
    exit 1
} else {
    Write-Host "╔══════════════════════════════════════════════════════╗" -ForegroundColor Red
    Write-Host "║                                                      ║" -ForegroundColor Red
    Write-Host "║        ❌ NOT READY FOR DEPLOYMENT ❌              ║" -ForegroundColor Red
    Write-Host "║                                                      ║" -ForegroundColor Red
    Write-Host "╚══════════════════════════════════════════════════════╝" -ForegroundColor Red
    Write-Host "`nMultiple critical issues detected. Fix them before deploying.`n" -ForegroundColor Red
    exit 1
}

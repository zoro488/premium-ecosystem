# ========================================
# DEPLOYMENT SCRIPT - PREMIUM ECOSYSTEM
# ========================================
# Script automatizado para despliegue a producción
# Autor: Premium Ecosystem Team
# Fecha: 2025-10-20

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("staging", "production")]
    [string]$Environment = "staging",

    [Parameter(Mandatory=$false)]
    [switch]$SkipTests = $false,

    [Parameter(Mandatory=$false)]
    [switch]$SkipBuild = $false,

    [Parameter(Mandatory=$false)]
    [switch]$Verbose = $false
)

# Configuración
$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

# Colores
function Write-ColorOutput($ForegroundColor) {
    $fc = $host.UI.RawUI.ForegroundColor
    $host.UI.RawUI.ForegroundColor = $ForegroundColor
    if ($args) {
        Write-Output $args
    }
    $host.UI.RawUI.ForegroundColor = $fc
}

function Write-Step($Message) {
    Write-ColorOutput Green "`n✓ $Message"
}

function Write-Info($Message) {
    Write-ColorOutput Cyan "ℹ $Message"
}

function Write-Warning($Message) {
    Write-ColorOutput Yellow "⚠ $Message"
}

function Write-Error($Message) {
    Write-ColorOutput Red "✗ $Message"
}

# Banner
Clear-Host
Write-ColorOutput Magenta @"
╔══════════════════════════════════════════════════════╗
║                                                      ║
║        🚀 PREMIUM ECOSYSTEM DEPLOYMENT 🚀           ║
║                                                      ║
║  Deploying to: $($Environment.ToUpper().PadRight(37)) ║
║                                                      ║
╚══════════════════════════════════════════════════════╝
"@

# Verificar que estamos en el directorio correcto
if (-not (Test-Path "package.json")) {
    Write-Error "Error: package.json no encontrado. Ejecutar desde la raíz del proyecto."
    exit 1
}

# 1. Pre-flight checks
Write-Step "1/8 Pre-flight checks"

# Verificar Node.js
Write-Info "Checking Node.js version..."
$nodeVersion = node --version
Write-Info "Node.js version: $nodeVersion"

# Verificar npm
$npmVersion = npm --version
Write-Info "npm version: $npmVersion"

# Verificar Git
$gitBranch = git rev-parse --abbrev-ref HEAD
Write-Info "Git branch: $gitBranch"

# Advertencia si no estamos en main y vamos a producción
if ($Environment -eq "production" -and $gitBranch -ne "main") {
    Write-Warning "WARNING: Deploying to production from branch '$gitBranch' (not 'main')"
    $confirmation = Read-Host "Continue? (y/N)"
    if ($confirmation -ne "y") {
        Write-Info "Deployment cancelled."
        exit 0
    }
}

# Verificar cambios sin commitear
$gitStatus = git status --porcelain
if ($gitStatus) {
    Write-Warning "Uncommitted changes detected:"
    git status --short
    $confirmation = Read-Host "Continue anyway? (y/N)"
    if ($confirmation -ne "y") {
        Write-Info "Deployment cancelled."
        exit 0
    }
}

# 2. Limpiar dependencias y reinstalar
Write-Step "2/8 Clean install dependencies"
Write-Info "Removing node_modules and package-lock.json..."
Remove-Item -Path "node_modules" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "package-lock.json" -Force -ErrorAction SilentlyContinue

Write-Info "Installing fresh dependencies..."
npm ci

# 3. Lint
Write-Step "3/8 Linting code"
Write-Info "Running ESLint..."
npm run lint
Write-ColorOutput Green "  ✓ Linting passed"

# 4. Tests (opcional)
if (-not $SkipTests) {
    Write-Step "4/8 Running tests"

    # Unit tests
    Write-Info "Running unit tests..."
    npm run test:run
    Write-ColorOutput Green "  ✓ Unit tests passed"

    # E2E tests
    Write-Info "Running E2E tests..."
    npm run test:e2e
    Write-ColorOutput Green "  ✓ E2E tests passed"
} else {
    Write-Warning "4/8 Skipping tests (--SkipTests flag)"
}

# 5. Build
if (-not $SkipBuild) {
    Write-Step "5/8 Building for production"

    # Limpiar dist anterior
    Write-Info "Cleaning previous build..."
    Remove-Item -Path "dist" -Recurse -Force -ErrorAction SilentlyContinue

    # Build
    Write-Info "Building project..."
    $env:NODE_ENV = "production"
    npm run build

    # Verificar que dist fue creado
    if (-not (Test-Path "dist/index.html")) {
        Write-Error "Build failed: dist/index.html not found"
        exit 1
    }

    Write-ColorOutput Green "  ✓ Build completed successfully"

    # Mostrar tamaño del bundle
    Write-Info "Bundle analysis:"
    $distSize = (Get-ChildItem -Path "dist" -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
    Write-Info "  Total dist size: $([math]::Round($distSize, 2)) MB"

} else {
    Write-Warning "5/8 Skipping build (--SkipBuild flag)"
}

# 6. Security check
Write-Step "6/8 Security audit"
Write-Info "Running npm audit..."
npm audit --audit-level=high

# 7. Deploy
Write-Step "7/8 Deploying to Vercel"

# Verificar si Vercel CLI está instalado
$vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue
if (-not $vercelInstalled) {
    Write-Warning "Vercel CLI not found. Installing..."
    npm install -g vercel
}

# Deploy
Write-Info "Deploying..."
if ($Environment -eq "production") {
    vercel --prod --yes
} else {
    vercel --yes
}

# 8. Post-deployment checks
Write-Step "8/8 Post-deployment verification"

# Obtener URL del deployment
Write-Info "Getting deployment URL..."
$deploymentUrl = vercel ls --limit 1 | Select-String -Pattern "https://.*vercel.app" | ForEach-Object { $_.Matches.Value }

if ($deploymentUrl) {
    Write-ColorOutput Green "  ✓ Deployment URL: $deploymentUrl"

    # Health check
    Write-Info "Running health check..."
    try {
        $response = Invoke-WebRequest -Uri $deploymentUrl -UseBasicParsing -TimeoutSec 10
        if ($response.StatusCode -eq 200) {
            Write-ColorOutput Green "  ✓ Health check passed (HTTP $($response.StatusCode))"
        } else {
            Write-Warning "Health check returned HTTP $($response.StatusCode)"
        }
    } catch {
        Write-Warning "Health check failed: $_"
    }
} else {
    Write-Warning "Could not determine deployment URL"
}

# Summary
Write-ColorOutput Magenta @"

╔══════════════════════════════════════════════════════╗
║                                                      ║
║              ✅ DEPLOYMENT SUCCESSFUL ✅             ║
║                                                      ║
╚══════════════════════════════════════════════════════╝

"@

Write-Info "Environment: $Environment"
Write-Info "Branch: $gitBranch"
Write-Info "Commit: $(git rev-parse --short HEAD)"
if ($deploymentUrl) {
    Write-Info "URL: $deploymentUrl"
}
Write-Info "Time: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"

Write-ColorOutput Green "`n🎉 Deployment completed successfully!`n"

# Abrir en navegador (opcional)
$openBrowser = Read-Host "Open deployment in browser? (Y/n)"
if ($openBrowser -ne "n" -and $deploymentUrl) {
    Start-Process $deploymentUrl
}

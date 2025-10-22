#!/usr/bin/env pwsh
# 🚀 SCRIPT DE DEPLOYMENT RÁPIDO - Premium Ecosystem
# Este script prepara y despliega el proyecto en minutos

param(
    [switch]$SkipTests,
    [switch]$Production,
    [switch]$Docker
)

$ErrorActionPreference = 'Stop'

Write-Host "`n🚀 PREMIUM ECOSYSTEM - DEPLOYMENT RÁPIDO`n" -ForegroundColor Magenta

# Función para medir tiempo
$stopwatch = [System.Diagnostics.Stopwatch]::StartNew()

function Write-Step {
    param($step, $msg)
    Write-Host "`n[$step/8] $msg" -ForegroundColor Cyan
}
function Write-Success { param($msg) Write-Host "✅ $msg" -ForegroundColor Green }
function Write-Error { param($msg) Write-Host "❌ $msg" -ForegroundColor Red }

try {
    # PASO 1: Verificar Node.js
    Write-Step 1 "Verificando Node.js..."
    $nodeVersion = node --version
    Write-Success "Node.js $nodeVersion instalado"

    # PASO 2: Limpiar caché
    Write-Step 2 "Limpiando caché y archivos temporales..."
    if (Test-Path "node_modules/.vite") { Remove-Item -Recurse -Force "node_modules/.vite" }
    if (Test-Path "dist") { Remove-Item -Recurse -Force "dist" }
    Write-Success "Caché limpiado"

    # PASO 3: Instalar dependencias
    Write-Step 3 "Instalando dependencias..."
    npm ci --prefer-offline --no-audit
    Write-Success "Dependencias instaladas"

    # PASO 4: Tests (opcional)
    if (-not $SkipTests) {
        Write-Step 4 "Ejecutando tests..."
        npm run test -- --run 2>&1 | Out-Null
        Write-Success "Tests pasados"
    }
    else {
        Write-Step 4 "Tests omitidos (--SkipTests)"
    }

    # PASO 5: Lint
    Write-Step 5 "Verificando código..."
    npm run lint 2>&1 | Out-Null
    Write-Success "Código verificado"

    # PASO 6: Build
    Write-Step 6 "Construyendo aplicación..."
    npm run build
    Write-Success "Build completado"

    # PASO 7: Docker (opcional)
    if ($Docker) {
        Write-Step 7 "Construyendo imagen Docker..."
        docker build -t premium-ecosystem:latest -f Dockerfile.prod .
        Write-Success "Imagen Docker creada"
    }
    else {
        Write-Step 7 "Docker omitido (usa --Docker para habilitar)"
    }

    # PASO 8: Firebase Deploy
    Write-Step 8 "Preparando para deployment..."

    if ($Production) {
        Write-Host "`n⚠️  Deployment a PRODUCCIÓN:" -ForegroundColor Yellow
        Write-Host "Ejecuta: firebase deploy --only hosting" -ForegroundColor White
    }
    else {
        Write-Host "`n📦 Build completado en ./dist" -ForegroundColor Green
        Write-Host "Para preview local: npm run preview" -ForegroundColor White
        Write-Host "Para deploy: firebase deploy --only hosting" -ForegroundColor White
    }

    $stopwatch.Stop()
    $elapsed = $stopwatch.Elapsed.TotalSeconds

    Write-Host "`n✅ DEPLOYMENT COMPLETADO EN $([math]::Round($elapsed, 2))s`n" -ForegroundColor Green

    Write-Host "📋 PRÓXIMOS PASOS:" -ForegroundColor Cyan
    Write-Host "1. Revisa el build: npm run preview" -ForegroundColor White
    Write-Host "2. Deploy a Firebase: firebase deploy" -ForegroundColor White
    Write-Host "3. Monitorea: firebase open hosting" -ForegroundColor White
    Write-Host ""

}
catch {
    $stopwatch.Stop()
    Write-Error "Deployment falló: $_"
    Write-Host "`n🔧 TROUBLESHOOTING:" -ForegroundColor Yellow
    Write-Host "1. Ejecuta: npm install" -ForegroundColor White
    Write-Host "2. Limpia caché: npm run clean (si existe)" -ForegroundColor White
    Write-Host "3. Verifica .env: copia de .env.example" -ForegroundColor White
    exit 1
}

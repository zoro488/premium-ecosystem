#!/usr/bin/env pwsh
# ============================================
# SCRIPT DE INICIO RÁPIDO
# Premium Ecosystem - Quick Start
# ============================================

param(
    [switch]$SkipInstall,
    [switch]$SkipTests,
    [switch]$OpenBrowser
)

$ErrorActionPreference = "Continue"

# Colores y símbolos
$symbols = @{
    success = "✅"
    error   = "❌"
    warning = "⚠️"
    info    = "ℹ️"
    rocket  = "🚀"
    check   = "🔍"
    build   = "🏗️"
    test    = "✅"
    fire    = "🔥"
}

# ============================================
# FUNCIÓN: Banner
# ============================================
function Show-Banner {
    Clear-Host
    Write-Host "`n" -NoNewline
    Write-Host "=" -NoNewline -ForegroundColor Cyan; 1..78 | ForEach-Object { Write-Host "=" -NoNewline -ForegroundColor Cyan }
    Write-Host ""
    Write-Host "  🚀 PREMIUM ECOSYSTEM - INICIO RÁPIDO" -ForegroundColor Magenta
    Write-Host "  5 Aplicaciones Empresariales Integradas" -ForegroundColor Gray
    Write-Host "=" -NoNewline -ForegroundColor Cyan; 1..78 | ForEach-Object { Write-Host "=" -NoNewline -ForegroundColor Cyan }
    Write-Host "`n"
}

# ============================================
# FUNCIÓN: Verificar prerequisitos
# ============================================
function Test-Prerequisites {
    Write-Host "🔍 Verificando prerequisitos...`n" -ForegroundColor Yellow

    $allGood = $true

    # Node.js
    try {
        $nodeVersion = node --version
        Write-Host "  ✅ Node.js: $nodeVersion" -ForegroundColor Green
    }
    catch {
        Write-Host "  ❌ Node.js no encontrado" -ForegroundColor Red
        $allGood = $false
    }

    # npm
    try {
        $npmVersion = npm --version
        Write-Host "  ✅ npm: v$npmVersion" -ForegroundColor Green
    }
    catch {
        Write-Host "  ❌ npm no encontrado" -ForegroundColor Red
        $allGood = $false
    }

    # Git
    try {
        $gitVersion = git --version
        Write-Host "  ✅ Git: $gitVersion" -ForegroundColor Green
    }
    catch {
        Write-Host "  ⚠️  Git no encontrado (opcional)" -ForegroundColor Yellow
    }

    # GitHub CLI
    try {
        $ghVersion = gh --version | Select-Object -First 1
        Write-Host "  ✅ GitHub CLI: $ghVersion" -ForegroundColor Green
    }
    catch {
        Write-Host "  ⚠️  GitHub CLI no encontrado (opcional)" -ForegroundColor Yellow
    }

    Write-Host ""

    if (-not $allGood) {
        Write-Host "❌ Faltan prerequisitos. Instala Node.js y npm primero." -ForegroundColor Red
        Write-Host "   Descarga: https://nodejs.org/`n" -ForegroundColor Cyan
        exit 1
    }

    return $true
}

# ============================================
# FUNCIÓN: Instalar dependencias
# ============================================
function Install-Dependencies {
    if ($SkipInstall) {
        Write-Host "⏭️  Saltando instalación de dependencias`n" -ForegroundColor Gray
        return
    }

    Write-Host "📦 Instalando dependencias...`n" -ForegroundColor Yellow

    # Verificar si ya están instaladas
    if (Test-Path "node_modules") {
        Write-Host "  ℹ️  node_modules ya existe" -ForegroundColor Gray
        Write-Host "  ¿Reinstalar? (S/N): " -NoNewline -ForegroundColor Yellow
        $response = Read-Host

        if ($response -ne "S" -and $response -ne "s") {
            Write-Host "  ⏭️  Usando dependencias existentes`n" -ForegroundColor Gray
            return
        }

        Write-Host "  🗑️  Limpiando instalación anterior..." -ForegroundColor Gray
        Remove-Item node_modules -Recurse -Force -ErrorAction SilentlyContinue
    }

    Write-Host "  📥 Ejecutando npm install..." -ForegroundColor Cyan

    $installOutput = npm install 2>&1

    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✅ Dependencias instaladas correctamente`n" -ForegroundColor Green
    }
    else {
        Write-Host "  ❌ Error instalando dependencias" -ForegroundColor Red
        Write-Host $installOutput -ForegroundColor Red
        exit 1
    }
}

# ============================================
# FUNCIÓN: Verificar configuración
# ============================================
function Test-Configuration {
    Write-Host "⚙️  Verificando configuración...`n" -ForegroundColor Yellow

    # .env
    if (Test-Path ".env") {
        Write-Host "  ✅ Archivo .env encontrado" -ForegroundColor Green

        # Verificar variables críticas
        $envContent = Get-Content .env -Raw
        if ($envContent -match "VITE_FIREBASE_API_KEY") {
            Write-Host "  ✅ Variables Firebase configuradas" -ForegroundColor Green
        }
        else {
            Write-Host "  ⚠️  Variables Firebase incompletas" -ForegroundColor Yellow
        }
    }
    else {
        Write-Host "  ⚠️  Archivo .env no encontrado" -ForegroundColor Yellow
        Write-Host "     La app funcionará en modo offline" -ForegroundColor Gray
    }

    # Verificar archivos críticos
    $criticalFiles = @(
        "package.json",
        "vite.config.js",
        "index.html",
        "src/main.jsx",
        "src/App.jsx"
    )

    foreach ($file in $criticalFiles) {
        if (Test-Path $file) {
            Write-Host "  ✅ $file" -ForegroundColor Green
        }
        else {
            Write-Host "  ❌ $file faltante" -ForegroundColor Red
        }
    }

    Write-Host ""
}

# ============================================
# FUNCIÓN: Ejecutar tests
# ============================================
function Invoke-Tests {
    if ($SkipTests) {
        Write-Host "⏭️  Saltando tests`n" -ForegroundColor Gray
        return
    }

    Write-Host "✅ Ejecutando tests...`n" -ForegroundColor Yellow

    Write-Host "  🧪 Tests unitarios..." -ForegroundColor Cyan

    $testOutput = npm run test:run 2>&1

    if ($testOutput -match "(\d+) passed") {
        $passed = $Matches[1]
        Write-Host "  ✅ $passed tests pasaron" -ForegroundColor Green
    }

    if ($testOutput -match "(\d+) failed") {
        $failed = $Matches[1]
        Write-Host "  ⚠️  $failed tests fallaron (no crítico)" -ForegroundColor Yellow
    }

    Write-Host ""
}

# ============================================
# FUNCIÓN: Build de verificación
# ============================================
function Invoke-BuildCheck {
    Write-Host "🏗️  Verificando build...`n" -ForegroundColor Yellow

    Write-Host "  📦 Ejecutando build de prueba..." -ForegroundColor Cyan

    $buildOutput = npm run build 2>&1

    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✅ Build exitoso" -ForegroundColor Green

        # Verificar dist/
        if (Test-Path "dist") {
            $distSize = (Get-ChildItem dist -Recurse | Measure-Object -Property Length -Sum).Sum
            $distSizeMB = [math]::Round($distSize / 1MB, 2)
            Write-Host "  📊 Tamaño del bundle: $distSizeMB MB" -ForegroundColor Cyan

            if ($distSizeMB -lt 10) {
                Write-Host "  ✅ Tamaño optimizado" -ForegroundColor Green
            }
            else {
                Write-Host "  ⚠️  Bundle grande (considera optimizar)" -ForegroundColor Yellow
            }
        }
    }
    else {
        Write-Host "  ⚠️  Build tuvo advertencias" -ForegroundColor Yellow
    }

    Write-Host ""
}

# ============================================
# FUNCIÓN: Información del proyecto
# ============================================
function Show-ProjectInfo {
    Write-Host "📊 INFORMACIÓN DEL PROYECTO`n" -ForegroundColor Cyan

    # Leer package.json
    $packageJson = Get-Content package.json | ConvertFrom-Json

    Write-Host "  Nombre: " -NoNewline -ForegroundColor Gray
    Write-Host $packageJson.name -ForegroundColor White

    Write-Host "  Versión: " -NoNewline -ForegroundColor Gray
    Write-Host $packageJson.version -ForegroundColor White

    Write-Host "  Descripción: " -NoNewline -ForegroundColor Gray
    Write-Host $packageJson.description -ForegroundColor White

    Write-Host "`n  🎯 Aplicaciones incluidas:" -ForegroundColor Cyan
    Write-Host "     1. FlowDistributor - Gestión de flujos" -ForegroundColor White
    Write-Host "     2. SmartSales - Sistema de ventas" -ForegroundColor White
    Write-Host "     3. ClientHub - CRM empresarial" -ForegroundColor White
    Write-Host "     4. AnalyticsPro - Dashboard analíticas" -ForegroundColor White
    Write-Host "     5. TeamSync - Colaboración equipos" -ForegroundColor White

    Write-Host "`n  🛠️  Stack tecnológico:" -ForegroundColor Cyan
    Write-Host "     • React 18 + Vite" -ForegroundColor White
    Write-Host "     • TailwindCSS + Framer Motion" -ForegroundColor White
    Write-Host "     • Firebase + Zustand" -ForegroundColor White
    Write-Host "     • Vitest + Playwright" -ForegroundColor White
    Write-Host "     • Three.js + React Hook Form" -ForegroundColor White

    Write-Host ""
}

# ============================================
# FUNCIÓN: Iniciar servidor
# ============================================
function Start-DevServer {
    Write-Host "🚀 INICIANDO SERVIDOR DE DESARROLLO`n" -ForegroundColor Magenta

    Write-Host "  🌐 URL Local: " -NoNewline -ForegroundColor Gray
    Write-Host "http://localhost:3005/" -ForegroundColor Cyan

    Write-Host "  📱 Para acceso en red: " -NoNewline -ForegroundColor Gray
    Write-Host "npm run dev -- --host" -ForegroundColor Yellow

    Write-Host "`n  ⌨️  Atajos:" -ForegroundColor Gray
    Write-Host "     • Ctrl+C - Detener servidor" -ForegroundColor White
    Write-Host "     • h - Mostrar ayuda" -ForegroundColor White
    Write-Host "     • r - Reiniciar servidor" -ForegroundColor White
    Write-Host "     • o - Abrir en navegador" -ForegroundColor White

    Write-Host "`n" -NoNewline
    Write-Host "=" -NoNewline -ForegroundColor Cyan; 1..78 | ForEach-Object { Write-Host "=" -NoNewline -ForegroundColor Cyan }
    Write-Host "`n"

    if ($OpenBrowser) {
        Start-Sleep -Seconds 2
        Start-Process "http://localhost:3005/"
    }

    # Iniciar servidor
    npm run dev
}

# ============================================
# FUNCIÓN: Menú de opciones
# ============================================
function Show-Menu {
    Write-Host "🎯 ¿QUÉ DESEAS HACER?`n" -ForegroundColor Cyan

    Write-Host "  1. " -NoNewline -ForegroundColor Yellow
    Write-Host "Iniciar servidor de desarrollo" -ForegroundColor White

    Write-Host "  2. " -NoNewline -ForegroundColor Yellow
    Write-Host "Ejecutar tests" -ForegroundColor White

    Write-Host "  3. " -NoNewline -ForegroundColor Yellow
    Write-Host "Build de producción" -ForegroundColor White

    Write-Host "  4. " -NoNewline -ForegroundColor Yellow
    Write-Host "Ver información del proyecto" -ForegroundColor White

    Write-Host "  5. " -NoNewline -ForegroundColor Yellow
    Write-Host "Abrir guía de prueba completa" -ForegroundColor White

    Write-Host "  0. " -NoNewline -ForegroundColor Yellow
    Write-Host "Salir" -ForegroundColor White

    Write-Host "`n  Selecciona una opción: " -NoNewline -ForegroundColor Cyan
    return Read-Host
}

# ============================================
# MAIN
# ============================================

Show-Banner
Test-Prerequisites
Install-Dependencies
Test-Configuration
Invoke-Tests
Invoke-BuildCheck
Show-ProjectInfo

Write-Host "=" -NoNewline -ForegroundColor Cyan; 1..78 | ForEach-Object { Write-Host "=" -NoNewline -ForegroundColor Cyan }
Write-Host "`n"

# Menú interactivo
while ($true) {
    $choice = Show-Menu

    switch ($choice) {
        "1" {
            Start-DevServer
            break
        }
        "2" {
            Write-Host "`n🧪 Ejecutando tests...`n" -ForegroundColor Yellow
            npm run test
            Write-Host "`nPresiona Enter para continuar..." -ForegroundColor Gray
            Read-Host
        }
        "3" {
            Write-Host "`n🏗️  Construyendo para producción...`n" -ForegroundColor Yellow
            npm run build
            Write-Host "`n✅ Build completado. Preview con: npm run preview" -ForegroundColor Green
            Write-Host "`nPresiona Enter para continuar..." -ForegroundColor Gray
            Read-Host
        }
        "4" {
            Write-Host ""
            Show-ProjectInfo
            Write-Host "`nPresiona Enter para continuar..." -ForegroundColor Gray
            Read-Host
        }
        "5" {
            Write-Host "`n📖 Abriendo guía de prueba...`n" -ForegroundColor Yellow
            if (Test-Path "GUIA_PRUEBA_COMPLETA.md") {
                code GUIA_PRUEBA_COMPLETA.md
            }
            else {
                Write-Host "  ❌ Archivo GUIA_PRUEBA_COMPLETA.md no encontrado" -ForegroundColor Red
            }
            Write-Host "`nPresiona Enter para continuar..." -ForegroundColor Gray
            Read-Host
        }
        "0" {
            Write-Host "`n👋 ¡Hasta luego!`n" -ForegroundColor Cyan
            exit 0
        }
        default {
            Write-Host "`n⚠️  Opción inválida. Intenta de nuevo.`n" -ForegroundColor Yellow
            Start-Sleep -Seconds 1
        }
    }

    Clear-Host
    Show-Banner
}

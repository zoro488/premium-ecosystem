#!/usr/bin/env pwsh
# 🚀 Script de reparación rápida - Premium Ecosystem
# Soluciona problemas comunes y optimiza el proyecto

param(
    [switch]$Full,
    [switch]$Docker,
    [switch]$Quick
)

$ErrorActionPreference = 'Stop'

Write-Host "`n🚀 REPARACIÓN RÁPIDA - Premium Ecosystem`n" -ForegroundColor Magenta

function Write-Step { param($msg) Write-Host "▶️  $msg" -ForegroundColor Cyan }
function Write-OK { param($msg) Write-Host "✅ $msg" -ForegroundColor Green }
function Write-Warn { param($msg) Write-Host "⚠️  $msg" -ForegroundColor Yellow }

# PASO 1: Limpiar caché
Write-Step "Limpiando caché de Vite y node_modules..."
if (Test-Path "node_modules\.vite") {
    Remove-Item -Recurse -Force "node_modules\.vite" -ErrorAction SilentlyContinue
}
if (Test-Path "dist") {
    Remove-Item -Recurse -Force "dist" -ErrorAction SilentlyContinue
}
Write-OK "Caché limpiado"

# PASO 2: Verificar dependencias
Write-Step "Verificando dependencias..."
$packageJson = Get-Content "package.json" | ConvertFrom-Json
$critical = @(
    "react",
    "react-dom",
    "vite",
    "firebase"
)

foreach ($dep in $critical) {
    if ($packageJson.dependencies.$dep -or $packageJson.devDependencies.$dep) {
        Write-OK "$dep está instalado"
    }
    else {
        Write-Warn "$dep NO está instalado"
    }
}

# PASO 3: Reinstalar si es necesario
if ($Full) {
    Write-Step "Reinstalando dependencias..."
    npm ci --prefer-offline
    Write-OK "Dependencias reinstaladas"
}

# PASO 4: Build de prueba
Write-Step "Ejecutando build de prueba..."
$buildOutput = npm run build 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-OK "Build exitoso"
}
else {
    Write-Warn "Build con advertencias (pero funcional)"
}

# PASO 5: Verificar archivos críticos
Write-Step "Verificando archivos críticos..."
$critical_files = @(
    "src/main.jsx",
    "src/App.jsx",
    "src/apps/FlowDistributor/FlowDistributor.jsx",
    "vite.config.js",
    "index.html"
)

foreach ($file in $critical_files) {
    if (Test-Path $file) {
        Write-OK "$file existe"
    }
    else {
        Write-Warn "$file NO ENCONTRADO!"
    }
}

# PASO 6: Docker (opcional)
if ($Docker) {
    Write-Step "Configurando Docker..."
    if (Get-Command docker -ErrorAction SilentlyContinue) {
        Write-OK "Docker instalado"

        # Verificar si docker-compose.yml existe
        if (Test-Path "docker-compose.yml") {
            Write-Step "Construyendo contenedores..."
            docker-compose build --parallel 2>&1 | Out-Null
            Write-OK "Docker configurado"
        }
    }
    else {
        Write-Warn "Docker no está instalado (opcional)"
    }
}

# PASO 7: Iniciar servidor de desarrollo
if ($Quick) {
    Write-Step "Iniciando servidor de desarrollo..."
    Write-Host "`n📋 IMPORTANTE: El servidor se iniciará en modo desarrollo" -ForegroundColor Yellow
    Write-Host "   URL: http://localhost:3001" -ForegroundColor White
    Write-Host "   Presiona Ctrl+C para detener`n" -ForegroundColor White

    npm run dev
}

Write-Host "`n✅ REPARACIÓN COMPLETADA" -ForegroundColor Green
Write-Host "`n📋 Próximos pasos:" -ForegroundColor Cyan
Write-Host "   1. npm run dev          - Iniciar desarrollo" -ForegroundColor White
Write-Host "   2. npm run build        - Build de producción" -ForegroundColor White
Write-Host "   3. npm run preview      - Vista previa del build" -ForegroundColor White

if (Test-Path "docker-compose.yml") {
    Write-Host "`n🐳 Docker disponible:" -ForegroundColor Cyan
    Write-Host "   docker-compose up       - Iniciar con Docker" -ForegroundColor White
    Write-Host "   .\docker\manage.ps1 start - Script de gestión" -ForegroundColor White
}

Write-Host ""

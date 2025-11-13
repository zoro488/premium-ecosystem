#!/usr/bin/env pwsh
# AUTONOMOUS SYSTEM - PRE-FLIGHT CHECK
# Verifica que todo esté listo para ejecutar el sistema autónomo

Write-Host "🤖 AUTONOMOUS SYSTEM - PRE-FLIGHT CHECK" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

$allChecksPass = $true

# 1. Verificar Java 17
Write-Host "☕ Verificando Java 17..." -ForegroundColor Yellow
try {
    $javaVersion = java -version 2>&1 | Select-String "version" | Select-Object -First 1
    if ($javaVersion -match "17\.") {
        Write-Host "  ✅ Java 17 encontrado: $javaVersion" -ForegroundColor Green
    } else {
        Write-Host "  ❌ Java 17 NO encontrado. Versión actual: $javaVersion" -ForegroundColor Red
        Write-Host "     Instalar: winget install --id Microsoft.OpenJDK.17" -ForegroundColor Yellow
        $allChecksPass = $false
    }
} catch {
    Write-Host "  ❌ Java NO instalado" -ForegroundColor Red
    Write-Host "     Instalar: winget install --id Microsoft.OpenJDK.17" -ForegroundColor Yellow
    $allChecksPass = $false
}

# 2. Verificar Node.js
Write-Host ""
Write-Host "🟢 Verificando Node.js 20.x..." -ForegroundColor Yellow
$nodeVersion = node --version
if ($nodeVersion -match "v20\.") {
    Write-Host "  ✅ Node.js 20.x encontrado: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "  ⚠️  Node.js no es versión 20. Versión actual: $nodeVersion" -ForegroundColor Yellow
    Write-Host "     Recomendado: Actualizar a Node.js 20.x" -ForegroundColor Yellow
}

# 3. Verificar Firebase CLI
Write-Host ""
Write-Host "🔥 Verificando Firebase CLI..." -ForegroundColor Yellow
try {
    $firebaseVersion = firebase --version
    Write-Host "  ✅ Firebase CLI encontrado: $firebaseVersion" -ForegroundColor Green
} catch {
    Write-Host "  ❌ Firebase CLI NO instalado" -ForegroundColor Red
    Write-Host "     Instalar: npm install -g firebase-tools" -ForegroundColor Yellow
    $allChecksPass = $false
}

# 4. Verificar archivos creados
Write-Host ""
Write-Host "📁 Verificando archivos del sistema autónomo..." -ForegroundColor Yellow

$requiredFiles = @(
    "__tests__/integration/firebase-real.integration.test.ts",
    "__tests__/setup.integration.ts",
    ".github/workflows/autonomous-tests.yml",
    "vitest.integration.config.ts",
    "AUTONOMOUS_SYSTEM_GUIDE.md",
    "AUTONOMOUS_SYSTEM_STATUS.md"
)

foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "  ✅ $file" -ForegroundColor Green
    } else {
        Write-Host "  ❌ $file FALTA" -ForegroundColor Red
        $allChecksPass = $false
    }
}

# 5. Verificar scripts en package.json
Write-Host ""
Write-Host "📦 Verificando scripts en package.json..." -ForegroundColor Yellow
$packageJson = Get-Content "package.json" -Raw | ConvertFrom-Json

$requiredScripts = @(
    "test:integration:real",
    "test:integration:watch",
    "test:coverage:real",
    "emulator:start",
    "emulator:stop"
)

foreach ($script in $requiredScripts) {
    if ($packageJson.scripts.$script) {
        Write-Host "  ✅ $script" -ForegroundColor Green
    } else {
        Write-Host "  ❌ $script FALTA" -ForegroundColor Red
        $allChecksPass = $false
    }
}

# 6. Verificar firebase.json
Write-Host ""
Write-Host "🔥 Verificando configuración de emuladores..." -ForegroundColor Yellow
$firebaseJson = Get-Content "firebase.json" -Raw | ConvertFrom-Json

if ($firebaseJson.emulators.firestore.port -eq 8080) {
    Write-Host "  ✅ Firestore emulator: puerto 8080" -ForegroundColor Green
} else {
    Write-Host "  ❌ Firestore emulator puerto incorrecto" -ForegroundColor Red
    $allChecksPass = $false
}

if ($firebaseJson.emulators.auth.port -eq 9099) {
    Write-Host "  ✅ Auth emulator: puerto 9099" -ForegroundColor Green
} else {
    Write-Host "  ❌ Auth emulator puerto incorrecto" -ForegroundColor Red
    $allChecksPass = $false
}

if ($firebaseJson.emulators.storage.port -eq 9199) {
    Write-Host "  ✅ Storage emulator: puerto 9199" -ForegroundColor Green
} else {
    Write-Host "  ❌ Storage emulator puerto incorrecto" -ForegroundColor Red
    $allChecksPass = $false
}

# 7. Verificar puertos disponibles
Write-Host ""
Write-Host "🔌 Verificando puertos disponibles..." -ForegroundColor Yellow

$ports = @(8080, 9099, 9199, 4000)
foreach ($port in $ports) {
    $connection = Test-NetConnection -ComputerName localhost -Port $port -WarningAction SilentlyContinue -ErrorAction SilentlyContinue
    if ($connection.TcpTestSucceeded) {
        Write-Host "  ⚠️  Puerto $port está en uso" -ForegroundColor Yellow
        Write-Host "     Si es el emulator, OK. Si no, libéralo." -ForegroundColor Yellow
    } else {
        Write-Host "  ✅ Puerto $port disponible" -ForegroundColor Green
    }
}

# 8. Verificar node_modules
Write-Host ""
Write-Host "📚 Verificando dependencias..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Write-Host "  ✅ node_modules existe" -ForegroundColor Green

    # Verificar vitest
    if (Test-Path "node_modules/vitest") {
        Write-Host "  ✅ vitest instalado" -ForegroundColor Green
    } else {
        Write-Host "  ❌ vitest NO instalado" -ForegroundColor Red
        Write-Host "     Ejecutar: npm install" -ForegroundColor Yellow
        $allChecksPass = $false
    }

    # Verificar firebase
    if (Test-Path "node_modules/firebase") {
        Write-Host "  ✅ firebase SDK instalado" -ForegroundColor Green
    } else {
        Write-Host "  ❌ firebase SDK NO instalado" -ForegroundColor Red
        Write-Host "     Ejecutar: npm install" -ForegroundColor Yellow
        $allChecksPass = $false
    }
} else {
    Write-Host "  ❌ node_modules NO existe" -ForegroundColor Red
    Write-Host "     Ejecutar: npm install" -ForegroundColor Yellow
    $allChecksPass = $false
}

# RESULTADO FINAL
Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
if ($allChecksPass) {
    Write-Host "✅ TODAS LAS VERIFICACIONES PASARON" -ForegroundColor Green
    Write-Host ""
    Write-Host "🚀 SISTEMA LISTO PARA EJECUTAR" -ForegroundColor Green
    Write-Host ""
    Write-Host "Próximos pasos:" -ForegroundColor Cyan
    Write-Host "  1. Terminal 1: npm run emulator:start" -ForegroundColor White
    Write-Host "  2. Terminal 2: npm run test:integration:real" -ForegroundColor White
    Write-Host "  3. Si todo pasa: git push origin emergency-fix-1763036653" -ForegroundColor White
    Write-Host ""
    exit 0
} else {
    Write-Host "❌ ALGUNAS VERIFICACIONES FALLARON" -ForegroundColor Red
    Write-Host ""
    Write-Host "Por favor, revisa los errores arriba y corrígelos antes de continuar." -ForegroundColor Yellow
    Write-Host ""
    exit 1
}

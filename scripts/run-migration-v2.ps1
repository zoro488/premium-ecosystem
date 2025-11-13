#!/usr/bin/env pwsh
# ============================================================================
# 🔥 MIGRACIÓN OPTIMIZADA V2 - Arquitectura de Negocio Real
# ============================================================================

Write-Host "`n🔥 ============================================" -ForegroundColor Cyan
Write-Host "   MIGRACIÓN OPTIMIZADA V2" -ForegroundColor Cyan
Write-Host "   Arquitectura de Negocio Real" -ForegroundColor Cyan
Write-Host "============================================`n" -ForegroundColor Cyan

# Verificar .env
if (-not (Test-Path ".env")) {
    Write-Host "❌ ERROR: No se encontró el archivo .env" -ForegroundColor Red
    exit 1
}

# Cargar variables de entorno
Write-Host "📂 Cargando variables de entorno..." -ForegroundColor Yellow
Get-Content .env | ForEach-Object {
    if ($_ -match '^([^#][^=]+)=(.*)$') {
        $key = $matches[1].Trim()
        $value = $matches[2].Trim()
        [System.Environment]::SetEnvironmentVariable($key, $value, [System.EnvironmentVariableTarget]::Process)
    }
}

# Verificar variables Firebase
$requiredVars = @(
    "VITE_FIREBASE_API_KEY",
    "VITE_FIREBASE_PROJECT_ID"
)

$missing = @()
foreach ($var in $requiredVars) {
    if (-not [System.Environment]::GetEnvironmentVariable($var)) {
        $missing += $var
    }
}

if ($missing.Count -gt 0) {
    Write-Host "❌ ERROR: Faltan variables de entorno:" -ForegroundColor Red
    $missing | ForEach-Object { Write-Host "   - $_" -ForegroundColor Red }
    exit 1
}

Write-Host "✅ Variables verificadas`n" -ForegroundColor Green

# Advertencia
Write-Host "⚠️  NUEVA ESTRUCTURA:" -ForegroundColor Yellow
Write-Host "   📦 8 Colecciones principales" -ForegroundColor White
Write-Host "   🏦 Bancos con subcollections (ingresos/gastos/cortes/transferencias)" -ForegroundColor White
Write-Host "   📊 Almacén con entradas/salidas" -ForegroundColor White
Write-Host "   👥 Clientes y Distribuidores separados" -ForegroundColor White
Write-Host "   💎 Capitales globales unificados`n" -ForegroundColor White

$confirmation = Read-Host "¿Deseas LIMPIAR Firestore y crear nueva estructura? (sí/no)"
if ($confirmation -ne "sí" -and $confirmation -ne "si") {
    Write-Host "`n❌ Migración cancelada`n" -ForegroundColor Yellow
    exit 0
}

Write-Host "`n🧹 Limpiando colecciones antiguas...`n" -ForegroundColor Yellow
node scripts/clean-firestore.js

Write-Host "`n🚀 Iniciando migración optimizada V2...`n" -ForegroundColor Cyan

# Ejecutar script
try {
    node scripts/migrate-unified-optimized-v2.js
    $exitCode = $LASTEXITCODE

    if ($exitCode -eq 0) {
        Write-Host "`n✅ ============================================" -ForegroundColor Green
        Write-Host "   MIGRACIÓN OPTIMIZADA V2 COMPLETADA" -ForegroundColor Green
        Write-Host "============================================`n" -ForegroundColor Green
        Write-Host "🔥 Nueva estructura creada exitosamente!" -ForegroundColor Cyan
        Write-Host "📊 Arquitectura optimizada para el negocio" -ForegroundColor Cyan
        Write-Host "🌐 Verifica: https://console.firebase.google.com/project/$env:VITE_FIREBASE_PROJECT_ID/firestore`n" -ForegroundColor Cyan
    }
    else {
        Write-Host "`n❌ ERROR: Migración falló (código $exitCode)`n" -ForegroundColor Red
        exit $exitCode
    }
}
catch {
    Write-Host "`n❌ ERROR: $($_.Exception.Message)`n" -ForegroundColor Red
    exit 1
}

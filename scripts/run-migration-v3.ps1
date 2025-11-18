#!/usr/bin/env pwsh
# ============================================================================
# 🔥 MIGRACIÓN COMPLETA V3 - TODOS LOS CAMPOS
# ============================================================================

Write-Host "`n🔥 ============================================" -ForegroundColor Cyan
Write-Host "   MIGRACIÓN COMPLETA V3 - TODOS LOS CAMPOS" -ForegroundColor Cyan
Write-Host "============================================`n" -ForegroundColor Cyan

# Verificar .env
if (-not (Test-Path ".env")) {
    Write-Host "❌ ERROR: No se encontró el archivo .env`n" -ForegroundColor Red
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

# Verificar Firebase
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
    Write-Host "❌ ERROR: Faltan variables de Firebase`n" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Variables verificadas`n" -ForegroundColor Green

# Mostrar info
Write-Host "📊 ESTA MIGRACIÓN INCLUYE:" -ForegroundColor Cyan
Write-Host "  ✅ TODOS los campos de ingresos: fecha, cliente, monto, tc, dolares, pesos, concepto, observaciones" -ForegroundColor White
Write-Host "  ✅ TODOS los campos de gastos: fecha, origen, proveedor, monto, tc, dolares, pesos, destino, concepto, observaciones" -ForegroundColor White
Write-Host "  ✅ TODOS los campos de ventas: fecha, ocRelacionada, cantidad, cliente, bovedaMonte, precioVenta, ingreso, flete, fleteUtilidad, utilidad, estatus, concepto" -ForegroundColor White
Write-Host "  ✅ TODOS los campos de almacén: oc, fecha, distribuidor, cantidad, cliente, concepto, observaciones" -ForegroundColor White
Write-Host "  ✅ TODOS los campos de clientes: nombre, actual, deuda, abonos, pendiente, observaciones" -ForegroundColor White
Write-Host "  ✅ TODOS los campos de distribuidores: nombre, costoTotal, abonos, pendiente, deudaActual" -ForegroundColor White
Write-Host "  ✅ Resumen de capitales global (bancos + stock en USD)`n" -ForegroundColor White

# Confirmación
Write-Host "⚠️  ADVERTENCIA:" -ForegroundColor Yellow
Write-Host "  1. Se conectará a: $env:VITE_FIREBASE_PROJECT_ID" -ForegroundColor White
Write-Host "  2. Se limpiarán y recrearán 8 colecciones" -ForegroundColor White
Write-Host "  3. Se migrarán TODOS los campos de TODOS los registros`n" -ForegroundColor White

$confirmation = Read-Host "¿Continuar con migración COMPLETA V3? (sí/no)"
if ($confirmation -ne "sí" -and $confirmation -ne "si") {
    Write-Host "`n❌ Migración cancelada`n" -ForegroundColor Yellow
    exit 0
}

Write-Host "`n🚀 Ejecutando migración completa V3...`n" -ForegroundColor Cyan

# Ejecutar limpieza primero
Write-Host "🧹 Paso 1: Limpiando colecciones antiguas..." -ForegroundColor Yellow
node scripts/clean-firestore.js

if ($LASTEXITCODE -ne 0) {
    Write-Host "`n❌ ERROR en limpieza`n" -ForegroundColor Red
    exit $LASTEXITCODE
}

Write-Host "`n📦 Paso 2: Migrando datos completos..." -ForegroundColor Yellow
node scripts/migrate-complete-v3.js

$exitCode = $LASTEXITCODE

if ($exitCode -eq 0) {
    Write-Host "`n✅ ============================================" -ForegroundColor Green
    Write-Host "   MIGRACIÓN V3 COMPLETADA EXITOSAMENTE" -ForegroundColor Green
    Write-Host "============================================`n" -ForegroundColor Green
    Write-Host "🔥 TODOS los campos migrados correctamente!" -ForegroundColor Cyan
    Write-Host "🌐 Verifica: https://console.firebase.google.com/project/$env:VITE_FIREBASE_PROJECT_ID/firestore`n" -ForegroundColor Cyan
} else {
    Write-Host "`n❌ ERROR: Migración falló con código $exitCode`n" -ForegroundColor Red
    exit $exitCode
}

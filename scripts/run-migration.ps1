#!/usr/bin/env pwsh
# ============================================================================
# 🔥 EJECUTOR DE MIGRACIÓN FLOWDISTRIBUTOR → FIRESTORE
# ============================================================================
# Este script carga las variables de entorno y ejecuta la migración

Write-Host "`n🔥 ============================================" -ForegroundColor Cyan
Write-Host "   MIGRACIÓN FLOWDISTRIBUTOR → FIRESTORE" -ForegroundColor Cyan
Write-Host "============================================`n" -ForegroundColor Cyan

# Verificar que existe el archivo .env
if (-not (Test-Path ".env")) {
    Write-Host "❌ ERROR: No se encontró el archivo .env" -ForegroundColor Red
    Write-Host "   Copia .env.example a .env y configura tus credenciales de Firebase`n" -ForegroundColor Yellow
    exit 1
}

# Cargar variables de entorno desde .env
Write-Host "📂 Cargando variables de entorno desde .env..." -ForegroundColor Yellow
Get-Content .env | ForEach-Object {
    if ($_ -match '^([^#][^=]+)=(.*)$') {
        $key = $matches[1].Trim()
        $value = $matches[2].Trim()
        [System.Environment]::SetEnvironmentVariable($key, $value, [System.EnvironmentVariableTarget]::Process)
    }
}

# Verificar variables críticas de Firebase
$requiredVars = @(
    "VITE_FIREBASE_API_KEY",
    "VITE_FIREBASE_AUTH_DOMAIN",
    "VITE_FIREBASE_PROJECT_ID",
    "VITE_FIREBASE_STORAGE_BUCKET",
    "VITE_FIREBASE_MESSAGING_SENDER_ID",
    "VITE_FIREBASE_APP_ID"
)

$missing = @()
foreach ($var in $requiredVars) {
    if (-not [System.Environment]::GetEnvironmentVariable($var)) {
        $missing += $var
    }
}

if ($missing.Count -gt 0) {
    Write-Host "❌ ERROR: Faltan las siguientes variables de entorno:" -ForegroundColor Red
    $missing | ForEach-Object { Write-Host "   - $_" -ForegroundColor Red }
    Write-Host "`n   Configúralas en tu archivo .env`n" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Variables de Firebase verificadas`n" -ForegroundColor Green

# Verificar que existe el JSON unificado
$jsonPath = "src\apps\FlowDistributor\data\BASE_DATOS_FLOWDISTRIBUTOR_UNIFICADO.json"
if (-not (Test-Path $jsonPath)) {
    Write-Host "❌ ERROR: No se encontró el archivo $jsonPath" -ForegroundColor Red
    exit 1
}

Write-Host "✅ JSON unificado encontrado (9,381 líneas)`n" -ForegroundColor Green

# Preguntar confirmación al usuario
Write-Host "⚠️  ADVERTENCIA: Este script va a:" -ForegroundColor Yellow
Write-Host "   1. Conectarse a tu proyecto Firebase: $env:VITE_FIREBASE_PROJECT_ID" -ForegroundColor White
Write-Host "   2. Crear/Sobrescribir 11 colecciones en Firestore" -ForegroundColor White
Write-Host "   3. Cargar miles de documentos desde el JSON`n" -ForegroundColor White

$confirmation = Read-Host "¿Deseas continuar? (sí/no)"
if ($confirmation -ne "sí" -and $confirmation -ne "si") {
    Write-Host "`n❌ Migración cancelada por el usuario`n" -ForegroundColor Yellow
    exit 0
}

Write-Host "`n🚀 Iniciando migración...`n" -ForegroundColor Cyan

# Ejecutar el script de migración
try {
    node scripts/migrate-unified-json-to-firestore.js
    $exitCode = $LASTEXITCODE

    if ($exitCode -eq 0) {
        Write-Host "`n✅ ============================================" -ForegroundColor Green
        Write-Host "   MIGRACIÓN COMPLETADA EXITOSAMENTE" -ForegroundColor Green
        Write-Host "============================================`n" -ForegroundColor Green
        Write-Host "🔥 Tus datos están ahora en Firestore!" -ForegroundColor Cyan
        Write-Host "🌐 Verifica en: https://console.firebase.google.com/project/$env:VITE_FIREBASE_PROJECT_ID/firestore`n" -ForegroundColor Cyan
    }
    else {
        Write-Host "`n❌ ERROR: La migración falló con código de salida $exitCode`n" -ForegroundColor Red
        exit $exitCode
    }
}
catch {
    Write-Host "`n❌ ERROR: $($_.Exception.Message)`n" -ForegroundColor Red
    exit 1
}

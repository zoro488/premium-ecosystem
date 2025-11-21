#!/usr/bin/env pwsh

<#
.SYNOPSIS
    Automatiza la descarga de Service Account Key de Firebase
.DESCRIPTION
    Este script usa gcloud CLI para descargar automáticamente el service account key
#>

Write-Host "`n╔═══════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                                                       ║" -ForegroundColor Cyan
Write-Host "║     🔑 DESCARGA AUTOMÁTICA DE CREDENCIALES          ║" -ForegroundColor Cyan
Write-Host "║                                                       ║" -ForegroundColor Cyan
Write-Host "╚═══════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

# Variables
$PROJECT_ID = "premium-ecosystem-1760790572"
$OUTPUT_FILE = "serviceAccountKey.json"
$PROJECT_ROOT = Split-Path -Parent $PSScriptRoot

Write-Host "📋 Información del proyecto:" -ForegroundColor Yellow
Write-Host "   • Proyecto: $PROJECT_ID" -ForegroundColor White
Write-Host "   • Archivo destino: $OUTPUT_FILE" -ForegroundColor White
Write-Host "   • Ruta: $PROJECT_ROOT`n" -ForegroundColor White

# Verificar si gcloud está instalado
Write-Host "🔍 Verificando gcloud CLI..." -ForegroundColor Yellow
$gcloudInstalled = Get-Command gcloud -ErrorAction SilentlyContinue

if (-not $gcloudInstalled) {
    Write-Host "❌ gcloud CLI no está instalado`n" -ForegroundColor Red
    Write-Host "📦 OPCIONES DE INSTALACIÓN:`n" -ForegroundColor Cyan

    Write-Host "Opción 1 - Descarga manual:" -ForegroundColor White
    Write-Host "   Ve a la Firebase Console y descarga manualmente:" -ForegroundColor Gray
    Write-Host "   https://console.firebase.google.com/u/0/project/$PROJECT_ID/settings/serviceaccounts/adminsdk`n" -ForegroundColor Blue

    Write-Host "Opción 2 - Instalar gcloud CLI:" -ForegroundColor White
    Write-Host "   1. Descarga de: https://cloud.google.com/sdk/docs/install" -ForegroundColor Gray
    Write-Host "   2. Ejecuta el instalador" -ForegroundColor Gray
    Write-Host "   3. Reinicia PowerShell" -ForegroundColor Gray
    Write-Host "   4. Ejecuta este script nuevamente`n" -ForegroundColor Gray

    # Preguntar si abrir el navegador
    $openBrowser = Read-Host "¿Abrir Firebase Console ahora? (s/n)"
    if ($openBrowser -eq 's' -or $openBrowser -eq 'S') {
        Start-Process "https://console.firebase.google.com/u/0/project/$PROJECT_ID/settings/serviceaccounts/adminsdk"
        Write-Host "✓ Navegador abierto" -ForegroundColor Green
    }

    exit 1
}

Write-Host "✓ gcloud CLI encontrado`n" -ForegroundColor Green

# Verificar autenticación
Write-Host "🔐 Verificando autenticación..." -ForegroundColor Yellow
$gcloudAccount = gcloud auth list --filter=status:ACTIVE --format="value(account)" 2>$null

if ([string]::IsNullOrWhiteSpace($gcloudAccount)) {
    Write-Host "❌ No estás autenticado en gcloud`n" -ForegroundColor Red
    Write-Host "🚀 Iniciando proceso de autenticación..." -ForegroundColor Cyan
    gcloud auth login

    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Error en la autenticación" -ForegroundColor Red
        exit 1
    }

    $gcloudAccount = gcloud auth list --filter=status:ACTIVE --format="value(account)" 2>$null
}

Write-Host "✓ Autenticado como: $gcloudAccount`n" -ForegroundColor Green

# Configurar proyecto
Write-Host "⚙️  Configurando proyecto..." -ForegroundColor Yellow
gcloud config set project $PROJECT_ID 2>$null | Out-Null

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error al configurar el proyecto" -ForegroundColor Red
    exit 1
}

Write-Host "✓ Proyecto configurado`n" -ForegroundColor Green

# Obtener service account
Write-Host "🔍 Buscando service account de Firebase..." -ForegroundColor Yellow
$serviceAccount = gcloud iam service-accounts list `
    --filter="email:firebase-adminsdk*" `
    --format="value(email)" 2>$null | Select-Object -First 1

if ([string]::IsNullOrWhiteSpace($serviceAccount)) {
    Write-Host "❌ No se encontró el service account de Firebase`n" -ForegroundColor Red
    Write-Host "💡 Posibles soluciones:" -ForegroundColor Yellow
    Write-Host "   1. Verifica que Firebase esté habilitado en el proyecto" -ForegroundColor Gray
    Write-Host "   2. Descarga manualmente desde Firebase Console" -ForegroundColor Gray
    Write-Host "   3. Usa: https://console.firebase.google.com/u/0/project/$PROJECT_ID/settings/serviceaccounts/adminsdk`n" -ForegroundColor Blue

    $openBrowser = Read-Host "¿Abrir Firebase Console? (s/n)"
    if ($openBrowser -eq 's' -or $openBrowser -eq 'S') {
        Start-Process "https://console.firebase.google.com/u/0/project/$PROJECT_ID/settings/serviceaccounts/adminsdk"
    }

    exit 1
}

Write-Host "✓ Service account encontrado: $serviceAccount`n" -ForegroundColor Green

# Verificar si ya existe una key
$outputPath = Join-Path $PROJECT_ROOT $OUTPUT_FILE
if (Test-Path $outputPath) {
    Write-Host "⚠️  El archivo $OUTPUT_FILE ya existe`n" -ForegroundColor Yellow
    $overwrite = Read-Host "¿Sobrescribir? (s/n)"
    if ($overwrite -ne 's' -and $overwrite -ne 'S') {
        Write-Host "❌ Operación cancelada" -ForegroundColor Red
        exit 0
    }
    Remove-Item $outputPath -Force
}

# Crear nueva key
Write-Host "🔑 Creando nueva key..." -ForegroundColor Yellow
gcloud iam service-accounts keys create $outputPath `
    --iam-account=$serviceAccount `
    --key-file-type=json 2>$null

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error al crear la key`n" -ForegroundColor Red
    Write-Host "💡 Intenta descargar manualmente desde:" -ForegroundColor Yellow
    Write-Host "   https://console.firebase.google.com/u/0/project/$PROJECT_ID/settings/serviceaccounts/adminsdk`n" -ForegroundColor Blue
    exit 1
}

Write-Host "✓ Key creada exitosamente`n" -ForegroundColor Green

# Verificar el archivo
if (Test-Path $outputPath) {
    $fileSize = (Get-Item $outputPath).Length
    Write-Host "╔═══════════════════════════════════════════════════════╗" -ForegroundColor Green
    Write-Host "║                                                       ║" -ForegroundColor Green
    Write-Host "║     ✅ CREDENCIALES DESCARGADAS EXITOSAMENTE        ║" -ForegroundColor Green
    Write-Host "║                                                       ║" -ForegroundColor Green
    Write-Host "╚═══════════════════════════════════════════════════════╝`n" -ForegroundColor Green

    Write-Host "📄 Archivo: $OUTPUT_FILE" -ForegroundColor White
    Write-Host "📂 Ubicación: $outputPath" -ForegroundColor White
    Write-Host "📊 Tamaño: $([math]::Round($fileSize/1KB, 2)) KB`n" -ForegroundColor White

    Write-Host "🎯 PRÓXIMOS PASOS:`n" -ForegroundColor Cyan
    Write-Host "   1. Verifica la configuración:" -ForegroundColor White
    Write-Host "      npm run test:csv-setup`n" -ForegroundColor Gray

    Write-Host "   2. Valida los archivos CSV:" -ForegroundColor White
    Write-Host "      npm run validate:csv`n" -ForegroundColor Gray

    Write-Host "   3. Prueba la importación (sin escribir):" -ForegroundColor White
    Write-Host "      npm run import:csv:dry-run`n" -ForegroundColor Gray

    Write-Host "   4. Importa los datos:" -ForegroundColor White
    Write-Host "      npm run import:csv`n" -ForegroundColor Gray

    Write-Host "⚠️  SEGURIDAD:" -ForegroundColor Yellow
    Write-Host "   • Este archivo contiene credenciales sensibles" -ForegroundColor Gray
    Write-Host "   • NO lo subas a GitHub (ya está en .gitignore)" -ForegroundColor Gray
    Write-Host "   • NO lo compartas públicamente`n" -ForegroundColor Gray

} else {
    Write-Host "❌ Error: El archivo no se creó correctamente" -ForegroundColor Red
    exit 1
}

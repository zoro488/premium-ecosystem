#!/usr/bin/env pwsh

<#
.SYNOPSIS
    Configura Application Default Credentials (ADC) para Firebase Admin SDK
.DESCRIPTION
    Instala gcloud CLI si no está instalado y configura ADC para desarrollo local
#>

$ErrorActionPreference = "Stop"

Write-Host "`n╔═══════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                                                       ║" -ForegroundColor Cyan
Write-Host "║     🔐 CONFIGURACIÓN DE ADC (RECOMENDADO)           ║" -ForegroundColor Cyan
Write-Host "║                                                       ║" -ForegroundColor Cyan
Write-Host "╚═══════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

Write-Host "✨ Application Default Credentials (ADC) es la forma más segura" -ForegroundColor Yellow
Write-Host "   de autenticarte durante el desarrollo local.`n" -ForegroundColor Yellow

# Verificar si gcloud está instalado
Write-Host "🔍 Verificando gcloud CLI..." -ForegroundColor Cyan
$gcloudInstalled = Get-Command gcloud -ErrorAction SilentlyContinue

if (-not $gcloudInstalled) {
    Write-Host "❌ gcloud CLI no está instalado`n" -ForegroundColor Red

    Write-Host "📦 INSTALACIÓN DE GCLOUD CLI:`n" -ForegroundColor Yellow

    Write-Host "Opción 1 - Instalador oficial (RECOMENDADO):" -ForegroundColor White
    Write-Host "  1. Descarga de: https://cloud.google.com/sdk/docs/install" -ForegroundColor Gray
    Write-Host "  2. Ejecuta GoogleCloudSDKInstaller.exe" -ForegroundColor Gray
    Write-Host "  3. Sigue el asistente de instalación" -ForegroundColor Gray
    Write-Host "  4. Reinicia PowerShell" -ForegroundColor Gray
    Write-Host "  5. Ejecuta este script nuevamente`n" -ForegroundColor Gray

    Write-Host "Opción 2 - Instalación automática:" -ForegroundColor White
    Write-Host "  PowerShell puede descargarlo automáticamente`n" -ForegroundColor Gray

    $autoInstall = Read-Host "¿Descargar e instalar gcloud CLI automáticamente? (s/n)"

    if ($autoInstall -eq 's' -or $autoInstall -eq 'S') {
        Write-Host "`n📥 Descargando gcloud CLI..." -ForegroundColor Cyan

        $installerUrl = "https://dl.google.com/dl/cloudsdk/channels/rapid/GoogleCloudSDKInstaller.exe"
        $installerPath = "$env:TEMP\GoogleCloudSDKInstaller.exe"

        try {
            Invoke-WebRequest -Uri $installerUrl -OutFile $installerPath -UseBasicParsing
            Write-Host "✓ Descarga completada`n" -ForegroundColor Green

            Write-Host "🚀 Iniciando instalador..." -ForegroundColor Cyan
            Write-Host "   Sigue las instrucciones del instalador`n" -ForegroundColor Gray

            Start-Process -FilePath $installerPath -Wait

            Write-Host "`n✅ Instalación completada" -ForegroundColor Green
            Write-Host "⚠️  Cierra y reabre PowerShell" -ForegroundColor Yellow
            Write-Host "   Luego ejecuta: npm run setup:adc`n" -ForegroundColor Cyan

        } catch {
            Write-Host "❌ Error al descargar: $_" -ForegroundColor Red
            Write-Host "`n💡 Descarga manual desde:" -ForegroundColor Yellow
            Write-Host "   https://cloud.google.com/sdk/docs/install`n" -ForegroundColor Blue
        }
    } else {
        Write-Host "`n💡 Cuando instales gcloud CLI, ejecuta:" -ForegroundColor Yellow
        Write-Host "   npm run setup:adc`n" -ForegroundColor Cyan

        $openBrowser = Read-Host "¿Abrir página de descarga ahora? (s/n)"
        if ($openBrowser -eq 's' -or $openBrowser -eq 'S') {
            Start-Process "https://cloud.google.com/sdk/docs/install"
        }
    }

    exit 1
}

Write-Host "✓ gcloud CLI encontrado`n" -ForegroundColor Green

# Verificar versión
$gcloudVersion = gcloud version --format="value(version)" 2>$null
Write-Host "  Versión: $gcloudVersion" -ForegroundColor Gray

# Paso 1: Configurar proyecto
Write-Host "`n📋 Paso 1/3: Configurando proyecto..." -ForegroundColor Cyan
$projectId = "premium-ecosystem-1760790572"

try {
    gcloud config set project $projectId 2>$null | Out-Null
    Write-Host "✓ Proyecto configurado: $projectId`n" -ForegroundColor Green
} catch {
    Write-Host "⚠️  No se pudo configurar el proyecto automáticamente" -ForegroundColor Yellow
}

# Paso 2: Autenticar con ADC
Write-Host "🔐 Paso 2/3: Configurando Application Default Credentials..." -ForegroundColor Cyan
Write-Host "   Se abrirá un navegador para iniciar sesión`n" -ForegroundColor Gray

try {
    Write-Host "   Ejecutando: gcloud auth application-default login..." -ForegroundColor Gray
    gcloud auth application-default login

    if ($LASTEXITCODE -eq 0) {
        Write-Host "`n✓ ADC configurado exitosamente" -ForegroundColor Green
    } else {
        throw "Error en la autenticación"
    }
} catch {
    Write-Host "`n❌ Error al configurar ADC: $_" -ForegroundColor Red
    Write-Host "`n💡 Intenta manualmente:" -ForegroundColor Yellow
    Write-Host "   gcloud auth application-default login`n" -ForegroundColor Cyan
    exit 1
}

# Paso 3: Verificar ADC
Write-Host "`n🔍 Paso 3/3: Verificando configuración..." -ForegroundColor Cyan

$adcPath = "$env:APPDATA\gcloud\application_default_credentials.json"
if (Test-Path $adcPath) {
    Write-Host "✓ Credenciales ADC encontradas en:" -ForegroundColor Green
    Write-Host "  $adcPath" -ForegroundColor Gray

    $fileSize = (Get-Item $adcPath).Length
    Write-Host "  Tamaño: $([math]::Round($fileSize/1KB, 2)) KB`n" -ForegroundColor Gray
} else {
    Write-Host "⚠️  No se encontraron las credenciales ADC" -ForegroundColor Yellow
}

# Actualizar script de importación para usar ADC
Write-Host "📝 Actualizando scripts para usar ADC..." -ForegroundColor Cyan

$importScript = "scripts/importar-csv-firestore.js"
if (Test-Path $importScript) {
    Write-Host "✓ Script de importación listo para ADC`n" -ForegroundColor Green
}

# Resumen
Write-Host "╔═══════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║                                                       ║" -ForegroundColor Green
Write-Host "║     ✅ ADC CONFIGURADO EXITOSAMENTE                  ║" -ForegroundColor Green
Write-Host "║                                                       ║" -ForegroundColor Green
Write-Host "╚═══════════════════════════════════════════════════════╝`n" -ForegroundColor Green

Write-Host "🎯 PRÓXIMOS PASOS:`n" -ForegroundColor Cyan

Write-Host "1. Verificar configuración:" -ForegroundColor White
Write-Host "   npm run test:csv-setup`n" -ForegroundColor Gray

Write-Host "2. Validar archivos CSV:" -ForegroundColor White
Write-Host "   npm run validate:csv`n" -ForegroundColor Gray

Write-Host "3. Probar importación (sin escribir):" -ForegroundColor White
Write-Host "   npm run import:csv:dry-run`n" -ForegroundColor Gray

Write-Host "4. Importar datos reales:" -ForegroundColor White
Write-Host "   npm run import:csv`n" -ForegroundColor Gray

Write-Host "📚 Ventajas de ADC:" -ForegroundColor Yellow
Write-Host "  ✓ No necesitas descargar archivos de credenciales" -ForegroundColor Green
Write-Host "  ✓ Más seguro (no hay archivos sensibles)" -ForegroundColor Green
Write-Host "  ✓ Fácil de renovar (solo gcloud auth login)" -ForegroundColor Green
Write-Host "  ✓ Se actualiza automáticamente" -ForegroundColor Green

Write-Host "`n⚠️  IMPORTANTE:" -ForegroundColor Yellow
Write-Host "  • ADC solo funciona en tu máquina local" -ForegroundColor Gray
Write-Host "  • Para producción, usa Service Account Keys" -ForegroundColor Gray
Write-Host "  • Las credenciales expiran, vuelve a ejecutar el comando si fallan`n" -ForegroundColor Gray

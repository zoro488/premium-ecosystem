#!/usr/bin/env pwsh

<#
.SYNOPSIS
    Mueve y renombra el archivo de credenciales descargado
#>

Write-Host "`n🔍 Buscando archivo de credenciales en Descargas..." -ForegroundColor Yellow

$downloadsPath = "$env:USERPROFILE\Downloads"
$targetPath = "serviceAccountKey.json"

# Buscar archivo que coincida con el patrón
$credentialFiles = Get-ChildItem -Path $downloadsPath -Filter "premium-ecosystem-*.json" -ErrorAction SilentlyContinue |
    Sort-Object LastWriteTime -Descending |
    Select-Object -First 1

if (-not $credentialFiles) {
    Write-Host "❌ No se encontró ningún archivo de credenciales" -ForegroundColor Red
    Write-Host "`nBusca manualmente un archivo JSON en:" -ForegroundColor Yellow
    Write-Host "  $downloadsPath" -ForegroundColor Gray
    Write-Host "`nEl nombre debe ser algo como:" -ForegroundColor Yellow
    Write-Host "  premium-ecosystem-1760790572-firebase-adminsdk-xxxxx.json" -ForegroundColor Gray

    # Listar archivos JSON recientes
    Write-Host "`n📄 Archivos JSON recientes en Descargas:" -ForegroundColor Cyan
    Get-ChildItem -Path $downloadsPath -Filter "*.json" -ErrorAction SilentlyContinue |
        Sort-Object LastWriteTime -Descending |
        Select-Object -First 5 |
        ForEach-Object {
            Write-Host "  • $($_.Name) - $($_.LastWriteTime)" -ForegroundColor Gray
        }

    Write-Host "`n💡 Si descargaste el archivo con otro nombre:" -ForegroundColor Yellow
    Write-Host "  Move-Item `"RUTA_AL_ARCHIVO.json`" -Destination `"serviceAccountKey.json`" -Force" -ForegroundColor Gray

    exit 1
}

Write-Host "✓ Archivo encontrado: $($credentialFiles.Name)" -ForegroundColor Green
Write-Host "📍 Ubicación: $($credentialFiles.FullName)" -ForegroundColor White

# Verificar si ya existe
if (Test-Path $targetPath) {
    Write-Host "`n⚠️  El archivo serviceAccountKey.json ya existe" -ForegroundColor Yellow
    $overwrite = Read-Host "¿Sobrescribir? (s/n)"
    if ($overwrite -ne 's' -and $overwrite -ne 'S') {
        Write-Host "❌ Operación cancelada" -ForegroundColor Red
        exit 0
    }
    Remove-Item $targetPath -Force
}

# Mover y renombrar
try {
    Move-Item -Path $credentialFiles.FullName -Destination $targetPath -Force
    Write-Host "✓ Archivo movido exitosamente" -ForegroundColor Green

    # Verificar
    if (Test-Path $targetPath) {
        $fileSize = (Get-Item $targetPath).Length

        Write-Host "`n╔═══════════════════════════════════════════════════════╗" -ForegroundColor Green
        Write-Host "║                                                       ║" -ForegroundColor Green
        Write-Host "║     ✅ CREDENCIALES CONFIGURADAS                    ║" -ForegroundColor Green
        Write-Host "║                                                       ║" -ForegroundColor Green
        Write-Host "╚═══════════════════════════════════════════════════════╝`n" -ForegroundColor Green

        Write-Host "📄 Archivo: serviceAccountKey.json" -ForegroundColor White
        Write-Host "📊 Tamaño: $([math]::Round($fileSize/1KB, 2)) KB" -ForegroundColor White
        Write-Host "📂 Ubicación: $(Get-Location)\$targetPath`n" -ForegroundColor White

        Write-Host "🎯 PRÓXIMOS PASOS:`n" -ForegroundColor Cyan
        Write-Host "   1. Verifica la configuración:" -ForegroundColor White
        Write-Host "      npm run test:csv-setup`n" -ForegroundColor Gray

        Write-Host "   2. Valida los CSV:" -ForegroundColor White
        Write-Host "      npm run validate:csv`n" -ForegroundColor Gray

        Write-Host "   3. Importa los datos:" -ForegroundColor White
        Write-Host "      npm run import:csv`n" -ForegroundColor Gray

    }
} catch {
    Write-Host "❌ Error al mover el archivo: $_" -ForegroundColor Red
    exit 1
}

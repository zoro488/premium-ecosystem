#!/usr/bin/env pwsh

<#
.SYNOPSIS
    Proceso completo automatizado de importación de datos
#>

param(
    [switch]$SkipCredentials = $false,
    [switch]$DryRun = $false
)

$ErrorActionPreference = "Stop"

function Write-Step {
    param([string]$Message, [string]$Status = "info")

    $colors = @{
        "info" = "Cyan"
        "success" = "Green"
        "warning" = "Yellow"
        "error" = "Red"
    }

    $icons = @{
        "info" = "🔵"
        "success" = "✅"
        "warning" = "⚠️"
        "error" = "❌"
    }

    Write-Host "$($icons[$Status]) $Message" -ForegroundColor $colors[$Status]
}

Write-Host "`n╔═══════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                                                       ║" -ForegroundColor Cyan
Write-Host "║     🚀 IMPORTACIÓN AUTOMÁTICA DE DATOS              ║" -ForegroundColor Cyan
Write-Host "║                                                       ║" -ForegroundColor Cyan
Write-Host "╚═══════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

# Paso 1: Verificar credenciales
Write-Step "Paso 1/4: Verificando credenciales..." "info"

if (-not (Test-Path "serviceAccountKey.json") -and -not $SkipCredentials) {
    Write-Step "No se encontró serviceAccountKey.json" "warning"

    Write-Host "`n📥 OPCIONES PARA OBTENER CREDENCIALES:`n" -ForegroundColor Yellow
    Write-Host "Opción 1 - Descarga Manual (RECOMENDADO):" -ForegroundColor White
    Write-Host "  1. Abre: https://console.firebase.google.com/u/0/project/premium-ecosystem-1760790572/settings/serviceaccounts/adminsdk" -ForegroundColor Gray
    Write-Host "  2. Haz clic en 'Generate new private key'" -ForegroundColor Gray
    Write-Host "  3. Descarga el archivo" -ForegroundColor Gray
    Write-Host "  4. Ejecútame de nuevo`n" -ForegroundColor Gray

    $choice = Read-Host "¿Abrir Firebase Console ahora? (s/n)"

    if ($choice -eq 's' -or $choice -eq 'S') {
        Start-Process "https://console.firebase.google.com/u/0/project/premium-ecosystem-1760790572/settings/serviceaccounts/adminsdk"
        Write-Step "Navegador abierto" "success"
        Write-Host "`nCuando descargues el archivo, ejecuta:" -ForegroundColor Yellow
        Write-Host "  npm run credentials:move" -ForegroundColor Cyan
        Write-Host "`nDespués ejecuta de nuevo:" -ForegroundColor Yellow
        Write-Host "  npm run import:complete`n" -ForegroundColor Cyan
        exit 0
    } else {
        Write-Step "Operación cancelada" "error"
        exit 1
    }
} elseif (Test-Path "serviceAccountKey.json") {
    $fileSize = (Get-Item "serviceAccountKey.json").Length
    Write-Step "Credenciales encontradas ($([math]::Round($fileSize/1KB, 2)) KB)" "success"
}

# Paso 2: Verificar archivos CSV
Write-Step "`nPaso 2/4: Verificando archivos CSV..." "info"

$csvFiles = Get-ChildItem -Path "data/csv/*.csv" -ErrorAction SilentlyContinue

if ($csvFiles.Count -eq 0) {
    Write-Step "No se encontraron archivos CSV" "error"
    Write-Host "`n💡 Ejecuta primero:" -ForegroundColor Yellow
    Write-Host "  npm run excel:to-csv`n" -ForegroundColor Cyan
    exit 1
}

$totalRecords = 0
foreach ($file in $csvFiles) {
    $lineCount = (Get-Content $file.FullName | Measure-Object -Line).Lines - 1
    $totalRecords += $lineCount
}

Write-Step "Encontrados $($csvFiles.Count) archivos CSV con $totalRecords registros" "success"

# Paso 3: Validar configuración
Write-Step "`nPaso 3/4: Validando configuración..." "info"

try {
    Write-Host "  → Ejecutando test:csv-setup..." -ForegroundColor Gray
    npm run test:csv-setup 2>&1 | Out-Null

    if ($LASTEXITCODE -eq 0) {
        Write-Step "Configuración válida" "success"
    } else {
        Write-Step "Hay problemas en la configuración" "warning"
        Write-Host "`n💡 Revisa los errores con:" -ForegroundColor Yellow
        Write-Host "  npm run test:csv-setup`n" -ForegroundColor Cyan

        $continue = Read-Host "¿Continuar de todos modos? (s/n)"
        if ($continue -ne 's' -and $continue -ne 'S') {
            exit 1
        }
    }
} catch {
    Write-Step "Error al validar configuración" "error"
    Write-Host $_.Exception.Message -ForegroundColor Red
}

# Paso 4: Importar datos
Write-Step "`nPaso 4/4: Importando datos a Firestore..." "info"

if ($DryRun) {
    Write-Host "  → Modo de prueba (sin escribir datos)..." -ForegroundColor Gray
    npm run import:csv:dry-run
} else {
    Write-Host "  → Importando datos reales..." -ForegroundColor Gray
    Write-Host "  → Esto puede tomar varios minutos...`n" -ForegroundColor Yellow
    npm run import:csv
}

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n╔═══════════════════════════════════════════════════════╗" -ForegroundColor Green
    Write-Host "║                                                       ║" -ForegroundColor Green
    Write-Host "║     ✅ IMPORTACIÓN COMPLETADA EXITOSAMENTE          ║" -ForegroundColor Green
    Write-Host "║                                                       ║" -ForegroundColor Green
    Write-Host "╚═══════════════════════════════════════════════════════╝`n" -ForegroundColor Green

    Write-Host "📊 Estadísticas:" -ForegroundColor Cyan
    Write-Host "  • Archivos procesados: $($csvFiles.Count)" -ForegroundColor White
    Write-Host "  • Registros importados: ~$totalRecords" -ForegroundColor White

    Write-Host "`n🎯 PRÓXIMOS PASOS:`n" -ForegroundColor Yellow
    Write-Host "  1. Verifica los datos en Firebase Console:" -ForegroundColor White
    Write-Host "     https://console.firebase.google.com/u/0/project/premium-ecosystem-1760790572/firestore`n" -ForegroundColor Blue

    Write-Host "  2. Ejecuta estadísticas:" -ForegroundColor White
    Write-Host "     npm run db:stats`n" -ForegroundColor Gray

    Write-Host "  3. Verifica consistencia:" -ForegroundColor White
    Write-Host "     npm run db:verify`n" -ForegroundColor Gray

} else {
    Write-Step "`nError en la importación" "error"
    Write-Host "`n💡 Revisa los logs arriba para más detalles`n" -ForegroundColor Yellow
    exit 1
}

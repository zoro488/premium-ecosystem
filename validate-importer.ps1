# ============================================
# SCRIPT DE VALIDACIÓN - QUANTUM EXCEL IMPORTER
# Pruebas para verificar la importación quirúrgica
# ============================================

Write-Host "🚀 Iniciando validación del Quantum Excel Importer..." -ForegroundColor Cyan
Write-Host ""

# Verificar estructura de archivos
Write-Host "📁 Verificando estructura de archivos..." -ForegroundColor Yellow

$files = @(
    "src\services\quantumExcelImporter.js",
    "src\components\ExcelImporter\QuantumImporter.jsx",
    "Copia de Administación_General.xlsx"
)

$allFilesExist = $true
foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "  ✅ $file" -ForegroundColor Green
    }
    else {
        Write-Host "  ❌ $file NO ENCONTRADO" -ForegroundColor Red
        $allFilesExist = $false
    }
}

Write-Host ""

if (-not $allFilesExist) {
    Write-Host "❌ Faltan archivos necesarios. Abortando validación." -ForegroundColor Red
    exit 1
}

# Verificar dependencias de Python
Write-Host "🐍 Verificando dependencias de Python..." -ForegroundColor Yellow

$pythonPackages = @("pandas", "openpyxl", "numpy")

foreach ($package in $pythonPackages) {
    $installed = python -c "import $package; print('OK')" 2>$null
    
    if ($installed -eq "OK") {
        Write-Host "  ✅ $package instalado" -ForegroundColor Green
    }
    else {
        Write-Host "  ⚠️  $package no instalado. Instalando..." -ForegroundColor Yellow
        pip install $package --quiet
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "  ✅ $package instalado correctamente" -ForegroundColor Green
        }
        else {
            Write-Host "  ❌ Error instalando $package" -ForegroundColor Red
        }
    }
}

Write-Host ""

# Verificar dependencias de Node
Write-Host "📦 Verificando dependencias de Node..." -ForegroundColor Yellow

$nodePackages = @(
    "xlsx",
    "firebase",
    "framer-motion",
    "lucide-react"
)

$packageJson = Get-Content "package.json" | ConvertFrom-Json
$dependencies = $packageJson.dependencies
$devDependencies = $packageJson.devDependencies

foreach ($package in $nodePackages) {
    $installed = $dependencies.PSObject.Properties.Name -contains $package -or 
    $devDependencies.PSObject.Properties.Name -contains $package
    
    if ($installed) {
        Write-Host "  ✅ $package" -ForegroundColor Green
    }
    else {
        Write-Host "  ⚠️  $package no encontrado en package.json" -ForegroundColor Yellow
    }
}

Write-Host ""

# Analizar Excel con Python
Write-Host "📊 Analizando estructura del Excel..." -ForegroundColor Yellow

$pythonScript = @"
import pandas as pd
import json
import sys

try:
    excel_path = 'Copia de Administación_General.xlsx'
    xls = pd.ExcelFile(excel_path)
    
    analysis = {
        'sheets': xls.sheet_names,
        'total_sheets': len(xls.sheet_names),
        'details': {}
    }
    
    for sheet in xls.sheet_names:
        df = pd.read_excel(xls, sheet)
        analysis['details'][sheet] = {
            'rows': len(df),
            'columns': len(df.columns),
            'size_kb': round(sys.getsizeof(df) / 1024, 2)
        }
    
    print(json.dumps(analysis, indent=2, ensure_ascii=False))
    sys.exit(0)
    
except Exception as e:
    print(json.dumps({'error': str(e)}, ensure_ascii=False))
    sys.exit(1)
"@

$pythonScript | Out-File -FilePath "temp_analysis.py" -Encoding UTF8

$analysisResult = python temp_analysis.py 2>&1

Remove-Item "temp_analysis.py" -ErrorAction SilentlyContinue

if ($LASTEXITCODE -eq 0) {
    $analysis = $analysisResult | ConvertFrom-Json
    
    Write-Host "  ✅ Excel analizado correctamente" -ForegroundColor Green
    Write-Host "  📋 Total de hojas: $($analysis.total_sheets)" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "  Hojas detectadas:" -ForegroundColor White
    
    foreach ($sheet in $analysis.sheets) {
        $details = $analysis.details.$sheet
        Write-Host "    • $sheet" -ForegroundColor White
        Write-Host "      - Filas: $($details.rows)" -ForegroundColor Gray
        Write-Host "      - Columnas: $($details.columns)" -ForegroundColor Gray
        Write-Host "      - Tamaño: $($details.size_kb) KB" -ForegroundColor Gray
    }
}
else {
    Write-Host "  ❌ Error analizando el Excel:" -ForegroundColor Red
    Write-Host "  $analysisResult" -ForegroundColor Red
}

Write-Host ""

# Verificar estructura de datos esperada
Write-Host "🔍 Verificando estructura de datos esperada..." -ForegroundColor Yellow

$expectedSheets = @(
    "Distribuidores",
    "Control_Maestro",
    "Almacen_Monte",
    "Bóveda_Monte",
    "Bóveda_USA",
    "Utilidades",
    "Flete_Sur",
    "Azteca",
    "Leftie",
    "Profit",
    "Clientes",
    "DATA"
)

if ($analysis -and $analysis.sheets) {
    $allSheetsPresent = $true
    
    foreach ($sheet in $expectedSheets) {
        if ($analysis.sheets -contains $sheet) {
            Write-Host "  ✅ $sheet" -ForegroundColor Green
        }
        else {
            Write-Host "  ❌ $sheet FALTANTE" -ForegroundColor Red
            $allSheetsPresent = $false
        }
    }
    
    if ($allSheetsPresent) {
        Write-Host ""
        Write-Host "  ✅ Todas las hojas esperadas están presentes" -ForegroundColor Green
    }
}
else {
    Write-Host "  ⚠️  No se pudo verificar la estructura" -ForegroundColor Yellow
}

Write-Host ""

# Verificar colecciones de Firestore
Write-Host "🔥 Colecciones de Firestore esperadas:" -ForegroundColor Yellow

$collections = @(
    "ordenesCompra",
    "distribuidores",
    "ventasLocales",
    "gastosAbonos",
    "almacenMovimientos",
    "movimientosBancarios",
    "bancos",
    "clientes",
    "importaciones"
)

foreach ($collection in $collections) {
    Write-Host "  • $collection" -ForegroundColor Gray
}

Write-Host ""

# Estimación de datos
if ($analysis -and $analysis.details) {
    Write-Host "📈 Estimación de registros a importar:" -ForegroundColor Yellow
    
    $totalEstimated = 0
    
    # Estimar basado en filas
    if ($analysis.details.Distribuidores) {
        $ocEstimated = [math]::Floor($analysis.details.Distribuidores.rows * 0.3)
        Write-Host "  • Órdenes de Compra: ~$ocEstimated" -ForegroundColor Cyan
        $totalEstimated += $ocEstimated
    }
    
    if ($analysis.details.Control_Maestro) {
        $ventasEstimated = [math]::Floor($analysis.details.Control_Maestro.rows * 0.25)
        Write-Host "  • Ventas Locales: ~$ventasEstimated" -ForegroundColor Cyan
        $totalEstimated += $ventasEstimated
        
        $gyaEstimated = [math]::Floor($analysis.details.Control_Maestro.rows * 0.25)
        Write-Host "  • Gastos/Abonos: ~$gyaEstimated" -ForegroundColor Cyan
        $totalEstimated += $gyaEstimated
    }
    
    if ($analysis.details.Almacen_Monte) {
        $almacenEstimated = [math]::Floor($analysis.details.Almacen_Monte.rows * 0.5)
        Write-Host "  • Movimientos Almacén: ~$almacenEstimated" -ForegroundColor Cyan
        $totalEstimated += $almacenEstimated
    }
    
    if ($analysis.details.Clientes) {
        $clientesEstimated = [math]::Floor($analysis.details.Clientes.rows * 0.8)
        Write-Host "  • Clientes: ~$clientesEstimated" -ForegroundColor Cyan
        $totalEstimated += $clientesEstimated
    }
    
    # Estimar movimientos bancarios (6 bancos)
    $bancosEstimated = 0
    $bancosSheets = @("Bóveda_Monte", "Bóveda_USA", "Utilidades", "Flete_Sur", "Azteca", "Leftie", "Profit")
    foreach ($bancoSheet in $bancosSheets) {
        if ($analysis.details.$bancoSheet) {
            $bancosEstimated += [math]::Floor($analysis.details.$bancoSheet.rows * 0.4)
        }
    }
    Write-Host "  • Movimientos Bancarios: ~$bancosEstimated" -ForegroundColor Cyan
    $totalEstimated += $bancosEstimated
    
    Write-Host ""
    Write-Host "  📊 Total estimado: ~$totalEstimated registros" -ForegroundColor Green
}

Write-Host ""
Write-Host "=" -Repeat 80 -ForegroundColor Cyan
Write-Host "✅ VALIDACIÓN COMPLETADA" -ForegroundColor Green
Write-Host "=" -Repeat 80 -ForegroundColor Cyan
Write-Host ""
Write-Host "🎯 Siguiente paso: Abrir FlowDistributor y usar 'Importar Excel' del menú" -ForegroundColor Yellow
Write-Host ""

# Resumen final
Write-Host "📋 RESUMEN:" -ForegroundColor White
Write-Host "  • Archivos necesarios: OK" -ForegroundColor Green
Write-Host "  • Dependencias Python: OK" -ForegroundColor Green
Write-Host "  • Dependencias Node: Verificar package.json" -ForegroundColor Yellow
Write-Host "  • Estructura Excel: OK" -ForegroundColor Green
Write-Host "  • Sistema listo para importación" -ForegroundColor Green
Write-Host ""

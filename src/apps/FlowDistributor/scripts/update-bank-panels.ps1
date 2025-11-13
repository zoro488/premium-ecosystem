# ============================================
# 🔥 SCRIPT DE ACTUALIZACIÓN MASIVA DE PANELES
# ============================================
# Actualiza todos los paneles de bancos para usar Firestore
# en lugar de archivos JSON estáticos

$ErrorActionPreference = "Stop"

# Configuración
$componentsPath = "C:\Users\xpovo\Documents\premium-ecosystem\src\apps\FlowDistributor\components"

# Paneles de bancos a actualizar
$bankPanels = @(
    @{
        file = "PanelBovedaMonteUltra.tsx"
        banco = "boveda_monte"
        oldImport = "import panelDataManual from '../data/panel-boveda-monte-manual.json';"
        theme = "amber"
        displayName = "Bóveda Monte"
    },
    @{
        file = "PanelBovedaUSAUltra.jsx"
        banco = "boveda_usa"
        oldImport = "import panelDataManual from '../data/panel-boveda-usa-manual.json';"
        theme = "green"
        displayName = "Bóveda USA"
    },
    @{
        file = "PanelFletesUltra.jsx"
        banco = "fletes"
        oldImport = "import panelDataManual from '../data/panel-fletes-manual.json';"
        theme = "orange"
        displayName = "Fletes"
    },
    @{
        file = "PanelLeftieUltra.jsx"
        banco = "leftie"
        oldImport = "import panelDataManual from '../data/panel-leftie-manual.json';"
        theme = "purple"
        displayName = "Leftie"
    },
    @{
        file = "PanelProfitUltra.jsx"
        banco = "profit"
        oldImport = "import panelDataManual from '../data/panel-profit-manual.json';"
        theme = "blue"
        displayName = "Profit"
    },
    @{
        file = "PanelUtilidadesUltra.jsx"
        banco = "utilidades"
        oldImport = "import panelDataManual from '../data/panel-utilidades-manual.json';"
        theme = "green"
        displayName = "Utilidades"
    }
)

Write-Host "🔥 Iniciando actualización masiva de paneles..." -ForegroundColor Cyan
Write-Host ""

foreach ($panel in $bankPanels) {
    $filePath = Join-Path $componentsPath $panel.file

    Write-Host "📝 Actualizando: $($panel.file)" -ForegroundColor Yellow

    if (-not (Test-Path $filePath)) {
        Write-Host "   ❌ Archivo no encontrado: $filePath" -ForegroundColor Red
        continue
    }

    # Leer contenido
    $content = Get-Content $filePath -Raw

    # Backup
    $backupPath = "$filePath.backup"
    $content | Set-Content $backupPath -NoNewline
    Write-Host "   ✅ Backup creado: $($panel.file).backup" -ForegroundColor Green

    # 1. Reemplazar import del JSON manual
    if ($content -match [regex]::Escape($panel.oldImport)) {
        $newImports = @"
// 🔥 FIRESTORE IMPORTS
import { useBancoData } from '../services/firestore-hooks.service';
import { PremiumLoadingScreen } from './shared/PremiumLoadingScreen';
"@
        $content = $content -replace [regex]::Escape($panel.oldImport), $newImports
        Write-Host "   ✅ Import actualizado a Firestore" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  No se encontró el import del JSON manual" -ForegroundColor DarkYellow
    }

    # 2. Agregar hook de Firestore después de los useState
    # Buscar el patrón típico de inicio del componente
    $hookCode = @"

  // 🔥 FIRESTORE REAL-TIME CONNECTION
  const { gastos, ingresos, loading, stats, error } = useBancoData('$($panel.banco)');
"@

    # Insertar después de la primera línea que contenga "useState" o al inicio del componente
    if ($content -match "(?s)(export default function.*?\{.*?useState.*?\n)") {
        $content = $content -replace "(?s)(export default function.*?\{.*?useState.*?\n)", "`$1$hookCode`n"
        Write-Host "   ✅ Hook de Firestore agregado" -ForegroundColor Green
    } elseif ($content -match "(?s)(export default function.*?\{)") {
        $content = $content -replace "(?s)(export default function.*?\{)", "`$1$hookCode`n"
        Write-Host "   ✅ Hook de Firestore agregado (sin useState previo)" -ForegroundColor Green
    }

    # 3. Agregar estados de loading y error al inicio del return
    # Buscar el primer return del componente
    $loadingCode = @"

  // 🔥 LOADING & ERROR STATES
  if (loading) {
    return <PremiumLoadingScreen message="Cargando $($panel.displayName)..." theme="$($panel.theme)" />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-6">
        <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-6 max-w-md">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
              <span className="text-2xl">⚠️</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Error de Conexión</h3>
              <p className="text-gray-400 text-sm">No se pudo cargar los datos</p>
            </div>
          </div>
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      </div>
    );
  }
"@

    if ($content -match "(?s)(return\s*\()") {
        $content = $content -replace "(?s)(return\s*\()", "$loadingCode`n`n  `$1"
        Write-Host "   ✅ Estados de loading/error agregados" -ForegroundColor Green
    }

    # 4. Crear useMemo para mapear datos de Firestore
    $dataMappingCode = @"

  // 🔥 DATA MAPPING FROM FIRESTORE
  const datosManual = useMemo(() => ({
    totalIngresos: stats.totalIngresos,
    totalGastos: stats.totalGastos,
    saldoNeto: stats.saldoNeto,
    ingresosList: ingresos.map((item, idx) => ({
      id: ``ing-$($panel.banco)-``${idx}``,
      ...item,
    })),
    gastosList: gastos.map((item, idx) => ({
      id: ``gast-$($panel.banco)-``${idx}``,
      ...item,
    })),
    rfCortes: [], // TODO: Agregar cuando esté disponible
    transferencias: [], // TODO: Agregar cuando esté disponible
  }), [gastos, ingresos, stats]);
"@

    # Insertar después del hook de useBancoData
    if ($content -match "(?s)(useBancoData\('$($panel.banco)'\);)") {
        $content = $content -replace "(?s)(useBancoData\('$($panel.banco)'\);)", "`$1$dataMappingCode"
        Write-Host "   ✅ Data mapping agregado" -ForegroundColor Green
    }

    # 5. Agregar import de useMemo si no existe
    if ($content -notmatch "import.*useMemo") {
        $content = $content -replace "(import.*useState.*from 'react';)", "`$1`nimport { useMemo } from 'react';"
        Write-Host "   ✅ Import de useMemo agregado" -ForegroundColor Green
    }

    # Guardar cambios
    $content | Set-Content $filePath -NoNewline

    Write-Host "   ✅ Actualización completada: $($panel.file)" -ForegroundColor Green
    Write-Host ""
}

Write-Host "🎉 Actualización masiva completada!" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 Resumen:" -ForegroundColor White
Write-Host "   • Archivos procesados: $($bankPanels.Count)" -ForegroundColor Gray
Write-Host "   • Backups creados: $($bankPanels.Count)" -ForegroundColor Gray
Write-Host ""
Write-Host "⚠️  Recuerda:" -ForegroundColor Yellow
Write-Host "   1. Revisar cada archivo manualmente" -ForegroundColor Gray
Write-Host "   2. Verificar imports duplicados" -ForegroundColor Gray
Write-Host "   3. Ajustar el código según sea necesario" -ForegroundColor Gray
Write-Host "   4. Probar cada panel individualmente" -ForegroundColor Gray
Write-Host ""

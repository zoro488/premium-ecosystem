# Script para agregar data-testid de forma masiva e inteligente
$filePath = "src/apps/FlowDistributor/FlowDistributor.jsx"
$content = Get-Content $filePath -Raw

# Backup
Copy-Item $filePath "$filePath.backup"

# Mapeo de botones a data-testid
$replacements = @(
    @{
        Pattern = '(?s)(onClick=\{\(\) => setShowForm\(!showForm\)\}\s+className="[^"]*from-green-500[^"]*"[^>]*>\s*<Plus[^>]*\/>\s*Nueva Orden)'
        TestId = 'nueva-orden-btn'
        Description = 'Botón Nueva Orden'
    },
    @{
        Pattern = '(?s)(onClick=\{agregarProducto\}\s+className="[^"]*from-green-500 to-emerald-500[^"]*"[^>]*>\s*<Plus[^>]*\/>\s*Agregar Producto)'
        TestId = 'agregar-producto-btn'
        Description = 'Botón Agregar Producto'
    },
    @{
        Pattern = '(?s)(onClick=\{crearOrden\}\s+disabled=\{productosOrden\.length === 0\}\s+className=)'
        TestId = 'crear-orden-btn'
        Description = 'Botón Crear Orden'
    },
    @{
        Pattern = '(?s)(onClick=\{\(\) => setShowAddModal\(true\)\}\s+className="[^"]*from-purple-500 to-pink-500[^"]*"[^>]*>\s*<UserPlus[^>]*\/>\s*Agregar Distribuidor)'
        TestId = 'agregar-distribuidor-btn'
        Description = 'Botón Agregar Distribuidor'
    },
    @{
        Pattern = '(?s)(onClick=\{\(\) => setShowForm\(!showForm\)\}\s+className="[^"]*from-green-500 to-emerald-500[^"]*"[^>]*>\s*<TrendingUp[^>]*\/>\s*Nueva Venta)'
        TestId = 'nueva-venta-btn'
        Description = 'Botón Nueva Venta'
    },
    @{
        Pattern = '(?s)(onClick=\{registrarVenta\}\s+className="[^"]*from-green-500 to-emerald-500[^"]*"[^>]*>\s*Registrar Venta)'
        TestId = 'registrar-venta-btn'
        Description = 'Botón Registrar Venta'
    },
    @{
        Pattern = '(?s)(onClick=\{\(\) => setShowTransferModal\(true\)\}\s+className="[^"]*from-blue-500 to-cyan-500[^"]*"[^>]*>\s*<ArrowLeftRight[^>]*\/>\s*Transferir)'
        TestId = 'transferencia-btn'
        Description = 'Botón Transferencia'
    },
    @{
        Pattern = '(?s)(onClick=\{\(\) => setShowGastoModal\(true\)\}\s+className="[^"]*from-red-500 to-pink-500[^"]*"[^>]*>\s*<TrendingDown[^>]*\/>\s*Gasto)'
        TestId = 'gasto-btn'
        Description = 'Botón Gasto'
    },
    @{
        Pattern = '(?s)(onClick=\{\(\) => setShowIngresoModal\(true\)\}\s+className="[^"]*from-green-500 to-emerald-500[^"]*"[^>]*>\s*<TrendingUp[^>]*\/>\s*Ingreso)'
        TestId = 'ingreso-btn'
        Description = 'Botón Ingreso'
    },
    @{
        Pattern = '(?s)(onClick=\{\(\) => setShowExportModal\(true\)\}\s+className="[^"]*from-blue-500 to-purple-500[^"]*"[^>]*>\s*<Download[^>]*\/>\s*Exportar Reportes)'
        TestId = 'exportar-btn'
        Description = 'Botón Exportar'
    }
)

$modifiedCount = 0
foreach ($replacement in $replacements) {
    $pattern = $replacement.Pattern
    $testId = $replacement.TestId
    $description = $replacement.Description

    if ($content -match $pattern) {
        Write-Host "✓ Encontrado: $description" -ForegroundColor Green
        $content = $content -replace "($pattern)", "data-testid=`"$testId`" `$1"
        $modifiedCount++
    } else {
        Write-Host "✗ No encontrado: $description" -ForegroundColor Yellow
    }
}

# Guardar archivo modificado
Set-Content -Path $filePath -Value $content -NoNewline

Write-Host "`n✅ Proceso completado: $modifiedCount data-testid agregados" -ForegroundColor Cyan
Write-Host "📁 Backup guardado en: $filePath.backup" -ForegroundColor Gray

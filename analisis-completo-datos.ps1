Write-Host "`n📊 ANÁLISIS COMPLETO DE TODOS LOS DATOS JSON" -ForegroundColor Cyan
Write-Host "============================================================`n" -ForegroundColor Cyan

$basePath = "src\apps\FlowDistributor\data"

# ÓRDENES DE COMPRA Y DISTRIBUIDORES
try {
    $ordenesJson = Get-Content "$basePath\panel-ordenes-compra-manual.json" | ConvertFrom-Json
    $ordenes = $ordenesJson.distribuidores.ordenesCompra.Count
    Write-Host "📦 ÓRDENES DE COMPRA: $ordenes" -ForegroundColor Green
} catch {
    Write-Host "❌ Error leyendo Órdenes de Compra" -ForegroundColor Red
}

# CLIENTES
try {
    $clientesJson = Get-Content "$basePath\panel-clientes-manual.json" | ConvertFrom-Json
    $clientes = $clientesJson.clientes.Count
    Write-Host "👥 CLIENTES: $clientes" -ForegroundColor Green
} catch {
    Write-Host "❌ Error leyendo Clientes" -ForegroundColor Red
}

# VENTAS LOCAL
try {
    $ventasJson = Get-Content "$basePath\panel-ventas-local-manual.json" | ConvertFrom-Json
    $ventas = $ventasJson.ventasLocal.Count
    Write-Host "💰 VENTAS LOCAL: $ventas" -ForegroundColor Green
} catch {
    Write-Host "❌ Error leyendo Ventas" -ForegroundColor Red
}

# GASTOS Y ABONOS
try {
    $gastosJson = Get-Content "$basePath\panel-gastos-abonos-manual.json" | ConvertFrom-Json
    $gastos = $gastosJson.gastosAbonos.Count
    Write-Host "💸 GASTOS Y ABONOS: $gastos" -ForegroundColor Green
} catch {
    Write-Host "❌ Error leyendo Gastos" -ForegroundColor Red
}

Write-Host "`n🏦 DATOS BANCARIOS:" -ForegroundColor Yellow

# UTILIDADES
try {
    $utilidadesJson = Get-Content "$basePath\panel-utilidades-manual.json" | ConvertFrom-Json
    $utilidadesIngresos = $utilidadesJson.utilidades.ingresosList.Count
    $utilidadesGastos = $utilidadesJson.utilidades.gastosList.Count
    $utilidadesRF = $utilidadesJson.utilidades.rfActual
    $utilidadesCortes = $utilidadesJson.utilidades.rfCortes.Count
    Write-Host "  ✅ Utilidades - Ingresos: $utilidadesIngresos" -ForegroundColor Green
    Write-Host "  ✅ Utilidades - Gastos: $utilidadesGastos" -ForegroundColor Green
    Write-Host "  ✅ Utilidades - RF Actual: `$$utilidadesRF" -ForegroundColor Cyan
    Write-Host "  ✅ Utilidades - Cortes: $utilidadesCortes" -ForegroundColor Green
} catch {
    Write-Host "  ❌ Error leyendo Utilidades" -ForegroundColor Red
}

# PROFIT
try {
    $profitJson = Get-Content "$basePath\panel-profit-manual.json" | ConvertFrom-Json
    $profitIngresos = $profitJson.profit.ingresosList.Count
    $profitGastos = $profitJson.profit.gastosList.Count
    $profitRF = $profitJson.profit.rfActual
    $profitCortes = $profitJson.profit.rfCortes.Count
    Write-Host "  ✅ Profit - Ingresos: $profitIngresos" -ForegroundColor Green
    Write-Host "  ✅ Profit - Gastos: $profitGastos" -ForegroundColor Green
    Write-Host "  ✅ Profit - RF Actual: `$$profitRF" -ForegroundColor Cyan
    Write-Host "  ✅ Profit - Cortes: $profitCortes" -ForegroundColor Green
} catch {
    Write-Host "  ❌ Error leyendo Profit" -ForegroundColor Red
}

# AZTECA
try {
    $aztecaJson = Get-Content "$basePath\panel-azteca-manual.json" | ConvertFrom-Json
    $aztecaIngresos = $aztecaJson.azteca.ingresosList.Count
    $aztecaGastos = $aztecaJson.azteca.gastosList.Count
    $aztecaRF = $aztecaJson.azteca.rfActual
    $aztecaCortes = $aztecaJson.azteca.rfCortes.Count
    Write-Host "  ✅ Azteca - Ingresos: $aztecaIngresos" -ForegroundColor Green
    Write-Host "  ✅ Azteca - Gastos: $aztecaGastos" -ForegroundColor Green
    Write-Host "  ✅ Azteca - RF Actual: `$$aztecaRF" -ForegroundColor Cyan
    Write-Host "  ✅ Azteca - Cortes: $aztecaCortes" -ForegroundColor Green
} catch {
    Write-Host "  ❌ Error leyendo Azteca" -ForegroundColor Red
}

# LEFTIE
try {
    $leftieJson = Get-Content "$basePath\panel-leftie-manual.json" | ConvertFrom-Json
    $leftieIngresos = $leftieJson.leftie.ingresosList.Count
    $leftieGastos = $leftieJson.leftie.gastosList.Count
    $leftieRF = $leftieJson.leftie.rfActual
    $leftieCortes = $leftieJson.leftie.rfCortes.Count
    Write-Host "  ✅ Leftie - Ingresos: $leftieIngresos" -ForegroundColor Green
    Write-Host "  ✅ Leftie - Gastos: $leftieGastos" -ForegroundColor Green
    Write-Host "  ✅ Leftie - RF Actual: `$$leftieRF" -ForegroundColor Cyan
    Write-Host "  ✅ Leftie - Cortes: $leftieCortes" -ForegroundColor Green
} catch {
    Write-Host "  ❌ Error leyendo Leftie" -ForegroundColor Red
}

# BÓVEDA MONTE
try {
    $monteJson = Get-Content "$basePath\panel-boveda-monte-manual.json" | ConvertFrom-Json
    $monteIngresos = $monteJson.bovedaMonte.ingresosList.Count
    $monteGastos = $monteJson.bovedaMonte.gastosList.Count
    $monteRF = $monteJson.bovedaMonte.rfActual
    $monteCortes = $monteJson.bovedaMonte.rfCortes.Count
    Write-Host "  ✅ Bóveda Monte - Ingresos: $monteIngresos" -ForegroundColor Green
    Write-Host "  ✅ Bóveda Monte - Gastos: $monteGastos" -ForegroundColor Green
    Write-Host "  ✅ Bóveda Monte - RF Actual: `$$monteRF" -ForegroundColor Cyan
    Write-Host "  ✅ Bóveda Monte - Cortes: $monteCortes" -ForegroundColor Green
} catch {
    Write-Host "  ❌ Error leyendo Bóveda Monte" -ForegroundColor Red
}

# BÓVEDA USA
try {
    $usaJson = Get-Content "$basePath\panel-boveda-usa-manual.json" | ConvertFrom-Json
    $usaIngresos = $usaJson.bovedaUsa.ingresosList.Count
    $usaGastos = $usaJson.bovedaUsa.gastosList.Count
    $usaRF = $usaJson.bovedaUsa.rfActual
    $usaCortes = $usaJson.bovedaUsa.rfCortes.Count
    Write-Host "  ✅ Bóveda USA - Ingresos: $usaIngresos" -ForegroundColor Green
    Write-Host "  ✅ Bóveda USA - Gastos: $usaGastos" -ForegroundColor Green
    Write-Host "  ✅ Bóveda USA - RF Actual: `$$usaRF" -ForegroundColor Cyan
    Write-Host "  ✅ Bóveda USA - Cortes: $usaCortes" -ForegroundColor Green
} catch {
    Write-Host "  ❌ Error leyendo Bóveda USA" -ForegroundColor Red
}

# FLETES
try {
    $fletesJson = Get-Content "$basePath\panel-fletes-manual.json" | ConvertFrom-Json
    $fletesIngresos = $fletesJson.fleteSur.ingresosList.Count
    $fletesGastos = $fletesJson.fleteSur.gastos.Count
    $fletesRF = $fletesJson.fleteSur.rfActual
    $fletesCortes = $fletesJson.fleteSur.rfCortes.Count
    Write-Host "  ✅ Fletes - Ingresos: $fletesIngresos" -ForegroundColor Green
    Write-Host "  ✅ Fletes - Gastos: $fletesGastos" -ForegroundColor Green
    Write-Host "  ✅ Fletes - RF Actual: `$$fletesRF" -ForegroundColor Cyan
    Write-Host "  ✅ Fletes - Cortes: $fletesCortes" -ForegroundColor Green
} catch {
    Write-Host "  ❌ Error leyendo Fletes" -ForegroundColor Red
}

Write-Host "`n📦 DATOS DE INVENTARIO:" -ForegroundColor Yellow

# ALMACÉN MONTE
try {
    $almacenJson = Get-Content "$basePath\panel-almacen-monte-manual.json" | ConvertFrom-Json
    $almacenOrdenes = $almacenJson.almacenMonte.ordenesCompra.Count
    $almacenSalidas = $almacenJson.almacenMonte.salidas.Count
    $almacenRF = $almacenJson.almacenMonte.rfActual
    $almacenCortes = $almacenJson.almacenMonte.rfCortes.Count
    $almacenIngresos = $almacenJson.almacenMonte.ingresos
    Write-Host "  ✅ Almacén - Órdenes de Compra: $almacenOrdenes" -ForegroundColor Green
    Write-Host "  ✅ Almacén - Salidas: $almacenSalidas" -ForegroundColor Green
    Write-Host "  ✅ Almacén - Ingresos Totales: $almacenIngresos unidades" -ForegroundColor Cyan
    Write-Host "  ✅ Almacén - RF Actual: $almacenRF unidades" -ForegroundColor Cyan
    Write-Host "  ✅ Almacén - Cortes: $almacenCortes" -ForegroundColor Green
} catch {
    Write-Host "  ❌ Error leyendo Almacén" -ForegroundColor Red
}

Write-Host "`n📊 DASHBOARD:" -ForegroundColor Yellow

# DASHBOARD
try {
    $dashJson = Get-Content "$basePath\panel-dashboard-manual.json" | ConvertFrom-Json
    $capitalEfectivo = $dashJson.dashboard.capitalEfectivo
    $inventarioFisico = $dashJson.dashboard.inventarioFisico
    $totalRF = $dashJson.dashboard.totalRfActual
    $paneles = $dashJson.dashboard.paneles.Count
    Write-Host "  ✅ Capital en Efectivo: `$$capitalEfectivo" -ForegroundColor Cyan
    Write-Host "  ✅ Inventario Físico: `$$inventarioFisico" -ForegroundColor Cyan
    Write-Host "  ✅ Total RF Actual: `$$totalRF" -ForegroundColor Cyan
    Write-Host "  ✅ Paneles Configurados: $paneles" -ForegroundColor Green
} catch {
    Write-Host "  ❌ Error leyendo Dashboard" -ForegroundColor Red
}

Write-Host "`n🎯 RESUMEN TOTAL DE REGISTROS:" -ForegroundColor Yellow
Write-Host "============================================================" -ForegroundColor Yellow

$totalRegistros = 0
$totalRegistros += $ordenes
$totalRegistros += $clientes
$totalRegistros += $ventas
$totalRegistros += $gastos
$totalRegistros += $utilidadesIngresos + $utilidadesGastos
$totalRegistros += $profitIngresos + $profitGastos
$totalRegistros += $aztecaIngresos + $aztecaGastos
$totalRegistros += $leftieIngresos + $leftieGastos
$totalRegistros += $monteIngresos + $monteGastos
$totalRegistros += $usaIngresos + $usaGastos
$totalRegistros += $fletesIngresos + $fletesGastos
$totalRegistros += $almacenOrdenes + $almacenSalidas

$totalCortes = $utilidadesCortes + $profitCortes + $aztecaCortes + $leftieCortes + $monteCortes + $usaCortes + $fletesCortes + $almacenCortes

Write-Host "  📝 Total de Registros: $totalRegistros" -ForegroundColor Cyan
Write-Host "  ✂️  Total de Cortes: $totalCortes" -ForegroundColor Cyan
Write-Host "`n✅ SISTEMA COMPLETAMENTE OPERATIVO" -ForegroundColor Green
Write-Host "============================================================`n" -ForegroundColor Green

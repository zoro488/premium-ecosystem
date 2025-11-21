Write-Host "`n📊 ANÁLISIS DE DATOS REALES EN JSON:" -ForegroundColor Cyan
Write-Host "================================================`n" -ForegroundColor Cyan

$basePath = "src\apps\FlowDistributor\data"

try {
    $ordenes = (Get-Content "$basePath\panel-ordenes-compra-manual.json" | ConvertFrom-Json).distribuidores.ordenesCompra.Count
    Write-Host "✅ Órdenes de Compra: $ordenes" -ForegroundColor Green
} catch {
    Write-Host "❌ Error leyendo Órdenes de Compra" -ForegroundColor Red
}

try {
    $clientes = (Get-Content "$basePath\panel-clientes-manual.json" | ConvertFrom-Json).clientes.Count
    Write-Host "✅ Clientes: $clientes" -ForegroundColor Green
} catch {
    Write-Host "❌ Error leyendo Clientes" -ForegroundColor Red
}

try {
    $ventas = (Get-Content "$basePath\panel-ventas-local-manual.json" | ConvertFrom-Json).ventasLocal.Count
    Write-Host "✅ Ventas Local: $ventas" -ForegroundColor Green
} catch {
    Write-Host "❌ Error leyendo Ventas" -ForegroundColor Red
}

try {
    $gastos = (Get-Content "$basePath\panel-gastos-abonos-manual.json" | ConvertFrom-Json).gastosAbonos.Count
    Write-Host "✅ Gastos y Abonos: $gastos" -ForegroundColor Green
} catch {
    Write-Host "❌ Error leyendo Gastos" -ForegroundColor Red
}

try {
    $utilidadesIngresos = (Get-Content "$basePath\panel-utilidades-manual.json" | ConvertFrom-Json).utilidades.ingresosList.Count
    $utilidadesGastos = (Get-Content "$basePath\panel-utilidades-manual.json" | ConvertFrom-Json).utilidades.gastosList.Count
    Write-Host "✅ Utilidades - Ingresos: $utilidadesIngresos" -ForegroundColor Green
    Write-Host "✅ Utilidades - Gastos: $utilidadesGastos" -ForegroundColor Green
} catch {
    Write-Host "❌ Error leyendo Utilidades" -ForegroundColor Red
}

try {
    $profitIngresos = (Get-Content "$basePath\panel-profit-manual.json" | ConvertFrom-Json).profit.ingresosList.Count
    Write-Host "✅ Profit - Ingresos: $profitIngresos" -ForegroundColor Green
} catch {
    Write-Host "❌ Error leyendo Profit" -ForegroundColor Red
}

try {
    $aztecaIngresos = (Get-Content "$basePath\panel-azteca-manual.json" | ConvertFrom-Json).azteca.ingresosList.Count
    $aztecaGastos = (Get-Content "$basePath\panel-azteca-manual.json" | ConvertFrom-Json).azteca.gastosList.Count
    Write-Host "✅ Azteca - Ingresos: $aztecaIngresos" -ForegroundColor Green
    Write-Host "✅ Azteca - Gastos: $aztecaGastos" -ForegroundColor Green
} catch {
    Write-Host "❌ Error leyendo Azteca" -ForegroundColor Red
}

try {
    $leftieIngresos = (Get-Content "$basePath\panel-leftie-manual.json" | ConvertFrom-Json).leftie.ingresosList.Count
    $leftieGastos = (Get-Content "$basePath\panel-leftie-manual.json" | ConvertFrom-Json).leftie.gastosList.Count
    Write-Host "✅ Leftie - Ingresos: $leftieIngresos" -ForegroundColor Green
    Write-Host "✅ Leftie - Gastos: $leftieGastos" -ForegroundColor Green
} catch {
    Write-Host "❌ Error leyendo Leftie" -ForegroundColor Red
}

try {
    $bovedaMonteIngresos = (Get-Content "$basePath\panel-boveda-monte-manual.json" | ConvertFrom-Json).bovedaMonte.ingresosList.Count
    $bovedaMonteGastos = (Get-Content "$basePath\panel-boveda-monte-manual.json" | ConvertFrom-Json).bovedaMonte.gastosList.Count
    Write-Host "✅ Bóveda Monte - Ingresos: $bovedaMonteIngresos" -ForegroundColor Green
    Write-Host "✅ Bóveda Monte - Gastos: $bovedaMonteGastos" -ForegroundColor Green
} catch {
    Write-Host "❌ Error leyendo Bóveda Monte" -ForegroundColor Red
}

try {
    $bovedaUsaIngresos = (Get-Content "$basePath\panel-boveda-usa-manual.json" | ConvertFrom-Json).bovedaUsa.ingresosList.Count
    $bovedaUsaGastos = (Get-Content "$basePath\panel-boveda-usa-manual.json" | ConvertFrom-Json).bovedaUsa.gastosList.Count
    Write-Host "✅ Bóveda USA - Ingresos: $bovedaUsaIngresos" -ForegroundColor Green
    Write-Host "✅ Bóveda USA - Gastos: $bovedaUsaGastos" -ForegroundColor Green
} catch {
    Write-Host "❌ Error leyendo Bóveda USA" -ForegroundColor Red
}

try {
    $almacenIngresos = (Get-Content "$basePath\panel-almacen-monte-manual.json" | ConvertFrom-Json).almacenMonte.ordenesCompra.Count
    $almacenSalidas = (Get-Content "$basePath\panel-almacen-monte-manual.json" | ConvertFrom-Json).almacenMonte.salidas.Count
    Write-Host "✅ Almacén Monte - Órdenes: $almacenIngresos" -ForegroundColor Green
    Write-Host "✅ Almacén Monte - Salidas: $almacenSalidas" -ForegroundColor Green
} catch {
    Write-Host "❌ Error leyendo Almacén Monte" -ForegroundColor Red
}

try {
    $fletesGastos = (Get-Content "$basePath\panel-fletes-manual.json" | ConvertFrom-Json).fleteSur.gastos.Count
    Write-Host "✅ Fletes - Gastos: $fletesGastos" -ForegroundColor Green
} catch {
    Write-Host "❌ Error leyendo Fletes" -ForegroundColor Red
}

Write-Host "`n🎯 RESUMEN VERIFICADO" -ForegroundColor Yellow
Write-Host "================================================" -ForegroundColor Yellow

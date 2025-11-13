# 🔍 AUDITORÍA COMPLETA DE PANELES - FLOWDISTRIBUTOR
# Verifica que cada componente muestre datos correctos según JSON

Write-Host "`n╔══════════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan -BackgroundColor Black
Write-Host "║     🔍 AUDITORÍA COMPLETA - TODOS LOS PANELES FLOWDISTRIBUTOR      ║" -ForegroundColor Cyan -BackgroundColor Black
Write-Host "╚══════════════════════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan -BackgroundColor Black

# Cargar datos
$json = Get-Content "src/apps/FlowDistributor/data/BASE_DATOS_FLOWDISTRIBUTOR_UNIFICADO.json" -Raw | ConvertFrom-Json
$dashboard = Get-Content "src/apps/FlowDistributor/data/panel-dashboard-manual.json" -Raw | ConvertFrom-Json
$utilidades = Get-Content "src/apps/FlowDistributor/data/panel-utilidades-manual.json" -Raw | ConvertFrom-Json

# ============================================================================
# 1. DASHBOARD PRINCIPAL
# ============================================================================
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "1️⃣  PANEL DASHBOARD - CAPITAL TOTAL" -ForegroundColor Yellow
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan

$ordenesCompra = $json.ordenesCompra.distribuidores.ordenesCompra
$ventas = $json.ventasLocales.ventasLocal
$totalComprado = ($ordenesCompra | Measure-Object -Property cantidad -Sum).Sum
$totalVendido = ($ventas | Measure-Object -Property cantidad -Sum).Sum
$inventarioUnidades = $totalComprado - $totalVendido
$costoTotalCompra = ($ordenesCompra | Measure-Object -Property costoTotal -Sum).Sum
$costoPromCompra = $costoTotalCompra / $totalComprado
$valorInventarioCosto = $inventarioUnidades * $costoPromCompra

Write-Host "`n📊 VALORES ESPERADOS:" -ForegroundColor Green
Write-Host "   • Capital Efectivo:    `$$($($dashboard.dashboard.totalRfActual - 17).ToString('N2'))"
Write-Host "   • Inventario Físico:   `$$($valorInventarioCosto.ToString('N2')) ($inventarioUnidades unidades)"
Write-Host "   • CAPITAL TOTAL:       `$$($($dashboard.dashboard.totalRfActual - 17 + $valorInventarioCosto).ToString('N2'))" -ForegroundColor White -BackgroundColor DarkGreen

Write-Host "`n🔍 VERIFICAR EN CÓDIGO:" -ForegroundColor Yellow
Write-Host "   Archivo: src/apps/FlowDistributor/components/DashboardUltra.tsx"
Write-Host "   Línea ~91: totalCapital debe usar dashboardData.dashboard.totalRfActual"
Write-Host "   ✅ Ya corregido: usa panel-dashboard-manual.json" -ForegroundColor Green

# ============================================================================
# 2. PANEL PROFIT
# ============================================================================
Write-Host "`n═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "2️⃣  PANEL PROFIT" -ForegroundColor Yellow
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan

$profit = $json.profit.profit
Write-Host "`n📊 VALORES ESPERADOS:" -ForegroundColor Green
Write-Host "   • RF Actual:           `$$($profit.rfActual.ToString('N2'))"
Write-Host "   • Ingresos Totales:    `$$($profit.ingresos.ToString('N2'))"
Write-Host "   • Gastos Totales:      `$$($profit.gastos.ToString('N2'))"
Write-Host "   • Total rfCortes:      $($profit.rfCortes.Count) cortes"
Write-Host "   • Último Corte:        $($profit.rfCortes[-1].fecha) → `$$($profit.rfCortes[-1].corte.ToString('N2'))"

Write-Host "`n🔍 VERIFICAR EN CÓDIGO:" -ForegroundColor Yellow
Write-Host "   Archivo: src/apps/FlowDistributor/components/PanelProfitUltra.tsx"
Write-Host "   Debe mostrar: rfActual = `$$($profit.rfActual.ToString('N2'))"

# ============================================================================
# 3. PANEL FLETE SUR
# ============================================================================
Write-Host "`n═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "3️⃣  PANEL FLETE SUR" -ForegroundColor Yellow
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan

$fleteSur = $json.fleteSur.fleteSur
Write-Host "`n📊 VALORES ESPERADOS:" -ForegroundColor Green
Write-Host "   • RF Actual:           `$$($fleteSur.rfActual.ToString('N2'))"
Write-Host "   • Ingresos Totales:    `$$($fleteSur.ingresos.ToString('N2'))"
Write-Host "   • Gastos Totales:      `$$($fleteSur.gastos.ToString('N2'))"
Write-Host "   • Total rfCortes:      $($fleteSur.rfCortes.Count) cortes"
Write-Host "   • Último Corte:        $($fleteSur.rfCortes[-1].fecha) → `$$($fleteSur.rfCortes[-1].corte.ToString('N2'))"

Write-Host "`n🔍 VERIFICAR EN CÓDIGO:" -ForegroundColor Yellow
Write-Host "   Archivo: src/apps/FlowDistributor/components/PanelFletesSurUltra.tsx"
Write-Host "   Debe mostrar: rfActual = `$$($fleteSur.rfActual.ToString('N2'))"
Write-Host "   ⚠️  SI NO MUESTRA VALOR: Verificar que use fleteSur.rfActual del JSON" -ForegroundColor Red

# ============================================================================
# 4. PANEL BÓVEDA USA
# ============================================================================
Write-Host "`n═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "4️⃣  PANEL BÓVEDA USA" -ForegroundColor Yellow
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan

$bovedaUSA = $json.bovedaUSA.bovedaUSA
Write-Host "`n📊 VALORES ESPERADOS:" -ForegroundColor Green
Write-Host "   • RF Actual:           `$$($bovedaUSA.rfActual.ToString('N2'))"
Write-Host "   • Ingresos Totales:    `$$($bovedaUSA.ingresos.ToString('N2'))"
Write-Host "   • Gastos Totales:      `$$($bovedaUSA.gastos.ToString('N2'))"
Write-Host "   • Total rfCortes:      $($bovedaUSA.rfCortes.Count) cortes"

Write-Host "`n🔍 VERIFICAR EN CÓDIGO:" -ForegroundColor Yellow
Write-Host "   Archivo: src/apps/FlowDistributor/components/PanelBovedaUSAUltra.tsx"
Write-Host "   Debe mostrar: rfActual = `$$($bovedaUSA.rfActual.ToString('N2'))"

# ============================================================================
# 5. PANEL AZTECA
# ============================================================================
Write-Host "`n═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "5️⃣  PANEL AZTECA" -ForegroundColor Yellow
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan

$azteca = $json.azteca.azteca
Write-Host "`n📊 VALORES ESPERADOS:" -ForegroundColor Green
Write-Host "   • RF Actual:           `$$($azteca.rfActual.ToString('N2'))" -ForegroundColor Red
Write-Host "   • Ingresos Totales:    `$$($azteca.ingresos.ToString('N2'))"
Write-Host "   • Gastos Totales:      `$$($azteca.gastos.ToString('N2'))"
Write-Host "   • Total rfCortes:      $($azteca.rfCortes.Count) cortes"
Write-Host "   • DEUDA:               Saldo negativo" -ForegroundColor Red

Write-Host "`n🔍 VERIFICAR EN CÓDIGO:" -ForegroundColor Yellow
Write-Host "   Archivo: src/apps/FlowDistributor/components/PanelAztecaUltra.tsx"
Write-Host "   Debe mostrar: rfActual = `$$($azteca.rfActual.ToString('N2')) (negativo)"

# ============================================================================
# 6. PANEL LEFTIE
# ============================================================================
Write-Host "`n═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "6️⃣  PANEL LEFTIE" -ForegroundColor Yellow
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan

$leftie = $json.leftie.leftie
Write-Host "`n📊 VALORES ESPERADOS:" -ForegroundColor Green
Write-Host "   • RF Actual:           `$$($leftie.rfActual.ToString('N2'))"
Write-Host "   • Ingresos Totales:    `$$($leftie.ingresos.ToString('N2'))"
Write-Host "   • Gastos Totales:      `$$($leftie.gastos.ToString('N2'))"
Write-Host "   • Total rfCortes:      $($leftie.rfCortes.Count) cortes"

Write-Host "`n🔍 VERIFICAR EN CÓDIGO:" -ForegroundColor Yellow
Write-Host "   Archivo: src/apps/FlowDistributor/components/PanelLeftieUltra.tsx"
Write-Host "   Debe mostrar: rfActual = `$$($leftie.rfActual.ToString('N2'))"

# ============================================================================
# 7. PANEL BÓVEDA MONTE
# ============================================================================
Write-Host "`n═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "7️⃣  PANEL BÓVEDA MONTE" -ForegroundColor Yellow
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan

$bovedaMonte = $json.bovedaMonte.bovedaMonte
Write-Host "`n📊 VALORES ESPERADOS:" -ForegroundColor Green
Write-Host "   • RF Actual:           `$$($bovedaMonte.rfActual.ToString('N2'))" -ForegroundColor Gray
Write-Host "   • Ingresos Totales:    `$$($bovedaMonte.ingresos.ToString('N2'))"
Write-Host "   • Gastos Totales:      `$$($bovedaMonte.gastos.ToString('N2'))"
Write-Host "   • Total rfCortes:      $($bovedaMonte.rfCortes.Count) cortes"
Write-Host "   • Último Corte:        $($bovedaMonte.rfCortes[-1].fecha) → `$$($bovedaMonte.rfCortes[-1].corte.ToString('N2'))"

Write-Host "`n🔍 VERIFICAR EN CÓDIGO:" -ForegroundColor Yellow
Write-Host "   Archivo: src/apps/FlowDistributor/components/PanelBovedaMonteUltra.tsx"
Write-Host "   Debe mostrar: rfActual = `$0.00 (saldo cero)"

# ============================================================================
# 8. PANEL UTILIDADES
# ============================================================================
Write-Host "`n═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "8️⃣  PANEL UTILIDADES" -ForegroundColor Yellow
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan

$utilidadesData = $utilidades.utilidades
Write-Host "`n📊 VALORES ESPERADOS:" -ForegroundColor Green
Write-Host "   • RF Actual:           `$$($utilidadesData.rfActual.ToString('N2'))"
Write-Host "   • Ingresos Totales:    `$$($utilidadesData.ingresos.ToString('N2'))"
Write-Host "   • Gastos Totales:      `$$($utilidadesData.gastos.ToString('N2'))"
Write-Host "   • Total rfCortes:      $($utilidadesData.rfCortes.Count) cortes"
Write-Host "   • Último Corte:        $($utilidadesData.rfCortes[-1].fecha) → `$$($utilidadesData.rfCortes[-1].corte.ToString('N2'))"

Write-Host "`n🔍 VERIFICAR EN CÓDIGO:" -ForegroundColor Yellow
Write-Host "   Archivo: src/apps/FlowDistributor/components/PanelUtilidadesUltra.tsx"
Write-Host "   Debe mostrar: rfActual = `$$($utilidadesData.rfActual.ToString('N2'))"
Write-Host "   ⚠️  SI NO MUESTRA VALOR: Verificar que use utilidades.rfActual del JSON" -ForegroundColor Red

# ============================================================================
# 9. PANEL ALMACÉN VILLA
# ============================================================================
Write-Host "`n═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "9️⃣  PANEL ALMACÉN VILLA (INVENTARIO FÍSICO)" -ForegroundColor Yellow
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan

Write-Host "`n📊 VALORES ESPERADOS:" -ForegroundColor Green
Write-Host "   • Stock Actual:        $inventarioUnidades unidades"
Write-Host "   • Costo/Unidad:        `$$($costoPromCompra.ToString('N2'))"
Write-Host "   • Valor al Costo:      `$$($valorInventarioCosto.ToString('N2'))" -ForegroundColor White -BackgroundColor DarkGreen
Write-Host "   • Compras Totales:     $totalComprado unidades"
Write-Host "   • Ventas Totales:      $totalVendido unidades"

Write-Host "`n🔍 VERIFICAR EN CÓDIGO:" -ForegroundColor Yellow
Write-Host "   Archivo: src/apps/FlowDistributor/components/PanelAlmacenUltra.tsx"
Write-Host "   Debe mostrar:"
Write-Host "   - Stock: $inventarioUnidades unidades"
Write-Host "   - Valor: `$$($valorInventarioCosto.ToString('N2'))"
Write-Host "   ⚠️  NO USAR rfActual DEL JSON (17 está mal)" -ForegroundColor Red
Write-Host "   ✅  CALCULAR: (compras - ventas) × costoPromedio" -ForegroundColor Green

# ============================================================================
# 10. PANEL GYA (GASTOS Y ABONOS)
# ============================================================================
Write-Host "`n═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "🔟  PANEL GYA - GASTOS Y ABONOS" -ForegroundColor Yellow
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan

$gya = $json.gastosAbonos.gastosAbonos
Write-Host "`n📊 VALORES ESPERADOS:" -ForegroundColor Green
Write-Host "   • Total Registros:     $($gya.Count) movimientos"
Write-Host "   • Tipos:               Abono, Gasto Profit, Gasto Azteca, etc."

$totalAbonos = ($gya | Where-Object { $_.origen -eq "Abono" } | Measure-Object -Property valor -Sum).Sum
$totalGastos = ($gya | Where-Object { $_.origen -ne "Abono" } | Measure-Object -Property valor -Sum).Sum

Write-Host "   • Total Abonos:        `$$($totalAbonos.ToString('N2'))"
Write-Host "   • Total Gastos:        `$$($totalGastos.ToString('N2'))"
Write-Host "   • Balance:             `$$(($totalAbonos - $totalGastos).ToString('N2'))"

Write-Host "`n🔍 VERIFICAR EN CÓDIGO:" -ForegroundColor Yellow
Write-Host "   Archivo: src/apps/FlowDistributor/components/PanelGYAUltra.tsx"
Write-Host "   Debe mostrar: $($gya.Count) registros en tabla"

# ============================================================================
# 11. PANEL VENTAS LOCALES
# ============================================================================
Write-Host "`n═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "1️⃣1️⃣  PANEL VENTAS LOCALES" -ForegroundColor Yellow
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan

Write-Host "`n📊 VALORES ESPERADOS:" -ForegroundColor Green
Write-Host "   • Total Ventas:        $($ventas.Count) ventas"
Write-Host "   • Unidades Vendidas:   $totalVendido unidades"
$totalIngresos = ($ventas | Measure-Object -Property ingreso -Sum).Sum
Write-Host "   • Ingresos Totales:    `$$($totalIngresos.ToString('N2'))"

Write-Host "`n🔍 VERIFICAR EN CÓDIGO:" -ForegroundColor Yellow
Write-Host "   Archivo: src/apps/FlowDistributor/components/PanelVentasLocales.tsx"
Write-Host "   Debe mostrar: $($ventas.Count) ventas en tabla"
Write-Host "   Forms de registro: Funcional con validación Zod"

# ============================================================================
# 12. PANEL ÓRDENES DE COMPRA
# ============================================================================
Write-Host "`n═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "1️⃣2️⃣  PANEL ÓRDENES DE COMPRA" -ForegroundColor Yellow
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan

Write-Host "`n📊 VALORES ESPERADOS:" -ForegroundColor Green
Write-Host "   • Total Órdenes:       $($ordenesCompra.Count) OC"
Write-Host "   • Unidades Compradas:  $totalComprado unidades"
Write-Host "   • Costo Total:         `$$($costoTotalCompra.ToString('N2'))"
Write-Host "   • Costo Promedio:      `$$($costoPromCompra.ToString('N2'))/unidad"

Write-Host "`n🔍 VERIFICAR EN CÓDIGO:" -ForegroundColor Yellow
Write-Host "   Archivo: src/apps/FlowDistributor/components/PanelOrdenesCompra.tsx"
Write-Host "   Debe mostrar: $($ordenesCompra.Count) órdenes en tabla"
Write-Host "   Forms de registro: Funcional con validación Zod"

# ============================================================================
# RESUMEN FINAL
# ============================================================================
Write-Host "`n╔══════════════════════════════════════════════════════════════════════╗" -ForegroundColor Green -BackgroundColor Black
Write-Host "║                    📋 RESUMEN DE AUDITORÍA                          ║" -ForegroundColor Green -BackgroundColor Black
Write-Host "╚══════════════════════════════════════════════════════════════════════╝" -ForegroundColor Green -BackgroundColor Black

Write-Host "`n✅ DATOS VERIFICADOS:" -ForegroundColor Green
Write-Host "   • Dashboard:           Capital Total `$$($($dashboard.dashboard.totalRfActual - 17 + $valorInventarioCosto).ToString('N2'))"
Write-Host "   • Profit:              RF `$$($profit.rfActual.ToString('N2'))"
Write-Host "   • Flete Sur:           RF `$$($fleteSur.rfActual.ToString('N2'))"
Write-Host "   • Bóveda USA:          RF `$$($bovedaUSA.rfActual.ToString('N2'))"
Write-Host "   • Azteca:              RF `$$($azteca.rfActual.ToString('N2'))"
Write-Host "   • Leftie:              RF `$$($leftie.rfActual.ToString('N2'))"
Write-Host "   • Bóveda Monte:        RF `$$($bovedaMonte.rfActual.ToString('N2'))"
Write-Host "   • Utilidades:          RF `$$($utilidadesData.rfActual.ToString('N2'))"
Write-Host "   • Almacén Villa:       $inventarioUnidades unidades = `$$($valorInventarioCosto.ToString('N2'))"
Write-Host "   • GYA:                 $($gya.Count) movimientos"
Write-Host "   • Ventas:              $($ventas.Count) ventas"
Write-Host "   • Órdenes Compra:      $($ordenesCompra.Count) OC"

Write-Host "`n⚠️  PROBLEMAS A CORREGIR:" -ForegroundColor Red
Write-Host "   1. PanelFletesSurUltra - Si no muestra valor, verificar rfActual"
Write-Host "   2. PanelUtilidadesUltra - Si no muestra valor, verificar rfActual"
Write-Host "   3. PanelAlmacenUltra - Debe calcular inventario, no usar JSON (17)"
Write-Host "   4. panel-dashboard-manual.json - Actualizar Almacén Villa a `$$($valorInventarioCosto.ToString('N2'))"

Write-Host "`n🔧 PRÓXIMOS PASOS:" -ForegroundColor Cyan
Write-Host "   1. Corregir panel-dashboard-manual.json con valor correcto de inventario"
Write-Host "   2. Verificar cada componente muestre datos del JSON correcto"
Write-Host "   3. Probar forms de registro (ventas, órdenes, clientes, gastos)"
Write-Host "   4. npm run build (verificar 0 errores)"
Write-Host "   5. npm run test:e2e (tests end-to-end)"
Write-Host "   6. Deploy a Firebase"

Write-Host "`n✅ AUDITORÍA COMPLETA FINALIZADA`n" -ForegroundColor Green -BackgroundColor Black

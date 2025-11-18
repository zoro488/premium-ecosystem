# Actualizar nombres de colecciones en servicios
Write-Host "🔄 Actualizando nombres de colecciones Firestore..." -ForegroundColor Cyan

# 1. Órdenes de Compra: 'ordenesCompra' -> 'ordenes_compra'
$file1 = "src/apps/FlowDistributor/services/ordenesCompra.service.ts"
$content1 = Get-Content $file1 -Raw
$content1 = $content1 -replace "'ordenesCompra'", "'ordenes_compra'"
$content1 | Set-Content $file1 -Encoding UTF8
Write-Host "✅ ordenesCompra.service.ts actualizado" -ForegroundColor Green

Write-Host "`n🎉 Colecciones actualizadas correctamente" -ForegroundColor Green

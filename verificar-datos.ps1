# Verificar datos cargados en Firestore
$projectId = 'premium-ecosystem-1760790572'
$apiKey = $env:VITE_FIREBASE_API_KEY

Write-Host "`n🔍 VERIFICACIÓN DE DATOS EN FIRESTORE`n" -ForegroundColor Cyan

# Verificar una orden de compra
Write-Host '📦 Orden de Compra OC0001:' -ForegroundColor Yellow
$url1 = "https://firestore.googleapis.com/v1/projects/$projectId/databases/(default)/documents/ordenes_compra/OC0001?key=$apiKey"
$doc1 = Invoke-RestMethod -Uri $url1 -Method Get
Write-Host 'Campos:' -ForegroundColor Green
$doc1.fields.PSObject.Properties | ForEach-Object {
  $name = $_.Name
  $value = $_.Value.PSObject.Properties.Value
  Write-Host "  - $name`: $value" -ForegroundColor White
}

# Verificar un cliente
Write-Host "`n👥 Cliente 'Primo':" -ForegroundColor Yellow
$url2 = "https://firestore.googleapis.com/v1/projects/$projectId/databases/(default)/documents/clientes/CLI001?key=$apiKey"
$doc2 = Invoke-RestMethod -Uri $url2 -Method Get
Write-Host 'Campos:' -ForegroundColor Green
$doc2.fields.PSObject.Properties | ForEach-Object {
  $name = $_.Name
  $value = $_.Value.PSObject.Properties.Value
  Write-Host "  - $name`: $value" -ForegroundColor White
}

# Verificar Bóveda Monte
Write-Host "`n🏦 Bóveda Monte:" -ForegroundColor Yellow
$url3 = "https://firestore.googleapis.com/v1/projects/$projectId/databases/(default)/documents/boveda_monte/cuenta?key=$apiKey"
$doc3 = Invoke-RestMethod -Uri $url3 -Method Get
Write-Host 'Campos:' -ForegroundColor Green
$doc3.fields.PSObject.Properties | ForEach-Object {
  $name = $_.Name
  $value = $_.Value.PSObject.Properties.Value
  Write-Host "  - $name`: $value" -ForegroundColor White
}

Write-Host "`n✅ Verificación completada`n" -ForegroundColor Green

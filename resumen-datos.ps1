# Listar todos los documentos cargados
$projectId = 'premium-ecosystem-1760790572'
$apiKey = $env:VITE_FIREBASE_API_KEY

Write-Host "`n📊 RESUMEN COMPLETO DE DATOS CARGADOS`n" -ForegroundColor Cyan

$colecciones = @(
  'ordenes_compra',
  'distribuidores',
  'dashboard',
  'almacen_monte',
  'boveda_monte',
  'boveda_usa',
  'azteca',
  'utilidades',
  'fleteSur',
  'leftie',
  'profit',
  'clientes'
)

foreach ($col in $colecciones) {
  Write-Host "📁 $col" -ForegroundColor Yellow
  $url = "https://firestore.googleapis.com/v1/projects/$projectId/databases/(default)/documents/$col`?key=$apiKey"
  try {
    $docs = Invoke-RestMethod -Uri $url -Method Get
    $count = if ($docs.documents) { $docs.documents.Count } else { 0 }
    Write-Host "   ✅ $count documentos" -ForegroundColor Green

    # Mostrar primer documento con todos sus campos
    if ($docs.documents -and $docs.documents.Count -gt 0) {
      $primerDoc = $docs.documents[0]
      $docId = $primerDoc.name.Split('/')[-1]
      Write-Host "   📄 Ejemplo: $docId" -ForegroundColor Cyan
      Write-Host "   Campos totales: $($primerDoc.fields.PSObject.Properties.Count)" -ForegroundColor White
    }
  }
  catch {
    Write-Host '   ⚠️  Sin documentos o error' -ForegroundColor Red
  }
  Write-Host ''
}

Write-Host "✅ Resumen completado`n" -ForegroundColor Green

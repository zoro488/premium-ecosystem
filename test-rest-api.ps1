# Test directo con REST API de Firestore
$projectId = 'premium-ecosystem-1760790572'
$apiKey = $env:VITE_FIREBASE_API_KEY

Write-Host "🔍 TEST REST API FIRESTORE`n" -ForegroundColor Cyan

# Crear documento via REST API
$url = "https://firestore.googleapis.com/v1/projects/$projectId/databases/(default)/documents/test?documentId=test_rest&key=$apiKey"

$body = @{
  fields = @{
    mensaje = @{ stringValue = 'test rest api' }
    numero  = @{ integerValue = '123' }
  }
} | ConvertTo-Json -Depth 10

try {
  Write-Host '📤 Enviando documento a Firestore...' -ForegroundColor Yellow
  $response = Invoke-RestMethod -Uri $url -Method Post -Body $body -ContentType 'application/json'
  Write-Host '✅ ÉXITO! Documento creado:' -ForegroundColor Green
  $response | ConvertTo-Json -Depth 5
}
catch {
  Write-Host '❌ ERROR:' -ForegroundColor Red
  Write-Host $_.Exception.Message -ForegroundColor Red
  if ($_.ErrorDetails) {
    Write-Host $_.ErrorDetails.Message -ForegroundColor Yellow
  }
}

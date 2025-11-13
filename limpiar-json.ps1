# Script para limpiar emojis y caracteres especiales del JSON

$jsonPath = 'datos_paneles_completos.json'
$outputPath = 'datos_paneles_limpios.json'

Write-Host '🧹 Limpiando JSON de caracteres especiales...' -ForegroundColor Cyan

# Leer el archivo
$content = Get-Content $jsonPath -Raw -Encoding UTF8

# Remover emojis y caracteres no-ASCII
$contentLimpio = $content -replace '[^\x00-\x7F]', ''

# Guardar archivo limpio
$contentLimpio | Out-File $outputPath -Encoding UTF8

Write-Host "✅ JSON limpio guardado en: $outputPath" -ForegroundColor Green

# Mostrar diferencias
$originalSize = (Get-Item $jsonPath).Length
$cleanSize = (Get-Item $outputPath).Length
Write-Host "📊 Tamaño original: $originalSize bytes" -ForegroundColor Yellow
Write-Host "📊 Tamaño limpio: $cleanSize bytes" -ForegroundColor Yellow
Write-Host "📉 Diferencia: $($originalSize - $cleanSize) bytes removidos" -ForegroundColor Yellow

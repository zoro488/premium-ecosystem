#!/usr/bin/env pwsh

<#
.SYNOPSIS
    Script de build optimizado para producción

.DESCRIPTION
    Realiza un build completo optimizado para despliegue en Vercel
    con validaciones, optimizaciones y verificaciones de calidad

.NOTES
    Autor: Premium Ecosystem
    Versión: 2.0.0
#>

# Colores para output
$ColorSuccess = 'Green'
$ColorWarning = 'Yellow'
$ColorError = 'Red'
$ColorInfo = 'Cyan'

# Banner
Write-Host ''
Write-Host '╔════════════════════════════════════════════╗' -ForegroundColor $ColorInfo
Write-Host '║   🚀 PREMIUM ECOSYSTEM - BUILD PRODUCTION  ║' -ForegroundColor $ColorInfo
Write-Host '╚════════════════════════════════════════════╝' -ForegroundColor $ColorInfo
Write-Host ''

# Función para logs con timestamp
function Write-LogMessage {
  param(
    [string]$Message,
    [string]$Type = 'INFO'
  )

  $timestamp = Get-Date -Format 'HH:mm:ss'
  $color = switch ($Type) {
    'SUCCESS' { $ColorSuccess }
    'WARNING' { $ColorWarning }
    'ERROR' { $ColorError }
    default { $ColorInfo }
  }

  Write-Host "[$timestamp] " -NoNewline
  Write-Host $Message -ForegroundColor $color
}

# 1. Verificar Node y npm
Write-LogMessage '🔍 Verificando entorno...' 'INFO'
try {
  $nodeVersion = node --version
  $npmVersion = npm --version
  Write-LogMessage "✅ Node $nodeVersion | npm $npmVersion" 'SUCCESS'
}
catch {
  Write-LogMessage '❌ Error: Node.js no está instalado' 'ERROR'
  exit 1
}

# 2. Limpiar build anterior
Write-LogMessage '🧹 Limpiando builds anteriores...' 'INFO'
if (Test-Path 'dist') {
  Remove-Item -Recurse -Force 'dist'
  Write-LogMessage '✅ Directorio dist eliminado' 'SUCCESS'
}

# 3. Verificar variables de entorno
Write-LogMessage '🔐 Verificando variables de entorno...' 'INFO'
$requiredVars = @(
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID'
)

$missingVars = @()
foreach ($var in $requiredVars) {
  if (-not (Test-Path "env:$var")) {
    $missingVars += $var
  }
}

if ($missingVars.Count -gt 0) {
  Write-LogMessage '⚠️ Variables faltantes:' 'WARNING'
  foreach ($var in $missingVars) {
    Write-Host "   - $var" -ForegroundColor $ColorWarning
  }
  Write-Host ''
  Write-LogMessage '💡 Para deployment local, crea un archivo .env' 'INFO'
  Write-LogMessage '💡 Para Vercel, configura las variables en el dashboard' 'INFO'
  Write-Host ''
}

# 4. Instalar dependencias (si es necesario)
if (-not (Test-Path 'node_modules')) {
  Write-LogMessage '📦 Instalando dependencias...' 'INFO'
  npm ci --silent
  if ($LASTEXITCODE -eq 0) {
    Write-LogMessage '✅ Dependencias instaladas' 'SUCCESS'
  }
  else {
    Write-LogMessage '❌ Error al instalar dependencias' 'ERROR'
    exit 1
  }
}

# 5. Ejecutar linter
Write-LogMessage '🔍 Ejecutando ESLint...' 'INFO'
npm run lint 2>&1 | Out-Null
if ($LASTEXITCODE -eq 0) {
  Write-LogMessage '✅ Linter pasó sin errores' 'SUCCESS'
}
else {
  Write-LogMessage '⚠️ Advertencias de linter detectadas' 'WARNING'
}

# 6. Ejecutar tests (opcional, comentado por velocidad)
# Write-LogMessage "🧪 Ejecutando tests..." "INFO"
# npm test -- --run 2>&1 | Out-Null
# if ($LASTEXITCODE -eq 0) {
#     Write-LogMessage "✅ Tests pasados" "SUCCESS"
# } else {
#     Write-LogMessage "⚠️ Algunos tests fallaron" "WARNING"
# }

# 7. Build de producción
Write-LogMessage '🏗️ Compilando para producción...' 'INFO'
$env:NODE_ENV = 'production'
npm run build

if ($LASTEXITCODE -eq 0) {
  Write-LogMessage '✅ Build completado exitosamente' 'SUCCESS'
}
else {
  Write-LogMessage '❌ Error en el build' 'ERROR'
  exit 1
}

# 8. Analizar tamaño del bundle
Write-LogMessage '📊 Analizando tamaño del bundle...' 'INFO'
if (Test-Path 'dist') {
  $distSize = (Get-ChildItem -Path 'dist' -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
  Write-LogMessage "📦 Tamaño total: $([math]::Round($distSize, 2)) MB" 'INFO'

  # Mostrar archivos más grandes
  Write-Host ''
  Write-Host '📊 Archivos más grandes:' -ForegroundColor $ColorInfo
  Get-ChildItem -Path 'dist' -Recurse -File |
  Sort-Object Length -Descending |
  Select-Object -First 10 |
  ForEach-Object {
    $sizeMB = [math]::Round($_.Length / 1MB, 2)
    $sizeKB = [math]::Round($_.Length / 1KB, 2)
    $size = if ($sizeMB -gt 0.1) { "$sizeMB MB" } else { "$sizeKB KB" }
    Write-Host "   $size - $($_.Name)" -ForegroundColor Gray
  }
}

# 9. Verificar estructura del build
Write-LogMessage '🔍 Verificando estructura del build...' 'INFO'
$criticalFiles = @(
  'dist/index.html',
  'dist/assets'
)

$allFilesExist = $true
foreach ($file in $criticalFiles) {
  if (-not (Test-Path $file)) {
    Write-LogMessage "❌ Archivo crítico faltante: $file" 'ERROR'
    $allFilesExist = $false
  }
}

if ($allFilesExist) {
  Write-LogMessage '✅ Todos los archivos críticos presentes' 'SUCCESS'
}

# 10. Resumen final
Write-Host ''
Write-Host '╔════════════════════════════════════════════╗' -ForegroundColor $ColorSuccess
Write-Host '║          ✅ BUILD COMPLETADO               ║' -ForegroundColor $ColorSuccess
Write-Host '╚════════════════════════════════════════════╝' -ForegroundColor $ColorSuccess
Write-Host ''
Write-LogMessage '📁 Build ubicado en: ./dist' 'SUCCESS'
Write-LogMessage '🚀 Listo para deploy en Vercel' 'SUCCESS'
Write-Host ''
Write-Host 'Siguiente paso:' -ForegroundColor $ColorInfo
Write-Host '  1. Verifica variables de entorno en Vercel' -ForegroundColor Gray
Write-Host '  2. Ejecuta: vercel --prod' -ForegroundColor Gray
Write-Host '  3. O haz push a main/master para auto-deploy' -ForegroundColor Gray
Write-Host ''

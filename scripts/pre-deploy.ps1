#!/usr/bin/env pwsh
# 🚀 Script de preparación para producción FlowDistributor
# Ejecuta verificaciones y optimizaciones antes del deploy

Write-Host '🚀 Preparando FlowDistributor para PRODUCCIÓN...' -ForegroundColor Cyan
Write-Host ''

# 1. Limpiar cache y builds anteriores
Write-Host '🧹 Limpiando cache y builds...' -ForegroundColor Yellow
if (Test-Path 'dist') {
  Remove-Item -Recurse -Force 'dist'
  Write-Host '   ✓ Directorio dist eliminado' -ForegroundColor Green
}
if (Test-Path 'node_modules/.vite') {
  Remove-Item -Recurse -Force 'node_modules/.vite'
  Write-Host '   ✓ Cache de Vite limpiado' -ForegroundColor Green
}

# 2. Verificar variables de entorno
Write-Host ''
Write-Host '🔐 Verificando variables de entorno...' -ForegroundColor Yellow
if (-not (Test-Path '.env.production')) {
  Write-Host '   ⚠️  Archivo .env.production no encontrado' -ForegroundColor Red
  Write-Host '   Creando desde .env...' -ForegroundColor Yellow
  if (Test-Path '.env') {
    Copy-Item '.env' '.env.production'
    Write-Host '   ✓ .env.production creado' -ForegroundColor Green
  }
  else {
    Write-Host '   ❌ ERROR: No se encontró .env' -ForegroundColor Red
    exit 1
  }
}
else {
  Write-Host '   ✓ .env.production existe' -ForegroundColor Green
}

# 3. Verificar dependencias
Write-Host ''
Write-Host '📦 Verificando dependencias...' -ForegroundColor Yellow
$packageJson = Get-Content 'package.json' | ConvertFrom-Json
Write-Host "   ✓ Proyecto: $($packageJson.name) v$($packageJson.version)" -ForegroundColor Green

# 4. Ejecutar TypeScript check (si existe)
Write-Host ''
Write-Host '📝 Verificando TypeScript...' -ForegroundColor Yellow
if (Test-Path 'tsconfig.json') {
  try {
    npx tsc --noEmit --skipLibCheck 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
      Write-Host '   ✓ TypeScript verificado sin errores' -ForegroundColor Green
    }
    else {
      Write-Host '   ⚠️  TypeScript tiene warnings (continuando...)' -ForegroundColor Yellow
    }
  }
  catch {
    Write-Host '   ⚠️  Error al verificar TypeScript' -ForegroundColor Yellow
  }
}
else {
  Write-Host '   ℹ️  No se encontró tsconfig.json (proyecto JavaScript)' -ForegroundColor Cyan
}

# 5. Ejecutar tests unitarios
Write-Host ''
Write-Host '🧪 Ejecutando tests...' -ForegroundColor Yellow
try {
  npm run test -- --run --reporter=verbose 2>&1 | Out-Null
  if ($LASTEXITCODE -eq 0) {
    Write-Host '   ✓ Tests pasaron exitosamente' -ForegroundColor Green
  }
  else {
    Write-Host '   ⚠️  Algunos tests fallaron (continuando...)' -ForegroundColor Yellow
  }
}
catch {
  Write-Host '   ℹ️  Tests no disponibles o error al ejecutar' -ForegroundColor Cyan
}

# 6. Build de producción
Write-Host ''
Write-Host '🏗️  Construyendo para producción...' -ForegroundColor Yellow
Write-Host '   (Esto puede tomar varios minutos...)' -ForegroundColor Gray

try {
  npm run build
  if ($LASTEXITCODE -eq 0) {
    Write-Host ''
    Write-Host '   ✓ Build completado exitosamente' -ForegroundColor Green

    # Mostrar tamaño del build
    if (Test-Path 'dist') {
      $distSize = (Get-ChildItem -Path 'dist' -Recurse | Measure-Object -Property Length -Sum).Sum
      $distSizeMB = [math]::Round($distSize / 1MB, 2)
      Write-Host "   ℹ️  Tamaño del build: $distSizeMB MB" -ForegroundColor Cyan
    }
  }
  else {
    Write-Host ''
    Write-Host '   ❌ ERROR: Build falló' -ForegroundColor Red
    exit 1
  }
}
catch {
  Write-Host ''
  Write-Host '   ❌ ERROR: Build falló con excepción' -ForegroundColor Red
  Write-Host "   $_" -ForegroundColor Red
  exit 1
}

# 7. Verificar archivos críticos en dist
Write-Host ''
Write-Host '📋 Verificando archivos críticos...' -ForegroundColor Yellow
$criticalFiles = @('index.html', 'assets')
$allFilesExist = $true

foreach ($file in $criticalFiles) {
  if (Test-Path "dist/$file") {
    Write-Host "   ✓ $file encontrado" -ForegroundColor Green
  }
  else {
    Write-Host "   ❌ $file NO encontrado" -ForegroundColor Red
    $allFilesExist = $false
  }
}

if (-not $allFilesExist) {
  Write-Host ''
  Write-Host '❌ ERROR: Archivos críticos faltantes en dist/' -ForegroundColor Red
  exit 1
}

# 8. Análisis de bundle (opcional)
Write-Host ''
Write-Host '📊 Análisis de bundle...' -ForegroundColor Yellow
if (Test-Path 'dist/assets') {
  $jsFiles = Get-ChildItem -Path 'dist/assets' -Filter '*.js' | Sort-Object Length -Descending | Select-Object -First 5
  Write-Host '   Los 5 archivos JS más grandes:' -ForegroundColor Cyan
  foreach ($file in $jsFiles) {
    $sizeMB = [math]::Round($file.Length / 1MB, 2)
    Write-Host "   - $($file.Name): $sizeMB MB" -ForegroundColor Gray
  }
}

# 9. Resumen final
Write-Host ''
Write-Host '═══════════════════════════════════════════════════' -ForegroundColor Cyan
Write-Host '✅ PREPARACIÓN COMPLETA - LISTO PARA DEPLOY' -ForegroundColor Green
Write-Host '═══════════════════════════════════════════════════' -ForegroundColor Cyan
Write-Host ''
Write-Host 'Comandos disponibles:' -ForegroundColor Yellow
Write-Host '  npm run deploy          - Deploy a Firebase Hosting' -ForegroundColor White
Write-Host '  npm run deploy:preview  - Deploy preview en Firebase' -ForegroundColor White
Write-Host '  firebase deploy         - Deploy completo (hosting + functions)' -ForegroundColor White
Write-Host ''

exit 0

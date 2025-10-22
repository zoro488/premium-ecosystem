#!/usr/bin/env pwsh
# 🎯 ÚLTIMO CHECKLIST - ENTREGA EN 2 HORAS
# Script de verificación final antes de entregar

Write-Host "`n🎯 VERIFICACIÓN FINAL - Premium Ecosystem`n" -ForegroundColor Magenta

$checks = @()

# 1. Verificar que el build funcione
Write-Host "1. Verificando build..." -ForegroundColor Cyan
$buildResult = npm run build 2>&1
if ($LASTEXITCODE -eq 0) {
  Write-Host "   ✅ Build exitoso" -ForegroundColor Green
  $checks += $true
}
else {
  Write-Host "   ❌ Build falló" -ForegroundColor Red
  $checks += $false
}

# 2. Verificar archivos críticos
Write-Host "`n2. Verificando archivos críticos..." -ForegroundColor Cyan
$criticalFiles = @(
  "src/main.jsx",
  "src/App.jsx",
  "src/apps/FlowDistributor/FlowDistributor.jsx",
  "package.json",
  "vite.config.js",
  "docker-compose.yml",
  "ENTREGA_FINAL.md",
  "QUICK_START_ES.md"
)

$allFilesExist = $true
foreach ($file in $criticalFiles) {
  if (Test-Path $file) {
    Write-Host "   ✅ $file" -ForegroundColor Green
  }
  else {
    Write-Host "   ❌ $file NO ENCONTRADO" -ForegroundColor Red
    $allFilesExist = $false
  }
}
$checks += $allFilesExist

# 3. Verificar que dist/ exista y tenga contenido
Write-Host "`n3. Verificando build output..." -ForegroundColor Cyan
if (Test-Path "dist/index.html") {
  $distSize = (Get-ChildItem -Path "dist" -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
  Write-Host "   ✅ Build output OK (~$([math]::Round($distSize, 2)) MB)" -ForegroundColor Green
  $checks += $true
}
else {
  Write-Host "   ❌ No hay build output" -ForegroundColor Red
  $checks += $false
}

# 4. Verificar documentación
Write-Host "`n4. Verificando documentación..." -ForegroundColor Cyan
$docFiles = @("README.md", "QUICK_START_ES.md", "ENTREGA_FINAL.md")
$docOK = $true
foreach ($doc in $docFiles) {
  if (Test-Path $doc) {
    Write-Host "   ✅ $doc existe" -ForegroundColor Green
  }
  else {
    Write-Host "   ❌ $doc faltante" -ForegroundColor Red
    $docOK = $false
  }
}
$checks += $docOK

# 5. Verificar Docker
Write-Host "`n5. Verificando Docker..." -ForegroundColor Cyan
if (Get-Command docker -ErrorAction SilentlyContinue) {
  if (Test-Path "docker-compose.yml") {
    Write-Host "   ✅ Docker configurado" -ForegroundColor Green
    $checks += $true
  }
  else {
    Write-Host "   ⚠️  docker-compose.yml faltante" -ForegroundColor Yellow
    $checks += $false
  }
}
else {
  Write-Host "   ⚠️  Docker no instalado (opcional)" -ForegroundColor Yellow
  $checks += $true
}

# 6. Verificar package.json scripts
Write-Host "`n6. Verificando scripts npm..." -ForegroundColor Cyan
$package = Get-Content "package.json" | ConvertFrom-Json
$requiredScripts = @("dev", "build", "preview", "test")
$scriptsOK = $true
foreach ($script in $requiredScripts) {
  if ($package.scripts.$script) {
    Write-Host "   ✅ npm run $script disponible" -ForegroundColor Green
  }
  else {
    Write-Host "   ❌ npm run $script NO disponible" -ForegroundColor Red
    $scriptsOK = $false
  }
}
$checks += $scriptsOK

# RESUMEN FINAL
Write-Host "`n" + "="*60 -ForegroundColor Magenta
Write-Host "RESUMEN FINAL" -ForegroundColor Magenta
Write-Host "="*60 -ForegroundColor Magenta

$passed = ($checks | Where-Object { $_ -eq $true }).Count
$total = $checks.Count
$percentage = [math]::Round(($passed / $total) * 100)

Write-Host "`nChecks pasados: $passed/$total ($percentage%)" -ForegroundColor Cyan

if ($percentage -eq 100) {
  Write-Host "`n✅ ¡PROYECTO LISTO PARA ENTREGAR!" -ForegroundColor Green
  Write-Host "`n📋 Próximos pasos:" -ForegroundColor Cyan
  Write-Host "   1. Iniciar demo: npm run preview" -ForegroundColor White
  Write-Host "   2. Abrir: http://localhost:4173" -ForegroundColor White
  Write-Host "   3. Revisar ENTREGA_FINAL.md" -ForegroundColor White
}
elseif ($percentage -ge 80) {
  Write-Host "`n⚠️  PROYECTO CASI LISTO (algunos detalles menores)" -ForegroundColor Yellow
  Write-Host "   Revisa los checks fallidos arriba" -ForegroundColor White
}
else {
  Write-Host "`n❌ ATENCIÓN: Hay problemas que resolver" -ForegroundColor Red
  Write-Host "   Ejecuta: .\quick-fix.ps1 -Full" -ForegroundColor White
}

Write-Host "`n🕐 Tiempo restante: ~2 horas" -ForegroundColor Yellow
Write-Host "💪 ¡Tú puedes!" -ForegroundColor Green
Write-Host ""

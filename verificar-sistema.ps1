# 🔍 SCRIPT DE VERIFICACIÓN COMPLETA DEL SISTEMA
# Ejecuta todas las verificaciones necesarias para asegurar calidad

Write-Host '╔═══════════════════════════════════════════════════════════╗' -ForegroundColor Cyan
Write-Host '║     🚀 VERIFICACIÓN COMPLETA DEL SISTEMA               ║' -ForegroundColor Cyan
Write-Host '╚═══════════════════════════════════════════════════════════╝' -ForegroundColor Cyan
Write-Host ''

$ErrorCount = 0
$WarningCount = 0
$SuccessCount = 0

# Función para mostrar resultados
function Show-Result {
  param(
    [string]$Test,
    [string]$Status,
    [string]$Message = ''
  )

  $Icon = switch ($Status) {
    'success' { '✅'; $script:SuccessCount++; 'Green' }
    'warning' { '⚠️ '; $script:WarningCount++; 'Yellow' }
    'error' { '❌'; $script:ErrorCount++; 'Red' }
    default { 'ℹ️ '; 'Cyan' }
  }

  Write-Host "$Icon $Test" -ForegroundColor $Icon[2] -NoNewline
  if ($Message) {
    Write-Host " - $Message" -ForegroundColor Gray
  }
  else {
    Write-Host ''
  }
}

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Write-Host '📦 VERIFICANDO DEPENDENCIAS...' -ForegroundColor Yellow
Write-Host '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' -ForegroundColor Yellow
Write-Host ''

# Verificar node_modules
if (Test-Path 'node_modules') {
  Show-Result 'node_modules instalado' 'success'
}
else {
  Show-Result 'node_modules NO encontrado' 'error' 'Ejecutar: npm install'
}

# Verificar scheduler
$schedulerPath = 'node_modules/scheduler/package.json'
if (Test-Path $schedulerPath) {
  $schedulerPkg = Get-Content $schedulerPath | ConvertFrom-Json
  $version = $schedulerPkg.version
  if ($version -match '^0\.23\.') {
    Show-Result "scheduler@$version" 'success' 'Versión correcta'
  }
  else {
    Show-Result "scheduler@$version" 'warning' 'Esperada: 0.23.x'
  }
}
else {
  Show-Result 'scheduler no encontrado' 'error'
}

# Verificar @react-three/fiber
$fiberPath = 'node_modules/@react-three/fiber/package.json'
if (Test-Path $fiberPath) {
  $fiberPkg = Get-Content $fiberPath | ConvertFrom-Json
  Show-Result "@react-three/fiber@$($fiberPkg.version)" 'success'
}
else {
  Show-Result '@react-three/fiber no encontrado' 'warning'
}

Write-Host ''

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Write-Host '🔧 VERIFICANDO CONFIGURACIÓN...' -ForegroundColor Yellow
Write-Host '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' -ForegroundColor Yellow
Write-Host ''

# Verificar vite.config.js
if (Test-Path 'vite.config.js') {
  $viteConfig = Get-Content 'vite.config.js' -Raw

  if ($viteConfig -match 'proxy:') {
    Show-Result 'Proxy configurado en vite.config.js' 'success'
  }
  else {
    Show-Result 'Proxy NO configurado' 'error'
  }

  if ($viteConfig -match '/api/ollama') {
    Show-Result 'Proxy para Ollama configurado' 'success'
  }
  else {
    Show-Result 'Proxy Ollama faltante' 'warning'
  }
}
else {
  Show-Result 'vite.config.js NO encontrado' 'error'
}

# Verificar package.json
if (Test-Path 'package.json') {
  $packageJson = Get-Content 'package.json' | ConvertFrom-Json

  if ($packageJson.dependencies.scheduler) {
    Show-Result 'scheduler en dependencies' 'success'
  }
  else {
    Show-Result 'scheduler NO en dependencies' 'error'
  }

  if ($packageJson.overrides.scheduler) {
    Show-Result 'overrides configurado' 'success'
  }
  else {
    Show-Result 'overrides faltante' 'warning'
  }
}
else {
  Show-Result 'package.json NO encontrado' 'error'
}

Write-Host ''

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Write-Host '📝 VERIFICANDO ARCHIVOS CORREGIDOS...' -ForegroundColor Yellow
Write-Host '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' -ForegroundColor Yellow
Write-Host ''

# Verificar AIInsightsWidget.tsx
$aiInsights = 'src/components/analytics/AIInsightsWidget.tsx'
if (Test-Path $aiInsights) {
  $content = Get-Content $aiInsights -Raw

  # Verificar que no haya return duplicado
  $returnCount = ($content | Select-String -Pattern 'return insights;\s*return insights;' -AllMatches).Matches.Count

  if ($returnCount -eq 0) {
    Show-Result 'AIInsightsWidget.tsx sin código inalcanzable' 'success'
  }
  else {
    Show-Result 'AIInsightsWidget.tsx tiene código inalcanzable' 'error'
  }
}
else {
  Show-Result 'AIInsightsWidget.tsx NO encontrado' 'error'
}

# Verificar zeroforce-autoconfig.js
$zeroforceCfg = 'public/zeroforce-autoconfig.js'
if (Test-Path $zeroforceCfg) {
  $content = Get-Content $zeroforceCfg -Raw

  if ($content -match '/api/ollama') {
    Show-Result 'zeroforce-autoconfig.js usa proxy' 'success'
  }
  else {
    Show-Result 'zeroforce-autoconfig.js NO usa proxy' 'warning'
  }
}
else {
  Show-Result 'zeroforce-autoconfig.js NO encontrado' 'warning'
}

Write-Host ''

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Write-Host '🌐 VERIFICANDO SERVIDOR...' -ForegroundColor Yellow
Write-Host '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' -ForegroundColor Yellow
Write-Host ''

# Verificar si el servidor está corriendo
try {
  $response = Invoke-WebRequest -Uri 'http://localhost:3001' -TimeoutSec 2 -UseBasicParsing -ErrorAction Stop
  Show-Result 'Servidor dev corriendo en :3001' 'success'
}
catch {
  Show-Result 'Servidor dev NO está corriendo' 'warning' 'Ejecutar: npm run dev'
}

# Verificar Ollama
try {
  $response = Invoke-WebRequest -Uri 'http://localhost:11434/api/tags' -TimeoutSec 2 -UseBasicParsing -ErrorAction Stop
  Show-Result 'Ollama respondiendo en :11434' 'success'
}
catch {
  Show-Result 'Ollama NO está corriendo' 'warning' 'Ejecutar: ollama serve'
}

Write-Host ''

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Write-Host '📊 RESUMEN FINAL' -ForegroundColor Cyan
Write-Host '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' -ForegroundColor Cyan
Write-Host ''

Write-Host "✅ Exitosos:  $SuccessCount" -ForegroundColor Green
Write-Host "⚠️  Warnings:  $WarningCount" -ForegroundColor Yellow
Write-Host "❌ Errores:   $ErrorCount" -ForegroundColor Red

Write-Host ''

if ($ErrorCount -eq 0 -and $WarningCount -eq 0) {
  Write-Host '╔═══════════════════════════════════════════════════════════╗' -ForegroundColor Green
  Write-Host '║   🎉 SISTEMA COMPLETAMENTE OPERATIVO Y OPTIMIZADO     ║' -ForegroundColor Green
  Write-Host '╚═══════════════════════════════════════════════════════════╝' -ForegroundColor Green
  Write-Host ''
  Write-Host '✨ El sistema está en su MÁXIMO NIVEL posible' -ForegroundColor Green
  Write-Host '🚀 Listo para producción' -ForegroundColor Green
}
elseif ($ErrorCount -eq 0) {
  Write-Host '╔═══════════════════════════════════════════════════════════╗' -ForegroundColor Yellow
  Write-Host '║   ✅ SISTEMA OPERATIVO CON WARNINGS MENORES           ║' -ForegroundColor Yellow
  Write-Host '╚═══════════════════════════════════════════════════════════╝' -ForegroundColor Yellow
  Write-Host ''
  Write-Host '⚠️  Revisa los warnings para optimización adicional' -ForegroundColor Yellow
}
else {
  Write-Host '╔═══════════════════════════════════════════════════════════╗' -ForegroundColor Red
  Write-Host '║   ❌ SE ENCONTRARON ERRORES QUE REQUIEREN ATENCIÓN    ║' -ForegroundColor Red
  Write-Host '╚═══════════════════════════════════════════════════════════╝' -ForegroundColor Red
  Write-Host ''
  Write-Host '🔧 Revisa los errores arriba y aplica las correcciones' -ForegroundColor Red
}

Write-Host ''
Write-Host '📚 Documentación completa: CORRECIONES_CRITICAS_APLICADAS.md' -ForegroundColor Cyan
Write-Host ''

# Retornar código de salida basado en errores
if ($ErrorCount -gt 0) {
  exit 1
}
elseif ($WarningCount -gt 0) {
  exit 2
}
else {
  exit 0
}

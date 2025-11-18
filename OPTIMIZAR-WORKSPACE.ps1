# ==========================================
# SCRIPT DE LIMPIEZA Y OPTIMIZACIÓN
# ==========================================
# Este script mueve archivos de documentación
# masiva a una carpeta de archivo para mejorar
# el rendimiento de VS Code

Write-Host "🧹 INICIANDO LIMPIEZA Y OPTIMIZACIÓN DEL WORKSPACE..." -ForegroundColor Cyan
Write-Host ""

# Crear carpeta de archivo
$archiveFolder = ".archive-docs"
if (-not (Test-Path $archiveFolder)) {
  New-Item -ItemType Directory -Path $archiveFolder -Force | Out-Null
  Write-Host "✅ Carpeta de archivo creada: $archiveFolder" -ForegroundColor Green
}

# Crear subcarpetas organizadas
$subfolders = @(
  "analisis",
  "reportes",
  "auditorias",
  "verificaciones",
  "resumenes",
  "informes",
  "implementaciones",
  "planes",
  "scripts-python",
  "scripts-batch",
  "datos-json",
  "archivos-excel"
)

foreach ($subfolder in $subfolders) {
  $path = Join-Path $archiveFolder $subfolder
  if (-not (Test-Path $path)) {
    New-Item -ItemType Directory -Path $path -Force | Out-Null
  }
}

Write-Host "📁 Moviendo archivos de documentación..." -ForegroundColor Yellow
Write-Host ""

# Contador de archivos movidos
$movedCount = 0

# Mover archivos de análisis
$patterns = @{
  "ANALISIS_*.md"       = "analisis"
  "REPORTE_*.md"        = "reportes"
  "AUDITORIA_*.md"      = "auditorias"
  "VERIFICACION_*.md"   = "verificaciones"
  "RESUMEN_*.md"        = "resumenes"
  "INFORME_*.md"        = "informes"
  "CONFIRMACION_*.md"   = "informes"
  "CORRECCION*.md"      = "reportes"
  "IMPLEMENTACION_*.md" = "implementaciones"
  "SESION_*.md"         = "resumenes"
  "PLAN_*.md"           = "planes"
  "PROGRESO_*.md"       = "resumenes"
  "STATUS_*.md"         = "resumenes"
  "ESTADO_*.md"         = "resumenes"
  "ESTRATEGIA_*.md"     = "planes"
  "MIGRACION_*.md"      = "planes"
  "MEJORAS_*.md"        = "planes"
  "TRANSFORMACION_*.md" = "implementaciones"
  "INTEGRACION_*.md"    = "implementaciones"
  "DEPLOYMENT_*.md"     = "reportes"
  "SINCRONIZACION_*.md" = "reportes"
  "OPTIMIZACION_*.md"   = "planes"
}

foreach ($pattern in $patterns.Keys) {
  $files = Get-ChildItem -Path "." -Filter $pattern -ErrorAction SilentlyContinue
  foreach ($file in $files) {
    $destination = Join-Path $archiveFolder $patterns[$pattern]
    Move-Item -Path $file.FullName -Destination $destination -Force -ErrorAction SilentlyContinue
    $movedCount++
    Write-Host "  📄 $($file.Name) → $destination" -ForegroundColor Gray
  }
}

# Mover scripts Python
$pythonFiles = Get-ChildItem -Path "." -Filter "*.py" | Where-Object {
  $_.Name -match "^(analizar|extraer|inspeccionar|transformar|consolidar|mapear|insertar|aplicar|cargar)_"
}
foreach ($file in $pythonFiles) {
  $destination = Join-Path $archiveFolder "scripts-python"
  Move-Item -Path $file.FullName -Destination $destination -Force -ErrorAction SilentlyContinue
  $movedCount++
}

# Mover archivos BAT
$batFiles = Get-ChildItem -Path "." -Filter "*.bat" -ErrorAction SilentlyContinue
foreach ($file in $batFiles) {
  $destination = Join-Path $archiveFolder "scripts-batch"
  Move-Item -Path $file.FullName -Destination $destination -Force -ErrorAction SilentlyContinue
  $movedCount++
}

# Mover archivos JSON de datos
$jsonPatterns = @("*_data_*.json", "datos_*.json", "analisis_*.json", "tablas_*.json", "*_export_*.json")
foreach ($pattern in $jsonPatterns) {
  $files = Get-ChildItem -Path "." -Filter $pattern -ErrorAction SilentlyContinue
  foreach ($file in $files) {
    $destination = Join-Path $archiveFolder "datos-json"
    Move-Item -Path $file.FullName -Destination $destination -Force -ErrorAction SilentlyContinue
    $movedCount++
  }
}

# Mover Excel duplicados
$excelFiles = Get-ChildItem -Path "." -Filter "Copia de *.xlsx" -ErrorAction SilentlyContinue
foreach ($file in $excelFiles) {
  $destination = Join-Path $archiveFolder "archivos-excel"
  Move-Item -Path $file.FullName -Destination $destination -Force -ErrorAction SilentlyContinue
  $movedCount++
}

Write-Host ""
Write-Host "✅ Se movieron $movedCount archivos a $archiveFolder" -ForegroundColor Green
Write-Host ""

# Limpiar node_modules y cache
Write-Host "🗑️  Limpiando node_modules y caché..." -ForegroundColor Yellow

if (Test-Path "node_modules") {
  Remove-Item -Path "node_modules" -Recurse -Force -ErrorAction SilentlyContinue
  Write-Host "  ✅ node_modules eliminado" -ForegroundColor Green
}

if (Test-Path ".cache") {
  Remove-Item -Path ".cache" -Recurse -Force -ErrorAction SilentlyContinue
  Write-Host "  ✅ .cache eliminado" -ForegroundColor Green
}

if (Test-Path "dist") {
  Remove-Item -Path "dist" -Recurse -Force -ErrorAction SilentlyContinue
  Write-Host "  ✅ dist eliminado" -ForegroundColor Green
}

# Reinstalar dependencias con caché limpia
Write-Host ""
Write-Host "📦 Reinstalando dependencias..." -ForegroundColor Cyan
npm install --legacy-peer-deps

Write-Host ""
Write-Host "✨ OPTIMIZACIÓN COMPLETADA ✨" -ForegroundColor Green
Write-Host ""
Write-Host "📋 SIGUIENTES PASOS:" -ForegroundColor Cyan
Write-Host "  1. Cierra y vuelve a abrir VS Code" -ForegroundColor White
Write-Host "  2. Los archivos de documentación están en: $archiveFolder" -ForegroundColor White
Write-Host "  3. El workspace debería ser mucho más rápido ahora" -ForegroundColor White
Write-Host ""

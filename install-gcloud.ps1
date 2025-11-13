# ====================================
# GOOGLE CLOUD SDK - INSTALADOR AUTOMÁTICO
# ====================================

Write-Host "🌩️  GOOGLE CLOUD SDK - INSTALACIÓN AUTOMÁTICA" -ForegroundColor Cyan
Write-Host "=" * 60

# Verificar si ya está instalado
if (Get-Command gcloud -ErrorAction SilentlyContinue) {
  Write-Host "✅ gcloud CLI ya está instalado" -ForegroundColor Green
  gcloud --version
  exit 0
}

Write-Host "📦 Descargando Google Cloud SDK..." -ForegroundColor Yellow

# URL del instalador
$installerUrl = "https://dl.google.com/dl/cloudsdk/channels/rapid/GoogleCloudSDKInstaller.exe"
$installerPath = "$env:TEMP\GoogleCloudSDKInstaller.exe"

# Descargar
try {
  Invoke-WebRequest -Uri $installerUrl -OutFile $installerPath -UseBasicParsing
  Write-Host "✅ Descarga completada" -ForegroundColor Green
}
catch {
  Write-Host "❌ Error al descargar: $_" -ForegroundColor Red
  exit 1
}

# Ejecutar instalador
Write-Host "🚀 Ejecutando instalador..." -ForegroundColor Yellow
Write-Host "⚠️  Acepta las opciones por defecto y espera a que termine" -ForegroundColor Yellow

Start-Process -FilePath $installerPath -Wait

Write-Host ""
Write-Host "✅ Instalación completada" -ForegroundColor Green
Write-Host ""
Write-Host "📝 PRÓXIMOS PASOS:" -ForegroundColor Cyan
Write-Host "1. Reinicia VS Code o la terminal" -ForegroundColor White
Write-Host "2. Ejecuta: gcloud init" -ForegroundColor White
Write-Host "3. Ejecuta: gcloud auth application-default login" -ForegroundColor White
Write-Host ""

# Limpiar
Remove-Item $installerPath -ErrorAction SilentlyContinue

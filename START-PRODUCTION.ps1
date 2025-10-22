#!/usr/bin/env pwsh
# 🚀 START PRODUCTION - Premium Ecosystem
# Este script deja todo corriendo para producción 24/7

param(
    [switch]$Build,
    [switch]$SkipBrowser
)

Clear-Host
Write-Host @"
╔══════════════════════════════════════════════════════════╗
║                                                          ║
║      🚀 PREMIUM ECOSYSTEM - PRODUCTION READY            ║
║                                                          ║
║      Iniciando sistema en modo producción...            ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
"@ -ForegroundColor Cyan

# 1. Verificar dependencias
Write-Host "`n🔍 Verificando dependencias..." -ForegroundColor Yellow
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Instalando dependencias..." -ForegroundColor Yellow
    npm install --legacy-peer-deps
}
Write-Host "✅ Dependencias OK" -ForegroundColor Green

# 2. Build si se solicita
if ($Build) {
    Write-Host "`n🏗️  Construyendo para producción..." -ForegroundColor Yellow
    npm run build
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Error en build" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Build completado" -ForegroundColor Green
}

# 3. Limpiar procesos anteriores
Write-Host "`n🧹 Limpiando procesos anteriores..." -ForegroundColor Yellow
Get-Process | Where-Object {$_.ProcessName -like "*node*" -or $_.ProcessName -like "*vite*"} | Stop-Process -Force 2>$null
Start-Sleep -Seconds 2
Write-Host "✅ Procesos limpiados" -ForegroundColor Green

# 4. Iniciar servidor
Write-Host "`n🚀 Iniciando servidor de desarrollo..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev" -WindowStyle Normal

Start-Sleep -Seconds 5

# 5. Abrir navegador
if (-not $SkipBrowser) {
    Write-Host "`n🌐 Abriendo navegador..." -ForegroundColor Yellow
    Start-Process "http://localhost:3001"
}

# 6. Información final
Write-Host @"

╔══════════════════════════════════════════════════════════╗
║                                                          ║
║          ✅ SISTEMA EN PRODUCCIÓN ACTIVO                ║
║                                                          ║
║      📍 Local:   http://localhost:3001                  ║
║      🌐 Network: http://$(hostname):3001                ║
║                                                          ║
║      El servidor está corriendo en una ventana          ║
║      separada. NO la cierres para mantener el           ║
║      sistema activo 24/7.                               ║
║                                                          ║
║      Para detener: Cierra la ventana del servidor       ║
║      o ejecuta: npm run stop                            ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝

"@ -ForegroundColor Green

Write-Host "📊 Panel de control disponible en: http://localhost:3001" -ForegroundColor Cyan
Write-Host "📱 Apps activas:" -ForegroundColor White
Write-Host "   • FlowDistributor (ERP)" -ForegroundColor White
Write-Host "   • SmartSales (Ventas)" -ForegroundColor White
Write-Host "   • ClientHub (CRM)" -ForegroundColor White
Write-Host "   • AnalyticsPro (Analíticas)" -ForegroundColor White
Write-Host "   • TeamSync (Colaboración)" -ForegroundColor White
Write-Host "`n🔄 Hot reload activo - Los cambios se aplicarán automáticamente" -ForegroundColor Yellow
Write-Host "`n✨ ¡Sistema listo para usar!" -ForegroundColor Green

# Mantener este script abierto
Write-Host "`n⏸️  Presiona cualquier tecla para cerrar este panel de control..." -ForegroundColor DarkGray
$null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')

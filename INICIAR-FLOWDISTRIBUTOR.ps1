# ========================================
# FLOWDISTRIBUTOR - INICIO PERMANENTE
# ========================================

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " FLOWDISTRIBUTOR - SERVIDOR" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Iniciando servidor..." -ForegroundColor Yellow
Write-Host "El servidor quedara corriendo permanentemente" -ForegroundColor Yellow
Write-Host ""
Write-Host "URLs de acceso:" -ForegroundColor White
Write-Host "- Local:   " -NoNewline -ForegroundColor Gray
Write-Host "http://localhost:3002" -ForegroundColor Cyan
Write-Host "- Red:     " -NoNewline -ForegroundColor Gray
Write-Host "http://192.168.1.66:3002" -ForegroundColor Cyan
Write-Host ""
Write-Host "IMPORTANTE: NO CIERRES ESTA VENTANA" -ForegroundColor Red
Write-Host "Para detener: Ctrl+C" -ForegroundColor Yellow
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Cambiar al directorio del script
Set-Location $PSScriptRoot

# Iniciar servidor
npm run dev

Write-Host ""
Write-Host "Presiona cualquier tecla para salir..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

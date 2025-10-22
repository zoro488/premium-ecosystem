# 🚀 FLOWDISTRIBUTOR EPIC - PREMIUM EDITION
# Script de inicio rápido

Clear-Host

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host " 🚀 FLOWDISTRIBUTOR EPIC - PREMIUM EDITION" -ForegroundColor White
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host " Iniciando versión ÉPICA con:" -ForegroundColor Green
Write-Host " ✨ Partículas animadas en el fondo" -ForegroundColor Yellow
Write-Host " 💎 Glassmorphism en todos los componentes" -ForegroundColor Yellow
Write-Host " 🎬 Transiciones fluidas y suaves" -ForegroundColor Yellow
Write-Host " 📊 Gráficos interactivos en tiempo real" -ForegroundColor Yellow
Write-Host " ⚡ Rendimiento de 60 FPS garantizado" -ForegroundColor Yellow
Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Verificar node_modules
if (-not (Test-Path "node_modules")) {
    Write-Host "[INFO] Instalando dependencias por primera vez..." -ForegroundColor Blue
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host ""
        Write-Host "[ERROR] No se pudieron instalar las dependencias" -ForegroundColor Red
        Write-Host "[SOLUCION] Ejecuta manualmente: npm install" -ForegroundColor Yellow
        Read-Host "Presiona Enter para salir"
        exit 1
    }
}

Write-Host "[✓] Dependencias verificadas" -ForegroundColor Green
Write-Host ""
Write-Host "[INFO] Iniciando servidor de desarrollo..." -ForegroundColor Blue
Write-Host "[INFO] Abrirá automáticamente en: http://localhost:5173" -ForegroundColor Blue
Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host " INSTRUCCIONES:" -ForegroundColor White
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host " 1. El navegador se abrirá automáticamente" -ForegroundColor White
Write-Host " 2. Navega a /flowdistributor en la URL" -ForegroundColor White
Write-Host " 3. ¡Disfruta de la versión EPIC!" -ForegroundColor White
Write-Host ""
Write-Host " ATAJOS:" -ForegroundColor Yellow
Write-Host " - Ctrl + C = Detener servidor" -ForegroundColor Gray
Write-Host " - F5 en navegador = Recargar" -ForegroundColor Gray
Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Esperar 3 segundos
Start-Sleep -Seconds 3

# Abrir navegador
Start-Process "http://localhost:5173/flowdistributor"

# Iniciar servidor
npm run dev

Read-Host "Presiona Enter para salir"

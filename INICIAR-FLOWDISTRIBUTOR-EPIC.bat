@echo off
chcp 65001 >nul
cls

echo.
echo ═══════════════════════════════════════════════════════════
echo  🚀 FLOWDISTRIBUTOR EPIC - PREMIUM EDITION
echo ═══════════════════════════════════════════════════════════
echo.
echo  Iniciando versión ÉPICA con:
echo  ✨ Partículas animadas en el fondo
echo  💎 Glassmorphism en todos los componentes
echo  🎬 Transiciones fluidas y suaves
echo  📊 Gráficos interactivos en tiempo real
echo  ⚡ Rendimiento de 60 FPS garantizado
echo.
echo ═══════════════════════════════════════════════════════════
echo.

REM Verificar si node_modules existe
if not exist "node_modules" (
    echo [INFO] Instalando dependencias por primera vez...
    call npm install
    if errorlevel 1 (
        echo.
        echo [ERROR] No se pudieron instalar las dependencias
        echo [SOLUCION] Ejecuta manualmente: npm install
        pause
        exit /b 1
    )
)

echo [✓] Dependencias verificadas
echo.
echo [INFO] Iniciando servidor de desarrollo...
echo [INFO] Abrirá automáticamente en: http://localhost:5173
echo.
echo ═══════════════════════════════════════════════════════════
echo  INSTRUCCIONES:
echo ═══════════════════════════════════════════════════════════
echo.
echo  1. El navegador se abrirá automáticamente
echo  2. Navega a /flowdistributor en la URL
echo  3. ¡Disfruta de la versión EPIC!
echo.
echo  ATAJOS:
echo  - Ctrl + C = Detener servidor
echo  - F5 en navegador = Recargar
echo.
echo ═══════════════════════════════════════════════════════════
echo.

REM Esperar 3 segundos antes de abrir
timeout /t 3 /nobreak >nul

REM Abrir navegador
start http://localhost:5173/flowdistributor

REM Iniciar servidor
call npm run dev

pause

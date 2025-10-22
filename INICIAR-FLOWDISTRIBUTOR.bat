@echo off
REM ========================================
REM FLOWDISTRIBUTOR - INICIO PERMANENTE
REM ========================================

title FlowDistributor - Servidor en Ejecucion

echo.
echo ========================================
echo  FLOWDISTRIBUTOR - SERVIDOR
echo ========================================
echo.
echo  Iniciando servidor...
echo  El servidor quedara corriendo permanentemente
echo.
echo  URLs de acceso:
echo  - Local:   http://localhost:3002
echo  - Red:     http://192.168.1.66:3002
echo.
echo  IMPORTANTE: NO CIERRES ESTA VENTANA
echo  Para detener: Ctrl+C
echo.
echo ========================================
echo.

cd /d "%~dp0"
npm run dev

pause

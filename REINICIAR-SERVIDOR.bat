@echo off
chcp 65001 >nul
echo ============================================
echo REINICIANDO FLOWDISTRIBUTOR CON DATOS IMPORTADOS
echo ============================================
echo.

echo [1/3] Deteniendo servidor anterior...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

echo [2/3] Limpiando caché de Vite...
if exist "node_modules\.vite" (
    rmdir /S /Q "node_modules\.vite"
    echo ✓ Caché limpiado
) else (
    echo ✓ No hay caché que limpiar
)

echo [3/3] Iniciando servidor de desarrollo...
echo.
echo ==========================================
echo SERVIDOR INICIADO EN http://localhost:3001
echo ==========================================
echo.
echo Abre tu navegador en: http://localhost:3001/flow-distributor
echo.
echo Presiona Ctrl+C para detener el servidor
echo.

npm run dev

pause

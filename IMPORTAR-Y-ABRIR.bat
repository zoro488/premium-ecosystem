@echo off
chcp 65001 >nul
cls
echo ============================================
echo IMPORTACIÓN COMPLETA DEL EXCEL
echo ============================================
echo.

echo [1/4] Importando datos del Excel...
python "scripts\importar_excel_completo.py"

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ ERROR: La importación falló
    pause
    exit /b 1
)

echo.
echo ✅ Importación completada exitosamente
echo.
echo [2/4] Deteniendo servidor anterior...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

echo [3/4] Limpiando caché...
if exist "node_modules\.vite" (
    rmdir /S /Q "node_modules\.vite"
)

echo [4/4] Iniciando servidor...
start "" "REINICIAR-SERVIDOR.bat"

timeout /t 3 /nobreak >nul

echo.
echo ============================================
echo ✅ PROCESO COMPLETADO
echo ============================================
echo.
echo El servidor se está iniciando en otra ventana
echo Abre: http://localhost:3001/flow-distributor
echo.

pause

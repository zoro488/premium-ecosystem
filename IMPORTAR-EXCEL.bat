@echo off
chcp 65001 >nul
echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║  📊 IMPORTADOR DE EXCEL A FLOWDISTRIBUTOR                      ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo 🔄 Convirtiendo datos del Excel...
echo.

python scripts\excel_to_flowdistributor.py

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ Error al convertir el Excel
    echo.
    pause
    exit /b 1
)

echo.
echo ✅ Conversión completada exitosamente
echo.
echo 📁 Archivo generado: public\excel_data.json
echo.
echo 🎯 Próximos pasos:
echo    1. Inicia FlowDistributor con: npm run dev
echo    2. Abre la aplicación en el navegador
echo    3. Ve a Configuración (⚙️)
echo    4. Haz clic en "Importar desde Excel"
echo.
pause

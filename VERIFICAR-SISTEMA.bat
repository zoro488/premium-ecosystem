@echo off
chcp 65001 >nul
cls
echo.
echo ╔═══════════════════════════════════════════════════════════════════╗
echo ║  🔍 VERIFICACIÓN COMPLETA DEL SISTEMA FLOWDISTRIBUTOR 3.0         ║
echo ╚═══════════════════════════════════════════════════════════════════╝
echo.
echo 📋 Iniciando verificación de todos los componentes...
echo.

REM 1. Verificar Python
echo [1/6] Verificando Python...
python --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo    ❌ Python NO encontrado
    echo    Descarga Python desde https://python.org
    goto :error
) else (
    echo    ✅ Python instalado correctamente
)

REM 2. Verificar openpyxl
echo [2/6] Verificando librería openpyxl...
python -c "import openpyxl" >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo    ⚠️ openpyxl NO encontrado, instalando...
    pip install openpyxl --quiet
    if %ERRORLEVEL% NEQ 0 (
        echo    ❌ Error al instalar openpyxl
        goto :error
    )
    echo    ✅ openpyxl instalado correctamente
) else (
    echo    ✅ openpyxl ya instalado
)

REM 3. Verificar archivo Excel
echo [3/6] Verificando archivo Excel de origen...
if exist "Administación_General.xlsx" (
    echo    ✅ Excel encontrado: Administación_General.xlsx
) else (
    echo    ⚠️ Excel no encontrado en el directorio actual
    echo    Ubicación: %cd%
)

REM 4. Verificar script parser
echo [4/6] Verificando script de conversión...
if exist "scripts\excel_to_flowdistributor.py" (
    echo    ✅ Parser encontrado
) else (
    echo    ❌ Parser NO encontrado
    goto :error
)

REM 5. Verificar Node.js y npm
echo [5/6] Verificando Node.js...
node --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo    ❌ Node.js NO encontrado
    echo    Descarga Node.js desde https://nodejs.org
    goto :error
) else (
    for /f "tokens=*" %%v in ('node --version') do set NODE_VERSION=%%v
    echo    ✅ Node.js !NODE_VERSION! instalado
)

REM 6. Verificar dependencias npm
echo [6/6] Verificando dependencias npm...
if exist "node_modules" (
    echo    ✅ Dependencias npm instaladas
) else (
    echo    ⚠️ Dependencias NO instaladas, instalando...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo    ❌ Error al instalar dependencias
        goto :error
    )
    echo    ✅ Dependencias instaladas correctamente
)

echo.
echo ═══════════════════════════════════════════════════════════════════
echo ✅ TODAS LAS VERIFICACIONES COMPLETADAS EXITOSAMENTE
echo ═══════════════════════════════════════════════════════════════════
echo.
echo 🎯 SISTEMA LISTO PARA USAR
echo.
echo 📊 Próximos pasos recomendados:
echo    1. Ejecuta: IMPORTAR-EXCEL.bat (para convertir el Excel a JSON)
echo    2. Ejecuta: npm run dev (para iniciar FlowDistributor)
echo    3. Abre: http://localhost:3001
echo    4. Configuración → Importar desde Excel
echo.
echo 📚 Documentación disponible:
echo    • README_FLOWDISTRIBUTOR_EXCEL.md (Manual completo)
echo    • GUIA_IMPORTACION_EXCEL.md (Guía de importación)
echo    • ANALISIS_EXCEL_Y_ADAPTACION.md (Análisis técnico)
echo.
pause
exit /b 0

:error
echo.
echo ═══════════════════════════════════════════════════════════════════
echo ❌ VERIFICACIÓN FALLIDA
echo ═══════════════════════════════════════════════════════════════════
echo.
echo Revisa los errores anteriores e instala los componentes faltantes.
echo.
pause
exit /b 1

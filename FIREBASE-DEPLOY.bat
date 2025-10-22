@echo off
chcp 65001 >nul
cls
echo ============================================
echo FIREBASE DEPLOYMENT - PREMIUM ECOSYSTEM
echo ============================================
echo.

echo [PASO 1/6] Verificando Firebase CLI...
firebase --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Firebase CLI no está instalado
    echo.
    echo Instala Firebase CLI:
    echo npm install -g firebase-tools
    pause
    exit /b 1
)
echo ✅ Firebase CLI instalado

echo.
echo [PASO 2/6] Verificando login...
firebase projects:list >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ⚠️  No has hecho login en Firebase
    echo.
    echo Iniciando login...
    firebase login
    if %ERRORLEVEL% NEQ 0 (
        echo ❌ Login fallido
        pause
        exit /b 1
    )
)
echo ✅ Login verificado

echo.
echo [PASO 3/6] Desplegando reglas de Firestore...
firebase deploy --only firestore:rules
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Error desplegando reglas de Firestore
    pause
    exit /b 1
)
echo ✅ Reglas de Firestore desplegadas

echo.
echo [PASO 4/6] Desplegando índices de Firestore...
firebase deploy --only firestore:indexes
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Error desplegando índices
    pause
    exit /b 1
)
echo ✅ Índices de Firestore desplegados

echo.
echo [PASO 5/6] Desplegando reglas de Storage...
firebase deploy --only storage
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Error desplegando reglas de Storage
    pause
    exit /b 1
)
echo ✅ Reglas de Storage desplegadas

echo.
echo [PASO 6/6] Construyendo y desplegando aplicación...
echo Construyendo proyecto...
npm run build
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Error en build
    pause
    exit /b 1
)

echo Desplegando hosting...
firebase deploy --only hosting
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Error desplegando hosting
    pause
    exit /b 1
)

echo.
echo ============================================
echo ✅ DESPLIEGUE COMPLETADO EXITOSAMENTE
echo ============================================
echo.
echo Tu aplicación está disponible en:
firebase hosting:sites:list
echo.
echo Para ver tu aplicación:
echo firebase open hosting:site
echo.

pause

@echo off
chcp 65001 >nul
cls
echo ============================================
echo FIREBASE EMULATORS - DESARROLLO LOCAL
echo ============================================
echo.

echo Iniciando Firebase Emulators...
echo.
echo Servicios disponibles:
echo ✅ Firestore: http://localhost:8080
echo ✅ Auth: http://localhost:9099
echo ✅ Storage: http://localhost:9199
echo ✅ Functions: http://localhost:5001
echo ✅ Hosting: http://localhost:5000
echo ✅ Emulator UI: http://localhost:4000
echo.
echo Presiona Ctrl+C para detener
echo.

firebase emulators:start

pause

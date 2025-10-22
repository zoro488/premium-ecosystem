@echo off
REM ========================================
REM FLOWDISTRIBUTOR - LIMPIAR Y ABRIR
REM ========================================

title FlowDistributor - Limpiando y Abriendo

echo.
echo ========================================
echo  FLOWDISTRIBUTOR
echo ========================================
echo.
echo  Paso 1: Limpiando datos antiguos...
echo.

REM Crear archivo HTML temporal con script de limpieza
echo ^<!DOCTYPE html^> > temp_clean.html
echo ^<html^>^<head^>^<title^>Limpiando...^</title^>^</head^> >> temp_clean.html
echo ^<body style="background: #1a1a2e; color: white; font-family: Arial; display: flex; align-items: center; justify-content: center; height: 100vh; flex-direction: column;"^> >> temp_clean.html
echo ^<h1^>🧹 Limpiando datos...^</h1^> >> temp_clean.html
echo ^<p^>Eliminando datos antiguos de FlowDistributor^</p^> >> temp_clean.html
echo ^<div id="status"^>Procesando...^</div^> >> temp_clean.html
echo ^<script^> >> temp_clean.html
echo setTimeout(function() { >> temp_clean.html
echo   localStorage.removeItem('flow_bancos'); >> temp_clean.html
echo   localStorage.removeItem('flow_ordenes_compra'); >> temp_clean.html
echo   localStorage.removeItem('flow_distribuidores'); >> temp_clean.html
echo   localStorage.removeItem('flow_ventas'); >> temp_clean.html
echo   localStorage.removeItem('flow_clientes'); >> temp_clean.html
echo   localStorage.removeItem('flow_almacen'); >> temp_clean.html
echo   document.getElementById('status').innerHTML = '✅ Datos eliminados!^<br^>^<br^>Redirigiendo a FlowDistributor...'; >> temp_clean.html
echo   setTimeout(function() { >> temp_clean.html
echo     window.location.href = 'http://localhost:3002'; >> temp_clean.html
echo   }, 2000); >> temp_clean.html
echo }, 1000); >> temp_clean.html
echo ^</script^> >> temp_clean.html
echo ^</body^>^</html^> >> temp_clean.html

echo  ✅ Script de limpieza creado
echo.
echo  Paso 2: Abriendo en navegador...
echo.

REM Abrir el archivo temporal en el navegador
start temp_clean.html

echo  ✅ Navegador abierto
echo.
echo  Limpiando archivo temporal en 10 segundos...
timeout /t 10 /nobreak >nul

REM Eliminar archivo temporal
del temp_clean.html >nul 2>&1

echo.
echo ========================================
echo  ✅ COMPLETADO
echo ========================================
echo.
echo  FlowDistributor esta abierto y limpio
echo  URL: http://localhost:3002
echo.
echo  Presiona cualquier tecla para cerrar...
pause >nul

exit

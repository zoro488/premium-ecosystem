#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Abre el navegador y muestra instrucciones de prueba
.DESCRIPTION
    Script helper para facilitar la verificación manual
#>

param(
    [string]$Browser = "default"
)

$url = "http://localhost:3001"

Write-Host "`n╔═══════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║          🧪 PRUEBA MANUAL DE CORRECCIONES             ║" -ForegroundColor Cyan
Write-Host "╚═══════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

# Verificar que el servidor está corriendo
$connection = Get-NetTCPConnection -LocalPort 3001 -ErrorAction SilentlyContinue
if (-not $connection) {
    Write-Host "❌ Servidor no está corriendo en puerto 3001" -ForegroundColor Red
    Write-Host "   Ejecuta: npm run dev`n" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Servidor detectado en $url" -ForegroundColor Green
Write-Host ""

# Abrir navegador
Write-Host "🌐 Abriendo navegador..." -ForegroundColor Cyan

switch ($Browser.ToLower()) {
    "firefox" {
        Start-Process "firefox" -ArgumentList $url
    }
    "chrome" {
        Start-Process "chrome" -ArgumentList $url
    }
    "edge" {
        Start-Process "msedge" -ArgumentList $url
    }
    default {
        Start-Process $url
    }
}

Start-Sleep -Seconds 2

# Mostrar instrucciones
Write-Host "`n╔═══════════════════════════════════════════════════════╗" -ForegroundColor Yellow
Write-Host "║              📋 INSTRUCCIONES DE PRUEBA               ║" -ForegroundColor Yellow
Write-Host "╚═══════════════════════════════════════════════════════╝" -ForegroundColor Yellow

Write-Host "`n1️⃣  VERIFICAR CONSOLA LIMPIA:" -ForegroundColor White
Write-Host "   • Abre DevTools (F12)" -ForegroundColor Gray
Write-Host "   • Ve a la pestaña 'Console'" -ForegroundColor Gray
Write-Host "   • Refresca la página (F5)" -ForegroundColor Gray
Write-Host "   • ❌ NO debe aparecer:" -ForegroundColor Gray
Write-Host "     - 'Promised response from onMessage listener'" -ForegroundColor DarkGray
Write-Host "     - 'Components es obsoleto'" -ForegroundColor DarkGray
Write-Host "     - 'import.meta may only appear in a module'" -ForegroundColor DarkGray

Write-Host "`n2️⃣  PROBAR HOT MODULE REPLACEMENT:" -ForegroundColor White
Write-Host "   • Abre VS Code con el proyecto" -ForegroundColor Gray
Write-Host "   • Edita cualquier archivo .jsx" -ForegroundColor Gray
Write-Host "   • Cambia algún texto visible" -ForegroundColor Gray
Write-Host "   • Guarda (Ctrl+S)" -ForegroundColor Gray
Write-Host "   • ✅ La página debe actualizarse SIN F5" -ForegroundColor Gray

Write-Host "`n3️⃣  VERIFICAR NETWORK (OPCIONAL):" -ForegroundColor White
Write-Host "   • En DevTools, ve a 'Network'" -ForegroundColor Gray
Write-Host "   • Filtra por 'WS' (WebSocket)" -ForegroundColor Gray
Write-Host "   • ✅ Debe haber conexión WebSocket activa" -ForegroundColor Gray

Write-Host "`n╔═══════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║              ✅ CRITERIOS DE ÉXITO                     ║" -ForegroundColor Green
Write-Host "╚═══════════════════════════════════════════════════════╝" -ForegroundColor Green

Write-Host "`n✅ Consola limpia (sin errores de extensiones)" -ForegroundColor Green
Write-Host "✅ HMR funciona (cambios sin recargar página)" -ForegroundColor Green
Write-Host "✅ WebSocket conectado correctamente" -ForegroundColor Green
Write-Host "✅ No hay errores de sintaxis en init-fixes.js`n" -ForegroundColor Green

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray
Write-Host "💡 TIPS:" -ForegroundColor Yellow
Write-Host "   • Si ves errores, ejecuta: .\restart-dev-clean.ps1" -ForegroundColor Gray
Write-Host "   • Para limpiar caché del navegador: Ctrl+Shift+Del" -ForegroundColor Gray
Write-Host "   • Prueba en modo incógnito si hay dudas" -ForegroundColor Gray
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor DarkGray

Write-Host "Presiona Ctrl+C cuando termines las pruebas" -ForegroundColor Yellow
Write-Host "o cierra esta ventana`n" -ForegroundColor Yellow

# Monitorear reloads del servidor
Write-Host "📊 Monitoreando actividad del servidor..." -ForegroundColor Cyan
Write-Host "   (Los reloads de página indicarán que HMR funciona)`n" -ForegroundColor Gray

# Mantener el script corriendo para mostrar el estado
$startTime = Get-Date
$reloadCount = 0

while ($true) {
    Start-Sleep -Seconds 5

    # Verificar que el servidor sigue corriendo
    $connection = Get-NetTCPConnection -LocalPort 3001 -ErrorAction SilentlyContinue
    if (-not $connection) {
        Write-Host "`n❌ Servidor detenido" -ForegroundColor Red
        break
    }

    $elapsed = (Get-Date) - $startTime
    Write-Host "⏱️  Tiempo de prueba: $([math]::Floor($elapsed.TotalMinutes))m $($elapsed.Seconds)s" -ForegroundColor DarkGray
}
